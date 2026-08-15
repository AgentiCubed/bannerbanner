import { test } from 'node:test';
import assert from 'node:assert/strict';

function storageArea(initial) {
  const data = { ...initial };
  return {
    data,
    get(keys, callback) {
      const selected = {};
      for (const key of Array.isArray(keys) ? keys : [keys]) {
        if (key in data) selected[key] = data[key];
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
  };
}

test('update purges all alpha storage, including local browsing-derived knowledge', async () => {
  let onInstalled;
  const local = storageArea({
    'bb:settings': { version: 1, mode: 'necessary', enabled: true, celebrate: true },
    'bananer-settings': { enabled: true },
    'bananer-sites': ['https://private.example'],
    'bananer-kb': { fingerprint: { hostname: 'private.example' } },
    'bananer-roster': { scout: { dismissals: 1 } },
    bannersClosedCount: 1,
  });
  const sync = storageArea({
    bannersClosedHistory: [{ url: 'https://private.example/path' }],
    'banner-preferences': { level: 'necessary' },
    'auto-close-enabled': true,
    'show-banana-celebration': true,
    theme: 'light',
  });

  globalThis.chrome = {
    storage: { local, sync },
    runtime: {
      onInstalled: { addListener(listener) { onInstalled = listener; } },
      onStartup: { addListener() {} },
      onMessage: { addListener() {} },
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

  await import('../../background.js');
  await onInstalled({ reason: 'update' });

  assert.deepEqual(Object.keys(local.data).sort(), [
    'bb:authorizedOrigins',
    'bb:settings',
    'bb:stats',
  ]);
  assert.deepEqual(sync.data, {});
});
