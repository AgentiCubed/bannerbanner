import { test } from 'node:test';
import assert from 'node:assert/strict';
import { runPipeline, createSession, OUTCOME, outcomeToStat } from '../../lib/pipeline.js';

// Mutable fake probe: tests flip `state` to simulate the page reacting.
function makeProbe(state) {
  const probe = {
    clicks: [],
    delays: 0,
    queryVisible(selectors) {
      for (const s of selectors) if (state.visible[s]) return state.visible[s];
      return null;
    },
    isGone(selectors) {
      return selectors.every((s) => !state.visible[s]);
    },
    click(handle) {
      probe.clicks.push(handle);
      if (state.onClick) state.onClick(handle);
    },
    getCookie(name) {
      return state.cookies[name] ?? null;
    },
    getLocalStorage(key) {
      return state.storage?.[key] ?? null;
    },
    hasGlobal() {
      return false;
    },
    delay() {
      probe.delays++;
      return Promise.resolve();
    },
    describeCandidates() {
      return state.candidates || [];
    },
  };
  return probe;
}

function onetrustState({ reactive = true } = {}) {
  const reject = { name: 'reject-btn' };
  const accept = { name: 'accept-btn' };
  const state = {
    visible: {
      '#onetrust-banner-sdk': { name: 'banner' },
      '#onetrust-reject-all-handler': reject,
      '#onetrust-accept-btn-handler': accept,
    },
    cookies: {},
    onClick(handle) {
      if (!reactive) return;
      // Simulate OneTrust: clicking writes the cookie and removes the banner.
      if (handle === reject || handle === accept) {
        state.cookies.OptanonConsent = 'groups=C0001';
        state.visible = {};
      }
    },
  };
  return { state, reject, accept };
}

const SETTINGS = { enabled: true, mode: 'necessary', celebrate: false };

test('success: supported CMP, control clicked, postcondition verified', async () => {
  const { state, reject } = onetrustState();
  const probe = makeProbe(state);
  const result = await runPipeline(probe, SETTINGS, { verifyIntervalMs: 0 });
  assert.equal(result.outcome, OUTCOME.SUCCESS);
  assert.equal(result.cmp, 'OneTrust');
  assert.equal(result.mode, 'necessary');
  assert.deepEqual(probe.clicks, [reject], 'exactly one click on the exact intended control');
  assert.equal(result.verified, true);
});

test('mode "all" clicks the accept control', async () => {
  const { state, accept } = onetrustState();
  const probe = makeProbe(state);
  const result = await runPipeline(probe, { ...SETTINGS, mode: 'all' }, { verifyIntervalMs: 0 });
  assert.equal(result.outcome, OUTCOME.SUCCESS);
  assert.deepEqual(probe.clicks, [accept]);
});

test('unverified: click happened but postcondition never passed', async () => {
  const { state } = onetrustState({ reactive: false });
  const probe = makeProbe(state);
  const result = await runPipeline(probe, SETTINGS, { verifyAttempts: 3, verifyIntervalMs: 0 });
  assert.equal(result.outcome, OUTCOME.UNVERIFIED);
  assert.equal(result.clicked, true);
  assert.equal(result.verified, false);
  assert.equal(outcomeToStat(result.outcome), 'unverified');
});

test('banner disappearance WITHOUT the consent signal is not success', async () => {
  const { state } = onetrustState({ reactive: false });
  state.onClick = () => {
    state.visible = {}; // banner vanishes, but no cookie is written
  };
  const probe = makeProbe(state);
  const result = await runPipeline(probe, SETTINGS, { verifyAttempts: 3, verifyIntervalMs: 0 });
  assert.equal(result.outcome, OUTCOME.UNVERIFIED, 'DOM disappearance alone must never be success');
});

test('disabled settings: nothing happens', async () => {
  const { state } = onetrustState();
  const probe = makeProbe(state);
  const result = await runPipeline(probe, { ...SETTINGS, enabled: false });
  assert.equal(result.outcome, OUTCOME.DISABLED);
  assert.equal(probe.clicks.length, 0);
});

test('missing settings fail closed', async () => {
  const { state } = onetrustState();
  const probe = makeProbe(state);
  const result = await runPipeline(probe, null);
  assert.equal(result.outcome, OUTCOME.DISABLED);
  assert.equal(probe.clicks.length, 0);
});

test('unsupported mode for the detected CMP fails closed (no fallback click)', async () => {
  // Quantcast supports only "all"; asking for "necessary" must do nothing.
  const probe = makeProbe({
    visible: { '#qc-cmp2-ui': { name: 'qc-banner' }, '#qc-cmp2-ui button[mode="primary"]': { name: 'accept' } },
    cookies: {},
  });
  const result = await runPipeline(probe, SETTINGS, { verifyIntervalMs: 0 });
  assert.equal(result.outcome, OUTCOME.UNSUPPORTED_MODE);
  assert.equal(result.cmp, 'Quantcast Choice');
  assert.equal(probe.clicks.length, 0);
  assert.equal(outcomeToStat(result.outcome), 'unsupported');
});

test('missing intended control fails closed (no generic fallback)', async () => {
  const probe = makeProbe({
    visible: { '#onetrust-banner-sdk': { name: 'banner' } }, // no buttons at all
    cookies: {},
  });
  const result = await runPipeline(probe, SETTINGS, { verifyIntervalMs: 0 });
  assert.equal(result.outcome, OUTCOME.NO_CONTROL);
  assert.equal(probe.clicks.length, 0);
});

test('unknown dialog: no click, no action, reported unsupported', async () => {
  const probe = makeProbe({
    visible: {},
    cookies: {},
    candidates: [{ text: 'Welcome! Check out our new features.', buttonTexts: ['OK'] }],
  });
  const result = await runPipeline(probe, SETTINGS);
  assert.equal(result.outcome, OUTCOME.UNKNOWN);
  assert.equal(probe.clicks.length, 0);
  assert.equal(outcomeToStat(result.outcome), 'unsupported');
});

test('sensitive dialog: no click, skipped, reason surfaced', async () => {
  const probe = makeProbe({
    visible: {},
    cookies: {},
    candidates: [{ text: 'Your session has expired. Please sign in again.' }],
  });
  const result = await runPipeline(probe, SETTINGS);
  assert.equal(result.outcome, OUTCOME.SENSITIVE);
  assert.equal(probe.clicks.length, 0);
  assert.equal(outcomeToStat(result.outcome), 'skipped');
});

test('no dialog at all: quiet no-op', async () => {
  const probe = makeProbe({ visible: {}, cookies: {}, candidates: [] });
  const result = await runPipeline(probe, SETTINGS);
  assert.equal(result.outcome, OUTCOME.NO_DIALOG);
  assert.equal(outcomeToStat(result.outcome), null);
});

test('a banner receives at most one action per session (sequential rescan)', async () => {
  const { state } = onetrustState({ reactive: false }); // banner never goes away
  const probe = makeProbe(state);
  const session = createSession();

  const first = await runPipeline(probe, SETTINGS, { session, verifyAttempts: 2, verifyIntervalMs: 0 });
  const second = await runPipeline(probe, SETTINGS, { session, verifyAttempts: 2, verifyIntervalMs: 0 });
  const third = await runPipeline(probe, SETTINGS, { session, verifyAttempts: 2, verifyIntervalMs: 0 });

  assert.equal(first.outcome, OUTCOME.UNVERIFIED);
  assert.equal(second.outcome, OUTCOME.DUPLICATE);
  assert.equal(third.outcome, OUTCOME.DUPLICATE);
  assert.equal(probe.clicks.length, 1, 'exactly one click ever');
});

test('two concurrent pipeline runs cannot race into two actions', async () => {
  const { state } = onetrustState({ reactive: false });
  const probe = makeProbe(state);
  const session = createSession();

  const [a, b] = await Promise.all([
    runPipeline(probe, SETTINGS, { session, verifyAttempts: 5, verifyIntervalMs: 0 }),
    runPipeline(probe, SETTINGS, { session, verifyAttempts: 5, verifyIntervalMs: 0 }),
  ]);

  const outcomes = [a.outcome, b.outcome].sort();
  assert.deepEqual(outcomes, [OUTCOME.DUPLICATE, OUTCOME.UNVERIFIED].sort());
  assert.equal(probe.clicks.length, 1, 'concurrent scans must produce exactly one click');
});

test('settled unsupported-mode CMP is not reprocessed', async () => {
  const probe = makeProbe({
    visible: { '#qc-cmp2-ui': {} },
    cookies: {},
  });
  const session = createSession();
  const first = await runPipeline(probe, SETTINGS, { session });
  const second = await runPipeline(probe, SETTINGS, { session });
  assert.equal(first.outcome, OUTCOME.UNSUPPORTED_MODE);
  assert.equal(second.outcome, OUTCOME.DUPLICATE);
});
