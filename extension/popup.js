// BannerBanner toolbar popup.
//
// Site authorization lives here: the ONLY way BannerBanner gains access to an
// origin is the user clicking "Enable on this site", which requests the host
// permission for that single origin and, when granted, asks the service worker
// to record it and register the dynamic content script.

import { normalizeOrigin, originToMatchPattern } from './lib/origins.js';

const els = {
  host: document.getElementById('site-host'),
  status: document.getElementById('site-status'),
  statusText: document.getElementById('status-text'),
  authorize: document.getElementById('authorize-btn'),
  revoke: document.getElementById('revoke-btn'),
  result: document.getElementById('result'),
  mode: document.getElementById('mode'),
  enabled: document.getElementById('enabled'),
  statSuccess: document.getElementById('stat-success'),
  statSites: document.getElementById('stat-sites'),
  openOptions: document.getElementById('open-options'),
};

let currentOrigin = null;

function sendMessage(message) {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(message, (response) => {
      void chrome.runtime.lastError;
      resolve(response);
    });
  });
}

function setAuthorized(authorized) {
  els.status.classList.toggle('on', authorized);
  els.statusText.textContent = authorized
    ? 'Enabled on this site'
    : 'Not enabled on this site';
  els.authorize.classList.toggle('hidden', authorized);
  els.revoke.classList.toggle('hidden', !authorized);
}

async function refreshState() {
  const state = await sendMessage({ type: 'BB_GET_STATE' });
  if (!state) return;
  els.mode.value = state.settings.mode;
  els.enabled.checked = state.settings.enabled;
  els.statSuccess.textContent = state.stats.totals.success;
  els.statSites.textContent = state.origins.length;
  if (currentOrigin) setAuthorized(state.origins.includes(currentOrigin));
}

async function authorize() {
  if (!currentOrigin) return;
  els.result.textContent = '';
  const pattern = originToMatchPattern(currentOrigin);
  chrome.permissions.request({ origins: [pattern] }, async (granted) => {
    if (chrome.runtime.lastError || !granted) {
      els.result.textContent = 'Permission declined — nothing was enabled.';
      return;
    }
    const response = await sendMessage({ type: 'BB_AUTHORIZE_ORIGIN', origin: currentOrigin });
    if (response && response.ok) {
      setAuthorized(true);
      els.result.textContent = 'Enabled. Reload the page to apply.';
    } else {
      els.result.textContent = 'Could not enable this site.';
    }
    refreshState();
  });
}

async function revoke() {
  if (!currentOrigin) return;
  const response = await sendMessage({ type: 'BB_REVOKE_ORIGIN', origin: currentOrigin });
  els.result.textContent = response && response.ok ? 'Disabled on this site.' : 'Could not disable.';
  setAuthorized(false);
  refreshState();
}

els.authorize.addEventListener('click', authorize);
els.revoke.addEventListener('click', revoke);
els.mode.addEventListener('change', () => {
  sendMessage({ type: 'BB_SET_SETTINGS', patch: { mode: els.mode.value } });
});
els.enabled.addEventListener('change', () => {
  sendMessage({ type: 'BB_SET_SETTINGS', patch: { enabled: els.enabled.checked } });
});
els.openOptions.addEventListener('click', (e) => {
  e.preventDefault();
  chrome.runtime.openOptionsPage();
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  const tab = tabs && tabs[0];
  currentOrigin = tab ? normalizeOrigin(tab.url) : null;
  if (!currentOrigin) {
    els.host.textContent = 'this page';
    els.statusText.textContent = 'BannerBanner cannot run on this page';
    els.authorize.disabled = true;
    refreshState();
    return;
  }
  els.host.textContent = new URL(currentOrigin).hostname;
  refreshState();
});
