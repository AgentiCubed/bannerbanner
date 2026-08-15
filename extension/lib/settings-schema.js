// Versioned settings schema for BannerBanner.
//
// chrome.storage is the sole runtime source of truth (docs/DECISIONS.md BB-006).
// This module owns the shape, defaults, validation, migration, and recovery of
// the settings object. It is pure and dependency-free so the exact same logic
// that runs in the service worker and options page is unit tested directly.

export const SETTINGS_VERSION = 1;

/** Storage keys used by the extension. */
export const STORAGE_KEYS = Object.freeze({
  settings: 'bb:settings',
  origins: 'bb:authorizedOrigins',
  stats: 'bb:stats',
});

const LEGACY_LOCAL_KEYS = Object.freeze([
  'bannersClosedCount',
  'bananer-settings',
  'bananer-sites',
  'bananer-kb',
  'bananer-roster',
]);
const LEGACY_SYNC_KEYS = Object.freeze([
  'bannersClosedHistory',
  'banner-preferences',
  'auto-close-enabled',
  'show-banana-celebration',
  'theme',
]);

/** Remove all pre-v0.1 storage after an update. */
export function purgeLegacyStorage(storage) {
  const remove = (area, keys) => new Promise((resolve) => area.remove(keys, resolve));
  return Promise.all([
    remove(storage.local, LEGACY_LOCAL_KEYS),
    remove(storage.sync, LEGACY_SYNC_KEYS),
  ]);
}

/**
 * The two v0.1 consent modes. Anything else is invalid.
 * - "necessary": reject all non-essential categories.
 * - "all": accept all categories.
 */
export const CONSENT_MODES = Object.freeze(['necessary', 'all']);

/** Canonical defaults for a fresh install. */
export function defaultSettings() {
  return {
    version: SETTINGS_VERSION,
    // Privacy-first default: reject non-essential cookies.
    mode: 'necessary',
    // Master switch for automatic consent handling on authorized origins.
    enabled: true,
    // Optional celebration animation, shown only after a verified success.
    celebrate: true,
  };
}

function isPlainObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Coerce an arbitrary stored value into a valid settings object.
 * Never throws. Unknown or corrupted fields fall back to defaults so a
 * damaged store can always recover to a safe state.
 *
 * @param {unknown} raw
 * @returns {{settings: object, recovered: boolean}} recovered=true when any
 *   field had to be repaired or reset.
 */
export function normalizeSettings(raw) {
  const defaults = defaultSettings();
  if (!isPlainObject(raw)) {
    return { settings: defaults, recovered: raw !== undefined };
  }

  let recovered = false;
  const out = { ...defaults };

  if (CONSENT_MODES.includes(raw.mode)) {
    out.mode = raw.mode;
  } else if (raw.mode !== undefined) {
    recovered = true;
  }

  if (typeof raw.enabled === 'boolean') {
    out.enabled = raw.enabled;
  } else if (raw.enabled !== undefined) {
    recovered = true;
  }

  if (typeof raw.celebrate === 'boolean') {
    out.celebrate = raw.celebrate;
  } else if (raw.celebrate !== undefined) {
    recovered = true;
  }

  out.version = SETTINGS_VERSION;
  return { settings: out, recovered };
}

/**
 * Migrate legacy pre-v0.1 storage shapes into the current schema.
 *
 * Legacy alpha stored a `banner-preferences` object under chrome.storage.sync
 * with a `level` field ("necessary" | "functional" | "analytics" | "all") and
 * separate `auto-close-enabled` / `show-banana-celebration` flags. Only the two
 * supported v0.1 modes survive; anything granular collapses to "necessary"
 * (the safe default) rather than silently accepting more than the user chose.
 *
 * @param {object} legacy an object possibly containing legacy keys
 * @returns {{settings: object, migrated: boolean}}
 */
export function migrateLegacySettings(legacy) {
  if (!isPlainObject(legacy)) {
    return { settings: defaultSettings(), migrated: false };
  }

  // Already on the current schema.
  if (isPlainObject(legacy[STORAGE_KEYS.settings]) && legacy[STORAGE_KEYS.settings].version === SETTINGS_VERSION) {
    return { settings: normalizeSettings(legacy[STORAGE_KEYS.settings]).settings, migrated: false };
  }

  const prefs = legacy['banner-preferences'];
  const hasLegacy =
    isPlainObject(prefs) ||
    legacy['auto-close-enabled'] !== undefined ||
    legacy['show-banana-celebration'] !== undefined;

  if (!hasLegacy) {
    return { settings: defaultSettings(), migrated: false };
  }

  const out = defaultSettings();
  // Map the only legacy level that unambiguously means "accept all".
  if (isPlainObject(prefs) && prefs.useCustom !== true && prefs.level === 'all') {
    out.mode = 'all';
  } else {
    out.mode = 'necessary';
  }
  if (legacy['auto-close-enabled'] === false) out.enabled = false;
  if (legacy['show-banana-celebration'] === false) out.celebrate = false;

  return { settings: out, migrated: true };
}

/**
 * Produce a shallow patch that only contains recognized settings fields.
 * Used by the options UI so it can never write junk keys into storage.
 * @param {object} patch
 * @returns {object}
 */
export function sanitizeSettingsPatch(patch) {
  const out = {};
  if (!isPlainObject(patch)) return out;
  if (CONSENT_MODES.includes(patch.mode)) out.mode = patch.mode;
  if (typeof patch.enabled === 'boolean') out.enabled = patch.enabled;
  if (typeof patch.celebrate === 'boolean') out.celebrate = patch.celebrate;
  return out;
}
