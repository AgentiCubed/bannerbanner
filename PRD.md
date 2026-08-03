# BannerBanner product requirements (v0.1)

Status: Canonical for the shipped Chrome extension  
Supersedes: alpha-era PRD content (training, granular categories, 30+ CMPs, all-site automation)  
Authority: When this file conflicts with older root markdown, prefer
`docs/MVP_CONTRACT.md`, then this PRD, then code and tests.

## Mission

BannerBanner v0.1 is a per-site opt-in Chrome extension that applies a user's
chosen cookie-consent preference on explicitly authorized websites. It acts
only when it can identify and activate a supported consent-management platform
(CMP) control, verifies the result, and reports success locally.

## Product promise

- Cookie-consent banners only.
- Genuine per-origin opt-in enforced with dynamic content-script registration.
- Two preference modes: **Necessary only** (default) and **Accept all**.
- Success only after the intended control is activated and an adapter-specific
  postcondition is verified.
- Unknown and sensitive dialogs receive no automatic action.
- Local aggregate counters only; no URL-bearing history; no remote services.

## In scope (v0.1)

| Area | Requirement |
|---|---|
| Platform | Chrome Manifest V3 |
| Access model | Optional host permissions; no static all-site content scripts |
| CMP allowlist | OneTrust, Cookiebot, CookieYes, Usercentrics (both modes); Quantcast Choice (**Accept all** only — BB-013) |
| Modes | `necessary`, `all` |
| UI | Toolbar popup (enable/disable site, mode, stats) + options page |
| Storage | `chrome.storage.local` keys `bb:settings`, `bb:authorizedOrigins`, `bb:stats` |
| Celebration | Optional banana animation only after verified success |
| Evidence | Unit, browser integration, package validation, real-site matrix |

## Out of scope (v0.1)

Recorded in `docs/MVP_CONTRACT.md` and the Parking Lot in `docs/STATUS.md`:

- Newsletter, advertisement, paywall, age-gate, or generic popup removal
- Automatic action on unknown dialogs
- DOM removal/hiding as a consent fallback
- Granular per-category consent automation
- User-trained selectors / training wizard
- Community pattern sharing or any backend
- Spark dashboard as extension runtime UI
- Cross-browser support
- Remote analytics, accounts, sync, or cloud storage
- TrustArc, Osano, Cookie Notice, and other non-allowlisted CMPs (BB-014)

## Safety invariants

See `docs/MVP_CONTRACT.md`. Non-negotiable summary:

1. Unknown means no automatic action.
2. Sensitive workflows remain untouched.
3. Consent is an action, not the absence of a banner.
4. Settings load before classification or execution.
5. One pipeline owns detect → decide → execute → verify → report.
6. Revoking an origin stops injection and current activity.
7. No full URL/path/query/title/content stored as history.
8. Success requires verified postcondition.
9. Celebration cannot delay or substitute for consent.
10. A destructive false positive blocks release.

## Permissions

| Permission | Why |
|---|---|
| `storage` | Settings, authorized origins, aggregate stats |
| `activeTab` | Popup knows the current tab origin for enable/disable |
| `scripting` | Register/unregister the content script per granted origin |
| Optional `http(s)://*/*` | Requested one origin at a time after explicit user action |

## User experience

1. Install → extension has access to **zero** sites.
2. User opens popup on a site → **Enable on this site** → Chrome permission prompt.
3. On grant, content script registers for that origin only.
4. If a supported CMP is present, BannerBanner clicks the mode-appropriate
   control and verifies the CMP's own consent signal.
5. Popup/options show local status and aggregate counters.
6. **Disable on this site** unregisters the script, drops the origin, and stops
   open tabs on that origin.

## Acceptance

v0.1 private beta requires every `PB-*` gate in `docs/RELEASE_GATES.md` with
linked evidence. Chrome Web Store submission additionally requires every
`WS-*` gate. No percentage-complete claim overrides an open gate.

## Design notes (non-blocking)

The GitHub Spark app under `src/` is a design playground and is **not** part of
the extension runtime. Visual polish there must not be described as shipped
extension functionality.
