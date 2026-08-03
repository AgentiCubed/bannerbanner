import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  registrationId,
  buildRegistration,
  planReconciliation,
  addOrigin,
  removeOrigin,
  CONTENT_SCRIPT_JS,
} from '../../lib/registry.js';

test('registrationId is deterministic and origin-scoped', () => {
  assert.equal(registrationId('https://example.com'), registrationId('https://example.com/'));
  assert.notEqual(registrationId('https://example.com'), registrationId('http://example.com'));
  assert.notEqual(registrationId('https://example.com'), registrationId('https://www.example.com'));
  assert.throws(() => registrationId('chrome://x'));
});

test('buildRegistration targets exactly one origin with the unified script', () => {
  const reg = buildRegistration('https://example.com');
  assert.deepEqual(reg.matches, ['https://example.com/*']);
  assert.deepEqual(reg.js, CONTENT_SCRIPT_JS);
  assert.equal(reg.allFrames, false);
  assert.equal(reg.persistAcrossSessions, true);
});

test('plan registers granted+desired origins that are not yet registered', () => {
  const plan = planReconciliation({
    desiredOrigins: ['https://a.com', 'https://b.com'],
    grantedOrigins: ['https://a.com', 'https://b.com'],
    registeredIds: [registrationId('https://a.com')],
  });
  assert.equal(plan.toRegister.length, 1);
  assert.deepEqual(plan.toRegister[0].matches, ['https://b.com/*']);
  assert.deepEqual(plan.toUnregisterIds, []);
  assert.deepEqual(plan.effectiveOrigins, ['https://a.com', 'https://b.com']);
});

test('plan unregisters origins that lost authorization (revocation)', () => {
  const plan = planReconciliation({
    desiredOrigins: ['https://a.com'],
    grantedOrigins: ['https://a.com'],
    registeredIds: [registrationId('https://a.com'), registrationId('https://revoked.com')],
  });
  assert.deepEqual(plan.toUnregisterIds, [registrationId('https://revoked.com')]);
});

test('desired-but-not-granted origins are NEVER registered (update cannot broaden access)', () => {
  const plan = planReconciliation({
    desiredOrigins: ['https://a.com', 'https://stale.com'],
    grantedOrigins: ['https://a.com'],
    registeredIds: [],
  });
  assert.deepEqual(plan.effectiveOrigins, ['https://a.com']);
  assert.equal(plan.toRegister.length, 1);
  assert.deepEqual(plan.toRegister[0].matches, ['https://a.com/*']);
});

test('granted-but-not-desired origins are not registered either (registry is canonical)', () => {
  const plan = planReconciliation({
    desiredOrigins: [],
    grantedOrigins: ['https://leftover.com'],
    registeredIds: [],
  });
  assert.deepEqual(plan.toRegister, []);
  assert.deepEqual(plan.effectiveOrigins, []);
});

test('sibling/similar origins never inherit authorization', () => {
  const plan = planReconciliation({
    desiredOrigins: ['https://example.com', 'https://app.example.com', 'http://example.com'],
    grantedOrigins: ['https://example.com'],
    registeredIds: [],
  });
  assert.deepEqual(plan.effectiveOrigins, ['https://example.com']);
});

test('foreign registration ids are left untouched', () => {
  const plan = planReconciliation({
    desiredOrigins: [],
    grantedOrigins: [],
    registeredIds: ['someone-elses-script', registrationId('https://old.com')],
  });
  assert.deepEqual(plan.toUnregisterIds, [registrationId('https://old.com')]);
});

test('wildcard/all-site grants are ignored by the planner', () => {
  // Even if a broad grant somehow existed, the planner only ever works with
  // canonical single origins; wildcards do not normalize and are dropped.
  const plan = planReconciliation({
    desiredOrigins: ['https://a.com'],
    grantedOrigins: ['https://a.com', 'http://*/*', '<all_urls>'],
    registeredIds: [],
  });
  assert.deepEqual(plan.effectiveOrigins, ['https://a.com']);
});

test('addOrigin / removeOrigin normalize and stay canonical', () => {
  let list = addOrigin([], 'https://Example.com/deep/path');
  assert.deepEqual(list, ['https://example.com']);
  list = addOrigin(list, 'https://example.com'); // idempotent
  assert.deepEqual(list, ['https://example.com']);
  list = removeOrigin(list, 'https://EXAMPLE.com');
  assert.deepEqual(list, []);
});
