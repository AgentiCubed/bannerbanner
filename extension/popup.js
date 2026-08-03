// BannerBanner toolbar popup — quick actions for deploying bananers.

(function () {
  'use strict';

  const els = {
    host: document.getElementById('site-host'),
    status: document.getElementById('site-status'),
    statusText: document.getElementById('site-status-text'),
    deploy: document.getElementById('deploy-btn'),
    result: document.getElementById('deploy-result'),
    removeSite: document.getElementById('remove-site-btn'),
    statFingerprints: document.getElementById('stat-fingerprints'),
    statDismissals: document.getElementById('stat-dismissals'),
    statSites: document.getElementById('stat-sites'),
    openLearn: document.getElementById('open-learn'),
  };

  let currentTab = null;
  let currentOrigin = null;

  function isDeployableUrl(url) {
    return /^https?:\/\//i.test(url || '');
  }

  function setStatus(active) {
    els.status.classList.toggle('on', active);
    els.statusText.textContent = active
      ? 'Bananers are on duty here'
      : 'No bananers deployed here yet';
    els.removeSite.classList.toggle('hidden', !active);
    els.deploy.textContent = active ? '🍌 Deploy a bananer now' : '🍌 Deploy a bananer here';
  }

  function refreshStats() {
    chrome.runtime.sendMessage({ type: 'BANANER_GET_STATE' }, (state) => {
      if (chrome.runtime.lastError || !state) return;
      const kbCount = Object.keys(state.kb || {}).length;
      const dismissals = Object.values(state.roster || {}).reduce((sum, r) => sum + (r.dismissals || 0), 0);
      els.statFingerprints.textContent = kbCount;
      els.statDismissals.textContent = dismissals;
      els.statSites.textContent = (state.sites || []).length;
    });
  }

  function injectAndDeploy(tabId) {
    chrome.scripting.executeScript(
      { target: { tabId }, files: ['bananer-characters.js', 'bananer.js'] },
      () => {
        void chrome.runtime.lastError;
        // Give the content script a beat to load its knowledge base.
        setTimeout(() => {
          chrome.tabs.sendMessage(tabId, { type: 'BANANER_DEPLOY_NOW' }, (response) => {
            if (chrome.runtime.lastError || !response) {
              els.result.textContent = 'Could not reach this page — try reloading it.';
              return;
            }
            els.result.textContent =
              response.found > 0
                ? `Bananer found ${response.found} popup${response.found === 1 ? '' : 's'} to handle! 💥`
                : 'All clear — the bananer found no popups. 🍌';
            refreshStats();
          });
        }, 300);
      }
    );
  }

  function deploy() {
    if (!currentTab || !currentOrigin) return;
    els.result.textContent = '';
    const originPattern = `${currentOrigin}/*`;

    chrome.permissions.contains({ origins: [originPattern] }, (granted) => {
      if (granted) {
        setStatus(true);
        injectAndDeploy(currentTab.id);
        return;
      }
      chrome.permissions.request({ origins: [originPattern] }, (accepted) => {
        if (!accepted) {
          els.result.textContent = 'Permission declined — bananers stay home.';
          return;
        }
        chrome.runtime.sendMessage({ type: 'BANANER_SITE_OPTED_IN', origin: currentOrigin }, () => {
          void chrome.runtime.lastError;
          setStatus(true);
          refreshStats();
          injectAndDeploy(currentTab.id);
        });
      });
    });
  }

  function removeSite() {
    if (!currentOrigin) return;
    chrome.runtime.sendMessage({ type: 'BANANER_SITE_REMOVED', origin: currentOrigin }, () => {
      void chrome.runtime.lastError;
      setStatus(false);
      els.result.textContent = 'Bananers recalled from this site.';
      refreshStats();
    });
  }

  els.deploy.addEventListener('click', deploy);
  els.removeSite.addEventListener('click', removeSite);
  els.openLearn.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
  });

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    currentTab = tabs && tabs[0];
    const url = currentTab && currentTab.url;
    if (!currentTab || !isDeployableUrl(url)) {
      els.host.textContent = 'this page';
      els.statusText.textContent = 'Bananers cannot work on this page';
      els.deploy.disabled = true;
      refreshStats();
      return;
    }
    const parsed = new URL(url);
    currentOrigin = parsed.origin;
    els.host.textContent = parsed.hostname;
    chrome.permissions.contains({ origins: [`${currentOrigin}/*`] }, (granted) => setStatus(!!granted));
    refreshStats();
  });
})();
