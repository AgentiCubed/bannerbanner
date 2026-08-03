# BannerBanner release gates

A gate is closed only when its checkbox is checked and its Evidence field points to reproducible proof. Code presence, a generated report, or a completion percentage is not evidence by itself.

## Safe Chrome private beta

- [ ] **PB-01: Genuine per-origin opt-in**
  - A clean install does not inject or execute BannerBanner on arbitrary websites.
  - Access begins only after explicit origin authorization.
  - Evidence: Not yet provided.

- [ ] **PB-02: Complete revocation**
  - Removing an origin prevents future injection and stops BannerBanner activity in already-open matching tabs.
  - Restart and extension update do not restore revoked access.
  - Evidence: Not yet provided.

- [ ] **PB-03: Verified supported-CMP decisions**
  - Each claimed CMP and each supported mode activates the intended control.
  - Success is recorded only after an adapter-specific postcondition passes.
  - Evidence: Not yet provided.

- [ ] **PB-04: Unknown dialogs fail closed**
  - Unknown dialogs receive no click, removal, hiding, style mutation, or synthetic event.
  - The user receives an understandable unsupported status.
  - Evidence: Not yet provided.

- [ ] **PB-05: Sensitive workflows remain untouched**
  - Login, checkout, payment, security, age-verification, session-expiration, and unsaved-work dialogs pass the regression suite without modification.
  - Any destructive false positive reopens this gate.
  - Evidence: Not yet provided.

- [ ] **PB-06: One awaited consent pipeline**
  - One engine owns detection, decision, execution, verification, and reporting.
  - Settings load before scanning.
  - A banner cannot receive duplicate or competing actions.
  - Evidence: Not yet provided.

- [ ] **PB-07: Shipped settings control shipped behavior**
  - The options UI writes versioned `chrome.storage` settings consumed by the content script.
  - The two v0.1 modes persist across reload, browser restart, and extension update.
  - Evidence: Not yet provided.

- [ ] **PB-08: Data handling matches the contract**
  - Normal use stores no full URL, path, query string, title, content, or chronological browsing history.
  - Browsing-derived data does not enter sync storage.
  - The privacy policy describes the observed schema and behavior.
  - Evidence: Not yet provided.

- [ ] **PB-09: Complete extension package**
  - Every manifest resource exists.
  - Missing required files fail the build.
  - The packaged directory contains only required runtime assets and loads without errors in a fresh profile.
  - Evidence: Not yet provided.

- [ ] **PB-10: Automated release checks**
  - Build, lint, unit, browser integration, manifest, and package checks run in CI and pass.
  - Safety regressions are required checks.
  - Evidence: Not yet provided.

- [ ] **PB-11: Real-site acceptance**
  - At least 20 to 30 representative sites are recorded in `docs/REAL_SITE_TEST_MATRIX.md`.
  - All claimed CMP-mode combinations have passing evidence.
  - There are zero destructive false positives.
  - Evidence: Not yet provided.

- [ ] **PB-12: Claims match the product**
  - README, PRD, manifest, options UI, privacy policy, and release notes agree on purpose, capabilities, permissions, data, and exclusions.
  - Nonfunctional or deferred features are not presented as available.
  - Evidence: Not yet provided.

## Chrome Web Store candidate

The private-beta section must pass first.

- [ ] **WS-01: Single purpose and minimum permissions**
  - Store copy describes the narrow cookie-consent purpose.
  - Requested permissions are necessary, explained, and exercised as described.
  - Evidence: Not yet provided.

- [ ] **WS-02: Accurate privacy disclosures**
  - Privacy policy and dashboard answers match code and test evidence.
  - Any browsing-derived processing is disclosed even when local.
  - Evidence: Not yet provided.

- [ ] **WS-03: Listing and asset readiness**
  - Required icons, screenshots, descriptions, support information, and policy links are complete and accurate.
  - Evidence: Not yet provided.

- [ ] **WS-04: Release artifact provenance**
  - The submitted archive is reproducibly built from a tagged, passing commit.
  - Its hash and package inventory are recorded.
  - Evidence: Not yet provided.

## Release rule

Private beta requires every `PB` gate. Web Store submission requires every `PB` and `WS` gate. A waived gate requires a new entry in `docs/DECISIONS.md`, explicit approval from James Richmond, and a documented risk owner and expiration date.
