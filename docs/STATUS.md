# BannerBanner status

Last updated: 2026-08-22  
Code baseline reviewed: `main` at `218b902`; deterministic icon release baseline under review in draft PR #57 (`4e3ced2`)  
Operating pack: committed to `main` on 2026-08-02

## Current Project

BannerBanner v0.1, Safe Chrome Private Beta.

## Current Mode

Release hardening — cross-platform release reproducibility in draft PR #57; PB-11 real-site evidence remains human-gated.

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
  enters sync storage; all alpha-era local knowledge/history and sync data are
  purged on install and update. The privacy policy was rewritten to the
  observed schema.
- Icons exist and retain identical decoded pixels. Draft PR #57 replaces
  host-zlib compression with explicit stored-DEFLATE bytes and enforces
  regeneration on Ubuntu and macOS with Node 22. The manifest references only
  real files, and the strict build emits a runtime-only inventory plus an
  archive hash.
- Issue #32 added the claim-to-code audit, release notes, release provenance
  record, Store-copy alignment, and the PB-11 matrix/protocol scaffolding. The
  live real-site rows still require a human browser run.

## Next Shippable Artifact

Complete review of draft PR #57's deterministic icon and release-candidate
baseline against one final head SHA. After its cross-platform icon, lint, unit,
browser, build, and validation evidence is green and James separately
authorizes merge, freeze that candidate and execute
`docs/REAL_SITE_TEST_PROTOCOL.md` against the 29 candidate rows covering 20
concrete distinct origins.

## Blocking Release Gate

`PB-11: Real-site acceptance` (requires human browser evidence). PB-09 and
PB-10 evidence is being strengthened by draft PR #57, but neither gate is
closed. `PB-12` is closed; `WS-01` and `WS-04` have repository evidence
prepared but still need submission-time/dashboard finalization.

## Known blockers

- The Chrome permission-grant prompt cannot be automated; grant/denial/revoke
  user flows need manual matrix rows.
- Agent/CI hosts cannot resolve the external sites needed for PB-11; live real
  CMP evidence must be gathered on a human desktop browser.
- CMP support claims stay "candidate" until the live rows pass.
- WS-03 screenshots are not yet captured.
- WS-04 still needs the final tagged-build hash on a gates-green commit.

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
  shipped package; code remains in git history).
- Quantcast Choice "Necessary only" support (needs a settings-panel adapter;
  see BB-013).

## Latest handoff

- Artifact shipped: PR #58 — Vite 8.2.1 dependency-tree upgrade with compatible
  plugins.
- Files or behavior changed: `package.json` / `package-lock.json` now move the
  app build to Vite 8.2.1, `@tailwindcss/vite` 4.3.3,
  `@vitejs/plugin-react-swc` 4.3.3, `tailwindcss` 4.3.3, and safe
  `postcss`/`nanoid` overrides; `@github/spark` is now a local compatibility
  package at `packages/github-spark/` that vendors 0.46.15 and broadens only
  its Vite peer range to include Vite 8; `tailwind.config.js` removes three
  unused raw screen aliases that broke Tailwind 4 CSS minification during
  `vite build`.
- Checks passed: `npm install`; `npm ls vite @github/spark @tailwindcss/vite
  @vitejs/plugin-react-swc`; `npm audit` (0 vulnerabilities); `npm run build`.
- Manual evidence: the built app bundle was generated locally with the vendored
  Spark compatibility package and the upgraded Vite/Tailwind stack.
- Remaining uncertainty: the vendored `@github/spark` compatibility package
  should be dropped once upstream publishes official Vite 8 peer support; CI on
  the final PR head is still required before this evidence can close PB-10.
- Release gate changed: none closed. PB-10 evidence is strengthened for the app
  toolchain, but the checkbox remains open pending CI; PB-11 is unchanged.
- Next shippable artifact: GitHub CI confirmation for this dependency upgrade,
  then the existing release-hardening path remains unchanged (final candidate
  freeze and human execution of `docs/REAL_SITE_TEST_PROTOCOL.md`).

Previous handoff (PR #57):

- Artifact in review: draft PR #57 — cross-platform deterministic icon
  generation and release-candidate baseline.
- Files or behavior changed: `scripts/generate-icons.mjs` now writes an
  explicit RFC 1950 stream with stored RFC 1951 DEFLATE blocks; the four PNGs
  were regenerated with identical decoded pixels; Extension CI now checks
  byte reproduction on Ubuntu and macOS with Node 22. No extension runtime or
  CMP behavior changed.
- Checks passed locally: generator syntax; 71/71 unit tests; strict 21-file
  build and package validation; source-tree validation; PNG decode; identical
  before/after pixel hashes; identical file hashes across two generations;
  `git diff --check`. Diagnostic archive SHA-256:
  `9f26e883c439fd0218372eac7c8ef4147582fd27b16434b6eb05487062f88c74`.
- Independent evidence required: the GitHub Actions results on the final PR
  head for Ubuntu/Node 22, macOS/Node 22, browser integration, and repo-wide
  lint. The PR remains draft until those checks are green.
- Manual evidence: none; this artifact is automated release hardening and does
  not substitute for PB-11.
- Remaining uncertainty: fresh-profile loading, permission lifecycle, and all
  live-site rows remain human work after a candidate is frozen.
- Release gate changed: none. PB-09 and PB-10 evidence is expanded but their
  checkboxes remain open; PB-11 is unchanged.
- Next shippable artifact after this PR passes and James authorizes merge:
  human execution of `docs/REAL_SITE_TEST_PROTOCOL.md`, subject to a new
  authorization gate.

Previous handoff (PR #50):

- Artifact shipped: PR #39 review corrections — honest candidate labels,
  a 20-distinct-origin PB-11 candidate set with durable evidence rules,
  BannerBanner-specific private vulnerability reporting, and complete
  alpha-storage cleanup on update.
- Files or behavior changed: `extension/background.js` now removes all legacy
  local knowledge/history keys and sync keys on install and update, with focused
  coverage in `extension/test/unit/background.test.mjs`; `USER_GUIDE.md`,
  `SECURITY.md`, `DOCUMENTATION_INDEX.md`, the real-site matrix/protocol, and
  release-gate evidence were aligned to the review.
- Checks passed: 71/71 unit tests; 33/33 browser integration tests; `npm run
  lint` with 0 errors and 7 pre-existing fast-refresh warnings; `npm run
  build:extension` and strict 21-file package validation; `git diff --check`.
- Manual evidence: the service-worker update lifecycle test was exercised with
  seeded URL-bearing alpha local/sync data; the matrix was counted at 20
  concrete unique origins. No live-site browser testing occurred.
- Remaining uncertainty: PB-11 live-site evidence, manual permission flows,
  WS-03 screenshots, the final tagged-build provenance row, and one current
  transitive high-severity advisory reported by `npm audit` from the existing
  dependency tree.
- Release gate changed: none closed. PB-08 evidence now covers complete legacy
  cleanup; PB-11 remains open and explicitly requires 20–30 distinct origins
  with durable accessible evidence.
- Next shippable artifact: human execution of
  `docs/REAL_SITE_TEST_PROTOCOL.md`, then final WS-04 tagged-build recording.

Previous handoff:

- Artifact shipped: PB-12 documentation reconciliation — `PRD.md`,
  `ITERATION_6_SUMMARY.md`, `MVP_ASSESSMENT.md`, `PROJECT_STATUS.md`, and
  `COMPLETE_PICTURE.md` rewritten to describe only the shipped v0.1 Manifest
  V3 extension. All alpha-era claims of a pattern training wizard, community
  sharing, granular consent categories, or a learning system were removed;
  each document now points to the operating pack
  (`docs/MVP_CONTRACT.md`, `docs/DECISIONS.md`, `docs/RELEASE_GATES.md`,
  this file) as canonical.
- Files or behavior changed: the five legacy documents above, this file, and
  the PB-12 row in `docs/RELEASE_GATES.md`. Docs only; no code changed;
  `extension/` is untouched.
- Checks passed: 70/70 unit tests, `npm run lint` 0 errors,
  `npm run build:extension` + strict package validation pass,
  `git diff --stat` confirms no `extension/` changes.
- Manual evidence: the diff is the record.
- Remaining uncertainty: none for PB-12 within the repository; external
  copy (e.g. future Web Store listing) is covered separately by WS-01/WS-02.
- Release gate changed: PB-12 closed (checkbox checked in
  `docs/RELEASE_GATES.md` at James's direction, 2026-08-15).
- Next shippable artifact: issue #32 execution — the real-site test matrix
  rows (PB-11).

Previous handoff (PR #37):

- Artifact shipped: repo-wide eslint in CI on top of the merged v0.1
  hardening rewrite: flat eslint config for eslint 10 (`eslint.config.js`
  covering `src/`, the ES-module extension runtime, `scripts/`, and both test
  suites), `.github/workflows/lint.yml`, and a clean `npm audit`.
- Files or behavior changed: `eslint.config.js` and `.github/workflows/lint.yml`
  added; 27 lint errors fixed in `src/` (unused bindings/imports, typing
  cleanups — no behavior changes) and 3 in the rewritten runtime/tooling
  (`lib/dom-probe.js` useless assignment, unused test arg, unused import in
  `validate-package.mjs`); `package.json` security overrides bumped
  (`postcss` 8.5.25, `minimatch` 3.1.5) plus `npm audit fix`, taking audit
  findings from 4 to 0. Runtime behavior is unchanged; the merge kept main's
  v0.1 runtime (including the deletion of `bananer.js`) intact.
- Checks passed: `npm run lint` exits 0 (7 warnings, all the stock shadcn
  fast-refresh warning); 70/70 unit tests; `npm audit` 0 vulnerabilities;
  `npm run build` passes.
- Manual evidence: Command output verified in the PR #37 session; the diff is
  the record.
- Remaining uncertainty: the lint workflow has not yet run on GitHub-hosted
  runners (first run happens on this PR); `npm audit` is clean locally but is
  deliberately not a CI check. The pre-existing `tsc --noEmit` errors in `src/`
  (lucide-react deep imports) are untouched.
- Release gate changed: None closed; PB-10 evidence extended with the
  repo-wide eslint CI workflow.
- Next shippable artifact: unchanged — issue #32 execution (run
  `docs/REAL_SITE_TEST_PROTOCOL.md` against the matrix rows) and the final
  claim audit.

Previous handoff (PR #38, issue #32 prep):

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
