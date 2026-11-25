import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createDomProbe } from '../../lib/dom-probe.js';

function makeElement({
  visible = true,
  shadowRoot = null,
} = {}) {
  return {
    nodeType: 1,
    isConnected: true,
    shadowRoot,
    getBoundingClientRect() {
      return visible ? { width: 120, height: 40 } : { width: 0, height: 0 };
    },
    click() {
      this.clicked = (this.clicked || 0) + 1;
    },
  };
}

function makeRoot(selectorMap, allElements = []) {
  return {
    querySelectorAll(selector) {
      if (selector === '*') return allElements;
      return selectorMap[selector] || [];
    },
  };
}

const fakeWin = {
  getComputedStyle() {
    return { display: 'block', visibility: 'visible', opacity: '1' };
  },
  setTimeout,
};

test('queryVisible finds visible controls inside an open shadowRoot (Usercentrics pattern)', () => {
  const denyBtn = makeElement({ visible: true });
  const shadow = makeRoot({ '[data-testid="uc-deny-all-button"]': [denyBtn] }, [denyBtn]);
  const host = makeElement({ visible: true, shadowRoot: shadow });
  const doc = makeRoot({ '#usercentrics-root': [host] }, [host]);

  const probe = createDomProbe(fakeWin, doc);
  assert.equal(probe.queryVisible(['#usercentrics-root']), host);
  assert.equal(probe.queryVisible(['[data-testid="uc-deny-all-button"]']), denyBtn);
  assert.equal(probe.isGone(['[data-testid="uc-deny-all-button"]']), false);
});

test('isGone returns true once shadow-DOM container is no longer visible', () => {
  const hiddenContainer = makeElement({ visible: false });
  const shadow = makeRoot({ '[data-testid="uc-container"]': [hiddenContainer] }, [hiddenContainer]);
  const host = makeElement({ visible: false, shadowRoot: shadow });
  const doc = makeRoot({ '#usercentrics-root': [host] }, [host]);

  const probe = createDomProbe(fakeWin, doc);
  assert.equal(probe.queryVisible(['#usercentrics-root', '[data-testid="uc-container"]']), null);
  assert.equal(probe.isGone(['#usercentrics-root', '[data-testid="uc-container"]']), true);
});
