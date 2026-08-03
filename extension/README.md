# BannerBanner extension (v0.1)

The Chrome (Manifest V3) extension. v0.1 does one thing: apply your
cookie-consent choice on sites you explicitly enable, when a supported
consent-management platform is present, with the result verified before it is
ever counted as a success.

## Architecture

```
manifest.json          MV3 manifest — NO static content scripts, no default host access
background.js          Service worker: origin registry + dynamic script registration,
                       settings, bounded aggregate stats
content.js             Tiny bootstrap, registered per-origin at runtime only
popup.html/js          Toolbar popup: per-site enable/disable, mode, quick stats
options.html/js        Options page: modes, enabled sites, stats, reset
lib/                   Shared ES modules (the unit-tested core):
  origins.js             origin normalization + match patterns
  settings-schema.js     versioned settings, defaults, migration, recovery
  stats.js               bounded aggregate counters (no URLs, no history)
  classify.js            cookie / sensitive / unknown classification
  cmp-adapters.js        allowlisted CMP adapters with verified postconditions
  pipeline.js            THE single consent pipeline (detect→classify→decide→
                         execute→verify→report)
  registry.js            dynamic-registration reconciliation planning
  dom-probe.js           the only DOM-touching layer
  content-runtime.js     content-side engine wiring
  celebrate.js           post-verified-success animation only
```

### The permission boundary

There are no static content scripts. The only way BannerBanner runs on a site:

1. The user clicks **Enable on this site** in the popup.
2. Chrome shows its permission prompt for that single origin.
3. On grant, the service worker records the origin in the canonical registry
   (`chrome.storage.local`, key `bb:authorizedOrigins`) and registers the
   content script for exactly that origin with
   `chrome.scripting.registerContentScripts()`.

Registrations are reconciled on install, startup, update, and permission
changes; the effective set is always *(registry ∩ currently granted origins)*,
so a stale registry entry or an extension update can never broaden access.
Revoking a site unregisters the script, removes the permission, and signals
open tabs on that origin to stop.

### The safety line

- Unknown dialogs get **no** click, removal, hiding, style mutation, or
  synthetic event.
- Login, checkout, payment, security, age-gate, session-expiration, and
  unsaved-work dialogs are classified sensitive and never touched.
- Newsletter and advertisement overlays are out of scope in v0.1.
- DOM removal is never a success: an outcome counts as success only when the
  adapter's own postcondition (the CMP's consent cookie / storage write plus
  the CMP tearing down its banner) verifies after clicking the intended
  control.
- The celebration animation plays only after a verified success.

## Commands

```bash
# Unit tests (pure logic, no dependencies)
npm run test:extension

# Build + validate the package (fatal on missing files) → dist-extension/
npm run build:extension

# Validate the source-tree manifest
npm run validate:extension

# Browser integration tests (real Chromium; installs playwright-core locally)
cd extension/test/browser && npm install && npm test

# Regenerate icons deterministically
node scripts/generate-icons.mjs
```

## Testing

- `test/unit/` — `node --test` suites for origins, settings schema, stats,
  classification, adapters, pipeline (including the one-action-per-banner and
  race guarantees), and registration reconciliation.
- `test/browser/specs/boundary.spec.mjs` — loads the **built extension** into
  Chromium: clean install executes nothing anywhere, registers nothing,
  initializes the versioned schema, keeps sync storage empty, and even a
  registered script does not run without a granted permission.
- `test/browser/specs/pipeline.spec.mjs` — runs the real runtime modules
  against CMP fixtures (both modes per claimed CMP) and against every
  protected dialog class, asserting byte-identical dialogs and zero clicks.
- `test/browser/fixtures/` — one fixture per supported CMP (cooperative and
  unresponsive variants) and per protected class.

What automation cannot cover: Chrome's native permission-grant prompt. The
grant/revoke user flows and real-site behavior are recorded manually in
`docs/REAL_SITE_TEST_MATRIX.md`.

## Supported CMPs (launch candidates)

| CMP | Necessary only | Accept all |
|---|---|---|
| OneTrust | ✓ | ✓ |
| Cookiebot | ✓ | ✓ |
| CookieYes | ✓ | ✓ |
| Usercentrics | ✓ | ✓ |
| Quantcast Choice | — (unsupported in v0.1) | ✓ |

"✓" means an adapter with an exact intended control and a verified
postcondition exists and passes fixture tests. Real-site verification is
tracked in `docs/REAL_SITE_TEST_MATRIX.md`; a CMP is only *claimed* publicly
once both its modes pass there.
