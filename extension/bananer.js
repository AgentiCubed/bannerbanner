// Bananers — popup-dismissing learning companions.
// Content script injected at document_start on sites the user has opted into.
//
// Responsibilities:
//   1. Pre-paint suppression of popups already learned for this host (memory recall).
//   2. Heuristic detection of new popups (cookie consent, newsletter interstitials, ad overlays).
//   3. Investigation: DOM structure, computed CSS, and attached-code inspection.
//   4. Dismissal via the safest working strategy (click reject/close, or peel the node off).
//   5. Reporting learned fingerprints back to the knowledge base (chrome.storage.local).
//   6. A playful, educational bananer character that narrates each step.

(function () {
  'use strict';

  if (window.__bananerLoaded) return;
  window.__bananerLoaded = true;

  const Bananers = self.BannerBannerBananers;
  const MAX_Z = 2147483647;
  const OVERLAY_ID = 'bannerbanner-bananer-overlay';

  const state = {
    settings: {
      enabled: true,
      autoDismiss: true,
      showCharacter: true,
      showCaptions: true,
      preemptiveSuppression: true,
    },
    legacyPreferences: { level: 'necessary', useCustom: false },
    knowledge: [], // KB records for this hostname
    suppressedSelectors: new Set(),
    handled: new WeakSet(),
    handledFingerprints: new Set(),
    sessionDismissals: 0,
    animationQueue: Promise.resolve(),
    observer: null,
    ready: false,
  };

  // ---------------------------------------------------------------------------
  // Bootstrap: load settings + learned fingerprints, apply pre-paint suppression
  // ---------------------------------------------------------------------------

  chrome.storage.local.get(['bananer-settings', 'bananer-kb'], (result) => {
    if (result['bananer-settings']) {
      state.settings = Object.assign(state.settings, result['bananer-settings']);
    }
    const kb = result['bananer-kb'] || {};
    state.knowledge = Object.values(kb).filter((r) => r.hostname === location.hostname);

    if (state.settings.enabled && state.settings.autoDismiss && state.settings.preemptiveSuppression) {
      applyPrePaintSuppression();
    }
    state.ready = true;
    whenBodyReady(startWatching);
  });

  chrome.storage.sync.get(['banner-preferences'], (result) => {
    if (result['banner-preferences']) {
      state.legacyPreferences = result['banner-preferences'];
    }
  });

  function applyPrePaintSuppression() {
    const selectors = state.knowledge
      .filter((r) => r.stats && r.stats.timesDismissed >= 1 && r.suppressSelector)
      .map((r) => r.suppressSelector);
    if (!selectors.length) return;

    selectors.forEach((s) => state.suppressedSelectors.add(s));
    const style = document.createElement('style');
    style.id = 'bannerbanner-bananer-suppression';
    style.textContent = selectors.map((s) => `${s} { display: none !important; }`).join('\n');
    (document.head || document.documentElement).appendChild(style);
  }

  function whenBodyReady(fn) {
    if (document.body) {
      fn();
    } else {
      new MutationObserver((_, obs) => {
        if (document.body) {
          obs.disconnect();
          fn();
        }
      }).observe(document.documentElement, { childList: true });
    }
  }

  // ---------------------------------------------------------------------------
  // Watching: initial scan + mutation observer for late-arriving popups
  // ---------------------------------------------------------------------------

  function startWatching() {
    if (!state.settings.enabled) return;

    scan(false);
    const debouncedScan = debounce(() => scan(false), 250);
    state.observer = new MutationObserver(debouncedScan);
    state.observer.observe(document.body, { childList: true, subtree: true });

    // Popups frequently arrive shortly after load; a couple of delayed passes
    // catches those without a mutation storm.
    setTimeout(() => scan(false), 1500);
    setTimeout(() => scan(false), 4000);
  }

  function debounce(fn, ms) {
    let t = null;
    return () => {
      clearTimeout(t);
      t = setTimeout(fn, ms);
    };
  }

  // ---------------------------------------------------------------------------
  // Scanning
  // ---------------------------------------------------------------------------

  function scan(manual) {
    if (!document.body) return { found: 0, dismissed: 0 };
    let found = 0;

    // 1. Fast path: recall learned fingerprints (works on pre-paint-hidden nodes too).
    for (const record of state.knowledge) {
      if (!record.selector) continue;
      let el = null;
      try {
        el = document.querySelector(record.selector);
      } catch (e) {
        continue;
      }
      if (el && !state.handled.has(el)) {
        found++;
        if (state.settings.autoDismiss || manual) {
          recallDismiss(record, el);
        }
      }
    }

    // 2. Heuristic path: discover new popups.
    for (const el of collectCandidates()) {
      if (state.handled.has(el)) continue;
      const analysis = analyzePopup(el);
      if (!analysis) continue;
      found++;
      if (state.settings.autoDismiss || manual) {
        investigateAndDismiss(el, analysis);
      }
    }

    return { found, dismissed: state.sessionDismissals };
  }

  function collectCandidates() {
    const candidates = new Set();
    for (const el of document.body.children) {
      if (el.nodeType === 1) candidates.add(el);
    }
    for (const el of document.querySelectorAll('[role="dialog"], [aria-modal="true"], dialog[open]')) {
      candidates.add(el);
    }
    candidates.forEach((el) => {
      if (el.id === OVERLAY_ID || el.id === 'bannerbanner-celebration') candidates.delete(el);
      if (['SCRIPT', 'STYLE', 'LINK', 'NOSCRIPT'].includes(el.tagName)) candidates.delete(el);
    });
    return candidates;
  }

  // ---------------------------------------------------------------------------
  // Analysis: is this element a popup, what kind, and how do we take it apart?
  // ---------------------------------------------------------------------------

  function analyzePopup(el) {
    if (!el.isConnected) return null;
    const style = getComputedStyle(el);
    const isDialog =
      el.tagName === 'DIALOG' ||
      el.getAttribute('role') === 'dialog' ||
      el.getAttribute('aria-modal') === 'true';
    const isOverlaid = style.position === 'fixed' || style.position === 'sticky';
    if (!isDialog && !isOverlaid) return null;
    if (['NAV', 'HEADER', 'FOOTER'].includes(el.tagName)) return null;
    const role = el.getAttribute('role');
    if (['navigation', 'banner', 'contentinfo', 'search'].includes(role)) return null;
    if (!isVisible(el)) return null;

    const rect = el.getBoundingClientRect();
    const vw = Math.max(window.innerWidth, 1);
    const vh = Math.max(window.innerHeight, 1);
    const coveragePct = Math.round(((rect.width * rect.height) / (vw * vh)) * 100);
    const isBar = rect.width >= vw * 0.6 && rect.height >= 60;
    const isBigEnough = rect.width * rect.height >= 40000 || isBar;
    if (!isDialog && !isBigEnough) return null;

    const zIndex = parseInt(style.zIndex, 10);
    if (!isDialog && (isNaN(zIndex) || zIndex < 100)) return null;

    const buttons = collectClickables(el);
    if (!buttons.length) return null;

    const text = (el.innerText || '').slice(0, 800);
    if (text.trim().length < 20) return null;

    const bannerType = classify(el, text);
    const backdrop = findBackdrop(el);
    const isModal = isDialog || !!backdrop || coveragePct >= 40;

    // Safety valve: never auto-destroy an unclassified element unless it clearly
    // behaves like a modal. Bananers are curious, not reckless.
    if (bannerType === 'unknown' && !isModal) return null;

    // Custom cookie-category preferences are applied by the classic CMP handler
    // (content.js), which knows how to open settings panels and flip toggles.
    // Bananers step aside for that flow instead of short-circuiting it.
    if (bannerType === 'cookie-consent' && state.legacyPreferences.useCustom) return null;

    return {
      bannerType,
      rect,
      coveragePct,
      zIndex: isNaN(zIndex) ? 'auto' : zIndex,
      position: style.position,
      buttons,
      backdrop,
      isModal,
      listeners: inspectAttachedCode(el, buttons),
    };
  }

  function isVisible(el) {
    const style = getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') return false;
    const rect = el.getBoundingClientRect();
    return rect.width > 1 && rect.height > 1;
  }

  function collectClickables(root) {
    const found = [];
    const nodes = root.querySelectorAll(
      'button, a, [role="button"], input[type="button"], input[type="submit"], [class*="close" i], [aria-label]'
    );
    for (const node of nodes) {
      if (found.length >= 40) break;
      if (isVisible(node)) found.push(node);
    }
    return found;
  }

  const TYPE_KEYWORDS = {
    'cookie-consent': /cookie|consent|gdpr|ccpa|privacy (policy|preferences|settings)|tracking technologies|data protection/i,
    'newsletter': /newsletter|subscribe|sign\s?up|mailing list|your inbox|email address|get updates|join (our|the) list/i,
    'ad-overlay': /advertisement|sponsored|special offer|limited time|sale ends|discount code|% off|promo code|upgrade (now|to premium)|ad blocker|adblock/i,
  };

  function classify(el, text) {
    const className = typeof el.className === 'string' ? el.className : '';
    const haystack = `${el.id} ${className} ${text}`;
    let best = 'unknown';
    let bestScore = 0;
    for (const [type, re] of Object.entries(TYPE_KEYWORDS)) {
      const matches = haystack.match(new RegExp(re.source, 'gi'));
      const score = matches ? matches.length : 0;
      if (score > bestScore) {
        bestScore = score;
        best = type;
      }
    }
    return best;
  }

  function findBackdrop(el) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const candidates = [el.previousElementSibling, el.nextElementSibling, el.parentElement];
    for (const c of candidates) {
      if (!c || c === document.body || c === document.documentElement) continue;
      const s = getComputedStyle(c);
      if (s.position !== 'fixed') continue;
      const r = c.getBoundingClientRect();
      const coversViewport = r.width >= vw * 0.9 && r.height >= vh * 0.9;
      const looksLikeBackdrop =
        /overlay|backdrop|dimmer|scrim|mask/i.test(`${c.id} ${c.className}`) ||
        ((s.backgroundColor.includes('rgba') || parseFloat(s.opacity) < 1) && (c.innerText || '').trim().length < 5);
      if (coversViewport && looksLikeBackdrop) return c;
    }
    return null;
  }

  // "All code" inspection: what code is wired up to this popup?
  function inspectAttachedCode(el, buttons) {
    const notes = [];
    if (el.getAttribute('onclick')) notes.push('inline onclick on container');
    let inlineHandlers = 0;
    let hashLinks = 0;
    for (const b of buttons) {
      if (b.getAttribute('onclick')) inlineHandlers++;
      if (b.tagName === 'A' && (b.getAttribute('href') === '#' || b.getAttribute('href') === '')) hashLinks++;
    }
    if (inlineHandlers) notes.push(`${inlineHandlers} button(s) with inline onclick handlers`);
    if (hashLinks) notes.push(`${hashLinks} anchor(s) with href="#" (JS-driven)`);
    const frameworkHints = Object.keys(el.dataset || {}).filter((k) =>
      /consent|cookie|modal|popup|dismiss|action/i.test(k)
    );
    if (frameworkHints.length) notes.push(`data-* hooks: ${frameworkHints.slice(0, 3).join(', ')}`);
    if (el.querySelector('iframe')) notes.push('embeds an iframe (third-party content)');
    if (!notes.length) notes.push('listeners attached via addEventListener (not statically visible)');
    return notes;
  }

  // ---------------------------------------------------------------------------
  // Dismissal strategies
  // ---------------------------------------------------------------------------

  const MATCHERS = {
    reject: /reject( all)?|decline|refuse|deny|disagree|necessary only|only (necessary|essential)|essential only|do not (accept|consent|sell)/i,
    accept: /accept( all)?|agree|allow( all)?|got it|^ok(ay)?!?$|i understand/i,
    close: /^[×✕✖xX]$|close|dismiss|no,? thanks?|not now|maybe later|remind me later|skip|no,? i('m| am)|continue (reading|to site|without)/i,
  };

  function buttonLabel(b) {
    return (
      (b.innerText || b.value || '').trim() ||
      b.getAttribute('aria-label') ||
      b.getAttribute('title') ||
      ''
    ).slice(0, 60);
  }

  function matchButton(buttons, kind) {
    for (const b of buttons) {
      const label = buttonLabel(b);
      if (label && MATCHERS[kind].test(label)) return b;
    }
    if (kind === 'close') {
      for (const b of buttons) {
        if (/close|dismiss/i.test(`${b.id} ${b.className}`)) return b;
      }
    }
    return null;
  }

  function chooseStrategy(analysis) {
    const { bannerType, buttons } = analysis;
    if (bannerType === 'cookie-consent') {
      const wantsAll = state.legacyPreferences.level === 'all';
      const preferred = matchButton(buttons, wantsAll ? 'accept' : 'reject');
      if (preferred) {
        return { strategy: wantsAll ? 'click-accept' : 'click-reject', button: preferred };
      }
      const close = matchButton(buttons, 'close');
      if (close) return { strategy: 'click-close', button: close };
      return { strategy: 'remove', button: null };
    }
    const close = matchButton(buttons, 'close');
    if (close) return { strategy: 'click-close', button: close };
    const reject = matchButton(buttons, 'reject');
    if (reject) return { strategy: 'click-reject', button: reject };
    return { strategy: 'remove', button: null };
  }

  function executeDismissal(el, plan, analysis) {
    try {
      if (plan.button && plan.button.isConnected) {
        plan.button.click();
      } else if (plan.strategy === 'remove' || !plan.button) {
        peelOff(el, analysis);
      }
      // If clicking didn't get rid of it, peel it off as a fallback.
      setTimeout(() => {
        if (el.isConnected && isVisible(el)) peelOff(el, analysis);
      }, 800);
      return true;
    } catch (e) {
      return false;
    }
  }

  function peelOff(el, analysis) {
    const backdrop = analysis && analysis.backdrop;
    if (backdrop && backdrop.isConnected) {
      if (backdrop.contains(el)) {
        backdrop.remove();
      } else {
        backdrop.remove();
        el.remove();
      }
    } else {
      el.remove();
    }
    if (analysis && analysis.isModal) unlockScroll();
  }

  function unlockScroll() {
    for (const target of [document.body, document.documentElement]) {
      if (!target) continue;
      if (getComputedStyle(target).overflow === 'hidden') {
        target.style.setProperty('overflow', 'visible', 'important');
      }
      target.classList.remove('modal-open', 'no-scroll', 'noscroll', 'overflow-hidden');
    }
  }

  // ---------------------------------------------------------------------------
  // Fingerprinting
  // ---------------------------------------------------------------------------

  function tokenize(value) {
    return String(value || '')
      .split(/[\s_-]+/)
      .map((t) => t.toLowerCase())
      .filter((t) => t.length > 2 && t.length < 30 && !/^\d+$/.test(t))
      .slice(0, 8);
  }

  function hashString(str) {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) + hash + str.charCodeAt(i)) >>> 0;
    }
    return hash.toString(36);
  }

  function stableClasses(el) {
    return Array.from(el.classList || [])
      .filter((c) => c.length > 2 && c.length < 40 && !/\d{3,}/.test(c))
      .slice(0, 3);
  }

  function buildSelector(el) {
    if (el.id) return `#${CSS.escape(el.id)}`;
    const classes = stableClasses(el);
    if (classes.length) {
      return `${el.tagName.toLowerCase()}${classes.map((c) => `.${CSS.escape(c)}`).join('')}`;
    }
    const parent = el.parentElement;
    if (parent && parent.id) {
      return `#${CSS.escape(parent.id)} > ${el.tagName.toLowerCase()}`;
    }
    return null;
  }

  function fingerprint(el, bannerType) {
    const signature = {
      tag: el.tagName.toLowerCase(),
      idTokens: tokenize(el.id),
      classTokens: tokenize(typeof el.className === 'string' ? el.className : ''),
    };
    const raw = [location.hostname, bannerType, signature.tag, signature.idTokens.join('.'), signature.classTokens.join('.')].join('|');
    return { id: `fp_${hashString(raw)}`, signature };
  }

  // ---------------------------------------------------------------------------
  // Investigation pipeline (new popups)
  // ---------------------------------------------------------------------------

  function investigateAndDismiss(el, analysis) {
    state.handled.add(el);
    const startedAt = Date.now();
    const { id, signature } = fingerprint(el, analysis.bannerType);
    if (state.handledFingerprints.has(id)) return;
    state.handledFingerprints.add(id);

    const character = Bananers.getBananerForType(analysis.bannerType);
    const typeInfo = Bananers.BANNER_TYPE_LABELS[analysis.bannerType];
    const plan = chooseStrategy(analysis);
    const selector = buildSelector(el);
    const steps = [];
    const log = (action, detail) => steps.push({ at: Date.now() - startedAt, action, detail });

    log('detected', `${character.name} spotted a ${typeInfo.label.toLowerCase()} (${typeInfo.emoji})`);
    log('classified', `Type: ${typeInfo.label} — position ${analysis.position}, z-index ${analysis.zIndex}, covers ~${analysis.coveragePct}% of the page`);
    log('inspected', `Found ${analysis.buttons.length} clickable control(s)${analysis.backdrop ? ' + a backdrop overlay' : ''}`);
    log('code', `Code check: ${analysis.listeners.join('; ')}`);
    log(
      'strategy',
      plan.button
        ? `Plan: click "${buttonLabel(plan.button)}" (${plan.strategy})`
        : 'Plan: peel the popup right off the DOM'
    );

    const finish = () => {
      if (!el.isConnected && !plan.button) {
        log('done', 'Popup vanished on its own — logged for the archives');
      } else {
        executeDismissal(el, plan, analysis);
        const ms = Date.now() - startedAt;
        log('dismissed', `Popup dismissed in ${ms}ms — new fingerprint learned!`);
        state.sessionDismissals++;
      }
      report({
        id,
        hostname: location.hostname,
        origin: location.origin,
        bannerType: analysis.bannerType,
        characterId: character.id,
        signature,
        selector,
        suppressSelector: selector,
        dismissal: {
          strategy: plan.strategy,
          buttonSelector: plan.button ? buildSelector(plan.button) : null,
          buttonText: plan.button ? buttonLabel(plan.button) : null,
        },
        inspection: {
          position: analysis.position,
          zIndex: analysis.zIndex,
          coveragePct: analysis.coveragePct,
          buttonCount: analysis.buttons.length,
          hasBackdrop: !!analysis.backdrop,
          listeners: analysis.listeners,
        },
        steps,
        recall: false,
        durationMs: Date.now() - startedAt,
      });
    };

    if (state.settings.showCharacter) {
      enqueueAnimation((resolve) => playInvestigation(character, el, steps, finish, resolve));
    } else {
      finish();
    }
  }

  // Recall pipeline: we've met this popup before.
  function recallDismiss(record, el) {
    state.handled.add(el);
    if (state.handledFingerprints.has(record.id)) return;
    state.handledFingerprints.add(record.id);

    const startedAt = Date.now();
    const character = Bananers.getBananerById(record.characterId) || Bananers.getBananerForType(record.bannerType);
    const typeInfo = Bananers.BANNER_TYPE_LABELS[record.bannerType] || Bananers.BANNER_TYPE_LABELS.unknown;
    const wasSuppressed = state.suppressedSelectors.has(record.suppressSelector);
    const steps = [];
    const log = (action, detail) => steps.push({ at: Date.now() - startedAt, action, detail });

    log('recalled', `${character.name} remembered this ${typeInfo.label.toLowerCase()} from a past visit`);
    if (wasSuppressed) log('suppressed', 'Hidden before it could even paint (pre-paint suppression)');

    // Utility first: dismiss immediately, celebrate after.
    let button = null;
    if (record.dismissal && record.dismissal.buttonSelector) {
      try {
        button = el.querySelector(record.dismissal.buttonSelector) || document.querySelector(record.dismissal.buttonSelector);
      } catch (e) {
        button = null;
      }
    }
    executeDismissal(el, { strategy: record.dismissal ? record.dismissal.strategy : 'remove', button }, {
      backdrop: findBackdrop(el),
      isModal: record.inspection ? record.inspection.hasBackdrop || record.inspection.coveragePct >= 40 : true,
    });
    const ms = Date.now() - startedAt;
    log('dismissed', `Dismissed from memory in ${ms}ms — no investigation needed`);
    state.sessionDismissals++;

    report(Object.assign({}, record, { steps, recall: true, durationMs: ms }));

    if (state.settings.showCharacter && !document.hidden) {
      enqueueAnimation((resolve) => playRecall(character, steps, resolve));
    }
  }

  function report(record) {
    try {
      chrome.runtime.sendMessage({ type: 'BANANER_REPORT', record }, () => void chrome.runtime.lastError);
    } catch (e) {
      // Extension context invalidated (e.g. update) — nothing to do.
    }
  }

  // ---------------------------------------------------------------------------
  // Character overlay + animations (isolated in a shadow root)
  // ---------------------------------------------------------------------------

  function enqueueAnimation(fn) {
    state.animationQueue = state.animationQueue.then(
      () => new Promise((resolve) => fn(resolve)),
      () => new Promise((resolve) => fn(resolve))
    );
  }

  function prefersReducedMotion() {
    return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function createOverlay() {
    const host = document.createElement('div');
    host.id = OVERLAY_ID;
    host.style.cssText = `position: fixed; inset: 0; pointer-events: none; z-index: ${MAX_Z};`;
    const root = host.attachShadow({ mode: 'open' });
    const style = document.createElement('style');
    style.textContent = `
      .bananer { position: absolute; font-size: 44px; filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.35)); transition: left 0.7s ease-in-out, top 0.7s ease-in-out, transform 0.3s ease; will-change: left, top, transform; }
      .bananer.walking { animation: bananer-bob 0.35s ease-in-out infinite alternate; }
      .bananer.inspecting { animation: bananer-peer 1s ease-in-out infinite; }
      .bananer.chop { animation: bananer-chop 0.4s ease-in-out; }
      .bananer.exit { animation: bananer-hop 0.6s ease-in forwards; }
      .caption { position: absolute; max-width: 300px; background: #1f2937; color: #fef3c7; border: 2px solid #fbbf24; border-radius: 12px; padding: 8px 12px; font: 600 12px/1.4 -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; box-shadow: 0 4px 12px rgba(0,0,0,0.3); animation: caption-in 0.25s ease-out; }
      .caption::after { content: ''; position: absolute; bottom: -8px; left: 24px; border: 8px solid transparent; border-top-color: #fbbf24; border-bottom: none; }
      .pow { position: absolute; font-size: 40px; animation: pow 0.5s ease-out forwards; }
      @keyframes bananer-bob { from { transform: translateY(0) rotate(-4deg); } to { transform: translateY(-8px) rotate(4deg); } }
      @keyframes bananer-peer { 0%, 100% { transform: scale(1) rotate(0deg); } 50% { transform: scale(1.15) rotate(-8deg); } }
      @keyframes bananer-chop { 0% { transform: rotate(0deg); } 40% { transform: rotate(-35deg) scale(1.2); } 100% { transform: rotate(0deg); } }
      @keyframes bananer-hop { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(-120px); opacity: 0; } }
      @keyframes caption-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
      @keyframes pow { 0% { transform: scale(0.3); opacity: 1; } 100% { transform: scale(1.6); opacity: 0; } }
      @media (prefers-reduced-motion: reduce) { .bananer, .caption, .pow { animation: none !important; transition: none !important; } }
    `;
    root.appendChild(style);
    document.documentElement.appendChild(host);
    return { host, root };
  }

  function placeCaption(root, bananerEl, text) {
    root.querySelectorAll('.caption').forEach((c) => c.remove());
    if (!state.settings.showCaptions) return;
    const caption = document.createElement('div');
    caption.className = 'caption';
    caption.textContent = text;
    const left = parseFloat(bananerEl.style.left) || 20;
    const top = parseFloat(bananerEl.style.top) || window.innerHeight - 120;
    caption.style.left = `${Math.min(Math.max(left - 10, 8), window.innerWidth - 320)}px`;
    caption.style.top = `${Math.max(top - 76, 8)}px`;
    root.appendChild(caption);
  }

  function playInvestigation(character, popupEl, steps, onDismiss, onComplete) {
    if (prefersReducedMotion() || document.hidden) {
      onDismiss();
      onComplete();
      return;
    }
    const { host, root } = createOverlay();
    const bananer = document.createElement('div');
    bananer.className = 'bananer walking';
    bananer.textContent = character.emoji;
    bananer.style.left = '-60px';
    bananer.style.top = `${window.innerHeight - 110}px`;
    root.appendChild(bananer);

    const rect = popupEl.isConnected ? popupEl.getBoundingClientRect() : { left: window.innerWidth / 2, bottom: window.innerHeight / 2, top: window.innerHeight / 2 };
    const targetLeft = Math.min(Math.max(rect.left + 12, 16), window.innerWidth - 80);
    const targetTop = Math.min(Math.max((rect.bottom || rect.top + 80) - 40, 60), window.innerHeight - 110);

    const captionSteps = steps.filter((s) => ['detected', 'classified', 'inspected', 'code', 'strategy'].includes(s.action));
    let i = 0;

    placeCaption(root, bananer, captionSteps.length ? captionSteps[0].detail : `${character.name} on the case!`);
    i = 1;

    setTimeout(() => {
      bananer.style.left = `${targetLeft}px`;
      bananer.style.top = `${targetTop}px`;
    }, 60);

    setTimeout(() => {
      bananer.classList.remove('walking');
      bananer.classList.add('inspecting');
      const interval = setInterval(() => {
        if (i < captionSteps.length) {
          placeCaption(root, bananer, captionSteps[i].detail);
          i++;
        } else {
          clearInterval(interval);
          bananer.classList.remove('inspecting');
          bananer.classList.add('chop');
          const pow = document.createElement('div');
          pow.className = 'pow';
          pow.textContent = '💥';
          pow.style.left = `${targetLeft + 30}px`;
          pow.style.top = `${targetTop - 20}px`;
          root.appendChild(pow);
          onDismiss(); // actual dismissal happens here
          setTimeout(() => {
            const dismissedStep = steps.find((s) => s.action === 'dismissed' || s.action === 'done');
            placeCaption(root, bananer, dismissedStep ? dismissedStep.detail : 'Popup dismissed!');
            bananer.classList.remove('chop');
            bananer.classList.add('exit');
            setTimeout(() => {
              host.remove();
              onComplete();
            }, 1400);
          }, 450);
        }
      }, 850);
    }, 850);
  }

  function playRecall(character, steps, done) {
    if (prefersReducedMotion() || document.hidden) {
      if (done) done();
      return;
    }
    const { host, root } = createOverlay();
    const bananer = document.createElement('div');
    bananer.className = 'bananer chop';
    bananer.textContent = `${character.emoji}`;
    bananer.style.left = '24px';
    bananer.style.top = `${window.innerHeight - 110}px`;
    root.appendChild(bananer);
    const recallStep = steps.find((s) => s.action === 'recalled');
    const speedStep = steps.find((s) => s.action === 'dismissed');
    placeCaption(root, bananer, `🧠 ${recallStep ? recallStep.detail : 'Dismissed from memory!'}`);
    setTimeout(() => {
      placeCaption(root, bananer, speedStep ? speedStep.detail : 'Faster every time!');
      bananer.classList.remove('chop');
      bananer.classList.add('exit');
      setTimeout(() => {
        host.remove();
        if (done) done();
      }, 900);
    }, 1600);
  }

  function playNothingFound() {
    if (prefersReducedMotion() || document.hidden) return;
    const character = Bananers.getBananerById('professor-nana');
    const { host, root } = createOverlay();
    const bananer = document.createElement('div');
    bananer.className = 'bananer walking';
    bananer.textContent = character.emoji;
    bananer.style.left = '24px';
    bananer.style.top = `${window.innerHeight - 110}px`;
    root.appendChild(bananer);
    placeCaption(root, bananer, 'All clear — no popups to dismiss here! 🍌');
    setTimeout(() => {
      bananer.classList.remove('walking');
      bananer.classList.add('exit');
      setTimeout(() => host.remove(), 900);
    }, 2200);
  }

  // ---------------------------------------------------------------------------
  // Messages from the toolbar popup / background
  // ---------------------------------------------------------------------------

  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    if (message.type === 'BANANER_DEPLOY_NOW') {
      const result = scan(true);
      if (result.found === 0) {
        enqueueAnimation((resolve) => {
          playNothingFound();
          setTimeout(resolve, 100);
        });
      }
      sendResponse({ ok: true, found: result.found, sessionDismissals: state.sessionDismissals });
      return true;
    }
    if (message.type === 'BANANER_TAB_STATUS') {
      sendResponse({ active: true, enabled: state.settings.enabled, sessionDismissals: state.sessionDismissals });
      return true;
    }
    if (message.type === 'BANANER_SETTINGS_UPDATED') {
      state.settings = Object.assign(state.settings, message.settings || {});
    }
    if (message.type === 'PREFERENCES_UPDATED') {
      state.legacyPreferences = message.preferences || state.legacyPreferences;
    }
  });
})();
