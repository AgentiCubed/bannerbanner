# BannerBanner status

Last updated: 2026-08-03  
Code baseline reviewed: issue #32 branch on top of `main` at `c981cc8` / merged hardening  
Operating pack: committed to `main` on 2026-08-02

## Current Project

BannerBanner v0.1, Safe Chrome Private Beta.

## Current Mode

Release hardening — claims alignment complete; real-site evidence still human-gated.

## Current truth

The v0.1 hardening branch (issues #24–#31) replaced the alpha runtime:

- No static content scripts; per-origin dynamic registration and revocation.
- One awaited consent pipeline; unknown/sensitive dialogs untouched.
- Verified CMP postconditions only; five launch-candidate adapters (Quantcast
  Accept-all only per BB-013; TrustArc/Osano/Cookie Notice removed per BB-014).
- `chrome.storage.local` sole runtime store; aggregate counters; empty sync.
- Icons, strict package validation, CI unit + browser suites.

Issue #32 (this branch) completed the **claim-to-code audit** and provenance
scaffolding. It could **not** complete live real-site rows: the agent/CI
network cannot resolve external hostnames.

## Next Shippable Artifact

Human execution of `docs/REAL_SITE_TEST_PROTOCOL.md` against the 29 candidate
rows (and permission walkthrough) on a desktop Chrome profile, then tick PB-11
(and remaining manual cells) with evidence paths.

## Blocking Release Gate

`PB-11: Real-site acceptance` (live rows). PB-12 evidence is prepared in
`docs/CLAIMS_AUDIT.md` awaiting James's review check. WS-01 draft copy and
WS-04 build procedure are recorded; both need submission-time finalization.

## Known blockers

- Live real-site and Chrome permission-prompt flows need a human networked
  browser (agent environment: no external DNS).
- CMP support claims stay "candidate" until matrix live rows pass.
- WS-03 screenshots not captured.
- WS-04 final upload requires a git tag on a gates-green commit.

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

- Artifact shipped: issue #32 documentation and evidence alignment — v0.1 PRD,
  Store listing copy, user/quick-start guides, claims audit, release provenance
  record, supersession of alpha-era root docs, matrix updates linking automated
  permission/sensitive/fixture evidence, gate evidence fields for PB-11/12,
  PB-05, WS-01, WS-04.
- Files or behavior changed: docs and public markdown only; extension runtime
  unchanged. Sample package hash recorded from `npm run build:extension` on
  commit `c981cc8` →
  `fc96dfa0c725e18475d635f68daefbdbac3b3ec3951965af4625b2b784273662`.
- Checks passed: 70/70 unit tests; `npm run lint` 0 errors (7 pre-existing shadcn warnings); package validation pass; browser pipeline fixtures 24/24 Pass with system Chrome; boundary suite 2/9 Pass here (service-worker timeouts under headless system Chrome — CI uses Playwright Chromium; not a runtime regression from this docs-only change).
- Manual evidence: live-site probe attempted; all origins `ERR_NAME_NOT_RESOLVED`.
  No Pass/Fail live rows fabricated.
- Remaining uncertainty: real CMP deployments; human grant/revoke UX; Store
  screenshots.
- Release gate changed: PB-12 / WS-01 / WS-04 evidence filled (checkboxes still
  for James); PB-11 still open with honest partial prep; PB-05 evidence note
  extended with matrix fixture Pass links.
- Next shippable artifact: completed live rows in
  `docs/REAL_SITE_TEST_MATRIX.md` via the protocol (human).

## Session handoff template

At the end of a meaningful session, replace this section's values:

- Artifact shipped:
- Files or behavior changed:
- Checks passed:
- Manual evidence:
- Remaining uncertainty:
- Release gate changed:
- Next shippable artifact:
