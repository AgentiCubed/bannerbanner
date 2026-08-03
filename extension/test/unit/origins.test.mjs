import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeOrigin,
  isSupportedPageUrl,
  originToMatchPattern,
  matchPatternToOrigin,
  isAllSitesPattern,
  sameOrigin,
  normalizeOriginList,
} from '../../lib/origins.js';

test('normalizeOrigin canonicalizes http(s) URLs', () => {
  assert.equal(normalizeOrigin('https://Example.COM/some/path?q=1'), 'https://example.com');
  assert.equal(normalizeOrigin('http://example.com:80/'), 'http://example.com');
  assert.equal(normalizeOrigin('https://example.com:443'), 'https://example.com');
  assert.equal(normalizeOrigin('https://example.com:8443'), 'https://example.com:8443');
  assert.equal(normalizeOrigin('https://sub.example.com'), 'https://sub.example.com');
});

test('normalizeOrigin rejects non-web and malformed URLs', () => {
  for (const bad of [
    'chrome://extensions',
    'chrome-extension://abc/popup.html',
    'about:blank',
    'file:///etc/passwd',
    'ftp://example.com',
    'data:text/html,hi',
    'javascript:alert(1)',
    'not a url',
    '',
    null,
    undefined,
    42,
  ]) {
    assert.equal(normalizeOrigin(bad), null, `expected null for ${String(bad)}`);
  }
});

test('isSupportedPageUrl mirrors normalizeOrigin', () => {
  assert.equal(isSupportedPageUrl('https://example.com/x'), true);
  assert.equal(isSupportedPageUrl('chrome://settings'), false);
});

test('originToMatchPattern builds single-origin patterns', () => {
  assert.equal(originToMatchPattern('https://example.com'), 'https://example.com/*');
  assert.throws(() => originToMatchPattern('chrome://x'));
  assert.throws(() => originToMatchPattern('*://*/*'));
});

test('matchPatternToOrigin inverts single-origin patterns and rejects wildcards', () => {
  assert.equal(matchPatternToOrigin('https://example.com/*'), 'https://example.com');
  assert.equal(matchPatternToOrigin('http://*/*'), null);
  assert.equal(matchPatternToOrigin('https://*.example.com/*'), null);
  assert.equal(matchPatternToOrigin('<all_urls>'), null);
});

test('isAllSitesPattern flags broad patterns', () => {
  assert.equal(isAllSitesPattern('http://*/*'), true);
  assert.equal(isAllSitesPattern('https://*/*'), true);
  assert.equal(isAllSitesPattern('<all_urls>'), true);
  assert.equal(isAllSitesPattern('https://example.com/*'), false);
});

test('sameOrigin is strict about scheme and host', () => {
  assert.equal(sameOrigin('https://example.com', 'https://example.com/'), true);
  assert.equal(sameOrigin('https://example.com', 'http://example.com'), false);
  assert.equal(sameOrigin('https://example.com', 'https://www.example.com'), false);
  assert.equal(sameOrigin('https://example.com', 'https://example.com.evil.com'), false);
  assert.equal(sameOrigin('https://example.com', 'https://examplé.com'), false);
});

test('normalizeOriginList dedupes, normalizes, sorts, drops junk', () => {
  assert.deepEqual(
    normalizeOriginList(['https://B.com/x', 'https://a.com', 'https://b.com', 'chrome://nope', null]),
    ['https://a.com', 'https://b.com']
  );
  assert.deepEqual(normalizeOriginList(undefined), []);
  assert.deepEqual(normalizeOriginList('not-an-array'), []);
});
