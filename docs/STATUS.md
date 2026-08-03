# BannerBanner status

Last updated: 2026-08-02  
Baseline: `main` at `1fce8291bce211ab539c9968d24caa19799c722a`

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

A permission-boundary patch that removes static all-site content scripts and dynamically registers one unified script only for explicitly accepted origins.

The patch must include opt-in, revocation, reload, update, and already-open-tab tests.

## Blocking Release Gate

`PB-01: Genuine per-origin opt-in`.

## Active sequence

1. Merge the v0.1 operating pack.
2. Enforce the permission boundary.
3. Unify the consent pipeline and remove generic destructive behavior.
4. Implement verified supported-CMP actions.
5. Connect settings and repair data handling.
6. Complete packaging, CI, and browser safety testing.
7. Run the real-site matrix and reconcile public claims.

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

## Session handoff template

At the end of a meaningful session, replace this section's values:

- Artifact shipped:
- Files or behavior changed:
- Checks passed:
- Manual evidence:
- Remaining uncertainty:
- Release gate changed:
- Next shippable artifact:
