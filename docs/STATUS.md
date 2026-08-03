# BannerBanner status

Last updated: 2026-08-03  
Code baseline reviewed: `main` at `1fce8291bce211ab539c9968d24caa19799c722a`  
Operating pack: committed to `main` on 2026-08-02

## Current Project

BannerBanner v0.1, Safe Chrome Private Beta.

## Current Mode

Release hardening and scope correction.

## Current truth

BannerBanner is a functional alpha with Manifest V3 scaffolding, an options page, optional host-permission declarations, content scripts, and local learning behavior. It is not yet a safe MVP.

Current critical mismatches include:

- static all-site content-script injection despite the per-site opt-in claim;
- two independent detection and dismissal engines;
- automatic destructive handling of unknown dialogs;
- DOM removal being recorded as cookie-consent success;
- extension settings split between Spark KV and `chrome.storage`;
- a training flow that does not capture a usable extension pattern;
- URL-bearing history and privacy-policy contradictions;
- absent release-grade tests and CI; and
- missing or dead package assets.

## Next Shippable Artifact

Issue #24: a permission-boundary patch that removes static all-site content scripts and dynamically registers one unified script only for explicitly accepted origins.

The patch must include opt-in, revocation, reload, update, and already-open-tab tests.

## Blocking Release Gate

`PB-01: Genuine per-origin opt-in`.

## Active sequence

1. Implement issue #24 and enforce the permission boundary.
2. Unify the consent pipeline and remove generic destructive behavior.
3. Implement verified supported-CMP actions.
4. Connect settings and repair data handling.
5. Complete packaging, CI, and browser safety testing.
6. Run the real-site matrix and reconcile public claims.

## Known blockers

- No release-grade automated test harness.
- No committed real-site verification evidence.
- Current extension package references missing assets.
- Current documentation overstates implemented capabilities.
- Chrome Web Store disclosures do not yet match behavior.

## Parking Lot

- Newsletter and advertisement removal.
- Generic popup agents.
- User pattern training.
- Community pattern sharing.
- Spark dashboard integration.
- Granular consent categories.
- Firefox and other browser support.
- Remote telemetry, accounts, or synchronization.
- Additional Bananer characters and animation polish.

## Latest handoff

- Artifact shipped: PR #37 — working `npm run lint` (flat eslint config for eslint 10 covering `src/` and `extension/`) and a clean `npm audit`.
- Files or behavior changed: New `eslint.config.js`; 27 lint errors fixed across 11 files (unused bindings, imports, and typing cleanups — no behavior changes); `package.json` security overrides bumped (`postcss` 8.5.25, `minimatch` 3.1.5) plus `npm audit fix`, taking audit findings from 4 to 0. Extension runtime behavior is unchanged.
- Checks passed: `npm run lint` exits 0 (7 warnings, all the standard shadcn fast-refresh warning); `npm audit` reports 0 vulnerabilities; `npm run build` passes; `tsc --noEmit` output is byte-identical before and after the change.
- Manual evidence: Command output verified in the PR #37 session; the diff is the record.
- Remaining uncertainty: Lint and audit run locally only — no CI executes them yet, and there are no unit, browser-integration, manifest, or package checks, so PB-10 remains open. The 36 pre-existing `tsc` errors (lucide-react deep imports) are untouched.
- Release gate changed: None closed; PB-10 evidence updated to record partial progress (local lint and audit green).
- Next shippable artifact: Issue #24, genuine per-origin opt-in.

## Session handoff template

At the end of a meaningful session, replace this section's values:

- Artifact shipped:
- Files or behavior changed:
- Checks passed:
- Manual evidence:
- Remaining uncertainty:
- Release gate changed:
- Next shippable artifact:
