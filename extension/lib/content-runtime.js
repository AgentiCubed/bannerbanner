// BannerBanner content runtime.
//
// Loaded (via dynamic import from content.js) only on origins the user has
// explicitly authorized. This is the single content-side engine: it awaits
// settings, drives the one consent pipeline, reports the verified outcome, and
// — only then — plays the optional celebration. It holds no detection or
// dismissal logic of its own; that all lives in the pure lib modules.

import { runPipeline, createSession, OUTCOME, outcomeToStat } from './pipeline.js';
import { createDomProbe } from './dom-probe.js';
import { celebrate } from './celebrate.js';
import { normalizeSettings, STORAGE_KEYS } from './settings-schema.js';

const SETTLED = new Set([OUTCOME.SUCCESS, OUTCOME.SENSITIVE, OUTCOME.UNSUPPORTED_MODE, OUTCOME.NO_CONTROL]);

export async function startContentRuntime(win = window, doc = document) {
  // One engine per frame.
  if (win.__bannerBannerActive) return;
  win.__bannerBannerActive = true;

  const probe = createDomProbe(win, doc);
  const session = createSession();
  let settings = null;
  let stopped = false;
  let observer = null;
  let scanning = false;

  function stop() {
    stopped = true;
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  }

  // Revocation and settings changes arrive from the service worker.
  chrome.runtime.onMessage.addListener((message) => {
    if (!message || typeof message !== 'object') return;
    if (message.type === 'BB_STOP') {
      if (!message.origin || message.origin === win.location.origin) stop();
    } else if (message.type === 'BB_SETTINGS_UPDATED') {
      settings = normalizeSettings(message.settings).settings;
    }
  });

  // Await settings before any scan (safety invariant 4).
  settings = await loadSettings();

  async function scan() {
    if (stopped || scanning || !settings || settings.enabled === false) return;
    scanning = true;
    try {
      const result = await runPipeline(probe, settings, { session });
      if (result.outcome !== OUTCOME.DUPLICATE && result.outcome !== OUTCOME.NO_DIALOG) {
        report(result);
      }
      if (result.outcome === OUTCOME.SUCCESS && settings.celebrate) {
        celebrate(win, doc);
      }
      if (SETTLED.has(result.outcome) && observer) {
        // Nothing more to do for a settled CMP; stop reacting to churn.
        observer.disconnect();
        observer = null;
      }
    } finally {
      scanning = false;
    }
  }

  function report(result) {
    const stat = outcomeToStat(result.outcome);
    if (!stat) return;
    try {
      chrome.runtime.sendMessage(
        { type: 'BB_OUTCOME', stat, cmp: result.cmp, mode: result.mode },
        () => void chrome.runtime.lastError
      );
    } catch {
      // Extension context invalidated (e.g. update/revoke) — ignore.
    }
  }

  // Initial scan + observe late-arriving banners.
  await scan();
  if (!stopped) {
    let debounce = null;
    observer = new MutationObserver(() => {
      if (debounce) win.clearTimeout(debounce);
      debounce = win.setTimeout(scan, 300);
    });
    if (doc.body) observer.observe(doc.body, { childList: true, subtree: true });
  }

  function loadSettings() {
    return new Promise((resolve) => {
      try {
        chrome.storage.local.get(STORAGE_KEYS.settings, (data) => {
          void chrome.runtime.lastError;
          resolve(normalizeSettings(data && data[STORAGE_KEYS.settings]).settings);
        });
      } catch {
        resolve(normalizeSettings(undefined).settings);
      }
    });
  }
}
