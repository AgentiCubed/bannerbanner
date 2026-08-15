# BannerBanner release gates

A gate is closed only when its checkbox is checked and its Evidence field points to reproducible proof. Code presence, a generated report, or a completion percentage is not evidence by itself.

## Safe Chrome private beta

- [ ] **PB-01: Genuine per-origin opt-in**
  - A clean install does not inject or execute BannerBanner on arbitrary websites.
  - Access begins only after explicit origin authorization.
  - Evidence: Automated: `extension/test/browser/specs/boundary.spec.mjs` (clean install executes nothing, registers nothing; a registered script without a grant still does not run) and `extension/test/unit/registry.test.mjs`. Pending: manual grant-flow run recorded in the matrix.

- [ ] **PB-02: Complete revocation**
  - Removing an origin prevents future injection and stops BannerBanner activity in already-open matching tabs.
  - Restart and extension update do not restore revoked access.
  - Evidence: Automated: `extension/test/unit/registry.test.mjs` (revocation/unregistration planning, update cannot broaden) and the BB_STOP test in `extension/test/browser/specs/pipeline.spec.mjs`. Pending: manual revoke-flow run recorded in the matrix.

- [ ] **PB-03: Verified supported-CMP decisions**
  - Each claimed CMP and each supported mode activates the intended control.
  - Success is recorded only after an adapter-specific postcondition passes.
  - Evidence: Automated: `extension/test/unit/cmp-adapters.test.mjs` and CMP fixture cases in `extension/test/browser/specs/pipeline.spec.mjs` (success requires the site-written consent signal; no DOM-removal path exists). Pending: real-site rows in the matrix.

- [ ] **PB-04: Unknown dialogs fail closed**
  - Unknown dialogs receive no click, removal, hiding, style mutation, or synthetic event.
  - The user receives an understandable unsupported status.
  - Evidence: Automated: unknown-dialog cases in `extension/test/unit/pipeline.test.mjs` and `unknown-modal`/`newsletter`/`ad-overlay` fixtures in `extension/test/browser/specs/pipeline.spec.mjs` (byte-identical dialogs, zero clicks, honest unsupported status).

- [ ] **PB-05: Sensitive workflows remain untouched**
  - Login, checkout, payment, security, age-verification, session-expiration, and unsaved-work dialogs pass the regression suite without modification.
  - Any destructive false positive reopens this gate.
  - Evidence: Automated: `extension/test/unit/classify.test.mjs` plus one fixture regression per protected class in `extension/test/browser/specs/pipeline.spec.mjs` (matrix sensitive section marked Pass for fixtures). Pending: optional real-flow spot checks in the matrix protocol.

- [ ] **PB-06: One awaited consent pipeline**
  - One engine owns detection, decision, execution, verification, and reporting.
  - Settings load before scanning.
  - A banner cannot receive duplicate or competing actions.
  - Evidence: Automated: `extension/test/unit/pipeline.test.mjs` (single engine, settings awaited, duplicate/race guards) and the awaited-settings and one-action browser tests in `pipeline.spec.mjs`. The second engine was removed in this change.

- [ ] **PB-07: Shipped settings control shipped behavior**
  - The options UI writes versioned `chrome.storage` settings consumed by the content script.
  - The two v0.1 modes persist across reload, browser restart, and extension update.
  - Evidence: Automated: `extension/test/unit/settings-schema.test.mjs` (versioned schema, migration, corruption recovery) and the options-UI persistence test in `boundary.spec.mjs`. Pending: manual restart/update verification.

- [ ] **PB-08: Data handling matches the contract**
  - Normal use stores no full URL, path, query string, title, content, or chronological browsing history.
  - Browsing-derived data does not enter sync storage.
  - The privacy policy describes the observed schema and behavior.
  - Evidence: Automated: `extension/test/unit/stats.test.mjs` (schema cannot express URLs or history) and the empty-sync-storage test in `boundary.spec.mjs`; privacy policy rewritten to the observed schema (`extension/PRIVACY_POLICY.md`).

- [ ] **PB-09: Complete extension package**
  - Every manifest resource exists.
  - Missing required files fail the build.
  - The packaged directory contains only required runtime assets and loads without errors in a fresh profile.
  - Evidence: Automated: `scripts/validate-package.mjs` (missing files fatal, strict inventory) run inside `extension/build-extension.sh` and CI; icons committed and reproducible. Pending: fresh-profile manual load check.

- [ ] **PB-10: Automated release checks**
  - Build, lint, unit, browser integration, manifest, and package checks run in CI and pass.
  - Safety regressions are required checks.
  - Evidence: Automated: `.github/workflows/extension-ci.yml` runs syntax checks, unit tests, icon reproducibility, build + package validation, and both browser suites on every pull request. Local commands documented in `extension/README.md`. `.github/workflows/lint.yml` runs repo-wide eslint (flat config in `eslint.config.js` covering `src/`, `extension/`, `scripts/`, and tests) on every pull request; `npm audit` is clean as of PR #37 but is not a CI check.

- [ ] **PB-11: Real-site acceptance**
  - At least 20 to 30 representative sites are recorded in `docs/REAL_SITE_TEST_MATRIX.md`.
  - All claimed CMP-mode combinations have passing evidence.
  - There are zero destructive false positives.
  - Evidence: Partial preparation only. Matrix has 33 candidate rows covering 20 distinct origins once the two placeholders are selected, protocol, CMP fixture mode matrix, automated permission/sensitive evidence links, and Run R1 environment/provenance (`docs/REAL_SITE_TEST_MATRIX.md`, `docs/REAL_SITE_TEST_PROTOCOL.md`, `docs/RELEASE_PROVENANCE.md`). **Live site rows remain `Not run`** — agent/CI hosts cannot resolve external DNS; a human desktop Chrome run of the protocol is still required before this gate can close.

- [x] **PB-12: Claims match the product**
  - README, PRD, manifest, options UI, privacy policy, and release notes agree on purpose, capabilities, permissions, data, and exclusions.
  - Nonfunctional or deferred features are not presented as available.
  - Evidence: Claim-to-code audit in `docs/CLAIMS_AUDIT.md` (2026-08-03). README, extension README, manifest description, popup/options copy, and privacy policy were reconciled to the v0.1 scope in the hardening rewrite; `PRD.md`, `USER_GUIDE.md`, `QUICK_START.md`, `extension/CHROME_WEB_STORE_SUBMISSION.md`, `extension/QUICK_START_SUBMISSION.md`, the submission checklist/tracker, and `DOCUMENTATION_INDEX.md` were rewritten to the MVP contract; and the legacy planning documents (`PRD.md`, `ITERATION_6_SUMMARY.md`, `MVP_ASSESSMENT.md`, `PROJECT_STATUS.md`, `COMPLETE_PICTURE.md`) were rewritten 2026-08-15 to remove alpha-era claims and defer to the operating pack as canonical. Closed at James's direction, 2026-08-15. Public CMP wording remains "candidate" until PB-11.

## Chrome Web Store candidate

The private-beta section must pass first.

- [ ] **WS-01: Single purpose and minimum permissions**
  - Store copy describes the narrow cookie-consent purpose.
  - Requested permissions are necessary, explained, and exercised as described.
  - Evidence: Draft Store summary/description and permission justifications in `extension/CHROME_WEB_STORE_SUBMISSION.md` match `manifest.json` (`storage`, `activeTab`, `scripting`, optional hosts) and the MVP contract. Final dashboard paste still pending at submission time.

- [ ] **WS-02: Accurate privacy disclosures**
  - Privacy policy and dashboard answers match code and test evidence.
  - Any browsing-derived processing is disclosed even when local.
  - Evidence: Partial: `extension/PRIVACY_POLICY.md` rewritten to the exact storage schema (`bb:settings`, `bb:authorizedOrigins`, `bb:stats`) with the empty-sync assertion tested in `boundary.spec.mjs`. Pending: Web Store dashboard answers at submission time.

- [ ] **WS-03: Listing and asset readiness**
  - Required icons, screenshots, descriptions, support information, and policy links are complete and accurate.
  - Evidence: Not yet provided.

- [ ] **WS-04: Release artifact provenance**
  - The submitted archive is reproducibly built from a tagged, passing commit.
  - Its hash and package inventory are recorded.
  - Evidence: Build procedure + strict inventory enforced by `extension/build-extension.sh` / `scripts/validate-package.mjs`. Record template and a pre-tag sample hash are in `docs/RELEASE_PROVENANCE.md`. Final row requires a release tag on a gates-green commit and the hash of that tagged build.

## Release rule

Private beta requires every `PB` gate. Web Store submission requires every `PB` and `WS` gate. A waived gate requires a new entry in `docs/DECISIONS.md`, explicit approval from James Richmond, and a documented risk owner and expiration date.
