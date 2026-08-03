# Privacy Policy for BannerBanner

**Last updated:** August 2026
**Applies to:** BannerBanner v0.1.x

## Overview

BannerBanner is a Chrome extension that applies your cookie-consent choice
("Necessary only" or "Accept all") on websites you explicitly enable, and only
when it recognizes a supported consent-management platform. This policy
describes exactly what the extension stores and does. It is written to match
the shipped code, and the repository's automated tests check the storage
behavior described here.

## The short version

- BannerBanner runs **only on sites you explicitly enable**, one site at a time.
- Everything it stores stays **on your device** in Chrome's extension storage.
- It keeps **aggregate counters only** — never page URLs, page titles, page
  content, or any chronological browsing history.
- It has **no servers, no analytics, no telemetry**, and transmits nothing.

## What BannerBanner stores (all local)

BannerBanner stores exactly three things, in `chrome.storage.local`:

1. **Settings** (`bb:settings`) — your consent mode (`necessary` or `all`),
   whether automatic handling is on, and whether the celebration animation is
   on, plus a schema version number.
2. **Enabled sites** (`bb:authorizedOrigins`) — the list of website origins
   (for example `https://example.com`) you have explicitly enabled. This is
   the record of your own opt-in choices, not a browsing history: an origin is
   added only when you click "Enable on this site" and approve Chrome's
   permission prompt, and it is removed when you disable the site.
3. **Aggregate statistics** (`bb:stats`) — counters of outcomes: how many
   verified successes, unverified attempts, unsupported banners, and skipped
   dialogs, plus per-consent-manager success counts. Counters only; they
   contain no URLs, timestamps, or per-page records.

BannerBanner does **not** store:

- full page URLs, URL paths, or query strings;
- page titles or page content;
- a chronological history of pages visited or banners handled;
- cookies or data from the sites you visit;
- anything in `chrome.storage.sync` (sync storage is not used).

If you are upgrading from a pre-0.1 build, the old build's stored history is
deleted on update.

## What BannerBanner transmits

Nothing. There are no remote servers, no analytics platforms, no error
reporting services, no CDNs, and no network requests made by the extension.

## Permissions explained

- **`storage`** — saves the three items above on your device.
- **`activeTab` / toolbar button** — lets the popup show which site you are on
  so you can enable or disable BannerBanner for that site.
- **`scripting`** — registers the content script for a site *after* you enable
  it, and removes that registration when you disable it.
- **Optional host access (`http://*/*`, `https://*/*`)** — these are
  *optional* permissions: BannerBanner starts with access to no websites at
  all. When you click "Enable on this site", Chrome asks you to grant access
  to that one origin. Only granted origins are ever injected, and revoking a
  site (from the popup, the options page, or `chrome://extensions`) stops
  BannerBanner there.

## What the extension does on an enabled site

On a site you enabled, BannerBanner looks for a small allowlist of known
cookie-consent managers. If it finds one it clicks that manager's own
"reject all"/"necessary only" or "accept all" control according to your
setting, verifies the manager recorded the choice, and counts the outcome.
If it does not recognize the dialog, it does nothing to the page. It never
fills forms, reads personal data, or interacts with login, checkout, payment,
or other sensitive dialogs — those are explicitly excluded and covered by
regression tests.

## Your controls

- **See your data:** the options page shows your settings, enabled sites, and
  the counters.
- **Delete your data:** disable sites individually, use "Reset settings to
  defaults", or uninstall the extension — uninstalling removes all stored
  data.

## Children's privacy

BannerBanner collects no data from anyone, including children.

## Changes to this policy

Changes update the date above and ship in the extension's release notes. The
policy will never describe less than what the code actually does; the
repository's tests compare stored data against the schema described here.

## Contact

Open an issue on the GitHub repository. The source code is public and this
policy can be checked against it.
