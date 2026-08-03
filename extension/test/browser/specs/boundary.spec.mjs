// Permission-boundary tests with the REAL built extension loaded.
//
// Proves the PB-01 core promise on a clean install:
//   * no BannerBanner code executes on an arbitrary page;
//   * no content scripts are registered;
//   * storage is initialized to the versioned schema with an empty origin
//     registry and empty aggregate stats;
//   * attempting to register a content script without holding the host
//     permission fails (the fail-closed path revocation relies on);
//   * nothing browsing-derived is written to chrome.storage.sync.
//
// The interactive grant/revoke prompt cannot be automated (Chrome renders a
// native dialog), so the positive grant flow remains a scripted manual case in
// docs/REAL_SITE_TEST_MATRIX.md; its planning logic is covered by unit tests.

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, rmSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { startFixtureServer, launchWithExtension, getServiceWorker, DIST, ROOT, sleep } from '../helpers.mjs';

let server, origin, context, userDataDir;

before(async () => {
  if (!existsSync(DIST)) {
    execSync('bash extension/build-extension.sh', { cwd: ROOT, stdio: 'inherit' });
  }
  ({ server, origin } = await startFixtureServer());
  userDataDir = mkdtempSync(join(tmpdir(), 'bb-profile-'));
  context = await launchWithExtension(userDataDir);
});

after(async () => {
  await context?.close();
  server?.close();
  if (userDataDir) rmSync(userDataDir, { recursive: true, force: true });
});

test('extension loads with a service worker and no registered content scripts', async () => {
  const sw = await getServiceWorker(context);
  assert.ok(sw.url().startsWith('chrome-extension://'), 'service worker running');

  const registered = await sw.evaluate(() => chrome.scripting.getRegisteredContentScripts());
  assert.deepEqual(registered, [], 'clean install registers no content scripts');
});

test('clean install initializes the versioned schema with no origins and empty stats', async () => {
  const sw = await getServiceWorker(context);
  // onInstalled may still be running; poll briefly.
  let data;
  for (let i = 0; i < 20; i++) {
    data = await sw.evaluate(() => new Promise((r) => chrome.storage.local.get(null, r)));
    if (data['bb:settings']) break;
    await sleep(250);
  }
  assert.equal(data['bb:settings'].version, 1);
  assert.equal(data['bb:settings'].mode, 'necessary', 'privacy-first default');
  assert.deepEqual(data['bb:authorizedOrigins'], []);
  assert.deepEqual(data['bb:stats'].totals, { success: 0, unverified: 0, unsupported: 0, skipped: 0 });
});

test('no BannerBanner code executes on an arbitrary page (clean install)', async () => {
  const page = await context.newPage();
  await page.goto(`${origin}/fixtures/onetrust.html`);
  await sleep(2000);

  const state = await page.evaluate(() => ({
    runtimeActive: window.__bannerBannerActive === true,
    clicks: window.__clickCount,
    bannerPresent: !!document.getElementById('onetrust-banner-sdk'),
    cookies: document.cookie,
    celebration: !!document.getElementById('bannerbanner-celebration'),
  }));

  assert.equal(state.runtimeActive, false, 'content runtime did not execute');
  assert.equal(state.clicks, 0, 'nothing was clicked');
  assert.equal(state.bannerPresent, true, 'banner untouched');
  assert.ok(!state.cookies.includes('OptanonConsent'), 'no consent cookie was caused');
  assert.equal(state.celebration, false);
  await page.close();
});

test('sensitive fixture on an arbitrary page is untouched (clean install)', async () => {
  const page = await context.newPage();
  await page.goto(`${origin}/fixtures/sensitive-login.html`);
  await sleep(1500);
  const state = await page.evaluate(() => ({
    clicked: window.__clicked,
    mutations: window.__mutations,
  }));
  assert.deepEqual(state.clicked, []);
  assert.equal(state.mutations, 0);
  await page.close();
});

test('even a registered content script does not execute without a granted host permission', async () => {
  // Chrome accepts registrations whose pattern is merely *declared* under
  // optional_host_permissions, but it must not inject them anywhere the user
  // has not granted access. This is the layer revocation relies on; our
  // reconcile() additionally never registers ungranted origins at all.
  const sw = await getServiceWorker(context);
  await sw.evaluate(async (pageOrigin) => {
    await chrome.scripting.registerContentScripts([
      {
        id: 'bb-test-unauthorized',
        matches: [`${pageOrigin}/*`],
        js: ['content.js'],
        runAt: 'document_idle',
      },
    ]);
  }, origin);

  const page = await context.newPage();
  await page.goto(`${origin}/fixtures/onetrust.html`);
  await sleep(2000);
  const state = await page.evaluate(() => ({
    runtimeActive: window.__bannerBannerActive === true,
    clicks: window.__clickCount,
  }));
  await page.close();

  await sw.evaluate(() =>
    chrome.scripting.unregisterContentScripts({ ids: ['bb-test-unauthorized'] }).catch(() => {})
  );

  assert.equal(state.runtimeActive, false, 'no execution without a granted host permission');
  assert.equal(state.clicks, 0, 'page untouched');
});

test('the message API rejects invalid origins and never broadens access', async () => {
  // Messages must come from an extension page: a service worker's own
  // sendMessage is never delivered to its own onMessage listener.
  const sw = await getServiceWorker(context);
  const extensionId = new URL(sw.url()).host;
  const page = await context.newPage();
  await page.goto(`chrome-extension://${extensionId}/options.html`);
  const responses = await page.evaluate(async () => {
    const send = (msg) => new Promise((r) => chrome.runtime.sendMessage(msg, r));
    return {
      chromeUrl: await send({ type: 'BB_AUTHORIZE_ORIGIN', origin: 'chrome://settings' }),
      wildcard: await send({ type: 'BB_AUTHORIZE_ORIGIN', origin: 'https://*/*' }),
      state: await send({ type: 'BB_GET_STATE' }),
    };
  });
  assert.equal(responses.chromeUrl.ok, false);
  assert.equal(responses.wildcard.ok, false);
  assert.deepEqual(responses.state.origins, [], 'origin registry still empty');
  await page.close();
});

test('nothing browsing-derived is in chrome.storage.sync', async () => {
  const sw = await getServiceWorker(context);
  const page = await context.newPage();
  await page.goto(`${origin}/fixtures/cookiebot.html`);
  await sleep(1000);
  await page.close();

  const sync = await sw.evaluate(() => new Promise((r) => chrome.storage.sync.get(null, r)));
  assert.deepEqual(sync, {}, 'sync storage stays empty during normal use');
});

test('popup and options pages load without errors', async () => {
  const sw = await getServiceWorker(context);
  const extensionId = new URL(sw.url()).host;

  const popup = await context.newPage();
  const popupErrors = [];
  popup.on('pageerror', (e) => popupErrors.push(String(e)));
  await popup.goto(`chrome-extension://${extensionId}/popup.html`);
  await sleep(500);
  assert.deepEqual(popupErrors, [], 'popup has no page errors');
  // On a non-web page the enable button must be disabled.
  assert.equal(await popup.locator('#authorize-btn').isDisabled(), true);
  await popup.close();

  const options = await context.newPage();
  const optionErrors = [];
  options.on('pageerror', (e) => optionErrors.push(String(e)));
  await options.goto(`chrome-extension://${extensionId}/options.html`);
  await sleep(500);
  assert.deepEqual(optionErrors, [], 'options page has no page errors');
  assert.equal(await options.locator('#mode').inputValue(), 'necessary');
  await options.close();
});

test('settings set through the real options UI persist to a fresh page load', async () => {
  const sw = await getServiceWorker(context);
  const extensionId = new URL(sw.url()).host;

  const page = await context.newPage();
  await page.goto(`chrome-extension://${extensionId}/options.html`);
  await page.locator('#mode').selectOption('all');
  await page.waitForFunction(() => document.getElementById('saved').textContent === 'Saved');
  await page.close();

  const again = await context.newPage();
  await again.goto(`chrome-extension://${extensionId}/options.html`);
  await sleep(400);
  assert.equal(await again.locator('#mode').inputValue(), 'all', 'mode persisted in chrome.storage');
  // Restore the default so test order does not matter.
  await again.locator('#mode').selectOption('necessary');
  await again.waitForFunction(() => document.getElementById('saved').textContent === 'Saved');
  await again.close();
});
