import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  SETTINGS_VERSION,
  STORAGE_KEYS,
  LEGACY_LOCAL_STORAGE_KEYS,
  LEGACY_SYNC_STORAGE_KEYS,
  defaultSettings,
  normalizeSettings,
  migrateLegacySettings,
  sanitizeSettingsPatch,
} from '../../lib/settings-schema.js';

test('legacy cleanup covers every alpha storage key', () => {
  assert.deepEqual(LEGACY_LOCAL_STORAGE_KEYS, [
    'bananer-settings',
    'bananer-sites',
    'bananer-kb',
    'bananer-roster',
    'bannersClosedCount',
  ]);
  assert.deepEqual(LEGACY_SYNC_STORAGE_KEYS, [
    'bannersClosedHistory',
    'banner-preferences',
    'auto-close-enabled',
    'show-banana-celebration',
    'theme',
  ]);
});

test('defaults are privacy-first and versioned', () => {
  const s = defaultSettings();
  assert.equal(s.version, SETTINGS_VERSION);
  assert.equal(s.mode, 'necessary');
  assert.equal(s.enabled, true);
  assert.equal(s.celebrate, true);
});

test('normalizeSettings passes through a valid object without recovery', () => {
  const { settings, recovered } = normalizeSettings({ version: 1, mode: 'all', enabled: false, celebrate: false });
  assert.equal(recovered, false);
  assert.deepEqual(settings, { version: 1, mode: 'all', enabled: false, celebrate: false });
});

test('normalizeSettings recovers from corruption without throwing', () => {
  for (const corrupt of [null, 'garbage', 42, [], { mode: 'granular' }, { enabled: 'yes' }, { celebrate: 1 }]) {
    const { settings, recovered } = normalizeSettings(corrupt);
    assert.equal(settings.version, SETTINGS_VERSION);
    assert.ok(['necessary', 'all'].includes(settings.mode));
    assert.equal(typeof settings.enabled, 'boolean');
    if (corrupt !== undefined) assert.equal(recovered, true, `expected recovery for ${JSON.stringify(corrupt)}`);
  }
  // undefined (fresh install) is defaults but not "recovered"
  assert.equal(normalizeSettings(undefined).recovered, false);
});

test('unknown junk fields never survive normalization', () => {
  const { settings } = normalizeSettings({ mode: 'all', evil: 'x', urls: ['https://a'] });
  assert.deepEqual(Object.keys(settings).sort(), ['celebrate', 'enabled', 'mode', 'version']);
});

test('legacy migration maps "all" and collapses everything else to necessary', () => {
  const all = migrateLegacySettings({ 'banner-preferences': { level: 'all', useCustom: false } });
  assert.equal(all.migrated, true);
  assert.equal(all.settings.mode, 'all');

  for (const level of ['necessary', 'functional', 'analytics']) {
    const r = migrateLegacySettings({ 'banner-preferences': { level, useCustom: false } });
    assert.equal(r.settings.mode, 'necessary', `level=${level} must collapse to necessary`);
  }

  // Custom category mode is granular — collapses to the safe default.
  const custom = migrateLegacySettings({ 'banner-preferences': { level: 'all', useCustom: true } });
  assert.equal(custom.settings.mode, 'necessary');
});

test('legacy migration carries over disable flags', () => {
  const r = migrateLegacySettings({
    'banner-preferences': { level: 'necessary' },
    'auto-close-enabled': false,
    'show-banana-celebration': false,
    bannersClosedHistory: [{ url: 'https://example.com/private' }],
    theme: 'dark',
  });
  assert.deepEqual(r.settings, {
    version: SETTINGS_VERSION,
    mode: 'necessary',
    enabled: false,
    celebrate: false,
  });
});

test('migration is a no-op when current-schema settings already exist', () => {
  const current = { version: SETTINGS_VERSION, mode: 'all', enabled: true, celebrate: false };
  const r = migrateLegacySettings({ [STORAGE_KEYS.settings]: current, 'banner-preferences': { level: 'necessary' } });
  assert.equal(r.migrated, false);
  assert.equal(r.settings.mode, 'all');
});

test('migration with no legacy data returns defaults, not migrated', () => {
  const r = migrateLegacySettings({});
  assert.equal(r.migrated, false);
  assert.deepEqual(r.settings, defaultSettings());
});

test('sanitizeSettingsPatch drops unknown keys and invalid values', () => {
  assert.deepEqual(sanitizeSettingsPatch({ mode: 'all', enabled: false, celebrate: true }), {
    mode: 'all',
    enabled: false,
    celebrate: true,
  });
  assert.deepEqual(sanitizeSettingsPatch({ mode: 'granular', urls: [], version: 99 }), {});
  assert.deepEqual(sanitizeSettingsPatch(null), {});
});
