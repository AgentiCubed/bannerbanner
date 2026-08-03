# 🍌 BannerBanner

**Applies your cookie-consent choice on websites you explicitly enable.**

BannerBanner v0.1 is a per-site opt-in Chrome extension for cookie-consent
banners. On sites you enable, it recognizes a small allowlist of
consent-management platforms (CMPs), clicks that platform's own
"necessary only" or "accept all" control according to your preference,
verifies the platform recorded the choice, and reports the outcome locally.
Everything else on a page is left alone.

The authoritative scope, safety rules, and release process live in the
operating pack: [`docs/MVP_CONTRACT.md`](docs/MVP_CONTRACT.md),
[`docs/RELEASE_GATES.md`](docs/RELEASE_GATES.md),
[`docs/DECISIONS.md`](docs/DECISIONS.md).

## ✨ What v0.1 does

- 🔒 **Genuine per-site opt-in** — no static content scripts; the extension
  starts with access to zero websites. Enabling a site requests Chrome's
  permission for that one origin and dynamically registers the content script
  for it. Disabling a site (or revoking in `chrome://extensions`) removes the
  registration and stops activity in open tabs.
- 🎯 **Two consent modes** — *Necessary only* (default) or *Accept all*.
- ✅ **Verified outcomes** — a banner counts as handled only after the CMP's
  own control was clicked *and* its consent signal (cookie/storage write plus
  banner teardown by the site) is observed. Hiding or removing a banner is
  never treated as consent.
- 🛡️ **Hard safety line** — unknown dialogs get no automatic action of any
  kind. Login, checkout, payment, security, age-verification,
  session-expiration, and unsaved-work dialogs are never touched, enforced by
  a regression suite.
- 📊 **Local aggregate counters only** — no URLs, page titles, content, or
  browsing history are stored; nothing enters sync storage; nothing is
  transmitted anywhere. See the
  [privacy policy](extension/PRIVACY_POLICY.md).
- 🍌 **Optional celebration** — a small banana animation, only after a
  verified success.

## 🚫 What v0.1 deliberately does not do

Newsletter/ad/paywall popup removal, generic modal dismissal, user-trained
patterns, community pattern sharing, granular per-category consent,
cross-browser support, and any remote service are all out of scope — see the
[MVP contract](docs/MVP_CONTRACT.md). The GitHub Spark web app under `src/`
is a design playground and is not part of the extension runtime.

## 🎯 Supported CMPs (launch candidates)

OneTrust, Cookiebot, CookieYes, Usercentrics (both modes), and Quantcast
Choice (*Accept all* only). Each has fixture-tested adapters with verified
postconditions; public support claims follow real-site evidence in
[`docs/REAL_SITE_TEST_MATRIX.md`](docs/REAL_SITE_TEST_MATRIX.md).

## 🚀 Quick start

```bash
# Build + validate the extension package
npm run build:extension

# Load in Chrome
#   chrome://extensions → Developer mode → Load unpacked → select dist-extension/
```

Then visit a site with a supported cookie banner, click the BannerBanner
toolbar icon, and choose **Enable on this site**.

### Tests

```bash
npm run test:extension            # unit tests (no dependencies, node --test)
npm run validate:extension        # manifest/package validation
cd extension/test/browser && npm install && npm test   # real-Chromium tests
```

CI runs all of these on every pull request
(`.github/workflows/extension-ci.yml`).

## 📦 Project structure

```
extension/           The Chrome extension (see extension/README.md)
  lib/               Unit-tested core modules (pipeline, adapters, registry…)
  test/unit/         node --test suites
  test/browser/      Playwright integration tests + CMP/sensitive fixtures
scripts/             Icon generation + package validation
docs/                Operating pack: contract, decisions, gates, status, matrix
src/                 GitHub Spark web app (not part of the extension runtime)
```

## 📄 License

The Spark Template files and resources from GitHub are licensed under the
terms of the MIT license, Copyright GitHub, Inc.
