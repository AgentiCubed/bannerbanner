# BannerBanner status

Last updated: 2026-08-03  
Code baseline reviewed: `main` at `8d20396` plus the v0.1 hardening branch  
Operating pack: committed to `main` on 2026-08-02

## Current Project

BannerBanner v0.1, Safe Chrome Private Beta.

## Current Mode

Release hardening and scope correction.

## Current truth

The v0.1 hardening branch (issues #24–#31, plus the automatable parts of #32)
replaces the alpha runtime:

- No static content scripts remain; access is per-origin, dynamically
  registered, reconciled against actual grants, and revocable (with a stop
  signal to open tabs).
- One awaited consent pipeline (`extension/lib/pipeline.js`) owns detect →
  classify → decide → execute → verify → report. The second engine
  (`bananer.js`) and the alpha `content.js` engine were removed.
- Unknown and sensitive dialogs receive no action of any kind; each protected
  class has a fixture regression.
- Consent success requires the CMP's own postcondition (site-written consent
  signal + banner teardown by the site). All DOM-removal/hiding fallbacks are
  gone.
- `chrome.storage.local` is the sole runtime store, with a versioned schema,
  legacy migration, corruption recovery, and reset. Spark KV is not used by
  the extension. Training/sharing/Learn-dashboard UI was removed from the
  shipped package.
- Storage holds bounded aggregate counters only; nothing browsing-derived
  enters sync storage; legacy URL-bearing history is purged on update. The
  privacy policy was rewritten to the observed schema.
- Icons exist (generated reproducibly), the manifest references only real
  files, the build packages only runtime files, validates strictly, and emits
  an inventory plus an archive hash.
- CI (`.github/workflows/extension-ci.yml`) runs syntax checks, 70 unit
  tests, icon reproducibility, build + strict package validation, and 33
  real-Chromium integration tests (permission boundary with the built
  extension loaded; CMP/sensitive/unknown fixtures against the shipped
  runtime modules).

## Next Shippable Artifact

Issue #32 execution: run `docs/REAL_SITE_TEST_PROTOCOL.md` against the 29
pre-filled candidate rows in `docs/REAL_SITE_TEST_MATRIX.md` (requires a
human at a browser), then the final claim-to-code audit of the legacy
planning documents (PRD and the alpha-era summaries still overstate
capabilities).

## Blocking Release Gate

`PB-11: Real-site acceptance` (requires human browser evidence). Gates PB-01
through PB-10 have automated evidence linked in `docs/RELEASE_GATES.md` and
await James's confirmation runs before their boxes are checked.

## Known blockers

- The Chrome permission-grant prompt cannot be automated; grant/denial/revoke
  user flows need manual matrix rows.
- No real-site evidence yet; CMP support claims stay "candidate" until then.
- PRD.md and other alpha-era documents still contain outdated claims (PB-12
  is only partially closed).

## Parking Lot

- Newsletter and advertisement removal.
- Generic popup agents.
- User pattern training.
- Community pattern sharing.
- Spark dashboard integration.
- Granular consent categories.
- Firefox and other browser support.
- Remote telemetry, accounts, or synchronization.
- Bananer characters, Learn dashboard, and animation polish (removed from the
  shipped package in this change; code remains in git history).
- Quantcast Choice "Necessary only" support (needs a settings-panel adapter;
  see BB-013).

## Latest handoff

- Artifact shipped: issue #32 preparation — `docs/REAL_SITE_TEST_PROTOCOL.md`
  (step-by-step manual procedure covering per-site rows, the
  permission-boundary walkthrough, sensitive-dialog spot checks, storage
  inspection, and evidence rules) and 29 pre-filled candidate rows in
  `docs/REAL_SITE_TEST_MATRIX.md` with adapter-derived expected controls and
  postconditions. Docs only; no runtime changes. The v0.1 runtime rewrite
  (#24–#31) merged to `main` in PR #36 with CI green.

Previous handoff (PR #36):

- Artifact shipped: v0.1 permission-boundary, single-pipeline, verified-consent
  rewrite of the extension runtime with tests, CI, packaging, and aligned
  privacy/docs (issues #24–#31; #32 partially).
- Files or behavior changed: `extension/` rewritten (manifest, background,
  content, popup, new options page, new `lib/` modules); `bananer.js`,
  `bananer-characters.js`, `learn.*`, `test-page.html` removed;
  `scripts/generate-icons.mjs` and `scripts/validate-package.mjs` added;
  `.github/workflows/extension-ci.yml` added; README, extension README,
  privacy policy, decisions (BB-013, BB-014), release gates, and this file
  updated.
- Checks passed: 70/70 unit tests; 24/24 pipeline browser tests and 9/9
  boundary browser tests in local Chromium; build + strict package validation
  pass; icons reproduce byte-identically.
- Manual evidence: none yet — real-site and grant-prompt flows are the next
  artifact.
- Remaining uncertainty: real-CMP behavior on live sites (fixtures mimic each
  CMP's DOM and consent signals but are not the real deployments); Web Store
  dashboard answers; PRD claim audit.
- Release gate changed: PB-01…PB-10 evidence fields now link automated proof
  (checkboxes intentionally left for James); PB-12 and WS-02 marked partial.
- Next shippable artifact: completed `docs/REAL_SITE_TEST_MATRIX.md` rows and
  the final claim audit (issue #32).

## Session handoff template

At the end of a meaningful session, replace this section's values:

- Artifact shipped:
- Files or behavior changed:
- Checks passed:
- Manual evidence:
- Remaining uncertainty:
- Release gate changed:
- Next shippable artifact:
