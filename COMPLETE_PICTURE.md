# BannerBanner: The Complete Picture

> **Corrected overview.** Earlier revisions of this document narrated the
> six alpha iterations of the Spark web app as if their features (training
> wizard, learning system, generic banner dismissal) had shipped. They did
> not. This revision describes the product as it exists: the v0.1 Chrome
> Manifest V3 extension. Canonical scope:
> [`docs/MVP_CONTRACT.md`](docs/MVP_CONTRACT.md); current truth:
> [`docs/STATUS.md`](docs/STATUS.md).

## The journey

- **Alpha (iterations 1–6):** a GitHub Spark React web app (`src/`) explored
  the concept — settings UI, pattern library, training wizard, themes,
  banana celebration — alongside an early extension with static content
  scripts and heuristic banner dismissal.
- **v0.1 hardening rewrite (issues #24–#31):** the alpha runtime was
  replaced. Static content scripts, the second engine (`bananer.js`),
  DOM-removal fallbacks, training/sharing UI, and URL-bearing history were
  all removed. The Spark app remains in the repo as a design playground
  only.

## The product

On sites the user explicitly enables, BannerBanner recognizes a strict
allowlist of consent-management platforms — OneTrust, Cookiebot, CookieYes,
Usercentrics (both modes), Quantcast Choice (*Accept all* only) — clicks
that platform's own "necessary only" or "accept all" control per the user's
preference, verifies the platform recorded the choice (site-written consent
signal plus site-initiated banner teardown), and counts the outcome locally.
Unknown dialogs get no action; sensitive workflows (login, checkout,
payment, security, age verification, session expiration, unsaved work) are
protected by a regression suite.

## The architecture

- **Manifest V3**, permissions `storage`, `activeTab`, `scripting`; host
  access only via `optional_host_permissions`, granted one origin at a time.
- **`extension/background.js`** — origin registry, dynamic content-script
  registration/removal, reconciliation against actual grants, stop signal to
  open tabs on revocation.
- **`extension/lib/pipeline.js`** — the single awaited pipeline: detect
  (`dom-probe.js`) → classify (`classify.js`) → decide → execute
  (`cmp-adapters.js`) → verify → report (`stats.js`).
- **`extension/lib/settings-schema.js`** — versioned `chrome.storage.local`
  schema with migration, corruption recovery, and reset.
- **Zero backend, zero database, zero network I/O, zero runtime
  dependencies.** The runtime is plain ES-module JavaScript (~1,600 lines).

## The verification story

- 70 unit tests (`node --test`) covering the pipeline, adapters,
  classification, registry, origins, settings schema, and stats.
- 33 real-Chromium integration tests: permission boundary with the built
  extension loaded; CMP, sensitive, and unknown fixtures against the shipped
  runtime modules.
- CI on every pull request: syntax checks, unit tests, icon
  reproducibility, build + strict package validation, both browser suites,
  and repo-wide eslint.
- Release is gated by [`docs/RELEASE_GATES.md`](docs/RELEASE_GATES.md); the
  blocking gate is PB-11 (manual real-site evidence).

## The future

Everything beyond v0.1 lives in the Parking Lot in
[`docs/STATUS.md`](docs/STATUS.md) — including training, sharing, granular
categories, other browsers, and the Bananer characters — and requires the
private-beta gates to pass plus a recorded decision in
[`docs/DECISIONS.md`](docs/DECISIONS.md) before any of it returns.
