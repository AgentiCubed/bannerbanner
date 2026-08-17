# BannerBanner status

Last updated: 2026-08-17
Code baseline reviewed: pre-R2 candidate
`6f8255baf9efdd2e86f421a468e733dc189b3b92`
Operating pack: committed to `main` on 2026-08-02

## Current Project

BannerBanner v0.1, Safe Chrome Private Beta.

## Current Mode

Release hardening — deterministic pre-R2 candidate validated locally; exact-SHA
CI and PB-11 real-site evidence remain open.

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
  an inventory plus a deterministic archive and portable checksum.
- Update lifecycle regressions now prove current settings/authorized grants
  persist while stale revoked registrations cannot return.
- Issue #32 added the claim-to-code audit, release notes, release provenance
  record, Store-copy alignment, and the PB-11 matrix/protocol scaffolding. The
  live real-site rows still require a human browser run.
- The Run R2 protocol now freezes one candidate, requires exact-SHA CI, tests
  post-revoke restart/update behavior, and records fresh-profile,
  package/storage, real-flow safety, and gate-specific evidence.
- Web Store asset guidance now matches v0.1 and no longer contains alpha-era
  training/theme claims or a remote JSZip loader.

## Next Shippable Artifact

Green Extension CI and Lint runs for the frozen candidate, followed by human
execution of `docs/REAL_SITE_TEST_PROTOCOL.md` against the 29 candidate rows
(including permission, post-revoke, storage, and fresh-profile checks).

## Blocking Release Gate

`PB-11: Real-site acceptance` (requires human browser evidence). `PB-12` is
closed; candidate CI evidence, all Web Store dashboard actions, and final
tagged provenance also remain pending.

## Known blockers

- The Chrome permission-grant prompt cannot be automated; grant/denial/revoke
  user flows need manual matrix rows.
- No Extension CI or Lint workflow run exists yet at candidate `6f8255b`;
  trigger both through a PR, manual dispatch, or candidate tag before Run R2.
- Live real CMP evidence must be gathered on a networked human desktop Chrome
  profile.
- CMP support claims stay "candidate" until the live rows pass.
- WS-03 screenshots are not yet captured.
- The private repository's support/privacy URLs return 404 while signed out;
  James must publish public endpoints before WS-02/WS-03 can close.
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

- Artifact shipped: evidence-ready pre-R2 candidate and release execution
  hardening.
- Files or behavior changed: release workflows gained manual/tag triggers;
  background lifecycle tests cover authorized and revoked update behavior;
  package ZIP output is deterministic with a portable checksum; Run R2 now has
  exact candidate/CI, post-revoke, package/storage, and gate reconciliation
  records; Store asset copy/checklists were aligned to v0.1.
- Checks passed at candidate `6f8255b`: 73/73 extension unit tests, 33/33
  browser tests, `npm run lint` with 0 errors and 7 pre-existing fast-refresh
  warnings, source/strict package validation, 21-file inventory, and two
  consecutive archives with SHA-256
  `7f74e24eff2ef4f7facf0398f5c7dcb3a7f571569512128190829c129aefe464`.
- Manual evidence: none. Signed-out checks showed the private repository's
  proposed support/privacy URLs return 404; they were recorded as owner
  actions rather than claimed complete.
- Remaining uncertainty: exact-SHA GitHub workflow runs, all Run R2 live-site
  and permission evidence, WS-03 visual assets, public support/privacy URLs,
  dashboard confirmations, and final tagged-build provenance.
- Release gate changed: none. PB-11 and all human/dashboard-dependent evidence
  remain open.
- Next shippable artifact: exact-SHA candidate CI, then human Run R2 evidence.

Previous handoff (PR #39):

- Artifact shipped: review fixes for candidate-only public CMP claims, PB-11
  unique-site/evidence rules, complete alpha-storage cleanup, authority
  ordering, provenance verification, and the misleading security-policy index
  entry.
- Files or behavior changed: extension updates purge all five legacy local keys
  plus legacy sync keys while preserving safely migrated settings;
  `extension/test/unit/background.test.mjs` covers the update lifecycle. The
  user guide, matrix/protocol, PRD, documentation index, and release-gate
  evidence match the review requirements.
- Checks passed: 71/71 extension unit tests; `npm run lint` with 0 errors and 7
  pre-existing fast-refresh warnings; `npm run build:extension` with strict
  21-file package validation; `git diff --check`.
- Manual evidence: matrix audit confirms 29 rows resolve to 20 unique sites;
  the user-guide table contains candidate/fixture wording rather than
  unconditional support; the sample provenance hash is present in
  `docs/RELEASE_PROVENANCE.md`.
- Remaining uncertainty: PB-11 live-site evidence, manual permission flows,
  WS-03 screenshots, and the final tagged-build provenance row.
- Release gate changed: none. PB-08 evidence includes the alpha-storage purge
  regression; PB-11 remains open and explicitly counts distinct origins.
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
