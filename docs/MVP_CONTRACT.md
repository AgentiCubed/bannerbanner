# BannerBanner v0.1 MVP contract

Status: Canonical after merge  
Target: Safe Chrome private beta  
Baseline reviewed: `main` at `1fce8291bce211ab539c9968d24caa19799c722a`  
Contract date: 2026-08-02

## Product promise

BannerBanner v0.1 is a per-site opt-in Chrome extension that applies a user's chosen cookie-consent preference on explicitly authorized websites. It acts only when it can identify and activate a supported consent control, verifies the result, and then reports success locally.

The purpose of v0.1 is narrow on purpose: reliably handle supported cookie-consent managers without damaging unrelated page workflows.

## Included in v0.1

- Chrome Manifest V3.
- Explicit opt-in for each website origin.
- Dynamic registration and removal of content scripts for authorized origins.
- Three to five verified consent-management platforms at launch.
- Two initial preference modes:
  - Necessary only.
  - Accept all.
- One Chrome-storage-backed options experience.
- Local aggregate counts that do not retain page URLs.
- A visible success or failure state.
- Optional Bananer celebration after verified success.
- Automated safety, unit, integration, manifest, and package checks.
- A committed real-site evidence matrix.

## Excluded from v0.1

- Newsletter, advertisement, paywall, age-gate, and generic popup removal.
- Automatic action on unknown dialogs.
- DOM removal or visual hiding as a cookie-consent fallback.
- Granular consent-category automation beyond the two supported modes.
- User-trained selectors.
- Community pattern sharing or any sharing backend.
- The GitHub Spark dashboard as extension runtime UI.
- Cross-browser support.
- Remote analytics, telemetry, accounts, synchronization, or cloud storage.

Excluded work belongs in the Parking Lot until the private-beta gates pass and James records a scope change in `docs/DECISIONS.md`.

## Safety invariants

1. Unknown means no automatic action.
2. Sensitive workflows remain untouched.
3. Consent is an action, not the absence of a banner.
4. The user's stored preference is loaded before classification or execution.
5. One page cannot have two BannerBanner engines acting independently.
6. Revoking an origin stops future injection and disables current activity on that origin.
7. No full URL, path, query string, page title, or page content is stored as history.
8. No result is called successful unless the chosen control was activated and the postcondition was verified.
9. A Bananer animation cannot delay or substitute for the consent operation.
10. A false positive that changes or removes a legitimate dialog blocks release.

## Permission contract

- `storage`, `activeTab`, and `scripting` may be used only for the stated single purpose.
- Host access is requested for the current origin after an explicit user action.
- All-site static content-script matches are prohibited.
- Authorized origins are represented in one canonical local registry.
- Removing an origin unregisters its scripts and signals already-open matching tabs to stop.
- Any new permission requires a recorded decision, a user-facing explanation, and updated tests and disclosures.

## Data contract

The runtime source of truth is `chrome.storage`.

Allowed local data:

- consent mode;
- extension behavior settings;
- explicitly authorized origins;
- supported-CMP knowledge needed to operate;
- aggregate success and failure counts;
- bounded technical diagnostics that cannot reconstruct browsing history.

Prohibited for v0.1:

- full page URLs;
- URL paths or query strings;
- page titles or page content;
- a chronological browsing or dismissal history;
- remote transmission;
- silent sync of browsing-derived data.

If a future feature needs data outside this contract, it requires an explicit decision before code is written.

## Supported-result contract

For each supported consent-management platform and preference mode, BannerBanner must:

1. detect the supported platform;
2. identify the exact intended control;
3. activate it without generic fallback behavior;
4. verify that the expected consent state or supported postcondition occurred;
5. record only the allowed local result; and
6. leave the page usable.

If any step cannot be completed, BannerBanner must fail closed: take no destructive action and show an understandable local status.

## Acceptance

v0.1 is ready for private beta only when every private-beta gate in `docs/RELEASE_GATES.md` is checked with linked evidence. It is ready for Chrome Web Store submission only when both the private-beta and Web Store gates pass.

No percentage-complete claim overrides an open release gate.
