# BannerBanner v0.1 release notes

Target audience: private beta testers and Chrome Web Store listing “What's new”.

## Summary

BannerBanner v0.1 applies your cookie-consent preference on websites you
explicitly enable. It supports a small allowlist of consent-management
platforms, verifies each outcome, and never acts on unknown or sensitive
dialogs.

## Included

- Per-site opt-in with dynamic content-script registration (no all-site access)
- Modes: **Necessary only** (default) and **Accept all**
- Launch CMP candidates: OneTrust, Cookiebot, CookieYes, Usercentrics (both
  modes); Quantcast Choice (**Accept all** only)
- Toolbar popup + options page backed by `chrome.storage.local`
- Local aggregate success/failure counters (no URLs or browsing history)
- Optional banana celebration after verified success only
- Automated unit, browser-fixture, package, and permission-boundary checks

## Not included

- Newsletter, ad, paywall, or generic popup removal
- Training wizard or community pattern sharing
- Granular per-category consent automation
- TrustArc, Osano, Cookie Notice, or other non-allowlisted CMPs
- Cross-browser builds, accounts, sync, or remote telemetry
- Spark web app UI as part of the extension

## Privacy

See `extension/PRIVACY_POLICY.md`. Nothing is transmitted. Sync storage is unused.

## Upgrade notes

Upgrading from pre-0.1 alpha builds deletes legacy URL-bearing history and
migrates settings into the versioned `bb:settings` schema. Re-enable sites
explicitly after install if you used the alpha static content-script build.
