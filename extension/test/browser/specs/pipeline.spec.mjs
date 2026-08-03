// Real-browser pipeline behavior tests.
//
// These load the true content-runtime modules (the exact files that ship) into
// real Chromium pages served over HTTP, with only the chrome.* messaging and
// storage APIs stubbed. They prove, per fixture:
//   * supported CMPs: the exact intended control is clicked, the site-written
//     consent signal is required for success, and the page stays usable;
//   * unresponsive CMPs: the attempt is reported unverified, never success,
//     and a banner receives exactly one action even under DOM churn;
//   * sensitive, newsletter, ad, and unknown dialogs: zero interaction and
//     zero mutation.

import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startFixtureServer, launchBrowser, startRuntimeOnPage, sleep } from '../helpers.mjs';

let server, origin, browser;

before(async () => {
  ({ server, origin } = await startFixtureServer());
  browser = await launchBrowser();
});

after(async () => {
  await browser?.close();
  server?.close();
});

async function freshPage() {
  const context = await browser.newContext();
  return context.newPage();
}

const NECESSARY = { version: 1, mode: 'necessary', enabled: true, celebrate: false };
const ALL = { version: 1, mode: 'all', enabled: true, celebrate: false };

// ---------------------------------------------------------------------------
// Supported CMP fixtures — both v0.1 modes where claimed.
// ---------------------------------------------------------------------------

const CMP_CASES = [
  { fixture: 'onetrust', cmp: 'OneTrust', mode: NECESSARY, expectClick: 'reject', cookie: 'OptanonConsent' },
  { fixture: 'onetrust', cmp: 'OneTrust', mode: ALL, expectClick: 'accept', cookie: 'OptanonConsent' },
  { fixture: 'cookiebot', cmp: 'Cookiebot', mode: NECESSARY, expectClick: 'reject', cookie: 'CookieConsent' },
  { fixture: 'cookiebot', cmp: 'Cookiebot', mode: ALL, expectClick: 'accept', cookie: 'CookieConsent' },
  { fixture: 'cookieyes', cmp: 'CookieYes', mode: NECESSARY, expectClick: 'reject', cookie: 'cookieyes-consent' },
  { fixture: 'cookieyes', cmp: 'CookieYes', mode: ALL, expectClick: 'accept', cookie: 'cookieyes-consent' },
  { fixture: 'quantcast', cmp: 'Quantcast Choice', mode: ALL, expectClick: 'accept', cookie: 'euconsent-v2' },
  { fixture: 'usercentrics', cmp: 'Usercentrics', mode: NECESSARY, expectClick: 'reject', storageKey: 'uc_settings' },
  { fixture: 'usercentrics', cmp: 'Usercentrics', mode: ALL, expectClick: 'accept', storageKey: 'uc_settings' },
];

for (const c of CMP_CASES) {
  test(`${c.cmp} / ${c.mode.mode}: intended control clicked, postcondition verified`, async () => {
    const page = await freshPage();
    await page.goto(`${origin}/fixtures/${c.fixture}.html`);
    await startRuntimeOnPage(page, origin, c.mode);
    await page.waitForFunction(() => window.__bbOutcomes.length > 0, null, { timeout: 8000 });

    const state = await page.evaluate(() => ({
      outcomes: window.__bbOutcomes,
      clicks: window.__clickCount,
      lastClicked: window.__lastClicked,
      cookies: document.cookie,
      localStorageKeys: Object.keys(localStorage),
      bodyText: document.body.innerText,
    }));

    assert.equal(state.clicks, 1, 'exactly one real click');
    assert.equal(state.lastClicked, c.expectClick, 'the exact intended control');
    const outcome = state.outcomes.find((o) => o.type === 'BB_OUTCOME');
    assert.ok(outcome, 'an outcome was reported');
    assert.equal(outcome.stat, 'success');
    assert.equal(outcome.cmp, c.cmp);
    if (c.cookie) assert.match(state.cookies, new RegExp(c.cookie), 'site-written consent cookie present');
    if (c.storageKey) assert.ok(state.localStorageKeys.includes(c.storageKey), 'site-written consent storage present');
    assert.ok(state.bodyText.length > 0, 'page still usable');
    await page.context().close();
  });
}

test('Quantcast + necessary mode: fail closed, no click, reported unsupported', async () => {
  const page = await freshPage();
  await page.goto(`${origin}/fixtures/quantcast.html`);
  await startRuntimeOnPage(page, origin, NECESSARY);
  await page.waitForFunction(() => window.__bbOutcomes.length > 0, null, { timeout: 8000 });

  const state = await page.evaluate(() => ({
    outcomes: window.__bbOutcomes,
    clicks: window.__clickCount,
    bannerPresent: !!document.getElementById('qc-cmp2-ui'),
  }));
  assert.equal(state.clicks, 0, 'no click on an unsupported mode');
  assert.equal(state.bannerPresent, true, 'banner untouched');
  assert.equal(state.outcomes.find((o) => o.type === 'BB_OUTCOME')?.stat, 'unsupported');
  await page.context().close();
});

test('unresponsive CMP: unverified (never success), exactly one action despite DOM churn', async () => {
  const page = await freshPage();
  await page.goto(`${origin}/fixtures/onetrust-unresponsive.html`);
  await startRuntimeOnPage(page, origin, NECESSARY);
  await page.waitForFunction(() => window.__bbOutcomes.length > 0, null, { timeout: 15000 });

  // Churn the DOM to provoke rescans.
  await page.evaluate(() => {
    for (let i = 0; i < 5; i++) document.body.appendChild(document.createElement('p'));
  });
  await sleep(1200);

  const state = await page.evaluate(() => ({
    outcomes: window.__bbOutcomes.filter((o) => o.type === 'BB_OUTCOME'),
    clicks: window.__clickCount,
    bannerPresent: !!document.getElementById('onetrust-banner-sdk'),
  }));
  assert.equal(state.clicks, 1, 'exactly one click across all rescans');
  assert.equal(state.outcomes[0].stat, 'unverified', 'DOM-visible banner without consent signal is not success');
  assert.ok(!state.outcomes.some((o) => o.stat === 'success'), 'no success was ever reported');
  await page.context().close();
});

test('settings are awaited before scanning (slow storage, mode=all still honored)', async () => {
  const page = await freshPage();
  await page.goto(`${origin}/fixtures/onetrust.html`);
  await startRuntimeOnPage(page, origin, ALL, { settingsDelayMs: 600 });
  await page.waitForFunction(() => window.__bbOutcomes.length > 0, null, { timeout: 8000 });

  const lastClicked = await page.evaluate(() => window.__lastClicked);
  assert.equal(lastClicked, 'accept', 'the awaited settings, not defaults, drove the decision');
  await page.context().close();
});

test('BB_STOP halts activity: banner added after stop is never touched', async () => {
  const page = await freshPage();
  await page.goto(`${origin}/fixtures/sensitive-login.html`); // no CMP present
  await startRuntimeOnPage(page, origin, NECESSARY);
  await sleep(500);

  await page.evaluate((org) => {
    window.__bbDispatch({ type: 'BB_STOP', origin: window.location.origin });
    // Now inject a fully working OneTrust-style banner.
    const div = document.createElement('div');
    div.id = 'onetrust-banner-sdk';
    div.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:#fff;padding:20px;';
    div.innerHTML = '<p>We use cookies (GDPR)</p><button id="onetrust-reject-all-handler">Reject All</button>';
    window.__lateClicks = 0;
    div.querySelector('button').addEventListener('click', () => window.__lateClicks++);
    document.body.appendChild(div);
  }, origin);
  await sleep(1500);

  const lateClicks = await page.evaluate(() => window.__lateClicks);
  assert.equal(lateClicks, 0, 'no action after revocation stop signal');
  await page.context().close();
});

test('disable via settings update stops future actions', async () => {
  const page = await freshPage();
  await page.goto(`${origin}/fixtures/sensitive-login.html`);
  await startRuntimeOnPage(page, origin, NECESSARY);
  await sleep(300);

  await page.evaluate(() => {
    window.__bbDispatch({ type: 'BB_SETTINGS_UPDATED', settings: { version: 1, mode: 'necessary', enabled: false, celebrate: false } });
    const div = document.createElement('div');
    div.id = 'onetrust-banner-sdk';
    div.style.cssText = 'position:fixed;bottom:0;background:#fff;padding:20px;';
    div.innerHTML = '<p>cookies (GDPR)</p><button id="onetrust-reject-all-handler">Reject All</button>';
    window.__lateClicks = 0;
    div.querySelector('button').addEventListener('click', () => window.__lateClicks++);
    document.body.appendChild(div);
  });
  await sleep(1200);
  assert.equal(await page.evaluate(() => window.__lateClicks), 0);
  await page.context().close();
});

// ---------------------------------------------------------------------------
// Protected dialogs — zero interaction, zero mutation.
// ---------------------------------------------------------------------------

const PROTECTED = [
  ['sensitive-login', 'skipped'],
  ['sensitive-checkout', 'skipped'],
  ['sensitive-payment', 'skipped'],
  ['sensitive-security', 'skipped'],
  ['sensitive-age-gate', 'skipped'],
  ['sensitive-session', 'skipped'],
  ['sensitive-unsaved', 'skipped'],
  ['newsletter', 'unsupported'],
  ['ad-overlay', 'unsupported'],
  ['unknown-modal', 'unsupported'],
];

for (const [fixture, expectedStat] of PROTECTED) {
  test(`${fixture}: untouched (no click, removal, hiding, style mutation, or synthetic event)`, async () => {
    const page = await freshPage();
    await page.goto(`${origin}/fixtures/${fixture}.html`);
    await startRuntimeOnPage(page, origin, NECESSARY);
    await sleep(1500);

    const state = await page.evaluate(() => ({
      clicked: window.__clicked,
      mutations: window.__mutations,
      dialogHTML: (document.querySelector('[role="dialog"], [aria-modal="true"], #promo-overlay') || {}).outerHTML,
      originalHTML: window.__dialogHTML,
      outcomes: window.__bbOutcomes.filter((o) => o.type === 'BB_OUTCOME'),
    }));

    assert.deepEqual(state.clicked, [], 'no button was clicked');
    assert.equal(state.mutations, 0, 'no attribute/child/style mutation inside the dialog');
    assert.equal(state.dialogHTML, state.originalHTML, 'dialog markup byte-identical');
    if (expectedStat) {
      assert.equal(state.outcomes[0]?.stat, expectedStat, `honest local status is "${expectedStat}"`);
    }
    assert.ok(!state.outcomes.some((o) => o.stat === 'success'), 'never reported as success');
    await page.context().close();
  });
}
