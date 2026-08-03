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

    chrome.tabs.create({
      url: chrome.runtime.getURL('popup.html') + '?welcome=true'
    });
  }
});

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
