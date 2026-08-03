# BannerBanner real-site test matrix

Status: Candidates prepared — no evidence recorded yet  
Target: 20 to 30 representative real sites, all claimed CMP-mode combinations, and zero destructive false positives.  
How to run: `docs/REAL_SITE_TEST_PROTOCOL.md` (per-row steps, permission-boundary walkthrough, storage inspection, evidence rules).

This document records evidence; it must not be populated from memory, a generated claim, or a test page designed only around BannerBanner's selectors.

## Test environment

Complete this block for each test run or link a versioned run record.

- Extension commit:
- Packaged artifact hash:
- Chrome version:
- Operating system:
- Profile state: Fresh or named test profile
- Date:
- Tester:
- Evidence location:

## Candidate CMP support ledger

Candidates are not supported until both v0.1 modes pass with evidence.

| CMP | Necessary only | Accept all | Sites tested | Status | Evidence |
|---|---:|---:|---:|---|---|
| OneTrust | 0 | 0 | 0 | Unverified candidate (fixture tests pass) | `extension/test/browser/specs/pipeline.spec.mjs` |
| Cookiebot | 0 | 0 | 0 | Unverified candidate (fixture tests pass) | `extension/test/browser/specs/pipeline.spec.mjs` |
| CookieYes | 0 | 0 | 0 | Unverified candidate (fixture tests pass) | `extension/test/browser/specs/pipeline.spec.mjs` |
| Quantcast Choice | n/a — unsupported (BB-013) | 0 | 0 | Unverified candidate (fixture tests pass; Accept all only) | `extension/test/browser/specs/pipeline.spec.mjs` |
| Usercentrics | 0 | 0 | 0 | Unverified candidate (fixture tests pass) | `extension/test/browser/specs/pipeline.spec.mjs` |

Launch may claim only three to five CMPs that pass. Remove or defer a candidate rather than weakening verification.

## Real-site results

One row represents one site, CMP, mode, extension commit, and test date.
Follow `docs/REAL_SITE_TEST_PROTOCOL.md` for every row.

The rows below are **pre-filled candidates** (29 rows): origins believed to
run each CMP as of 2026-08, with the expected control and postcondition taken
from the shipped adapters. Deployments change — step 1 of the protocol
confirms the CMP on the day of testing; mark a row `Blocked` and substitute a
site from the same CMP's pool if the vendor changed. Result `Not run` means
the row is still a candidate, not evidence.

Expected-control shorthand used below:
- **OT-reject** = `#onetrust-reject-all-handler`; **OT-accept** = `#onetrust-accept-btn-handler`; postcondition: `OptanonConsent` cookie written by the site and banner torn down by OneTrust.
- **CB-decline** = `#CybotCookiebotDialogBodyLevelButtonLevelOptinDeclineAll`; **CB-allow** = `…OptinAllowAll`; postcondition: `CookieConsent` cookie + teardown.
- **CY-reject** / **CY-accept** = `[data-cky-tag="reject-button"|"accept-button"]`; postcondition: `cookieyes-consent` cookie + teardown.
- **QC-accept** = `#qc-cmp2-ui button[mode="primary"]`; postcondition: `euconsent-v2` cookie + teardown. (*Necessary only* is unsupported for Quantcast in v0.1 — BB-013.)
- **UC-deny** / **UC-accept** = `[data-testid="uc-deny-all-button"|"uc-accept-all-button"]`; postcondition: `uc_settings` in localStorage + teardown.

| ID | Site origin | CMP and version | Mode | Expected control and postcondition | Result | Page usable | Destructive false positive | Evidence | Date | Notes |
|---|---|---|---|---|---|---|---|---|---|---|
| RS-01 | https://www.adobe.com | OneTrust | Necessary only | OT-reject → OptanonConsent | Not run | | | | | |
| RS-02 | https://www.adobe.com | OneTrust | Accept all | OT-accept → OptanonConsent | Not run | | | | | |
| RS-03 | https://open.spotify.com | OneTrust | Necessary only | OT-reject → OptanonConsent | Not run | | | | | |
| RS-04 | https://open.spotify.com | OneTrust | Accept all | OT-accept → OptanonConsent | Not run | | | | | |
| RS-05 | https://edition.cnn.com | OneTrust | Necessary only | OT-reject → OptanonConsent | Not run | | | | EU/UK exit point may be needed to see the banner | |
| RS-06 | https://edition.cnn.com | OneTrust | Accept all | OT-accept → OptanonConsent | Not run | | | | | |
| RS-07 | https://www.lego.com | OneTrust | Necessary only | OT-reject → OptanonConsent | Not run | | | | | |
| RS-08 | https://www.lego.com | OneTrust | Accept all | OT-accept → OptanonConsent | Not run | | | | | |
| RS-09 | https://www.zoom.us | OneTrust | Necessary only | OT-reject → OptanonConsent | Not run | | | | | |
| RS-10 | https://www.zoom.us | OneTrust | Accept all | OT-accept → OptanonConsent | Not run | | | | | |
| RS-11 | https://www.cookiebot.com | Cookiebot | Necessary only | CB-decline → CookieConsent | Not run | | | | vendor's own site | |
| RS-12 | https://www.cookiebot.com | Cookiebot | Accept all | CB-allow → CookieConsent | Not run | | | | | |
| RS-13 | https://www.bang-olufsen.com | Cookiebot | Necessary only | CB-decline → CookieConsent | Not run | | | | | |
| RS-14 | https://www.bang-olufsen.com | Cookiebot | Accept all | CB-allow → CookieConsent | Not run | | | | | |
| RS-15 | https://www.grundfos.com | Cookiebot | Necessary only | CB-decline → CookieConsent | Not run | | | | | |
| RS-16 | https://www.grundfos.com | Cookiebot | Accept all | CB-allow → CookieConsent | Not run | | | | | |
| RS-17 | https://www.cookieyes.com | CookieYes | Necessary only | CY-reject → cookieyes-consent | Not run | | | | vendor's own site | |
| RS-18 | https://www.cookieyes.com | CookieYes | Accept all | CY-accept → cookieyes-consent | Not run | | | | | |
| RS-19 | (pick from CookieYes showcase / BuiltWith) | CookieYes | Necessary only | CY-reject → cookieyes-consent | Not run | | | | source a live WordPress deployment at test time | |
| RS-20 | (same site as RS-19) | CookieYes | Accept all | CY-accept → cookieyes-consent | Not run | | | | | |
| RS-21 | https://sourceforge.net | Quantcast Choice | Accept all | QC-accept → euconsent-v2 | Not run | | | | GDPR banner shows from EU vantage | |
| RS-22 | https://www.howstuffworks.com | Quantcast Choice | Accept all | QC-accept → euconsent-v2 | Not run | | | | | |
| RS-23 | (pick a Quantcast publisher via TCF vendor list) | Quantcast Choice | Accept all | QC-accept → euconsent-v2 | Not run | | | | | |
| RS-24 | https://usercentrics.com | Usercentrics | Necessary only | UC-deny → uc_settings | Not run | | | | vendor's own site | |
| RS-25 | https://usercentrics.com | Usercentrics | Accept all | UC-accept → uc_settings | Not run | | | | | |
| RS-26 | https://www.sixt.de | Usercentrics | Necessary only | UC-deny → uc_settings | Not run | | | | | |
| RS-27 | https://www.sixt.de | Usercentrics | Accept all | UC-accept → uc_settings | Not run | | | | | |
| RS-28 | https://www.kicker.de | Usercentrics | Necessary only | UC-deny → uc_settings | Not run | | | | | |
| RS-29 | https://www.kicker.de | Usercentrics | Accept all | UC-accept → uc_settings | Not run | | | | | |

Replacement pools if a candidate changed CMP vendor: OneTrust —
mastercard.com, sap.com, heineken.com; Cookiebot — visitdenmark.com,
carlsberg.com, maersk.com; Usercentrics — tchibo.de, dm.de. Confirm with the
container selector from the protocol before substituting.

Allowed Result values: `Pass`, `Fail`, `Unsupported`, `Blocked`, `Not run`.

Do not store account identifiers, URL paths, query strings, private page content, or secrets in this public-facing matrix. Use only the origin unless additional public context is essential.

## Permission-boundary matrix

| Case | Expected result | Status | Evidence |
|---|---|---|---|
| Clean install; never-authorized origin | No content script execution or page mutation | Not run | |
| Explicit grant for current origin | Unified script registers and operates only on that origin | Not run | |
| Reload after grant | Authorized behavior persists | Not run | |
| Browser restart after grant | Authorized behavior persists | Not run | |
| Extension update after grant | Registrations reconcile without expanding access | Not run | |
| Permission denial | No execution; clear local status | Not run | |
| Revoke origin | Registration removed and current activity stops | Not run | |
| Similar but unauthorized origin | No execution or page mutation | Not run | |

## Sensitive-dialog regression matrix

Each case must prove that BannerBanner performs no click, removal, hiding, style mutation, or synthetic event.

| Case | Fixture or real flow | Expected result | Status | Evidence |
|---|---|---|---|---|
| Login dialog | | Untouched | Not run | |
| Checkout dialog | | Untouched | Not run | |
| Payment or 3-D Secure dialog | | Untouched | Not run | |
| Security or reauthentication prompt | | Untouched | Not run | |
| Age-verification gate | | Untouched | Not run | |
| Session-expiration warning | | Untouched | Not run | |
| Unsaved-work confirmation | | Untouched | Not run | |
| Newsletter signup | | Untouched | Not run | |
| Advertisement overlay | | Untouched | Not run | |
| Unknown large modal | | Untouched; unsupported status only | Not run | |

## Failure record

For every failure, capture:

- matrix ID;
- extension commit;
- exact expected and observed behavior;
- whether the page was mutated;
- reproducible steps;
- sanitized screenshot, trace, or console evidence;
- linked issue;
- fix commit; and
- regression-test location.

## Exit criteria

- 20 to 30 real-site rows are complete.
- Every claimed CMP passes both supported modes.
- Permission grant and revocation cases pass.
- Every sensitive-dialog case passes.
- No destructive false positive remains.
- All failures are fixed, explicitly unsupported, or cause the relevant support claim to be removed.
- `PB-03`, `PB-04`, `PB-05`, and `PB-11` link to this evidence.
