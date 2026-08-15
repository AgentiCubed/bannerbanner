import { test } from 'node:test';
import assert from 'node:assert/strict';

function storageArea(initial) {
  const data = structuredClone(initial);
  return {
    data,
    get(keys, callback) {
      const selected = {};
      for (const key of Array.isArray(keys) ? keys : [keys]) {
        if (key in data) selected[key] = structuredClone(data[key]);
      }
      callback(selected);
    },
    set(values, callback) {
      Object.assign(data, structuredClone(values));
      callback?.();
    },
    remove(keys, callback) {
      for (const key of Array.isArray(keys) ? keys : [keys]) delete data[key];
      callback?.();
    },
  };
}

function installChromeMock(local, sync) {
  let onInstalled;
  globalThis.chrome = {
    storage: { local, sync },
    runtime: {
      onInstalled: { addListener(listener) { onInstalled = listener; } },
      onStartup: { addListener() {} },
      onMessage: { addListener() {} },
      getURL: (path) => path,
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
  return (details) => {
    assert.equal(typeof onInstalled, 'function');
    return onInstalled(details);
  };
}

test('extension update purges all alpha local and sync storage', async () => {
  const currentSettings = { version: 1, mode: 'all', enabled: true, celebrate: false };
  const local = storageArea({
    'bb:settings': currentSettings,
    'bb:authorizedOrigins': [],
    'bb:stats': { version: 1, totals: { success: 0, unverified: 0, unsupported: 0, skipped: 0 }, byCmp: {} },
    'bananer-settings': { enabled: true },
    'bananer-sites': ['https://example.com'],
    'bananer-kb': { record: { origin: 'https://example.com', selector: '#banner' } },
    'bananer-roster': { character: { dismissals: 1 } },
    bannersClosedCount: 1,
  });
  const sync = storageArea({
    bannersClosedHistory: [{ url: 'https://example.com/private' }],
    'banner-preferences': { level: 'necessary' },
    'auto-close-enabled': true,
    'show-banana-celebration': true,
    theme: 'light',
  });
  const triggerOnInstalled = installChromeMock(local, sync);

  await import(`../../background.js?test=${Date.now()}`);
  await triggerOnInstalled({ reason: 'update' });

  assert.deepEqual(local.data, {
    'bb:settings': currentSettings,
    'bb:authorizedOrigins': [],
    'bb:stats': { version: 1, totals: { success: 0, unverified: 0, unsupported: 0, skipped: 0 }, byCmp: {} },
  });
  assert.deepEqual(sync.data, {});
  delete globalThis.chrome;
});

test('extension update migrates allowlisted settings before purging alpha storage', async () => {
  const local = storageArea({
    'bananer-settings': { enabled: true },
    'bananer-sites': ['https://example.com'],
    'bananer-kb': { record: { hostname: 'example.com' } },
    'bananer-roster': { professor: { xp: 10 } },
    bannersClosedCount: 4,
  });
  const sync = storageArea({
    'banner-preferences': { level: 'all', useCustom: false },
    'auto-close-enabled': true,
    'show-banana-celebration': true,
    bannersClosedHistory: [{ url: 'https://example.com/private' }],
    theme: 'light',
  });
  const triggerOnInstalled = installChromeMock(local, sync);

  await import(`../../background.js?test=${Date.now()}`);
  await triggerOnInstalled({ reason: 'update' });

  assert.deepEqual(Object.keys(local.data).sort(), ['bb:authorizedOrigins', 'bb:settings', 'bb:stats']);
  assert.equal(local.data['bb:settings'].mode, 'all');
  assert.deepEqual(sync.data, {});
  delete globalThis.chrome;
});
