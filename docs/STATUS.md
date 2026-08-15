# BannerBanner status

Last updated: 2026-08-15  
Code baseline reviewed: `main` at `3981fdb` with issue #32 documentation/provenance work merged on top  
Operating pack: committed to `main` on 2026-08-02

## Current Project

BannerBanner v0.1, Safe Chrome Private Beta.

## Current Mode

Release hardening — PB-12 closed; PB-11 real-site evidence still human-gated.

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
- Issue #32 added the claim-to-code audit, release notes, release provenance
  record, Store-copy alignment, and the PB-11 matrix/protocol scaffolding. The
  live real-site rows still require a human browser run.

## Next Shippable Artifact

Human execution of `docs/REAL_SITE_TEST_PROTOCOL.md` against the 33 candidate
rows covering 20 distinct origins in `docs/REAL_SITE_TEST_MATRIX.md` (including the permission
walkthrough/revocation checks), then a tagged gates-green build with the final
WS-04 provenance row.

## Blocking Release Gate

`PB-11: Real-site acceptance` (requires human browser evidence). `PB-12` is
closed; `WS-01` and `WS-04` now have repository evidence prepared but still
need submission-time/dashboard finalization.

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

- Artifact shipped: PR #39 review fixes — honest candidate wording, enough
  distinct PB-11 site candidates, durable evidence requirements, complete
  alpha-storage cleanup, and project-specific private vulnerability reporting.
- Files or behavior changed: updates now purge all five alpha local keys and
  all five legacy sync keys; focused lifecycle coverage added. User/security
  docs and the PB-11 matrix/protocol were corrected; no consent pipeline,
  permissions, or supported-dialog behavior changed.
- Checks passed: focused update-migration tests and JavaScript syntax checks;
  final repository checks pending.
- Manual evidence: reviewed the historical alpha `bananer.js` storage writes
  against the cleanup inventory and inspected all eight review threads.
- Remaining uncertainty: PB-11 live-site evidence, manual permission flows,
  WS-03 screenshots, and the final tagged-build provenance row.
- Release gate changed: none closed. PB-11 still requires 20–30 distinct
  completed origins with durable evidence; the candidate matrix now has enough
  distinct origins to meet that criterion after its two placeholders are
  selected.
- Next shippable artifact: human execution of
  `docs/REAL_SITE_TEST_PROTOCOL.md`, then final WS-04 tagged-build recording.

Previous handoff:

- Artifact shipped: merge-conflict resolution for the issue #32 PR while
  preserving both sets of truthful v0.1 documentation: `main`'s rewritten
  legacy planning docs plus this branch's claim audit, release provenance,
  Store-copy, and matrix evidence scaffolding.
- Files or behavior changed: resolved conflicts in `PRD.md`,
  `COMPLETE_PICTURE.md`, `ITERATION_6_SUMMARY.md`, `PROJECT_STATUS.md`,
  `docs/RELEASE_GATES.md`, and this file; the merge also brought forward
  `main`'s non-conflicting updates to `MVP_ASSESSMENT.md`, `package.json`,
  and `package-lock.json`. No extension runtime files under `extension/`
  changed.
- Checks passed: merge state resolved cleanly; `git diff --check` and a
  repository scan for conflict markers both pass; `npm run build:extension`
  passes; `npm run lint` passes with 7 pre-existing fast-refresh warnings.
- Manual evidence: none; merge result inspected against `origin/main` and the
  issue #32 branch state.
- Remaining uncertainty: PB-11 live-site evidence, manual permission flows,
  WS-03 screenshots, the final tagged-build provenance row, and one current
  transitive `nanoid` advisory reported by `npm audit` from the merged main
  dependency tree.
- Release gate changed: none materially. `PB-12` remains closed; `PB-11`
  remains open; `WS-01`/`WS-04` evidence remains recorded in-repo.
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
