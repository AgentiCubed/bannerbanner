# 🍌 Bananers — Popup-Dismissing Learning Companions

Deploy a bananer — one of a roster of anthropomorphized banana characters — to
investigate an annoying third-party popup inside and out (UI and code): cookie
consent modals, newsletter interstitials, ad takeovers. The bananer dismisses
the popup in character and **remembers how** — so on your next visit the popup
is gone before you ever see it. Unless you enjoyed the show — per-type
"keep showing me these" toggles let you keep a popup type around purely to
watch your bananer deal with it.

A real Manifest V3 browser extension. No build step, no dependencies:
`extension/` loads as-is.

## Design docs

- [Core design](docs/DESIGN.md) — fingerprinting & storage schema, the
  document_start "cloak, then close" suppression mechanism,
  content-script/dashboard split, character framework, Banana God policy seam
- [Implementation plan](docs/IMPLEMENTATION_PLAN.md)
- [Lifecycle theming](../docs/bananers-theming-design.md) — the ripeness
  slider, six stages, the AA guarantee
- [Lore & voice](../docs/bananers-lore-design.md) — canon, tone guardrails,
  string architecture

## Run it in Chrome

1. `chrome://extensions` → enable **Developer mode**
2. **Load unpacked** → select `bananers/extension/`
3. Visit a site with a popup — or open `test-pages/cookie-banner.html` /
   `test-pages/newsletter-modal.html`, served over http (e.g.
   `python3 -m http.server`; content scripts don't run on `file://` by
   default). Click the 🍌 toolbar icon, pick a bananer, **Deploy**. First
   deploy on a site asks for that site's permission only — nothing runs
   anywhere you haven't opted in (the deploy *is* the opt-in).
4. Reload the page: the popup never appears — it was learned.
5. Open the **Learn dashboard** (options page) for the roster, the per-site
   memory browser, replays, per-type "keep the show" toggles, and the
   ripeness slider.

The five bananers: **Peel Noir** (DOM detective — picks the lock),
**Splitsu** (ninja — slices overlay & backdrop), **Glitch** (hacker — event
protocols & Escape), **Bruce Bananer** (brute — ranked clicks), **Frost
Peel** (forensics — CSS deep freeze). None of them ever click "Accept".

## Tests

End-to-end against real Chromium (uses the `playwright` package, local or
global):

```bash
node bananers/test/run-tests.mjs
```

Loads the extension headless, drives three synthetic banner pages, and
asserts the whole contract: learning, safe dismissal (site records
*rejected* consent), pre-paint suppression on revisit, one-time micro-prompt,
per-type opt-in, scroll unlock, dashboard rendering — 36 assertions.

Unit tests are zero-dependency, pure `node:test`:

```sh
node --test bananers/tests/
```

Covers fingerprint hashing/fuzzy matching, detection scoring/classification,
the policy seam (including the Banana God hook), the **AA contrast sweep
across every slider position**, and the lore-guardrail lint over every
user-facing string.

## Regenerate icons

```bash
node bananers/tools/make-icons.mjs
```

## Architecture notes

- **Zero-build**: plain ES modules everywhere; content scripts dynamically
  `import(chrome.runtime.getURL(...))`. No bundler, no `node_modules`.
- **Opt-in scoping**: automatic handling only runs on origins where you've
  deployed a bananer at least once. Production path for store review —
  `optional_host_permissions` + per-origin registered content scripts — is
  documented in the core design doc, not yet built.
- **Honesty**: "before you see it" = hide-CSS at `document_start` + real
  dismissal moments later. Listener inspection is a legitimate census (inline
  handlers, clickable elements), not devtools magic. No anti-adblock bypass.
- **Banana God**: not implemented — only the policy hook it will one day
  plug into, per spec.
