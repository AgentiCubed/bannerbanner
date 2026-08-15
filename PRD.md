# BannerBanner v0.1 — Product Requirements

> **Scope note.** This document describes the shipped v0.1 product: a Chrome
> Manifest V3 extension. Earlier revisions of this PRD described alpha-era
> concepts (a pattern training wizard, community pattern sharing, granular
> per-category consent, a learning system) that were removed from the product
> and are out of scope for v0.1. The canonical scope, safety rules, and
> authority order is defined in [`AGENTS.md`](AGENTS.md). This PRD is
> subordinate to `docs/MVP_CONTRACT.md`, `docs/DECISIONS.md`,
> `docs/RELEASE_GATES.md`, `docs/STATUS.md`, and
> `docs/IMPLEMENTATION_PLAN.md`; if this document disagrees with them, they win.

## Product summary

BannerBanner v0.1 is a per-site opt-in Chrome extension that applies the
user's chosen cookie-consent preference on websites the user explicitly
enables. On an enabled site, it recognizes a strict allowlist of
consent-management platforms (CMPs), activates that platform's own
"necessary only" or "accept all" control, verifies the platform recorded the
choice, and reports the outcome locally. There is no backend, no account, no
telemetry, and no network activity of any kind.

**Status:** release hardening for a Safe Chrome private beta. Automated
release gates PB-01 through PB-10 have evidence; the blocking gate is PB-11
(real-site acceptance), which requires manual browser evidence recorded in
[`docs/REAL_SITE_TEST_MATRIX.md`](docs/REAL_SITE_TEST_MATRIX.md).

## Experience qualities

1. **Protective** — a guardian of user privacy, with a hard safety line:
   unknown or sensitive dialogs are never touched.
2. **Honest** — a banner counts as handled only after the CMP's own control
   was activated *and* its consent signal was verified. Hiding a banner is
   never treated as consent.
3. **Trustworthy** — genuinely minimal permissions: the extension starts with
   access to zero websites and gains access one origin at a time, only after
   an explicit user action.

## Essential features (v0.1, as shipped)

### 1. Per-site opt-in

- No static content scripts. Enabling a site requests Chrome's optional host
  permission for that one origin and dynamically registers the content
  script for it.
- Disabling a site (or revoking access in `chrome://extensions`) removes the
  registration and signals already-open matching tabs to stop.
- Success criteria: a clean install injects nothing anywhere; revocation is
  complete and survives restart and extension update.

### 2. Two consent modes

- **Necessary only** (default) or **Accept all**, chosen in the options UI.
- The stored preference is loaded before any classification or execution.
- Success criteria: the selected mode persists across reload, browser
  restart, and extension update (versioned `chrome.storage.local` schema
  with migration and corruption recovery).

### 3. Allowlisted CMP handling with verified outcomes

- Supported platforms (launch candidates): OneTrust, Cookiebot, CookieYes,
  Usercentrics (both modes), and Quantcast Choice (*Accept all* only).
- One awaited pipeline owns detect → classify → decide → execute → verify →
  report (`extension/lib/pipeline.js`). One page can never have two engines
  acting independently.
- Success is recorded only after an adapter-specific postcondition passes:
  the site-written consent signal (cookie/storage) plus banner teardown by
  the site itself. There is no DOM-removal or hiding fallback.
- Success criteria: fixture-tested adapters per CMP and mode; public support
  claims follow real-site evidence in the test matrix.

### 4. Fail-closed safety

- Unknown dialogs receive no click, removal, hiding, style mutation, or
  synthetic event — the user gets an honest "unsupported" status.
- Login, checkout, payment, security, age-verification, session-expiration,
  and unsaved-work dialogs are never touched, enforced by one fixture
  regression per protected class.
- Success criteria: the safety regression suite passes; any destructive
  false positive blocks release.

### 5. Local aggregate statistics

- Bounded aggregate success/failure counters in `chrome.storage.local` only.
- No URLs, paths, query strings, page titles, page content, or chronological
  browsing history are stored; nothing enters sync storage; nothing is
  transmitted anywhere. See
  [`extension/PRIVACY_POLICY.md`](extension/PRIVACY_POLICY.md).

### 6. Optional banana celebration

- A small banana animation after a verified success only. It can be disabled
  and can never delay or substitute for the consent operation.

## Explicitly out of scope for v0.1

These are Parking Lot items, not features. Some existed in alpha builds and
were deliberately removed from the shipped package:

- Pattern training wizard / user-trained selectors.
- Community pattern sharing or any sharing backend.
- Granular per-category consent beyond the two modes.
- Any "learning system" or adaptive detection.
- Newsletter, advertisement, paywall, age-gate, or generic popup removal.
- Remote analytics, telemetry, accounts, synchronization, or cloud storage.
- Cross-browser support.
- The GitHub Spark web app under `src/` as extension runtime UI — it is a
  design playground only and is not part of the shipped extension.

Reintroducing any of these requires the private-beta gates to pass first and
a recorded scope change in `docs/DECISIONS.md`.

## Technical shape

- Chrome Manifest V3; permissions `storage`, `activeTab`, `scripting`; host
  access only via `optional_host_permissions`, granted per origin.
- Plain ES-module JavaScript runtime under `extension/` with zero runtime
  dependencies and no bundler.
- `chrome.storage.local` is the sole runtime store (versioned schema).
- Zero backend, zero database, zero network I/O.
- Automated checks: 70 unit tests, 33 real-Chromium integration tests,
  strict package validation, reproducible icons, repo-wide lint — all in CI.

## Success criteria for the private beta

Defined by the release gates in `docs/RELEASE_GATES.md` (PB-01 – PB-12). The
remaining blocking work is PB-11: manual real-site evidence for the
candidate CMP rows in `docs/REAL_SITE_TEST_MATRIX.md`, following
`docs/REAL_SITE_TEST_PROTOCOL.md`.
