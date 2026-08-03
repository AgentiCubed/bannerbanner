const BANANER_DEFAULT_SETTINGS = {
  enabled: true,
  autoDismiss: true,
  showCharacter: true,
  showCaptions: true,
  preemptiveSuppression: true,
};

const BANANER_KB_MAX_RECORDS = 300;
const XP_NEW_FINGERPRINT = 10;
const XP_RECALL = 2;

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    chrome.storage.sync.set({
      'banner-preferences': {
        level: 'necessary',
        useCustom: false,
        customCategories: {
          necessary: true,
          functional: false,
          analytics: false,
          marketing: false,
        },
      },
      'auto-close-enabled': true,
      'show-banana-celebration': true,
      'theme': 'light',
    });

    chrome.storage.local.set({
      'bananer-settings': BANANER_DEFAULT_SETTINGS,
      'bananer-sites': [],
      'bananer-kb': {},
      'bananer-roster': {},
    });

    chrome.tabs.create({
      url: chrome.runtime.getURL('learn.html') + '?welcome=true'
    });
  }
});

// ---------------------------------------------------------------------------
// Bananers: knowledge base + roster bookkeeping
// ---------------------------------------------------------------------------

function mergeBananerReport(record, sendResponse) {
  chrome.storage.local.get(['bananer-kb', 'bananer-roster'], (result) => {
    const kb = result['bananer-kb'] || {};
    const roster = result['bananer-roster'] || {};
    const now = Date.now();
    const existing = kb[record.id];

    if (existing) {
      existing.stats = existing.stats || {};
      existing.stats.timesSeen = (existing.stats.timesSeen || 0) + 1;
      existing.stats.timesDismissed = (existing.stats.timesDismissed || 0) + 1;
      existing.stats.lastSeenAt = now;
      existing.stats.lastDurationMs = record.durationMs;
      if (!existing.stats.fastestMs || record.durationMs < existing.stats.fastestMs) {
        existing.stats.fastestMs = record.durationMs;
      }
      existing.steps = record.steps || existing.steps;
      existing.selector = record.selector || existing.selector;
      existing.suppressSelector = record.suppressSelector || existing.suppressSelector;
      existing.dismissal = record.dismissal || existing.dismissal;
      existing.inspection = record.inspection || existing.inspection;
      kb[record.id] = existing;
    } else {
      record.stats = {
        timesSeen: 1,
        timesDismissed: 1,
        firstLearnedAt: now,
        lastSeenAt: now,
        lastDurationMs: record.durationMs,
        fastestMs: record.durationMs,
      };
      kb[record.id] = record;
    }

    // Prune the knowledge base, oldest memories first.
    const ids = Object.keys(kb);
    if (ids.length > BANANER_KB_MAX_RECORDS) {
      ids
        .sort((a, b) => (kb[a].stats.lastSeenAt || 0) - (kb[b].stats.lastSeenAt || 0))
        .slice(0, ids.length - BANANER_KB_MAX_RECORDS)
        .forEach((id) => delete kb[id]);
    }

    const characterId = record.characterId || 'professor-nana';
    const entry = roster[characterId] || { xp: 0, dismissals: 0, recalls: 0, fingerprints: 0, byType: {} };
    entry.xp += record.recall ? XP_RECALL : XP_NEW_FINGERPRINT;
    entry.dismissals += 1;
    if (record.recall) entry.recalls += 1;
    else entry.fingerprints += 1;
    entry.byType[record.bannerType] = (entry.byType[record.bannerType] || 0) + 1;
    roster[characterId] = entry;

    chrome.storage.local.set({ 'bananer-kb': kb, 'bananer-roster': roster }, () => {
      if (sendResponse) sendResponse({ ok: true });
    });
  });
}

function broadcastToTabs(message) {
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id, message).catch(() => {});
    });
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'BANNER_CLOSED') {
    chrome.storage.local.get(['bannersClosedCount'], (result) => {
      const count = (result.bannersClosedCount || 0) + 1;
      chrome.storage.local.set({ bannersClosedCount: count });
      
      chrome.storage.sync.get(['bannersClosedHistory'], (historyResult) => {
        const history = historyResult.bannersClosedHistory || [];
        history.push({
          timestamp: Date.now(),
          bannerName: message.bannerName,
          url: sender.tab?.url,
          preferenceApplied: message.preferenceApplied,
        });
        
        if (history.length > 1000) {
          history.shift();
        }
        
        chrome.storage.sync.set({ bannersClosedHistory: history });
      });
    });
  }
  
  if (message.type === 'GET_STATS') {
    chrome.storage.local.get(['bannersClosedCount'], (result) => {
      sendResponse({ bannersClosedCount: result.bannersClosedCount || 0 });
    });
    return true;
  }
  
  if (message.type === 'SHOW_CELEBRATION') {
    chrome.tabs.sendMessage(sender.tab.id, {
      type: 'SHOW_BANANA_CELEBRATION',
      bannerName: message.bannerName,
    });
  }

  if (message.type === 'BANANER_REPORT') {
    mergeBananerReport(message.record, sendResponse);
    return true;
  }

  if (message.type === 'BANANER_GET_STATE') {
    chrome.storage.local.get(['bananer-settings', 'bananer-sites', 'bananer-kb', 'bananer-roster'], (result) => {
      sendResponse({
        settings: Object.assign({}, BANANER_DEFAULT_SETTINGS, result['bananer-settings'] || {}),
        sites: result['bananer-sites'] || [],
        kb: result['bananer-kb'] || {},
        roster: result['bananer-roster'] || {},
      });
    });
    return true;
  }

  if (message.type === 'BANANER_SET_SETTINGS') {
    chrome.storage.local.get(['bananer-settings'], (result) => {
      const settings = Object.assign({}, BANANER_DEFAULT_SETTINGS, result['bananer-settings'] || {}, message.settings || {});
      chrome.storage.local.set({ 'bananer-settings': settings }, () => {
        broadcastToTabs({ type: 'BANANER_SETTINGS_UPDATED', settings });
        sendResponse({ ok: true, settings });
      });
    });
    return true;
  }

  if (message.type === 'BANANER_SITE_OPTED_IN') {
    chrome.storage.local.get(['bananer-sites'], (result) => {
      const sites = result['bananer-sites'] || [];
      if (!sites.includes(message.origin)) sites.push(message.origin);
      chrome.storage.local.set({ 'bananer-sites': sites }, () => sendResponse({ ok: true, sites }));
    });
    return true;
  }

  if (message.type === 'BANANER_SITE_REMOVED') {
    chrome.storage.local.get(['bananer-sites'], (result) => {
      const sites = (result['bananer-sites'] || []).filter((s) => s !== message.origin);
      chrome.storage.local.set({ 'bananer-sites': sites }, () => {
        chrome.permissions.remove({ origins: [`${message.origin}/*`] }, () => {
          void chrome.runtime.lastError;
          sendResponse({ ok: true, sites });
        });
      });
    });
    return true;
  }

  if (message.type === 'BANANER_FORGET') {
    chrome.storage.local.get(['bananer-kb'], (result) => {
      const kb = result['bananer-kb'] || {};
      delete kb[message.id];
      chrome.storage.local.set({ 'bananer-kb': kb }, () => sendResponse({ ok: true }));
    });
    return true;
  }

  if (message.type === 'BANANER_FORGET_ALL') {
    chrome.storage.local.set({ 'bananer-kb': {} }, () => sendResponse({ ok: true }));
    return true;
  }
});

// Keep the opted-in site list honest if the user revokes host access
// from chrome://extensions or the site controls menu.
chrome.permissions.onRemoved.addListener((removed) => {
  if (!removed.origins || !removed.origins.length) return;
  chrome.storage.local.get(['bananer-sites'], (result) => {
    const sites = result['bananer-sites'] || [];
    const remaining = sites.filter(
      (site) => !removed.origins.some((pattern) => pattern === `${site}/*` || pattern === site)
    );
    if (remaining.length !== sites.length) {
      chrome.storage.local.set({ 'bananer-sites': remaining });
    }
  });
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'sync' && changes['banner-preferences']) {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(tab.id, {
          type: 'PREFERENCES_UPDATED',
          preferences: changes['banner-preferences'].newValue,
        }).catch(() => {});
      });
    });
  }
});
