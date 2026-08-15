import { test } from 'node:test';
import assert from 'node:assert/strict';

test('update purges all alpha storage while preserving migrated settings', async () => {
  const local = {
    'bananer-settings': { enabled: true },
    'bananer-sites': ['https://example.com'],
    'bananer-kb': { record: { hostname: 'example.com' } },
    'bananer-roster': { professor: { xp: 10 } },
    bannersClosedCount: 4,
  };
  const sync = {
    'banner-preferences': { level: 'all', useCustom: false },
    'auto-close-enabled': true,
    'show-banana-celebration': true,
    bannersClosedHistory: [{ url: 'https://example.com/private' }],
    theme: 'light',
  };
  let onInstalled;

  const storageArea = (data) => ({
    get(keys, callback) {
      const selected = {};
      for (const key of Array.isArray(keys) ? keys : [keys]) {
        if (data[key] !== undefined) selected[key] = data[key];
      }
      callback(selected);
    },
    set(values, callback) {
      Object.assign(data, values);
      callback?.();
    },
    remove(keys, callback) {
      for (const key of keys) delete data[key];
      callback?.();
    },
  });

  globalThis.chrome = {
    runtime: {
      onInstalled: { addListener(listener) { onInstalled = listener; } },
      onStartup: { addListener() {} },
      onMessage: { addListener() {} },
      getURL: (path) => path,
    },
    storage: {
      local: storageArea(local),
      sync: storageArea(sync),
      onChanged: { addListener() {} },
    },
    permissions: {
      getAll(callback) { callback({ origins: [] }); },
      onRemoved: { addListener() {} },
      onAdded: { addListener() {} },
    },
    scripting: {
      async getRegisteredContentScripts() { return []; },
      async unregisterContentScripts() {},
      async registerContentScripts() {},
    },
    tabs: {
      query(_query, callback) { callback([]); },
      create() {},
    },
  };

  await import(`../../background.js?test=${Date.now()}`);
  await onInstalled({ reason: 'update' });

  assert.deepEqual(Object.keys(local).sort(), ['bb:authorizedOrigins', 'bb:settings', 'bb:stats']);
  assert.equal(local['bb:settings'].mode, 'all');
  assert.deepEqual(sync, {});

  delete globalThis.chrome;
});
