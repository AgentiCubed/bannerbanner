// Allowlisted CMP adapters for BannerBanner.
//
// v0.1 only ever acts on a supported consent-management platform through an
// exact, intended control, and only records success after an adapter-specific
// postcondition is verified (docs/MVP_CONTRACT.md "Supported-result contract").
// There is deliberately NO generic fallback: if a CMP is not matched, or its
// control cannot be found, or its postcondition cannot be verified, the pipeline
// fails closed.
//
// Adapters are written against a small `probe` interface so they contain no DOM
// or chrome.* calls and can be unit tested with fake probes:
//
//   probe.queryVisible(selectors: string[]) -> Handle | null
//   probe.getCookie(name: string)           -> string | null
//   probe.getLocalStorage(key: string)      -> string | null
//   probe.hasGlobal(path: string)           -> boolean
//   probe.isGone(selectors: string[])       -> boolean   // absent or not visible

/**
 * @typedef {Object} CmpAdapter
 * @property {string} id
 * @property {string} name
 * @property {string[]} containerSelectors
 * @property {(mode: string) => boolean} supportsMode
 * @property {(probe: object) => boolean} detect
 * @property {(mode: string, probe: object) => (object|null)} control
 * @property {(probe: object, mode: string) => boolean} verify
 * @property {(mode: string) => string} postconditionText
 */

/**
 * Build an adapter from a compact spec. Every adapter shares the same detection
 * and verification skeleton; only the selectors and consent signal differ.
 */
function makeAdapter(spec) {
  const controls = spec.controls; // { necessary: string[], all: string[] }
  return {
    id: spec.id,
    name: spec.name,
    containerSelectors: spec.containerSelectors,
    supportsMode(mode) {
      return Array.isArray(controls[mode]) && controls[mode].length > 0;
    },
    detect(probe) {
      return probe.queryVisible(spec.containerSelectors) !== null;
    },
    control(mode, probe) {
      const selectors = controls[mode];
      if (!Array.isArray(selectors) || selectors.length === 0) return null;
      return probe.queryVisible(selectors);
    },
    verify(probe, mode) {
      // Postcondition = the CMP tore down its own banner AND a CMP-specific
      // consent signal is present. DOM removal by BannerBanner is never used and
      // never counts; this checks the site's own reaction to a real click.
      const gone = probe.isGone(spec.containerSelectors);
      const signal = spec.consentSignal(probe, mode);
      return gone && signal;
    },
    postconditionText(mode) {
      return `${spec.name}: banner removed by the site and ${spec.signalText} after the "${mode}" control is clicked.`;
    },
  };
}

/**
 * A cookie is "present" when it exists and is non-empty.
 */
function hasCookie(probe, name) {
  const value = probe.getCookie(name);
  return typeof value === 'string' && value.length > 0;
}

export const ADAPTERS = [
  makeAdapter({
    id: 'onetrust',
    name: 'OneTrust',
    containerSelectors: ['#onetrust-banner-sdk', '#onetrust-consent-sdk #onetrust-banner-sdk'],
    controls: {
      necessary: ['#onetrust-reject-all-handler', '.ot-pc-refuse-all-handler'],
      all: ['#onetrust-accept-btn-handler'],
    },
    signalText: 'the OptanonConsent cookie is written',
    consentSignal: (probe) => hasCookie(probe, 'OptanonConsent') || hasCookie(probe, 'OptanonAlertBoxClosed'),
  }),
  makeAdapter({
    id: 'cookiebot',
    name: 'Cookiebot',
    containerSelectors: ['#CybotCookiebotDialog'],
    controls: {
      necessary: ['#CybotCookiebotDialogBodyLevelButtonLevelOptinDeclineAll', '#CybotCookiebotDialogBodyButtonDecline'],
      all: ['#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll', '#CybotCookiebotDialogBodyButtonAccept'],
    },
    signalText: 'the CookieConsent cookie is written',
    consentSignal: (probe) => hasCookie(probe, 'CookieConsent'),
  }),
  makeAdapter({
    id: 'cookieyes',
    name: 'CookieYes',
    containerSelectors: ['.cky-consent-container', '#cookie-law-info-bar'],
    controls: {
      necessary: ['[data-cky-tag="reject-button"]', '.cky-btn-reject'],
      all: ['[data-cky-tag="accept-button"]', '.cky-btn-accept'],
    },
    signalText: 'the cookieyes-consent cookie is written',
    consentSignal: (probe) => hasCookie(probe, 'cookieyes-consent') || hasCookie(probe, 'cookie_notice_accepted'),
  }),
  makeAdapter({
    id: 'quantcast',
    name: 'Quantcast Choice',
    containerSelectors: ['#qc-cmp2-ui', '.qc-cmp2-container'],
    controls: {
      // Quantcast's summary buttons are not stably identifiable across sites for
      // "reject all" without opening the settings panel, so v0.1 only claims the
      // "accept all" primary control, which is stable. "necessary" is unsupported
      // and the pipeline will fail closed rather than guess.
      all: ['#qc-cmp2-ui button[mode="primary"]', '.qc-cmp2-summary-buttons > button[mode="primary"]'],
    },
    signalText: 'the euconsent-v2 cookie is written',
    consentSignal: (probe) => hasCookie(probe, 'euconsent-v2'),
  }),
  makeAdapter({
    id: 'usercentrics',
    name: 'Usercentrics',
    containerSelectors: ['#usercentrics-root', '[data-testid="uc-container"]', '#usercentrics-cmp-ui'],
    controls: {
      necessary: ['[data-testid="uc-deny-all-button"]', 'button[data-testid="uc-deny-all-button"]'],
      all: ['[data-testid="uc-accept-all-button"]', 'button[data-testid="uc-accept-all-button"]'],
    },
    signalText: 'Usercentrics settings are persisted to local storage',
    consentSignal: (probe) => {
      const value = probe.getLocalStorage('uc_settings') || probe.getLocalStorage('ucData');
      return (typeof value === 'string' && value.length > 0) || hasCookie(probe, 'usercentrics');
    },
  }),
];

/**
 * Return the first adapter that detects its CMP on the page, or null.
 * @param {object} probe
 * @param {CmpAdapter[]} [adapters]
 * @returns {CmpAdapter|null}
 */
export function detectAdapter(probe, adapters = ADAPTERS) {
  for (const adapter of adapters) {
    if (adapter.detect(probe)) return adapter;
  }
  return null;
}

/** IDs of every claimed CMP, for docs/manifest alignment checks. */
export function supportedCmpNames(adapters = ADAPTERS) {
  return adapters.map((a) => a.name);
}
