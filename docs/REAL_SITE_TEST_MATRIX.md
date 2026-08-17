# BannerBanner real-site test matrix

Status: Candidates prepared — **live rows still require a human browser**  
Target: 20 to 30 representative real sites, all claimed CMP-mode combinations, and zero destructive false positives.  
How to run: `docs/REAL_SITE_TEST_PROTOCOL.md` (per-row steps, permission-boundary walkthrough, storage inspection, evidence rules).

This document records evidence; it must not be populated from memory, a generated claim, or a test page designed only around BannerBanner's selectors.

## Test environment

Complete this block for each test run or link a versioned run record.

### Run R1 — automated boundary + fixture evidence (2026-08-03)

- Extension commit: `c981cc8b1d758dcbe18e09ea7f8b5ddffd04f611` (issue #32 branch base; rebuild after merge)
- Packaged artifact hash: `fc96dfa0c725e18475d635f68daefbdbac3b3ec3951965af4625b2b784273662` (`bannerbanner-v0.1.0.zip`)
- Chrome version: Google Chrome 150.0.7871.128 (agent runner) / CI Chromium via Playwright
- Operating system: Linux x86_64 (GitHub-hosted / agent runner)
- Profile state: Fresh temporary profiles in browser tests
- Date: 2026-08-03
- Tester: copilot-agent (automated suites only)
- Evidence location: `extension/test/browser/specs/boundary.spec.mjs`, `extension/test/browser/specs/pipeline.spec.mjs`, `extension/test/unit/*`, `docs/RELEASE_PROVENANCE.md`
- Live-site attempt: **Blocked** in the agent environment — external DNS does not resolve (`ERR_NAME_NOT_RESOLVED` / `socket.gaierror`). Per-protocol real-site rows remain for a human on a networked desktop Chrome profile.

### Run R2 — human real-site pass (pending)

- Frozen release-candidate commit:
- Packaged artifact hash:
- Package inventory:
- Extension CI run URL (same SHA):
- Lint run URL (same SHA):
- Chrome version:
- Operating system:
- Profile state: Fresh profile; exact archive extracted to a new working directory
- Date:
- Tester:
- Evidence location: committed sanitized evidence path or durable external
  artifact URL. Captures that cannot be safely sanitized must be excluded and
  cannot support a `Pass` row.
- Distinct origins passed:
- Destructive false positives:
- Fresh-profile load result:
- Final local/sync storage audit:

## Candidate validation

Every row must identify the same frozen candidate SHA. Local output is useful,
but PB-10 requires the linked GitHub workflow runs to use that exact `head_sha`.

| Check | Required result | Status | Evidence |
|---|---|---|---|
| Clean candidate tree | `git status --short` empty before build | Pending | |
| Repo lint | `npm run lint` passes | Pending | |
| Extension unit tests | All tests pass | Pending | |
| Browser integration | Boundary and pipeline suites pass | Pending | |
| Extension build | Build completes from candidate SHA | Pending | |
| Source manifest validation | `npm run validate:extension` passes | Pending | |
| Package validation | Strict 21-file inventory passes | Pending | |
| Extension CI | Green run with candidate `head_sha` | Pending | |
| Lint CI | Green run with candidate `head_sha` | Pending | |

## Candidate CMP support ledger

Candidates are not supported until both v0.1 modes pass with evidence on **real sites**.
Fixture passes alone keep status at "Unverified candidate".

| CMP | Necessary only | Accept all | Sites tested | Status | Evidence |
|---|---:|---:|---:|---|---|
| OneTrust | 0 live / fixtures pass | 0 live / fixtures pass | 0 live | Unverified candidate (fixture tests pass) | `extension/test/browser/specs/pipeline.spec.mjs` |
| Cookiebot | 0 live / fixtures pass | 0 live / fixtures pass | 0 live | Unverified candidate (fixture tests pass) | `extension/test/browser/specs/pipeline.spec.mjs` |
| CookieYes | 0 live / fixtures pass | 0 live / fixtures pass | 0 live | Unverified candidate (fixture tests pass) | `extension/test/browser/specs/pipeline.spec.mjs` |
| Quantcast Choice | n/a — unsupported (BB-013) | 0 live / fixtures pass | 0 live | Unverified candidate (fixture tests pass; Accept all only) | `extension/test/browser/specs/pipeline.spec.mjs` |
| Usercentrics | 0 live / fixtures pass | 0 live / fixtures pass | 0 live | Unverified candidate (fixture tests pass) | `extension/test/browser/specs/pipeline.spec.mjs` |

Launch may claim only three to five CMPs that pass. Remove or defer a candidate rather than weakening verification.

## Real-site results

One row represents one site, CMP, mode, extension commit, and test date.
Follow `docs/REAL_SITE_TEST_PROTOCOL.md` for every row.

The rows below are **pre-filled candidates** (29 rows covering 20 distinct
candidate sites once RS-19 and RS-23 select different origins): origins believed to
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
| RS-01 | https://www.adobe.com | OneTrust | Necessary only | OT-reject → OptanonConsent | Not run | | | | | Agent R1: DNS blocked |
| RS-02 | https://www.adobe.com | OneTrust | Accept all | OT-accept → OptanonConsent | Not run | | | | | |
| RS-03 | https://open.spotify.com | OneTrust | Necessary only | OT-reject → OptanonConsent | Not run | | | | | |
| RS-04 | https://open.spotify.com | OneTrust | Accept all | OT-accept → OptanonConsent | Not run | | | | | |
| RS-05 | https://edition.cnn.com | OneTrust | Necessary only | OT-reject → OptanonConsent | Not run | | | | | EU/UK exit point may be needed to see the banner |
| RS-06 | https://edition.cnn.com | OneTrust | Accept all | OT-accept → OptanonConsent | Not run | | | | | |
| RS-07 | https://www.lego.com | OneTrust | Necessary only | OT-reject → OptanonConsent | Not run | | | | | |
| RS-08 | https://www.mastercard.com | OneTrust | Accept all | OT-accept → OptanonConsent | Not run | | | | | |
| RS-09 | https://www.zoom.us | OneTrust | Necessary only | OT-reject → OptanonConsent | Not run | | | | | |
| RS-10 | https://www.sap.com | OneTrust | Accept all | OT-accept → OptanonConsent | Not run | | | | | |
| RS-11 | https://www.cookiebot.com | Cookiebot | Necessary only | CB-decline → CookieConsent | Not run | | | | | vendor's own site |
| RS-12 | https://www.cookiebot.com | Cookiebot | Accept all | CB-allow → CookieConsent | Not run | | | | | |
| RS-13 | https://www.bang-olufsen.com | Cookiebot | Necessary only | CB-decline → CookieConsent | Not run | | | | | |
| RS-14 | https://www.visitdenmark.com | Cookiebot | Accept all | CB-allow → CookieConsent | Not run | | | | | |
| RS-15 | https://www.grundfos.com | Cookiebot | Necessary only | CB-decline → CookieConsent | Not run | | | | | |
| RS-16 | https://www.carlsberg.com | Cookiebot | Accept all | CB-allow → CookieConsent | Not run | | | | | |
| RS-17 | https://www.cookieyes.com | CookieYes | Necessary only | CY-reject → cookieyes-consent | Not run | | | | | vendor's own site |
| RS-18 | https://www.cookieyes.com | CookieYes | Accept all | CY-accept → cookieyes-consent | Not run | | | | | |
| RS-19 | (pick from CookieYes showcase / BuiltWith) | CookieYes | Necessary only | CY-reject → cookieyes-consent | Not run | | | | | source a live WordPress deployment at test time |
| RS-20 | (same site as RS-19) | CookieYes | Accept all | CY-accept → cookieyes-consent | Not run | | | | | |
| RS-21 | https://sourceforge.net | Quantcast Choice | Accept all | QC-accept → euconsent-v2 | Not run | | | | | GDPR banner shows from EU vantage |
| RS-22 | https://www.howstuffworks.com | Quantcast Choice | Accept all | QC-accept → euconsent-v2 | Not run | | | | | |
| RS-23 | (pick a Quantcast publisher via TCF vendor list) | Quantcast Choice | Accept all | QC-accept → euconsent-v2 | Not run | | | | | |
| RS-24 | https://usercentrics.com | Usercentrics | Necessary only | UC-deny → uc_settings | Not run | | | | | vendor's own site |
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

Interactive Chrome permission prompts cannot be automated. Automated rows use
the built extension in Chromium (`boundary.spec.mjs`) or pure registry unit
tests. Manual rows follow `REAL_SITE_TEST_PROTOCOL.md` permission walkthrough.

| Case | Expected result | Status | Evidence |
|---|---|---|---|
| Clean install; never-authorized origin | No content script execution or page mutation | **Pass (automated)** | `extension/test/browser/specs/boundary.spec.mjs` — clean install executes nothing, registers nothing; sensitive fixture untouched |
| Explicit grant for current origin | Unified script registers and operates only on that origin | Not run (manual prompt) | Planning: `extension/test/unit/registry.test.mjs`; protocol walkthrough step 2 |
| Reload after grant | Authorized behavior persists | Not run (manual) | Protocol walkthrough step 3 |
| Browser restart after grant | Authorized behavior persists | Not run (manual) | Protocol walkthrough step 4 |
| Extension update after grant | Settings and authorized registration persist without expanding access | **Pass (automated lifecycle)** + manual confirm pending | `background.test.mjs` / `registry.test.mjs`; protocol step 5 for a manifest-version update |
| Permission denial | No execution; clear local status | Not run (manual prompt) | Protocol walkthrough step 6 |
| Revoke origin | Registration removed and current activity stops | **Pass (automated stop path)** + manual confirm pending | `BB_STOP` in `pipeline.spec.mjs`; unregistration planning in `registry.test.mjs`; protocol step 7 |
| Browser restart after revoke | Revoked access and registration remain absent | Not run (manual) | Protocol walkthrough step 8 |
| Extension update after revoke | Revoked access and registration are not restored | **Pass (automated lifecycle)** + manual confirm pending | `background.test.mjs` (stale grant/registration removed); protocol step 9 |
| Similar but unauthorized origin | No execution or page mutation | **Pass (automated)** | `boundary.spec.mjs` registered-without-grant does not run; `origins` / registry unit tests |

## Sensitive-dialog regression matrix

Each case must prove that BannerBanner performs no click, removal, hiding, style mutation, or synthetic event.
Fixture column = automated CI evidence. Run R2 requires both human real-flow
spot checks from the protocol.

| Case | Fixture or real flow | Expected result | Status | Evidence |
|---|---|---|---|---|
| Login dialog | fixture `sensitive-login.html` | Untouched | **Pass (fixture)** | `pipeline.spec.mjs` protected loop — byte-identical dialog, zero clicks |
| Checkout dialog | fixture `sensitive-checkout.html` | Untouched | **Pass (fixture)** | same |
| Payment or 3-D Secure dialog | fixture `sensitive-payment.html` | Untouched | **Pass (fixture)** | same |
| Security or reauthentication prompt | fixture `sensitive-security.html` | Untouched | **Pass (fixture)** | same |
| Age-verification gate | fixture `sensitive-age-gate.html` | Untouched | **Pass (fixture)** | same |
| Session-expiration warning | fixture `sensitive-session.html` | Untouched | **Pass (fixture)** | same |
| Unsaved-work confirmation | fixture `sensitive-unsaved.html` | Untouched | **Pass (fixture)** | same |
| Newsletter signup | fixture `newsletter.html` | Untouched; unsupported | **Pass (fixture)** | same |
| Advertisement overlay | fixture `ad-overlay.html` | Untouched; unsupported | **Pass (fixture)** | same |
| Unknown large modal | fixture `unknown-modal.html` | Untouched; unsupported status only | **Pass (fixture)** | same |
| Login dialog (real flow spot check) | human | Untouched | Not run | Protocol sensitive-dialog section |
| Newsletter popup (real flow spot check) | human | Untouched | Not run | Protocol sensitive-dialog section |

## Package and storage audit

| Check | Expected result | Status | Evidence |
|---|---|---|---|
| Exact archive in fresh profile | Loads unpacked with no extension-card, service-worker, popup, or options errors | Not run | Protocol setup |
| Package checksum and inventory | SHA-256 matches Run R2; strict 21-file inventory unchanged | Not run | Protocol run-level audit |
| Local storage schema | Only `bb:settings`, `bb:authorizedOrigins`, and `bb:stats`; no prohibited fields | Not run | Protocol run-level audit |
| Sync storage | `{}` after normal use | Not run | Protocol run-level audit |
| Registration audit | One registration per currently authorized origin and no others | Not run | Protocol run-level audit |

## CMP fixture mode matrix (not a substitute for real sites)

| CMP | Necessary only | Accept all | Evidence |
|---|---|---|---|
| OneTrust | Pass | Pass | `pipeline.spec.mjs` |
| Cookiebot | Pass | Pass | `pipeline.spec.mjs` |
| CookieYes | Pass | Pass | `pipeline.spec.mjs` |
| Quantcast Choice | Unsupported (no click) | Pass | `pipeline.spec.mjs` + BB-013 |
| Usercentrics | Pass | Pass | `pipeline.spec.mjs` |
| Unresponsive OneTrust | unverified, one click max | — | `pipeline.spec.mjs` |

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
- Every claimed CMP passes both supported modes **on real sites**.
- Candidate lint, unit, browser, build, manifest, and package checks pass locally
  and in linked workflows at the exact candidate SHA.
- Permission grant, denial, persistence, revocation, post-revoke restart, and
  post-revoke update cases pass (manual + automated).
- Every sensitive-dialog case passes (fixtures done; both real spot checks
  required for Run R2).
- Fresh-profile load and run-level package/storage audits pass.
- No destructive false positive remains.
- All failures are fixed, explicitly unsupported, or cause the relevant support claim to be removed.
- `PB-03`, `PB-04`, `PB-05`, and `PB-11` link to this evidence.
