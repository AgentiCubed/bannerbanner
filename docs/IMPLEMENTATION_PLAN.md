# BannerBanner v0.1 implementation plan

Target: Safe Chrome Private Beta  
Execution rule: close the earliest unmet release gate before expanding scope.

## Work package 0: Operating pack

Status: Complete.

Goal: establish one durable source of truth.

Deliverables:

- `AGENTS.md`;
- MVP contract;
- decisions log;
- status handoff;
- release gates;
- real-site evidence matrix; and
- Release Steward definition.

Completed on `main` on 2026-08-02.

## Work package 1: Enforce genuine per-site opt-in

Issue title: `P0: Enforce genuine per-site opt-in with dynamic content scripts`

Tasks:

- Remove static `http://*/*` and `https://*/*` content-script entries.
- Define one canonical authorized-origin registry in `chrome.storage.local`.
- Request an origin only after an explicit toolbar action.
- Register the unified content script for that origin with `chrome.scripting.registerContentScripts()`.
- Reconcile registrations on install, startup, update, and settings changes.
- Unregister scripts and stop current activity when access is revoked.
- Handle unsupported pages and permission denial clearly.

Evidence:

- manifest validation;
- unit coverage for origin normalization and reconciliation;
- browser integration tests for grant, reload, restart, update, revoke, and denial; and
- proof that a clean install does not run on arbitrary sites.

Closes: `PB-01`, `PB-02`.

## Work package 2: Replace the competing engines

Issue title: `P0: Replace the dual dismissal engines with one awaited consent pipeline`

Tasks:

- Choose one content-script entry point.
- Load settings completely before scanning.
- Build explicit stages: detect, classify, decide, execute, verify, report.
- Remove or quarantine the second engine.
- Prevent duplicate processing within a frame and session.
- Make animation a post-result observer.

Evidence:

- unit tests for pipeline transitions;
- one-action integration tests; and
- regression proof that a page cannot receive two competing actions.

Closes: `PB-06`.

## Work package 3: Make automatic behavior safe and verifiable

Issue titles:

- `P0: Never automatically act on unknown or sensitive dialogs`
- `P0: Verify consent actions and remove DOM-removal success fallback`

Tasks:

- Delete automatic generic-modal removal.
- Add hard exclusions for sensitive modal categories.
- Support only allowlisted CMP adapters and explicit controls.
- Implement Necessary only and Accept all for each supported adapter.
- Define adapter-specific success postconditions.
- Fail closed when detection, control selection, action, or verification is uncertain.
- Report a readable unsupported or unverified state.

Evidence:

- classification and strategy unit tests;
- supported-CMP fixtures;
- sensitive-dialog regression suite; and
- browser tests proving that DOM removal is never reported as consent.

Closes: `PB-03`, `PB-04`, `PB-05`.

## Work package 4: Connect settings and storage

Issue title: `P0: Make Chrome storage the sole settings source of truth`

Tasks:

- Put the two v0.1 consent modes in the shipped options UI.
- Remove Spark KV from the extension runtime path.
- Define versioned defaults and a migration path.
- Propagate changes to registered content scripts.
- Add reset and corruption recovery behavior.
- Remove nonfunctional training and sharing controls from the shipped MVP.

Evidence:

- storage migration tests;
- options-to-content-script integration tests; and
- browser verification across restart and update.

Closes: `PB-07`.

## Work package 5: Repair privacy and data handling

Issue title: `P0: Remove URL-bearing history and align privacy disclosures`

Tasks:

- Remove full URLs and chronological browsing records.
- Keep bounded aggregate local counts only.
- Do not use sync storage for browsing-derived data.
- Handle storage write failures explicitly.
- Rewrite the privacy policy and Web Store answers to match code.
- Correct repository visibility and unsupported-feature claims.

Evidence:

- storage schema tests;
- an inspection showing no prohibited fields after normal use; and
- code-to-policy review notes.

Closes: `PB-08`, `WS-02`.

## Work package 6: Produce a complete, deterministic package

Issue title: `P1: Complete and validate the extension package`

Tasks:

- Add required icon sizes.
- Remove or supply every declared web-accessible resource.
- Make missing required assets fatal.
- Package only runtime files.
- Eliminate duplicate build work.
- Validate the final manifest and unpacked directory.

Evidence:

- reproducible build command;
- package file inventory;
- clean load in a fresh Chrome profile; and
- zero missing-resource errors.

Closes: `PB-09`, `WS-03`.

## Work package 7: Establish release-grade tests and CI

Issue title: `P0: Add release-grade automated tests and CI`

Tasks:

- Add unit tests for origin handling, classification, adapters, action selection, verification, fingerprinting, and storage.
- Add browser integration tests for permissions, settings, supported CMPs, and safety cases.
- Add manifest and package validation.
- Run build, lint, tests, and package checks in GitHub Actions.
- Preserve failure artifacts useful for diagnosis.

Evidence:

- required checks passing on the pull request; and
- documented local reproduction commands.

Closes: `PB-10`.

## Work package 8: Prove real-site behavior and align claims

Issue title: `P1: Complete real-site acceptance and align all v0.1 claims`

Tasks:

- Select 20 to 30 sites across the supported CMP set.
- Test each supported preference mode.
- Record version, date, result, evidence, and regressions.
- Exercise sensitive and unknown-dialog controls.
- Fix or narrow support claims for failures.
- Make every public description match shipped capability and permissions.

Evidence:

- completed `docs/REAL_SITE_TEST_MATRIX.md`;
- zero destructive false positives;
- linked screenshots, traces, or test artifacts; and
- final claim-to-code audit.

Closes: `PB-11`, `PB-12`, `WS-01`, `WS-04`.

## Dependency order

1. Work package 0.
2. Work package 1.
3. Work packages 2 and 3.
4. Work packages 4 and 5.
5. Work packages 6 and 7.
6. Work package 8.

Parallel work is allowed only when it cannot obscure the first blocking gate or create competing architecture.

## Completion rule for every package

Before closing a package:

- satisfy its issue acceptance criteria;
- run and record the relevant checks;
- update the affected release gates;
- update `docs/STATUS.md`;
- update the real-site matrix when browser behavior changed; and
- record any durable scope, permission, safety, or data decision.
