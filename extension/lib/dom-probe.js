// DOM-backed implementation of the pipeline `probe` interface.
//
// This is the ONLY place in the consent path that touches the live DOM,
// document.cookie, localStorage, or page globals. It is intentionally thin:
// all decisions live in the pure lib modules. Because it is a straightforward
// DOM adapter, it is exercised by the browser integration tests rather than the
// pure unit tests.

function isElementVisible(el) {
  if (!el || el.nodeType !== 1) return false;
  const style = getComputedStyle(el);
  if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
  const rect = el.getBoundingClientRect();
  return rect.width > 1 && rect.height > 1;
}

export function createDomProbe(win = window, doc = document) {
  return {
    queryVisible(selectors) {
      for (const selector of selectors) {
        let nodes;
        try {
          nodes = doc.querySelectorAll(selector);
        } catch {
          continue;
        }
        for (const node of nodes) {
          if (isElementVisible(node)) return node;
        }
      }
      return null;
    },

    isGone(selectors) {
      for (const selector of selectors) {
        let node;
        try {
          node = doc.querySelector(selector);
        } catch {
          continue;
        }
        if (node && isElementVisible(node)) return false;
      }
      return true;
    },

    click(handle) {
      if (handle && typeof handle.click === 'function' && handle.isConnected) {
        handle.click();
      }
    },

    getCookie(name) {
      const cookies = (doc.cookie || '').split(';');
      for (const cookie of cookies) {
        const idx = cookie.indexOf('=');
        const key = (idx === -1 ? cookie : cookie.slice(0, idx)).trim();
        if (key === name) {
          return decodeURIComponent(idx === -1 ? '' : cookie.slice(idx + 1).trim());
        }
      }
      return null;
    },

    getLocalStorage(key) {
      try {
        return win.localStorage.getItem(key);
      } catch {
        return null;
      }
    },

    hasGlobal(path) {
      const parts = String(path).split('.');
      let cursor = win;
      for (const part of parts) {
        if (cursor == null) return false;
        cursor = cursor[part];
      }
      return cursor !== undefined && cursor !== null;
    },

    delay(ms) {
      return new Promise((resolve) => win.setTimeout(resolve, ms));
    },

    // Advisory only: describe dialog-like elements for classification / status.
    // Never used to trigger a mutation.
    describeCandidates() {
      const seen = new Set();
      const out = [];
      const selector = '[role="dialog"], [aria-modal="true"], dialog[open]';
      let nodes;
      try {
        nodes = doc.querySelectorAll(selector);
      } catch {
        nodes = [];
      }
      const roots = new Set(nodes);
      // Also consider large fixed/sticky top-level elements.
      if (doc.body) {
        for (const el of doc.body.children) {
          if (el.nodeType !== 1) continue;
          const style = getComputedStyle(el);
          if (style.position === 'fixed' || style.position === 'sticky') roots.add(el);
        }
      }
      for (const el of roots) {
        if (out.length >= 8) break;
        if (seen.has(el) || !isElementVisible(el)) continue;
        seen.add(el);
        const buttonTexts = [];
        for (const btn of el.querySelectorAll('button, a, [role="button"]')) {
          if (buttonTexts.length >= 12) break;
          const label = (btn.innerText || btn.getAttribute('aria-label') || '').trim();
          if (label) buttonTexts.push(label.slice(0, 40));
        }
        out.push({
          id: el.id || '',
          classes: typeof el.className === 'string' ? el.className.split(/\s+/).filter(Boolean) : [],
          role: el.getAttribute('role') || '',
          ariaLabel: el.getAttribute('aria-label') || '',
          tag: el.tagName.toLowerCase(),
          text: (el.innerText || '').slice(0, 600),
          buttonTexts,
        });
      }
      return out;
    },
  };
}
