const BANNER_PATTERNS = [
  {
    name: 'Cookiebot',
    containerSelectors: ['#CybotCookiebotDialog', '[id*="CookiebotDialog"]'],
    acceptSelectors: ['#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll', 'a#CybotCookiebotDialogBodyButtonAccept'],
    rejectSelectors: ['#CybotCookiebotDialogBodyLevelButtonLevelOptinDeclineAll', 'a#CybotCookiebotDialogBodyButtonDecline'],
    settingsSelectors: ['#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowallSelection', 'a.CybotCookiebotDialogBodyLevelButtonLevelOptinAllowallSelection'],
    categoryToggles: {
      functional: '[data-cookieconsent="preferences"]',
      analytics: '[data-cookieconsent="statistics"]',
      marketing: '[data-cookieconsent="marketing"]',
    },
  },
  {
    name: 'OneTrust',
    containerSelectors: ['#onetrust-banner-sdk', '#onetrust-consent-sdk'],
    acceptSelectors: ['#onetrust-accept-btn-handler', 'button[title*="Accept"]'],
    rejectSelectors: ['#onetrust-reject-all-handler', '.ot-pc-refuse-all-handler'],
    settingsSelectors: ['#onetrust-pc-btn-handler', 'button[aria-label*="Cookie Settings"]'],
    categoryToggles: {
      functional: '#ot-group-id-C0003',
      analytics: '#ot-group-id-C0002',
      marketing: '#ot-group-id-C0004',
    },
  },
  {
    name: 'CookieYes',
    containerSelectors: ['.cky-consent-container', '#cky-consent-container'],
    acceptSelectors: ['.cky-btn-accept', 'button[data-cky-tag="accept-button"]'],
    rejectSelectors: ['.cky-btn-reject', 'button[data-cky-tag="reject-button"]'],
    settingsSelectors: ['.cky-btn-settings', 'button[data-cky-tag="settings-button"]'],
    categoryToggles: {
      functional: '[data-cky-tag="functional"]',
      analytics: '[data-cky-tag="analytics"]',
      marketing: '[data-cky-tag="advertisement"]',
    },
  },
  {
    name: 'Quantcast Choice',
    containerSelectors: ['#qc-cmp2-ui', '.qc-cmp2-container'],
    acceptSelectors: ['button[mode="primary"]', '.qc-cmp2-summary-buttons > button:first-child'],
    rejectSelectors: ['button[mode="secondary"]', '.qc-cmp2-summary-buttons > button:last-child'],
    settingsSelectors: ['.qc-cmp2-summary-buttons button', 'button[aria-label*="Manage"]'],
  },
  {
    name: 'Usercentrics',
    containerSelectors: ['#usercentrics-root', '[data-testid="uc-container"]'],
    acceptSelectors: ['button[data-testid="uc-accept-all-button"]', '[aria-label*="Accept all"]'],
    rejectSelectors: ['button[data-testid="uc-deny-all-button"]', '[aria-label*="Deny all"]'],
    settingsSelectors: ['button[data-testid="uc-more-button"]', '[aria-label*="More"]'],
  },
  {
    name: 'TrustArc',
    containerSelectors: ['#truste-consent-track', '#consent-banner'],
    acceptSelectors: ['.trustarc-agree-btn', 'a.call'],
    rejectSelectors: ['.trustarc-required-btn', 'a.required'],
    settingsSelectors: ['.trustarc-manage-btn', 'a.manage'],
  },
  {
    name: 'Osano',
    containerSelectors: ['.osano-cm-widget', '.osano-cm-dialog'],
    acceptSelectors: ['.osano-cm-accept-all', 'button[data-action="acceptAll"]'],
    rejectSelectors: ['.osano-cm-deny', 'button[data-action="denyAll"]'],
    settingsSelectors: ['.osano-cm-manage', 'button[data-action="manage"]'],
  },
  {
    name: 'Cookie Notice',
    containerSelectors: ['#cookie-notice', '.cookie-notice-container'],
    acceptSelectors: ['#cn-accept-cookie', '.cn-button-accept'],
    rejectSelectors: ['#cn-refuse-cookie', '.cn-button-refuse'],
    settingsSelectors: ['#cn-more-info', '.cn-button-settings'],
  },
];

let currentPreferences = null;
let autoCloseEnabled = true;
let showBananaCelebration = true;
let processingBanner = false;

chrome.storage.sync.get(['banner-preferences', 'auto-close-enabled', 'show-banana-celebration'], (result) => {
  currentPreferences = result['banner-preferences'] || {
    level: 'necessary',
    useCustom: false,
    customCategories: { necessary: true, functional: false, analytics: false, marketing: false },
  };
  autoCloseEnabled = result['auto-close-enabled'] !== false;
  showBananaCelebration = result['show-banana-celebration'] !== false;
});

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'PREFERENCES_UPDATED') {
    currentPreferences = message.preferences;
  }
  if (message.type === 'SHOW_BANANA_CELEBRATION' && showBananaCelebration) {
    showBananaCelebrationAnimation(message.bannerName);
  }
});

function detectBanner() {
  if (processingBanner) return null;
  
  for (const pattern of BANNER_PATTERNS) {
    for (const selector of pattern.containerSelectors) {
      const container = document.querySelector(selector);
      if (container && isVisible(container)) {
        return { pattern, container };
      }
    }
  }
  
  return null;
}

function isVisible(element) {
  if (!element) return false;
  const style = window.getComputedStyle(element);
  return style.display !== 'none' && 
         style.visibility !== 'hidden' && 
         style.opacity !== '0' &&
         element.offsetParent !== null;
}

function findButton(selectors) {
  for (const selector of selectors) {
    const button = document.querySelector(selector);
    if (button && isVisible(button)) {
      return button;
    }
  }
  return null;
}

async function handleBanner(pattern, container) {
  if (!autoCloseEnabled || processingBanner) return;
  
  processingBanner = true;
  
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let buttonToClick = null;
    let preferenceApplied = '';
    
    if (currentPreferences.useCustom) {
      const settingsButton = findButton(pattern.settingsSelectors || []);
      if (settingsButton) {
        settingsButton.click();
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (pattern.categoryToggles) {
          const categories = currentPreferences.customCategories;
          
          for (const [category, selector] of Object.entries(pattern.categoryToggles)) {
            const toggle = document.querySelector(selector);
            if (toggle) {
              const shouldBeEnabled = categories[category] === true;
              const isEnabled = toggle.checked || toggle.getAttribute('aria-checked') === 'true';
              
              if (shouldBeEnabled !== isEnabled) {
                toggle.click();
              }
            }
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 300));
        
        const saveButton = document.querySelector('button[aria-label*="Save"], button[class*="save"], button[id*="save"]');
        if (saveButton) {
          buttonToClick = saveButton;
          preferenceApplied = 'custom';
        }
      }
    } else {
      switch (currentPreferences.level) {
        case 'necessary':
          buttonToClick = findButton(pattern.rejectSelectors || []);
          preferenceApplied = 'necessary';
          break;
        case 'functional':
        case 'analytics':
          buttonToClick = findButton(pattern.settingsSelectors || []);
          preferenceApplied = currentPreferences.level;
          break;
        case 'all':
          buttonToClick = findButton(pattern.acceptSelectors || []);
          preferenceApplied = 'all';
          break;
      }
    }
    
    if (buttonToClick) {
      buttonToClick.click();
      
      chrome.runtime.sendMessage({
        type: 'BANNER_CLOSED',
        bannerName: pattern.name,
        preferenceApplied,
      });
      
      if (showBananaCelebration) {
        await new Promise(resolve => setTimeout(resolve, 300));
        showBananaCelebrationAnimation(pattern.name);
      }
    }
  } catch (error) {
    console.error('[BannerBanner] Error handling banner:', error);
  } finally {
    processingBanner = false;
  }
}

function showBananaCelebrationAnimation(bannerName) {
  const celebrations = [
    'zipline',
    'lawyer',
    'bicycle',
    'newspaper',
    'dance',
    'detective',
    'parkbench',
    'chef',
  ];
  
  const randomCelebration = celebrations[Math.floor(Math.random() * celebrations.length)];
  
  const celebrationContainer = document.createElement('div');
  celebrationContainer.id = 'bannerbanner-celebration';
  celebrationContainer.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 2147483647;
    overflow: hidden;
  `;
  
  const banana = document.createElement('div');
  banana.style.cssText = `
    position: absolute;
    font-size: 48px;
    filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));
  `;
  
  switch (randomCelebration) {
    case 'zipline':
      banana.innerHTML = '🍌💼';
      banana.style.top = '10%';
      banana.style.left = '-10%';
      banana.style.animation = 'zipline 3s ease-in-out forwards';
      break;
    case 'lawyer':
      banana.innerHTML = '🍌👔';
      banana.style.top = '50%';
      banana.style.left = '-10%';
      banana.style.animation = 'walkacross 4s linear forwards';
      break;
    case 'bicycle':
      banana.innerHTML = '🍌🚲';
      banana.style.bottom = '10%';
      banana.style.left = '-10%';
      banana.style.animation = 'wobblybike 5s ease-in-out forwards';
      break;
    case 'newspaper':
      banana.innerHTML = '🍌📰';
      banana.style.top = '30%';
      banana.style.right = '-10%';
      banana.style.animation = 'floatreading 4s ease-in-out forwards';
      break;
    case 'dance':
      banana.innerHTML = '🍌🍌🍌';
      banana.style.bottom = '20%';
      banana.style.left = '50%';
      banana.style.animation = 'quickdance 2s ease-in-out forwards';
      break;
    case 'detective':
      banana.innerHTML = '🍌🔍';
      banana.style.top = '40%';
      banana.style.left = '-10%';
      banana.style.animation = 'investigate 4s ease-in-out forwards';
      break;
    case 'parkbench':
      banana.innerHTML = '🍌🪑🐦';
      banana.style.top = '60%';
      banana.style.left = '50%';
      banana.style.animation = 'parkrelax 4s ease-in-out forwards';
      break;
    case 'chef':
      banana.innerHTML = '🍌👨‍🍳🥞';
      banana.style.top = '35%';
      banana.style.right = '-10%';
      banana.style.animation = 'flipcook 3s ease-in-out forwards';
      break;
  }
  
  celebrationContainer.appendChild(banana);
  document.body.appendChild(celebrationContainer);
  
  const style = document.createElement('style');
  style.textContent = `
    @keyframes zipline {
      0% { left: -10%; transform: rotate(0deg); }
      100% { left: 110%; transform: rotate(360deg); }
    }
    @keyframes walkacross {
      0% { left: -10%; }
      50% { transform: scaleX(-1); }
      100% { left: 110%; }
    }
    @keyframes wobblybike {
      0% { left: -10%; transform: rotate(0deg); }
      25% { transform: rotate(5deg); }
      50% { transform: rotate(-5deg); }
      75% { transform: rotate(3deg); }
      100% { left: 110%; transform: rotate(0deg); }
    }
    @keyframes floatreading {
      0% { right: -10%; opacity: 0; }
      20% { opacity: 1; }
      80% { opacity: 1; }
      100% { right: -10%; transform: translateY(-100px); opacity: 0; }
    }
    @keyframes quickdance {
      0% { transform: translateX(-50%) scale(0); }
      20% { transform: translateX(-50%) scale(1.2) rotate(10deg); }
      40% { transform: translateX(-50%) scale(1) rotate(-10deg); }
      60% { transform: translateX(-50%) scale(1.1) rotate(10deg); }
      80% { transform: translateX(-50%) scale(1) rotate(-5deg); }
      100% { transform: translateX(-50%) scale(0); }
    }
    @keyframes investigate {
      0% { left: -10%; }
      40% { left: 50%; }
      60% { left: 50%; transform: scale(1.1); }
      100% { left: 110%; }
    }
    @keyframes parkrelax {
      0% { transform: translateX(-50%) translateY(100px); opacity: 0; }
      20% { transform: translateX(-50%) translateY(0); opacity: 1; }
      80% { transform: translateX(-50%) translateY(0); opacity: 1; }
      100% { transform: translateX(-50%) translateY(-100px); opacity: 0; }
    }
    @keyframes flipcook {
      0% { right: -10%; }
      40% { right: 40%; }
      50% { right: 40%; transform: rotateY(360deg); }
      60% { right: 40%; }
      100% { right: -10%; }
    }
  `;
  document.head.appendChild(style);
  
  setTimeout(() => {
    celebrationContainer.remove();
    style.remove();
  }, 6000);
}

const observer = new MutationObserver(() => {
  const detected = detectBanner();
  if (detected && autoCloseEnabled) {
    handleBanner(detected.pattern, detected.container);
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

setTimeout(() => {
  const detected = detectBanner();
  if (detected && autoCloseEnabled) {
    handleBanner(detected.pattern, detected.container);
  }
}, 1000);
