> **SUPERSEDED for v0.1 product claims.** This document describes alpha-era Spark UI / planning work. Canonical scope, safety rules, and release status live in [`docs/MVP_CONTRACT.md`](docs/MVP_CONTRACT.md), [`docs/RELEASE_GATES.md`](docs/RELEASE_GATES.md), [`docs/STATUS.md`](docs/STATUS.md), and [`PRD.md`](PRD.md). Do not treat features listed below (training, granular categories, TrustArc/Osano, all-site automation, community sharing) as shipped.


# BannerBanner MVP Assessment

> **Superseded assessment.** Earlier revisions of this document assessed the
> alpha-era Spark web app and scored features (training system, pattern
> sharing, granular categories, learning) that were later removed from the
> product. This revision assesses the shipped v0.1 Chrome extension.
> Canonical scope: [`docs/MVP_CONTRACT.md`](docs/MVP_CONTRACT.md); current
> truth: [`docs/STATUS.md`](docs/STATUS.md).

## Executive summary

BannerBanner v0.1 is a per-site opt-in Chrome Manifest V3 extension that
applies the user's cookie-consent preference ("Necessary only" or "Accept
all") on explicitly enabled sites, using a strict allowlist of CMP adapters
with verified postconditions. It has no backend, no accounts, no telemetry,
and no network activity; `chrome.storage.local` is the sole runtime store.

The MVP is defined by the release gates in
[`docs/RELEASE_GATES.md`](docs/RELEASE_GATES.md), not by feature counts.

## What exists and is verified (automated evidence)

- **Per-origin opt-in and revocation** — no static content scripts; dynamic
  registration reconciled against actual grants; revocation stops open tabs
  (PB-01, PB-02).
- **Verified CMP decisions** — adapters for OneTrust, Cookiebot, CookieYes,
  Usercentrics (both modes) and Quantcast Choice (*Accept all* only), each
  requiring the site-written consent signal plus site-initiated banner
  teardown (PB-03).
- **Fail-closed safety** — unknown dialogs receive no action of any kind;
  one fixture regression per protected sensitive-dialog class (PB-04,
  PB-05).
- **Single awaited pipeline** — one engine; settings load before scanning;
  duplicate/race guards (PB-06).
- **Versioned settings** — schema versioning, migration, corruption
  recovery, reset (PB-07).
- **Contract-conformant data handling** — bounded aggregate counters only;
  the schema cannot express URLs or history; sync storage stays empty
  (PB-08).
- **Complete, validated package** — strict inventory, reproducible icons,
  archive hash (PB-09).
- **CI** — syntax checks, 70 unit tests, 33 real-Chromium integration
  tests, build + package validation, repo-wide eslint (PB-10).

## What is missing or pending

- **Real-site evidence (PB-11 — the blocking gate).** All CMP support
  claims remain "candidate" until the manual protocol in
  `docs/REAL_SITE_TEST_PROTOCOL.md` is run against the candidate rows in
  `docs/REAL_SITE_TEST_MATRIX.md`. Chrome's permission prompt cannot be
  automated, so this requires a human.
- **Manual confirmations** for the grant/revoke/restart/update flows backing
  PB-01, PB-02, PB-07, PB-09.
- **Quantcast Choice "Necessary only"** — needs a settings-panel adapter
  (Parking Lot, BB-013).

## Explicitly not part of the MVP

Removed from the product and parked (require a recorded decision in
`docs/DECISIONS.md` to revisit):

- Banner training system / user-trained selectors.
- Community pattern sharing.
- Granular per-category consent beyond the two modes.
- Learning/adaptive detection.
- Newsletter, ad, paywall, or generic popup removal.
- The Spark web app (`src/`) as runtime UI — it is a design playground.
- Cross-browser support; any remote service.

## Verdict

The engineering MVP is complete and automated evidence is in place. The
product is **not** releasable to the private beta until PB-11's real-site
evidence exists and James confirms the pending manual checks.
