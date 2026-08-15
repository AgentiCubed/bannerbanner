# Getting started with BannerBanner (v0.1)

BannerBanner applies your cookie-consent choice on websites **you explicitly
enable**. It only acts on a small allowlist of fixture-tested consent-manager
candidates and leaves everything else alone.

Canonical product rules: [`docs/MVP_CONTRACT.md`](docs/MVP_CONTRACT.md).

## Install from source

```bash
npm run build:extension
```

1. Open `chrome://extensions/`
2. Enable **Developer mode**
3. **Load unpacked** → select `dist-extension/`
4. Pin the BannerBanner icon

A clean install has access to **no** websites.

## First use

1. Visit a site.
2. Click the BannerBanner toolbar icon.
3. Choose **Necessary only** (default) or **Accept all**.
4. Click **Enable on this site** and accept Chrome's permission prompt for that
   one origin.
5. Reload if the banner is already visible. On a candidate CMP, BannerBanner
   clicks the matching control and counts a success only after the CMP records
   the choice.

## Disable a site

- Popup → **Disable on this site**, or
- Options page → remove the origin, or
- `chrome://extensions` → BannerBanner → Site access

Revoking stops future injection and signals open tabs on that origin to stop.

## Fixture-tested launch candidates

These candidates are not supported claims until the linked real-site matrix passes.

| CMP | Necessary only | Accept all |
|---|---|---|
| OneTrust | candidate (fixtures pass) | candidate (fixtures pass) |
| Cookiebot | candidate (fixtures pass) | candidate (fixtures pass) |
| CookieYes | candidate (fixtures pass) | candidate (fixtures pass) |
| Usercentrics | candidate (fixtures pass) | candidate (fixtures pass) |
| Quantcast Choice | unsupported | candidate (fixtures pass) |

Real-site evidence: [`docs/REAL_SITE_TEST_MATRIX.md`](docs/REAL_SITE_TEST_MATRIX.md).

## What it does not do

- Run on sites you did not enable
- Close newsletters, ads, paywalls, or unknown dialogs
- Train custom patterns or share them
- Store page URLs or browsing history
- Send data anywhere

## Privacy

See [`extension/PRIVACY_POLICY.md`](extension/PRIVACY_POLICY.md). Only settings,
enabled origins, and aggregate counters are stored locally.

## Troubleshooting

| Symptom | Check |
|---|---|
| Nothing happens on a site | Is the site enabled? Is the CMP in the table above? |
| Banner remains | Unsupported CMP or mode (e.g. Quantcast + Necessary only) — left untouched on purpose |
| Want a clean slate | Options → Reset settings; disable sites individually |

## Help

Open a GitHub issue on the repository. Include the site **origin** (not full
URL paths), CMP name if known, mode, and extension version — never passwords or
personal page content.
