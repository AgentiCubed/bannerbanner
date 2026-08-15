# Iteration 6 Summary (historical)

> **Historical document.** Iteration 6 was an alpha-era milestone of the
> GitHub Spark web app. Its claims below have been corrected to match the
> shipped v0.1 product; the alpha features it originally celebrated
> (pattern training, learning system, in-page banner engine in the web app)
> were removed from the product. Current truth lives in
> [`docs/STATUS.md`](docs/STATUS.md); canonical scope in
> [`docs/MVP_CONTRACT.md`](docs/MVP_CONTRACT.md).

## What Iteration 6 actually was

Iteration 6 built out the GitHub Spark web application under `src/` — a
React design playground exploring settings UI, a pattern library view, a
training wizard concept, themes, and a banana celebration. It demonstrated
UX direction; it was not, and is not, the shipped extension.

## What replaced it

The v0.1 hardening rewrite (issues #24–#31) replaced the alpha runtime with
the current Chrome Manifest V3 extension under `extension/`:

- Genuine per-origin opt-in via `optional_host_permissions` and dynamically
  registered content scripts — no static all-site scripts.
- One awaited consent pipeline (`extension/lib/pipeline.js`): detect →
  classify → decide → execute → verify → report.
- A strict allowlist of CMP adapters (OneTrust, Cookiebot, CookieYes,
  Usercentrics; Quantcast Choice for *Accept all*), each with a verified
  postcondition. No DOM-removal or hiding fallbacks.
- Fail-closed handling of unknown dialogs and a regression suite protecting
  sensitive workflows (login, checkout, payment, security, age verification,
  session expiration, unsaved work).
- `chrome.storage.local` as the sole runtime store with a versioned schema;
  bounded aggregate counters only; zero backend and zero network I/O.

## Claims corrected

The original version of this document declared "MVP ACHIEVED" and listed the
following as shipped capabilities. They were not shipped and are out of
scope for v0.1 (Parking Lot):

- Pattern training wizard / user-trained selectors.
- Community pattern sharing.
- Granular per-category consent controls.
- A "learning system" that adapts to new banners.
- Generic banner/popup dismissal without verified CMP consent.

## Where the project stands

See [`docs/STATUS.md`](docs/STATUS.md). The blocking release gate is PB-11
(real-site acceptance, requiring manual browser evidence in
[`docs/REAL_SITE_TEST_MATRIX.md`](docs/REAL_SITE_TEST_MATRIX.md)).
