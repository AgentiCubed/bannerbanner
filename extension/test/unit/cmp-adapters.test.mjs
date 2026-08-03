import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ADAPTERS, detectAdapter, supportedCmpNames } from '../../lib/cmp-adapters.js';

// A configurable fake probe. `visible` maps selector -> handle; cookies and
// localStorage are plain objects.
function fakeProbe({ visible = {}, cookies = {}, storage = {} } = {}) {
  return {
    clicks: [],
    queryVisible(selectors) {
      for (const s of selectors) if (visible[s]) return visible[s];
      return null;
    },
    isGone(selectors) {
      return selectors.every((s) => !visible[s]);
    },
    click(handle) {
      this.clicks.push(handle);
    },
    getCookie(name) {
      return cookies[name] ?? null;
    },
    getLocalStorage(key) {
      return storage[key] ?? null;
    },
    hasGlobal() {
      return false;
    },
    delay() {
      return Promise.resolve();
    },
  };
}

test('every adapter has id, name, container selectors, and at least one mode', () => {
  for (const a of ADAPTERS) {
    assert.ok(a.id && a.name, 'adapter identity');
    assert.ok(a.containerSelectors.length > 0);
    assert.ok(a.supportsMode('necessary') || a.supportsMode('all'), `${a.name} must support a v0.1 mode`);
    assert.ok(a.postconditionText('all').length > 10, `${a.name} must document its postcondition`);
  }
});

test('detectAdapter finds only the CMP whose container is visible', () => {
  const onetrust = ADAPTERS.find((a) => a.id === 'onetrust');
  const probe = fakeProbe({ visible: { '#onetrust-banner-sdk': { tag: 'div' } } });
  assert.equal(detectAdapter(probe), onetrust);

  const empty = fakeProbe();
  assert.equal(detectAdapter(empty), null);
});

test('control() returns the exact intended control per mode, or null', () => {
  const onetrust = ADAPTERS.find((a) => a.id === 'onetrust');
  const reject = { id: 'reject' };
  const accept = { id: 'accept' };
  const probe = fakeProbe({
    visible: {
      '#onetrust-banner-sdk': {},
      '#onetrust-reject-all-handler': reject,
      '#onetrust-accept-btn-handler': accept,
    },
  });
  assert.equal(onetrust.control('necessary', probe), reject);
  assert.equal(onetrust.control('all', probe), accept);

  const bare = fakeProbe({ visible: { '#onetrust-banner-sdk': {} } });
  assert.equal(onetrust.control('necessary', bare), null, 'missing control must be null, never a guess');
});

test('Quantcast supports only "all" in v0.1 (narrowed claim)', () => {
  const quantcast = ADAPTERS.find((a) => a.id === 'quantcast');
  assert.equal(quantcast.supportsMode('all'), true);
  assert.equal(quantcast.supportsMode('necessary'), false);
  assert.equal(quantcast.control('necessary', fakeProbe()), null);
});

test('verify requires BOTH banner teardown AND the consent signal', () => {
  const onetrust = ADAPTERS.find((a) => a.id === 'onetrust');

  // Banner gone but no cookie: NOT verified (DOM disappearance is not consent).
  const goneNoCookie = fakeProbe({});
  assert.equal(onetrust.verify(goneNoCookie, 'necessary'), false);

  // Cookie present but banner still visible: NOT verified.
  const cookieStillVisible = fakeProbe({
    visible: { '#onetrust-banner-sdk': {} },
    cookies: { OptanonConsent: 'groups=C0001' },
  });
  assert.equal(onetrust.verify(cookieStillVisible, 'necessary'), false);

  // Both: verified.
  const both = fakeProbe({ cookies: { OptanonConsent: 'groups=C0001' } });
  assert.equal(onetrust.verify(both, 'necessary'), true);
});

test('adapter-specific signals: cookiebot, cookieyes, quantcast, usercentrics', () => {
  const byId = Object.fromEntries(ADAPTERS.map((a) => [a.id, a]));
  assert.equal(byId.cookiebot.verify(fakeProbe({ cookies: { CookieConsent: '{stamp:1}' } }), 'all'), true);
  assert.equal(byId.cookiebot.verify(fakeProbe({}), 'all'), false);
  assert.equal(byId.cookieyes.verify(fakeProbe({ cookies: { 'cookieyes-consent': 'consentid:x' } }), 'all'), true);
  assert.equal(byId.quantcast.verify(fakeProbe({ cookies: { 'euconsent-v2': 'CPc...' } }), 'all'), true);
  assert.equal(byId.usercentrics.verify(fakeProbe({ storage: { uc_settings: '{"v":1}' } }), 'all'), true);
  assert.equal(byId.usercentrics.verify(fakeProbe({}), 'all'), false);
});

test('claimed CMP set is the launch allowlist', () => {
  assert.deepEqual(supportedCmpNames().sort(), ['Cookiebot', 'CookieYes', 'OneTrust', 'Quantcast Choice', 'Usercentrics'].sort());
});
