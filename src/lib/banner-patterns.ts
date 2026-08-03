export interface BannerPattern {
  id: string;
  name: string;
  description: string;
  framework?: string;
  selectors: {
    container?: string[];
    acceptAll?: string[];
    rejectAll?: string[];
    settings?: string[];
    saveSettings?: string[];
    necessary?: string[];
    functional?: string[];
    analytics?: string[];
    marketing?: string[];
  };
  detectPattern?: string[];
  priority: number;
}

export const BANNER_PATTERNS: BannerPattern[] = [
  {
    id: 'cookiebot',
    name: 'Cookiebot',
    description: 'One of the most popular cookie consent solutions',
    framework: 'Cookiebot',
    selectors: {
      container: ['#CybotCookiebotDialog', '.CybotCookiebotDialog'],
      acceptAll: ['#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll'],
      rejectAll: ['#CybotCookiebotDialogBodyLevelButtonLevelOptinDeclineAll'],
      settings: ['#CybotCookiebotDialogBodyLevelButtonLevelDetails'],
      saveSettings: ['#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowallSelection'],
      necessary: ['input[id*="CybotCookiebotDialogBodyLevelButtonNecessary"]'],
      functional: ['input[id*="CybotCookiebotDialogBodyLevelButtonPreferences"]'],
      analytics: ['input[id*="CybotCookiebotDialogBodyLevelButtonStatistics"]'],
      marketing: ['input[id*="CybotCookiebotDialogBodyLevelButtonMarketing"]'],
    },
    detectPattern: ['CybotCookiebot', 'cookiebot'],
    priority: 1,
  },
  {
    id: 'onetrust',
    name: 'OneTrust',
    description: 'Enterprise cookie consent management platform',
    framework: 'OneTrust',
    selectors: {
      container: ['#onetrust-banner-sdk', '#onetrust-consent-sdk'],
      acceptAll: ['#onetrust-accept-btn-handler', '.onetrust-close-btn-handler'],
      rejectAll: ['#onetrust-reject-all-handler', '.ot-pc-refuse-all-handler'],
      settings: ['#onetrust-pc-btn-handler', '.ot-sdk-show-settings'],
      saveSettings: ['.save-preference-btn-handler', '.onetrust-close-btn-handler'],
      necessary: ['input[id*="ot-group-id-C0001"]'],
      functional: ['input[id*="ot-group-id-C0003"]'],
      analytics: ['input[id*="ot-group-id-C0002"]'],
      marketing: ['input[id*="ot-group-id-C0004"]'],
    },
    detectPattern: ['onetrust', 'ot-sdk'],
    priority: 1,
  },
  {
    id: 'cookiefirst',
    name: 'CookieFirst',
    description: 'GDPR-compliant cookie consent solution',
    framework: 'CookieFirst',
    selectors: {
      container: ['[data-cookiefirst-banner]', '#cookiefirst-root'],
      acceptAll: ['button[data-cookiefirst-action="accept"]'],
      rejectAll: ['button[data-cookiefirst-action="reject"]'],
      settings: ['button[data-cookiefirst-action="adjust"]'],
      saveSettings: ['button[data-cookiefirst-action="save"]'],
      necessary: ['input[name="necessary"]'],
      functional: ['input[name="functional"]'],
      analytics: ['input[name="analytics"]'],
      marketing: ['input[name="marketing"]'],
    },
    detectPattern: ['cookiefirst'],
    priority: 1,
  },
  {
    id: 'cookieyes',
    name: 'CookieYes',
    description: 'Popular WordPress cookie consent plugin',
    framework: 'CookieYes',
    selectors: {
      container: ['#cky-consent-container', '.cky-consent-container'],
      acceptAll: ['.cky-btn-accept'],
      rejectAll: ['.cky-btn-reject'],
      settings: ['.cky-btn-customize'],
      saveSettings: ['.cky-btn-preferences'],
      necessary: ['input[data-cky-tag="necessary"]'],
      functional: ['input[data-cky-tag="functional"]'],
      analytics: ['input[data-cky-tag="analytics"]'],
      marketing: ['input[data-cky-tag="advertisement"]'],
    },
    detectPattern: ['cky-consent', 'cookieyes'],
    priority: 1,
  },
  {
    id: 'termly',
    name: 'Termly',
    description: 'Comprehensive consent management',
    framework: 'Termly',
    selectors: {
      container: ['#termly-code-snippet-support', '[data-termly]'],
      acceptAll: ['button[data-action="accept-all"]'],
      rejectAll: ['button[data-action="reject-all"]'],
      settings: ['button[data-action="open-settings"]'],
      saveSettings: ['button[data-action="save"]'],
      necessary: ['input[name="necessary"]'],
      functional: ['input[name="functionality"]'],
      analytics: ['input[name="analytics"]'],
      marketing: ['input[name="advertising"]'],
    },
    detectPattern: ['termly'],
    priority: 1,
  },
  {
    id: 'complianz',
    name: 'Complianz',
    description: 'WordPress GDPR/CCPA cookie consent',
    framework: 'Complianz',
    selectors: {
      container: ['.cmplz-cookiebanner', '#cmplz-cookiebanner'],
      acceptAll: ['.cmplz-accept'],
      rejectAll: ['.cmplz-deny'],
      settings: ['.cmplz-manage-consent'],
      saveSettings: ['.cmplz-save-preferences'],
      functional: ['input[name="cmplz_functional"]'],
      analytics: ['input[name="cmplz_statistics"]'],
      marketing: ['input[name="cmplz_marketing"]'],
    },
    detectPattern: ['cmplz', 'complianz'],
    priority: 1,
  },
  {
    id: 'quantcast',
    name: 'Quantcast Choice',
    description: 'IAB TCF compliant CMP',
    framework: 'Quantcast',
    selectors: {
      container: ['[id*="qc-cmp2"]', '.qc-cmp2-container'],
      acceptAll: ['button[mode="primary"]', 'button.qc-cmp2-summary-buttons button:first-child'],
      rejectAll: ['button.qc-cmp2-reject-all'],
      settings: ['button[mode="secondary"]', 'button.qc-cmp2-summary-buttons button:last-child'],
      saveSettings: ['.qc-cmp2-save-and-exit'],
    },
    detectPattern: ['qc-cmp', 'quantcast'],
    priority: 1,
  },
  {
    id: 'trustarc',
    name: 'TrustArc',
    description: 'Enterprise privacy management platform',
    framework: 'TrustArc',
    selectors: {
      container: ['#truste-consent-track', '#teconsent'],
      acceptAll: ['.truste-button1', '#truste-consent-button'],
      settings: ['.truste-button2', '.truste-manage-cookies'],
      saveSettings: ['.trustarc-agree-btn'],
    },
    detectPattern: ['truste', 'trustarc'],
    priority: 1,
  },
  {
    id: 'didomi',
    name: 'Didomi',
    description: 'Consent & preference management',
    framework: 'Didomi',
    selectors: {
      container: ['#didomi-host', '.didomi-consent-popup'],
      acceptAll: ['#didomi-notice-agree-button'],
      rejectAll: ['#didomi-notice-disagree-button'],
      settings: ['#didomi-notice-learn-more-button'],
      saveSettings: ['.didomi-consent-popup-actions button[aria-label*="Agree"]'],
    },
    detectPattern: ['didomi'],
    priority: 1,
  },
  {
    id: 'osano',
    name: 'Osano',
    description: 'Data privacy platform',
    framework: 'Osano',
    selectors: {
      container: ['.osano-cm-dialog', '.osano-cm-window'],
      acceptAll: ['.osano-cm-accept-all', '.osano-cm-accept'],
      rejectAll: ['.osano-cm-deny-all', '.osano-cm-deny'],
      settings: ['.osano-cm-dialog__close', '.osano-cm-link'],
      saveSettings: ['.osano-cm-save'],
    },
    detectPattern: ['osano'],
    priority: 1,
  },
  {
    id: 'usercentrics',
    name: 'Usercentrics',
    description: 'Consent management platform',
    framework: 'Usercentrics',
    selectors: {
      container: ['#usercentrics-root', '[data-testid="uc-container"]'],
      acceptAll: ['[data-testid="uc-accept-all-button"]'],
      rejectAll: ['[data-testid="uc-deny-all-button"]'],
      settings: ['[data-testid="uc-more-button"]'],
      saveSettings: ['[data-testid="uc-save-button"]'],
    },
    detectPattern: ['usercentrics'],
    priority: 1,
  },
  {
    id: 'iubenda',
    name: 'iubenda',
    description: 'Privacy and cookie solution',
    framework: 'iubenda',
    selectors: {
      container: ['#iubenda-cs-banner', '.iubenda-cs-container'],
      acceptAll: ['.iubenda-cs-accept-btn'],
      rejectAll: ['.iubenda-cs-reject-btn'],
      settings: ['.iubenda-cs-customize-btn'],
      saveSettings: ['.iubenda-cs-btn-primary'],
    },
    detectPattern: ['iubenda'],
    priority: 1,
  },
  {
    id: 'generic-gdpr',
    name: 'Generic GDPR Banner',
    description: 'Common patterns for custom GDPR implementations',
    selectors: {
      container: [
        '[class*="cookie-banner"]',
        '[class*="cookie-consent"]',
        '[id*="cookie-banner"]',
        '[class*="gdpr"]',
        '[aria-label*="cookie" i]',
        '[role="dialog"][aria-label*="consent" i]',
      ],
      acceptAll: [
        'button[class*="accept-all" i]',
        'button[class*="accept" i]:not([class*="necessary"])',
        'button[id*="accept-all" i]',
        'button:has-text("Accept All")',
        'button:has-text("Accept all cookies")',
        '[data-action="accept-all"]',
      ],
      rejectAll: [
        'button[class*="reject-all" i]',
        'button[class*="decline" i]',
        'button[class*="reject" i]',
        'button[id*="reject-all" i]',
        'button:has-text("Reject All")',
        '[data-action="reject-all"]',
      ],
      settings: [
        'button[class*="settings" i]',
        'button[class*="customize" i]',
        'button[class*="manage" i]',
        'button:has-text("Settings")',
        'button:has-text("Manage")',
        '[data-action="settings"]',
      ],
    },
    priority: 10,
  },
];

export interface BannerMatchResult {
  pattern: BannerPattern;
  confidence: number;
  detectedElements: {
    container?: Element;
    acceptAll?: Element;
    rejectAll?: Element;
    settings?: Element;
  };
}

export function detectBanner(document: Document): BannerMatchResult | null {
  const matches: BannerMatchResult[] = [];

  for (const pattern of BANNER_PATTERNS) {
    let confidence = 0;
    const detectedElements: BannerMatchResult['detectedElements'] = {};

    if (pattern.detectPattern) {
      for (const detectStr of pattern.detectPattern) {
        if (document.body.innerHTML.toLowerCase().includes(detectStr.toLowerCase())) {
          confidence += 30;
          break;
        }
      }
    }

    if (pattern.selectors.container) {
      for (const selector of pattern.selectors.container) {
        const element = document.querySelector(selector);
        if (element) {
          detectedElements.container = element;
          confidence += 40;
          break;
        }
      }
    }

    if (pattern.selectors.acceptAll) {
      for (const selector of pattern.selectors.acceptAll) {
        try {
          const element = document.querySelector(selector);
          if (element) {
            detectedElements.acceptAll = element;
            confidence += 10;
            break;
          }
        } catch {
          continue;
        }
      }
    }

    if (pattern.selectors.settings) {
      for (const selector of pattern.selectors.settings) {
        try {
          const element = document.querySelector(selector);
          if (element) {
            detectedElements.settings = element;
            confidence += 10;
            break;
          }
        } catch {
          continue;
        }
      }
    }

    if (pattern.selectors.rejectAll) {
      for (const selector of pattern.selectors.rejectAll) {
        try {
          const element = document.querySelector(selector);
          if (element) {
            detectedElements.rejectAll = element;
            confidence += 10;
            break;
          }
        } catch {
          continue;
        }
      }
    }

    if (confidence > 0) {
      matches.push({
        pattern,
        confidence,
        detectedElements,
      });
    }
  }

  matches.sort((a, b) => {
    if (b.confidence !== a.confidence) {
      return b.confidence - a.confidence;
    }
    return a.pattern.priority - b.pattern.priority;
  });

  return matches.length > 0 ? matches[0] : null;
}

export function findElement(selectors: string[], doc: Document = document): Element | null {
  for (const selector of selectors) {
    try {
      const element = doc.querySelector(selector);
      if (element) return element;
    } catch {
      continue;
    }
  }
  return null;
}

export function clickElement(element: Element | null): boolean {
  if (!element) return false;
  
  try {
    if (element instanceof HTMLElement) {
      element.click();
      return true;
    }
    
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    });
    element.dispatchEvent(clickEvent);
    return true;
  } catch {
    return false;
  }
}

export function toggleCheckbox(element: Element | null, checked: boolean): boolean {
  if (!element) return false;

  try {
    if (element instanceof HTMLInputElement) {
      if (element.type === 'checkbox') {
        if (element.checked !== checked) {
          element.click();
        }
        return true;
      }
    }

    const input = element.querySelector('input[type="checkbox"]');
    if (input instanceof HTMLInputElement) {
      if (input.checked !== checked) {
        input.click();
      }
      return true;
    }
  } catch {
    return false;
  }

  return false;
}
