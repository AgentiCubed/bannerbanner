// Origin handling for BannerBanner.
//
// Pure, dependency-free helpers for turning page URLs into canonical origins,
// building the host-permission patterns Chrome expects, and comparing origins
// so that "similar but different" origins never authorize one another.
//
// These functions never touch chrome.* or the DOM so they can be unit tested
// directly with `node --test`.

/**
 * Normalize a URL string into its canonical http(s) origin.
 * Returns null for anything that is not a normal web page origin
 * (chrome://, file://, about:, extension pages, data:, etc.).
 *
 * @param {string} url
 * @returns {string|null} e.g. "https://example.com" or null
 */
export function normalizeOrigin(url) {
  if (typeof url !== 'string' || url.length === 0) return null;
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }
  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') return null;
  if (!parsed.hostname) return null;
  // URL.origin already lowercases the host and drops default ports.
  return parsed.origin;
}

/**
 * True when a URL is an origin BannerBanner is technically able to run on.
 * @param {string} url
 * @returns {boolean}
 */
export function isSupportedPageUrl(url) {
  return normalizeOrigin(url) !== null;
}

/**
 * Build the Chrome host-permission / content-script match pattern for an origin.
 * An origin like "https://example.com" becomes "https://example.com/*".
 *
 * @param {string} origin canonical origin
 * @returns {string}
 */
export function originToMatchPattern(origin) {
  const normalized = normalizeOrigin(origin);
  if (!normalized) {
    throw new Error(`Not a valid http(s) origin: ${String(origin)}`);
  }
  return `${normalized}/*`;
}

/**
 * Recover the canonical origin from a match pattern such as
 * "https://example.com/*". Returns null if the pattern is not a
 * single-origin http(s) pattern (a wildcard-host pattern returns null).
 *
 * @param {string} pattern
 * @returns {string|null}
 */
export function matchPatternToOrigin(pattern) {
  if (typeof pattern !== 'string') return null;
  const withoutPath = pattern.replace(/\/\*$/, '');
  if (withoutPath.includes('*')) return null; // wildcard host — not a single origin
  return normalizeOrigin(withoutPath);
}

/**
 * Reject the all-sites wildcard patterns outright. Used to guard against ever
 * requesting or registering broad host access.
 * @param {string} pattern
 * @returns {boolean}
 */
export function isAllSitesPattern(pattern) {
  if (typeof pattern !== 'string') return false;
  return /^(\*|https?):\/\/(\*|\*\.\*)?\/?\*?$/.test(pattern) || pattern === '<all_urls>';
}

/**
 * Strict origin equality. "https://example.com" and "https://www.example.com"
 * are NOT equal; "https://example.com" and "http://example.com" are NOT equal.
 * @param {string} a
 * @param {string} b
 * @returns {boolean}
 */
export function sameOrigin(a, b) {
  const na = normalizeOrigin(a);
  const nb = normalizeOrigin(b);
  return na !== null && na === nb;
}

/**
 * De-duplicate and normalize a list of origins, dropping anything invalid.
 * @param {string[]} origins
 * @returns {string[]} sorted, unique, canonical origins
 */
export function normalizeOriginList(origins) {
  if (!Array.isArray(origins)) return [];
  const set = new Set();
  for (const o of origins) {
    const n = normalizeOrigin(o);
    if (n) set.add(n);
  }
  return Array.from(set).sort();
}
