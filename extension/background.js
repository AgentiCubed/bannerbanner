// BannerBanner service worker (Manifest V3, ES module).
//
// Owns the canonical authorized-origin registry and keeps dynamic content-script
// registrations in sync with it (docs/MVP_CONTRACT.md permission contract).
// It performs no page logic; it only registers/unregisters the one content
// script per authorized origin, propagates settings, records bounded aggregate
// stats, and signals open tabs to stop when access is revoked.

import { STORAGE_KEYS, defaultSettings, normalizeSettings, sanitizeSettingsPatch, migrateLegacySettings } from './lib/settings-schema.js';
import { normalizeStats, recordOutcome } from './lib/stats.js';
import { planReconciliation, addOrigin, removeOrigin } from './lib/registry.js';
import { normalizeOrigin, originToMatchPattern, matchPatternToOrigin, normalizeOriginList } from './lib/origins.js';

// --- storage helpers -------------------------------------------------------

function localGet(keys) {
  return new Promise((resolve) => chrome.storage.local.get(keys, (data) => resolve(data || {})));
}
function localSet(obj) {
  return new Promise((resolve) => chrome.storage.local.set(obj, () => resolve()));
}
function storageRemove(area, keys) {
  return new Promise((resolve) => area.remove(keys, () => resolve()));
}

async function getSettings() {
  const data = await localGet(STORAGE_KEYS.settings);
  return normalizeSettings(data[STORAGE_KEYS.settings]).settings;
}
async function getOrigins() {
  const data = await localGet(STORAGE_KEYS.origins);
  return normalizeOriginList(data[STORAGE_KEYS.origins]);
}
async function getStats() {
  const data = await localGet(STORAGE_KEYS.stats);
  return normalizeStats(data[STORAGE_KEYS.stats]);
}

// --- chrome.* wrappers -----------------------------------------------------

function getGrantedOrigins() {
  return new Promise((resolve) => {
    chrome.permissions.getAll((perms) => {
      const origins = (perms && perms.origins) || [];
      resolve(normalizeOriginList(origins.map(matchPatternToOrigin).filter(Boolean)));
    });
  });
}

async function getRegisteredIds() {
  try {
    const scripts = await chrome.scripting.getRegisteredContentScripts();
    return (scripts || []).map((s) => s.id);
  } catch {
    return [];
  }
}

/**
 * Reconcile dynamic content-script registrations with the effective set of
 * origins (authorized AND currently permitted). Idempotent; safe to call on
 * install, startup, update, permission change, and settings change.
 */
async function reconcile() {
  const [desiredOrigins, grantedOrigins, registeredIds] = await Promise.all([
    getOrigins(),
    getGrantedOrigins(),
    getRegisteredIds(),
  ]);

  const plan = planReconciliation({ desiredOrigins, grantedOrigins, registeredIds });

  if (plan.toUnregisterIds.length) {
    try {
      await chrome.scripting.unregisterContentScripts({ ids: plan.toUnregisterIds });
    } catch (e) {
      console.warn('[BannerBanner] unregister failed', e);
    }
  }
  if (plan.toRegister.length) {
    try {
      await chrome.scripting.registerContentScripts(plan.toRegister);
    } catch (e) {
      console.warn('[BannerBanner] register failed', e);
    }
  }

  // Keep the stored registry honest: drop authorized origins that no longer hold
  // permission so a later grant is required to reactivate them.
  const effective = new Set(plan.effectiveOrigins);
  if (desiredOrigins.some((o) => !effective.has(o))) {
    await localSet({ [STORAGE_KEYS.origins]: plan.effectiveOrigins });
  }

  return plan;
}

function broadcast(origin, message) {
  const pattern = origin ? originToMatchPattern(origin) : undefined;
  const query = pattern ? { url: pattern } : {};
  chrome.tabs.query(query, (tabs) => {
    void chrome.runtime.lastError;
    for (const tab of tabs || []) {
      if (tab.id != null) chrome.tabs.sendMessage(tab.id, message).catch(() => {});
    }
  });
}

async function broadcastSettings(settings) {
  const origins = await getOrigins();
  for (const origin of origins) {
    broadcast(origin, { type: 'BB_SETTINGS_UPDATED', settings });
  }
}

// --- lifecycle -------------------------------------------------------------

chrome.runtime.onInstalled.addListener(async (details) => {
  const existing = await localGet([STORAGE_KEYS.settings, STORAGE_KEYS.origins, STORAGE_KEYS.stats]);

  if (existing[STORAGE_KEYS.settings] === undefined) {
    // Fresh install or upgrade from legacy alpha: migrate what we safely can.
    let settings = defaultSettings();
    if (details.reason === 'update') {
      const legacySync = await new Promise((resolve) =>
        chrome.storage.sync.get(['banner-preferences', 'auto-close-enabled', 'show-banana-celebration'], (d) => resolve(d || {}))
      );
      settings = migrateLegacySettings(legacySync).settings;
    }
    await localSet({ [STORAGE_KEYS.settings]: settings });
  }
  if (details.reason === 'update') {
    // Purge all alpha-era data, including URL-bearing local knowledge records.
    await Promise.all([
      storageRemove(chrome.storage.local, [
        'bananer-settings',
        'bananer-sites',
        'bananer-kb',
        'bananer-roster',
        'bannersClosedCount',
      ]),
      storageRemove(chrome.storage.sync, [
        'bannersClosedHistory',
        'banner-preferences',
        'auto-close-enabled',
        'show-banana-celebration',
        'theme',
      ]),
    ]);
  }
  if (existing[STORAGE_KEYS.origins] === undefined) {
    await localSet({ [STORAGE_KEYS.origins]: [] });
  }
  if (existing[STORAGE_KEYS.stats] === undefined) {
    await localSet({ [STORAGE_KEYS.stats]: normalizeStats(undefined) });
  }

  await reconcile();

  if (details.reason === 'install') {
    chrome.tabs.create({ url: chrome.runtime.getURL('options.html') + '?welcome=1' });
  }
});

chrome.runtime.onStartup.addListener(() => {
  reconcile();
});

// If the user revokes host access from chrome://extensions, drop it from the
// registry, unregister the script, and stop any activity in open tabs.
chrome.permissions.onRemoved.addListener(async (removed) => {
  const origins = (removed.origins || []).map(matchPatternToOrigin).filter(Boolean);
  if (origins.length) {
    let stored = await getOrigins();
    for (const origin of origins) {
      stored = removeOrigin(stored, origin);
      broadcast(origin, { type: 'BB_STOP', origin });
    }
    await localSet({ [STORAGE_KEYS.origins]: stored });
  }
  await reconcile();
});

chrome.permissions.onAdded.addListener(() => {
  reconcile();
});

// --- messaging -------------------------------------------------------------

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (!message || typeof message !== 'object') return;

  switch (message.type) {
    case 'BB_GET_STATE': {
      (async () => {
        const [settings, origins, stats] = await Promise.all([getSettings(), getOrigins(), getStats()]);
        sendResponse({ settings, origins, stats });
      })();
      return true;
    }

    case 'BB_AUTHORIZE_ORIGIN': {
      (async () => {
        const origin = normalizeOrigin(message.origin);
        if (!origin) {
          sendResponse({ ok: false, error: 'invalid-origin' });
          return;
        }
        const origins = addOrigin(await getOrigins(), origin);
        await localSet({ [STORAGE_KEYS.origins]: origins });
        const plan = await reconcile();
        sendResponse({ ok: plan.effectiveOrigins.includes(origin), origins: plan.effectiveOrigins });
      })();
      return true;
    }

    case 'BB_REVOKE_ORIGIN': {
      (async () => {
        const origin = normalizeOrigin(message.origin);
        if (!origin) {
          sendResponse({ ok: false, error: 'invalid-origin' });
          return;
        }
        const origins = removeOrigin(await getOrigins(), origin);
        await localSet({ [STORAGE_KEYS.origins]: origins });
        broadcast(origin, { type: 'BB_STOP', origin });
        await new Promise((resolve) =>
          chrome.permissions.remove({ origins: [originToMatchPattern(origin)] }, () => {
            void chrome.runtime.lastError;
            resolve();
          })
        );
        const plan = await reconcile();
        sendResponse({ ok: true, origins: plan.effectiveOrigins });
      })();
      return true;
    }

    case 'BB_SET_SETTINGS': {
      (async () => {
        const current = await getSettings();
        const next = normalizeSettings({ ...current, ...sanitizeSettingsPatch(message.patch) }).settings;
        await localSet({ [STORAGE_KEYS.settings]: next });
        await broadcastSettings(next);
        sendResponse({ ok: true, settings: next });
      })();
      return true;
    }

    case 'BB_RESET_SETTINGS': {
      (async () => {
        const next = defaultSettings();
        await localSet({ [STORAGE_KEYS.settings]: next });
        await broadcastSettings(next);
        sendResponse({ ok: true, settings: next });
      })();
      return true;
    }

    case 'BB_OUTCOME': {
      (async () => {
        const stats = await getStats();
        const next = recordOutcome(stats, message.stat, { cmp: message.cmp, mode: message.mode });
        await localSet({ [STORAGE_KEYS.stats]: next });
        sendResponse({ ok: true });
      })();
      return true;
    }

    default:
      return undefined;
  }
});
