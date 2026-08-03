import { test } from 'node:test';
import assert from 'node:assert/strict';
import { emptyStats, normalizeStats, recordOutcome, OUTCOMES } from '../../lib/stats.js';

test('empty stats are bounded counters only', () => {
  const s = emptyStats();
  assert.deepEqual(s.totals, { success: 0, unverified: 0, unsupported: 0, skipped: 0 });
  assert.deepEqual(s.byCmp, {});
});

test('recordOutcome increments the right buckets immutably', () => {
  const s0 = emptyStats();
  const s1 = recordOutcome(s0, 'success', { cmp: 'OneTrust', mode: 'necessary' });
  const s2 = recordOutcome(s1, 'success', { cmp: 'OneTrust', mode: 'necessary' });
  const s3 = recordOutcome(s2, 'unsupported');
  assert.equal(s0.totals.success, 0, 'input must not be mutated');
  assert.equal(s3.totals.success, 2);
  assert.equal(s3.totals.unsupported, 1);
  assert.equal(s3.byCmp.OneTrust.necessary, 2);
});

test('unknown outcomes are ignored', () => {
  const s = recordOutcome(emptyStats(), 'clicked-something');
  assert.deepEqual(s.totals, emptyStats().totals);
});

test('normalizeStats strips prohibited/foreign fields (privacy contract)', () => {
  const polluted = {
    totals: { success: 3, unverified: -5, junk: 9 },
    byCmp: { OneTrust: { necessary: 2, granular: 7 }, ['x'.repeat(50)]: { all: 1 } },
    history: [{ url: 'https://example.com/private?q=secret', timestamp: 123 }],
    lastUrl: 'https://example.com/account',
  };
  const s = normalizeStats(polluted);
  assert.equal(s.totals.success, 3);
  assert.equal(s.totals.unverified, 0, 'negative counts reset');
  assert.equal('junk' in s.totals, false);
  assert.equal('history' in s, false, 'chronological history must never survive');
  assert.equal('lastUrl' in s, false, 'URLs must never survive');
  assert.deepEqual(s.byCmp.OneTrust, { necessary: 2 });
  assert.equal(Object.keys(s.byCmp).length, 1, 'oversized CMP keys dropped');
});

test('the stats schema cannot express a URL or history entry', () => {
  // Whatever gets recorded, the serialized form contains only known keys.
  let s = emptyStats();
  for (const outcome of OUTCOMES) s = recordOutcome(s, outcome, { cmp: 'Cookiebot', mode: 'all' });
  const keys = new Set();
  JSON.stringify(s, (k, v) => {
    if (k) keys.add(k);
    return v;
  });
  const allowed = new Set(['totals', 'byCmp', 'success', 'unverified', 'unsupported', 'skipped', 'Cookiebot', 'all', 'necessary']);
  for (const key of keys) assert.ok(allowed.has(key), `unexpected key in stats: ${key}`);
});
