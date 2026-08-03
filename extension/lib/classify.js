// Dialog classification for BannerBanner.
//
// This module answers one question about a candidate dialog descriptor:
// is it a cookie-consent dialog, a SENSITIVE workflow we must never touch, or
// UNKNOWN? Classification is advisory only: it is used to decide NOT to act and
// to show an honest local status. It never triggers a mutation on its own.
//
// Safety invariants (docs/MVP_CONTRACT.md):
//   1. Unknown means no automatic action.
//   2. Sensitive workflows remain untouched.
//
// A descriptor is a plain, DOM-free object so this logic is fully unit testable:
//   { id, classes: string[], role, ariaLabel, text, tag, buttonTexts: string[] }

export const CLASS = Object.freeze({
  COOKIE: 'cookie-consent',
  SENSITIVE: 'sensitive',
  UNKNOWN: 'unknown',
});

// Sensitive categories that must never be auto-acted on. Order matters only for
// the returned reason label; any match forces SENSITIVE.
const SENSITIVE_PATTERNS = [
  ['login', /\b(log[\s-]?in|sign[\s-]?in|password|username|two[\s-]?factor|2fa|one[\s-]?time (code|password)|otp|verification code|authenticat)/i],
  ['payment', /\b(payment|credit card|debit card|card number|cvv|cvc|billing|3-?d secure|3ds|secure checkout)\b/i],
  ['checkout', /\b(checkout|place your order|complete (your )?purchase|shipping address|order summary)\b/i],
  ['security', /\b(security (check|alert|warning)|re-?authenticat|confirm your identity|suspicious (activity|login)|verify it'?s you)\b/i],
  ['age-gate', /\b(are you (over|at least)|confirm your age|enter your (date of )?birth|18\+|21\+|age verification|old enough)\b/i],
  ['session', /\b(session (has )?(expired|about to expire|timeout)|you('| a)re about to be (logged|signed) out|stay signed in\??)\b/i],
  ['unsaved', /\b(unsaved changes|leave (this )?(page|site)\??|discard (your )?changes|changes (you made )?may not be saved|before you (go|leave))\b/i],
];

const COOKIE_PATTERN =
  /\b(cookie|consent|gdpr|ccpa|tracking (technolog|cookie)|data protection|privacy (policy|preferences|choices)|we (use|value) (cookies|your privacy)|accept (all )?cookies|manage (cookies|consent))\b/i;

function haystackFor(descriptor) {
  const parts = [
    descriptor.id || '',
    Array.isArray(descriptor.classes) ? descriptor.classes.join(' ') : '',
    descriptor.role || '',
    descriptor.ariaLabel || '',
    descriptor.text || '',
    Array.isArray(descriptor.buttonTexts) ? descriptor.buttonTexts.join(' ') : '',
  ];
  return parts.join(' \n ');
}

/**
 * Classify a candidate dialog descriptor.
 * @param {object} descriptor
 * @returns {{class: string, reason: string|null}}
 */
export function classifyDialog(descriptor) {
  if (!descriptor || typeof descriptor !== 'object') {
    return { class: CLASS.UNKNOWN, reason: null };
  }
  const haystack = haystackFor(descriptor);

  // Sensitive wins over everything: if a dialog looks even partly like a
  // protected workflow, we refuse to touch it.
  for (const [reason, pattern] of SENSITIVE_PATTERNS) {
    if (pattern.test(haystack)) {
      return { class: CLASS.SENSITIVE, reason };
    }
  }

  if (COOKIE_PATTERN.test(haystack)) {
    return { class: CLASS.COOKIE, reason: 'cookie-language' };
  }

  return { class: CLASS.UNKNOWN, reason: null };
}

/**
 * Convenience: is this descriptor sensitive?
 * @param {object} descriptor
 * @returns {boolean}
 */
export function isSensitive(descriptor) {
  return classifyDialog(descriptor).class === CLASS.SENSITIVE;
}
