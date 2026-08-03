# BannerBanner real-site test matrix

Status: Not started  
Target: 20 to 30 representative real sites, all claimed CMP-mode combinations, and zero destructive false positives.

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

| ID | Site origin | CMP and version | Mode | Expected control and postcondition | Result | Page usable | Destructive false positive | Evidence | Date | Notes |
|---|---|---|---|---|---|---|---|---|---|---|

Allowed Result values: `Pass`, `Fail`, `Unsupported`, `Blocked`.

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
