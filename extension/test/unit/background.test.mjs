import { test } from 'node:test';
import assert from 'node:assert/strict';

const EMPTY_STATS = {
  totals: { success: 0, unverified: 0, unsupported: 0, skipped: 0 },
  byCmp: {},
};

function storageArea(data) {
  return {
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
  };
}

async function loadBackground({
  local,
  sync = {},
  grantedOrigins = [],
  registeredScripts = [],
}) {
  let onInstalled;
  const registered = [];
  const unregistered = [];

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
      getAll(callback) { callback({ origins: grantedOrigins }); },
      onRemoved: { addListener() {} },
      onAdded: { addListener() {} },
    },
    scripting: {
      async getRegisteredContentScripts() { return registeredScripts; },
      async unregisterContentScripts({ ids }) { unregistered.push(...ids); },
      async registerContentScripts(scripts) { registered.push(...scripts); },
    },
    tabs: {
      query(_query, callback) { callback([]); },
      create() {},
    },
  };

  await import(`../../background.js?test=${Date.now()}-${Math.random()}`);
  return { onInstalled, registered, unregistered };
}

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
  const background = await loadBackground({ local, sync });

  try {
    await background.onInstalled({ reason: 'update' });
    assert.deepEqual(Object.keys(local).sort(), ['bb:authorizedOrigins', 'bb:settings', 'bb:stats']);
    assert.equal(local['bb:settings'].mode, 'all');
    assert.deepEqual(sync, {});
  } finally {
    delete globalThis.chrome;
  }
});

test('update preserves current settings and registers only an authorized granted origin', async () => {
  const origin = 'https://allowed.example';
  const settings = { version: 1, mode: 'all', enabled: true, celebrate: false };
  const local = {
    'bb:settings': settings,
    'bb:authorizedOrigins': [origin],
    'bb:stats': EMPTY_STATS,
  };
  const background = await loadBackground({
    local,
    grantedOrigins: [`${origin}/*`],
  });

  try {
    await background.onInstalled({ reason: 'update' });
    assert.deepEqual(local['bb:settings'], settings);
    assert.deepEqual(local['bb:authorizedOrigins'], [origin]);
    assert.deepEqual(background.unregistered, []);
    assert.deepEqual(background.registered, [
      {
        id: 'bb-cs-https_allowed_example',
        matches: [`${origin}/*`],
        js: ['content.js'],
        runAt: 'document_idle',
        allFrames: false,
        persistAcrossSessions: true,
      },
    ]);
  } finally {
    delete globalThis.chrome;
  }
});

test('update does not restore a revoked origin even if a stale grant or registration remains', async () => {
  const origin = 'https://revoked.example';
  const registrationId = 'bb-cs-https_revoked_example';
  const local = {
    'bb:settings': { version: 1, mode: 'necessary', enabled: true, celebrate: true },
    'bb:authorizedOrigins': [],
    'bb:stats': EMPTY_STATS,
  };
  const background = await loadBackground({
    local,
    grantedOrigins: [`${origin}/*`],
    registeredScripts: [{ id: registrationId }],
  });

  try {
    await background.onInstalled({ reason: 'update' });
    assert.deepEqual(local['bb:authorizedOrigins'], []);
    assert.deepEqual(background.registered, []);
    assert.deepEqual(background.unregistered, [registrationId]);
  } finally {
    delete globalThis.chrome;
  }
});
