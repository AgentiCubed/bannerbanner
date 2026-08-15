# BannerBanner: Project Status & Next Steps

> **Pointer document.** The authoritative, maintained status lives in
> [`docs/STATUS.md`](docs/STATUS.md). Earlier revisions of this file
> described the alpha-era Spark web app and claimed 100%-complete features
> (training, learning, eight generic "banner frameworks") that were removed
> from the product. This revision reflects the shipped v0.1 extension only.

## What the product is

A per-site opt-in Chrome Manifest V3 extension (`extension/`) that applies
the user's cookie-consent choice — *Necessary only* (default) or *Accept
all* — on explicitly enabled sites, for a strict allowlist of
consent-management platforms: OneTrust, Cookiebot, CookieYes, Usercentrics
(both modes), and Quantcast Choice (*Accept all* only). Every success is
verified against the CMP's own consent signal; unknown and sensitive
dialogs are never touched. All data is local (`chrome.storage.local`,
bounded aggregate counters only); there is no backend and no network I/O.

## What is complete

- v0.1 hardening rewrite merged (issues #24–#31 plus automatable parts of
  #32): single awaited pipeline, dynamic per-origin registration and
  revocation, versioned storage schema, fixture-tested CMP adapters,
  fail-closed unknown/sensitive handling.
- Automated evidence for release gates PB-01 through PB-10: 70 unit tests,
  33 real-Chromium integration tests, strict package validation,
  reproducible icons, repo-wide eslint in CI.
- Privacy policy rewritten to the observed storage schema.
- Documentation reconciled to v0.1 scope (PB-12).

## What is missing before the private beta

- **PB-11: Real-site acceptance** — the blocking gate. Run
  [`docs/REAL_SITE_TEST_PROTOCOL.md`](docs/REAL_SITE_TEST_PROTOCOL.md)
  against the candidate rows in
  [`docs/REAL_SITE_TEST_MATRIX.md`](docs/REAL_SITE_TEST_MATRIX.md). Requires
  a human at a browser (the permission prompt cannot be automated).
- James's confirmation runs for the manual portions of PB-01, PB-02, PB-07,
  and PB-09 (grant/revoke flows, restart/update persistence, fresh-profile
  load).

## Path to launch

1. Close PB-11 with real-site evidence; confirm the pending manual checks.
2. Safe Chrome private beta.
3. Chrome Web Store candidate gates (WS-01 …) per
   [`docs/RELEASE_GATES.md`](docs/RELEASE_GATES.md).

## Out of scope (Parking Lot)

Training, community sharing, granular categories, learning systems,
newsletter/ad/generic popup removal, cross-browser support, any remote
service, and the Spark web app (`src/` — design playground only). Changes
require a recorded decision in [`docs/DECISIONS.md`](docs/DECISIONS.md).
