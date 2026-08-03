import { test } from 'node:test';
import assert from 'node:assert/strict';
import { classifyDialog, isSensitive, CLASS } from '../../lib/classify.js';

const SENSITIVE_CASES = [
  ['login', { text: 'Sign in to your account', buttonTexts: ['Log in', 'Forgot password?'] }],
  ['login (2fa)', { text: 'Enter the one-time code we sent to your phone' }],
  ['payment', { text: 'Enter your card number and CVV to complete payment' }],
  ['payment (3ds)', { text: 'Your bank requires 3-D Secure verification' }],
  ['checkout', { text: 'Order summary — place your order', buttonTexts: ['Place your order'] }],
  ['security', { text: 'Suspicious activity detected. Confirm your identity to continue.' }],
  ['security (reauth)', { ariaLabel: 'Re-authentication required' }],
  ['age gate', { text: 'Are you over 18? Please confirm your age to enter.' }],
  ['age gate (dob)', { text: 'Enter your date of birth to continue' }],
  ['session', { text: 'Your session has expired. Stay signed in?' }],
  ['session (timeout)', { text: "You're about to be logged out due to inactivity" }],
  ['unsaved work', { text: 'You have unsaved changes. Leave this page?' }],
  ['unsaved (discard)', { text: 'Discard your changes?', buttonTexts: ['Discard', 'Keep editing'] }],
];

for (const [label, descriptor] of SENSITIVE_CASES) {
  test(`sensitive: ${label}`, () => {
    const result = classifyDialog(descriptor);
    assert.equal(result.class, CLASS.SENSITIVE, `${label} must classify as sensitive`);
    assert.ok(isSensitive(descriptor));
  });
}

test('sensitive wins even when cookie words are present', () => {
  const result = classifyDialog({
    text: 'Sign in to manage your cookie preferences and consent choices',
  });
  assert.equal(result.class, CLASS.SENSITIVE);
});

test('cookie consent language classifies as cookie', () => {
  for (const descriptor of [
    { text: 'We use cookies to improve your experience. See our privacy policy.' },
    { id: 'onetrust-banner-sdk', text: 'This site uses tracking cookies. Manage consent.' },
    { text: 'By clicking Accept all cookies you agree to our use of cookies (GDPR).' },
  ]) {
    assert.equal(classifyDialog(descriptor).class, CLASS.COOKIE);
  }
});

test('newsletter and ad overlays are UNKNOWN (excluded from v0.1), never cookie', () => {
  for (const descriptor of [
    { text: 'Join our newsletter! Enter your email address to get updates in your inbox.' },
    { text: 'Special offer! 20% off — limited time. Use promo code SAVE20.' },
    { text: 'Please disable your ad blocker to continue reading.' },
  ]) {
    const result = classifyDialog(descriptor);
    assert.equal(result.class, CLASS.UNKNOWN, JSON.stringify(descriptor));
  }
});

test('generic modals are UNKNOWN', () => {
  assert.equal(classifyDialog({ text: 'Welcome to our brand new site experience!' }).class, CLASS.UNKNOWN);
  assert.equal(classifyDialog({}).class, CLASS.UNKNOWN);
  assert.equal(classifyDialog(null).class, CLASS.UNKNOWN);
});
