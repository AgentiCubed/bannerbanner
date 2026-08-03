# Privacy Policy for BannerBanner

**Last Updated:** December 2024

## Overview

BannerBanner ("we", "our", or "the extension") is committed to protecting your privacy. This Privacy Policy explains how we handle information when you use our browser extension.

## The Short Version

**We don't collect, store, or transmit any of your personal data. Period.**

All settings and preferences stay on your device. We have no servers, no analytics, and no tracking.

## Information We Don't Collect

BannerBanner does NOT collect, store, or transmit:

- ❌ Browsing history
- ❌ Personal information
- ❌ Website content you view
- ❌ Cookies or tracking data
- ❌ IP addresses
- ❌ Usage analytics
- ❌ Error reports
- ❌ Device information
- ❌ Any other personal data

## Information Stored Locally

BannerBanner stores the following information **on your device only** using Chrome's local storage:

### User Preferences
- Your selected privacy level (Necessary Only, Functional, Analytics, or All Cookies)
- Custom category settings (if you use advanced mode)
- Theme preference (Light, Dark, Banana, or Dark Banana)
- Whether automatic banner closing is enabled
- Whether banana celebrations are enabled
- Statistics (number of banners closed, last banner detected, etc.)

### Custom Patterns (Optional)
- If you use the "Learn Banner Pattern" feature, the patterns you create are stored locally
- These patterns contain CSS selectors and button patterns, not personal data
- You can choose whether to share patterns publicly (opt-in only)

### Test Results (Optional)
- If you use the "Testing" tab, results from your tests are stored locally
- These include website URLs and whether banners were detected
- This data never leaves your device

**Important:** All this data is stored using `chrome.storage.local`, which means:
- It stays on your device
- It's not synced to any server
- It's not accessible to us or any third party
- You can clear it at any time by uninstalling the extension

## Permissions Explained

BannerBanner requests the following permissions:

### `storage`
**Why we need it:** To save your privacy preferences locally on your device.
**What we do with it:** Store your settings so they persist between browser sessions.
**What we DON'T do:** Sync data to any server or share it with anyone.

### `activeTab`
**Why we need it:** To detect and interact with cookie banners on the page you're viewing.
**What we do with it:** Read the page structure to find cookie banners and click the appropriate buttons.
**What we DON'T do:** Monitor your browsing, track what sites you visit, or collect page content.

### `<all_urls>` (Host Permissions)
**Why we need it:** Cookie banners appear on all websites, so we need permission to work everywhere.
**What we do with it:** Run our content script to detect and close banners on any website you visit.
**What we DON'T do:** Transmit any information about the sites you visit or their content.

## Third-Party Services

**BannerBanner uses zero third-party services.**

- No analytics platforms (Google Analytics, Mixpanel, etc.)
- No error tracking (Sentry, Rollbar, etc.)
- No A/B testing services
- No advertising networks
- No remote servers or APIs
- No CDN or external resources

Everything runs entirely in your browser.

## Data Sharing

**We don't share any data because we don't collect any data.**

The only exception is if you **explicitly opt-in** to share custom banner patterns you create using the "Learn Banner Pattern" feature. Even then:

- Only the pattern itself (CSS selectors and button text) is shared
- No personal information is included
- Sharing is completely optional
- You control what gets shared
- Shared patterns are anonymized

## Children's Privacy

BannerBanner does not knowingly collect data from anyone, including children under 13. Since we don't collect any data at all, the extension is safe for users of all ages.

## Data Security

Since we don't collect or transmit data, there's no data for anyone to intercept or steal. Your preferences stay encrypted in Chrome's local storage, protected by your browser's built-in security.

## Your Rights

You have complete control over your data:

### Access Your Data
All your settings are visible in the extension popup and settings page.

### Export Your Data
You can view all stored data in Chrome DevTools:
1. Right-click the extension popup
2. Select "Inspect"
3. Go to Application > Storage > Local Storage

### Delete Your Data
Simply uninstall the extension, and all local data is automatically removed.

Or use the "Reset All Settings" option in the extension settings (if available).

## Changes to Privacy Policy

If we ever make changes to this privacy policy, we will:
1. Update the "Last Updated" date at the top
2. Notify users through the extension's update notes
3. Never introduce data collection without explicit consent

## Open Source Transparency

BannerBanner's source code is publicly available for review. You can verify that we do what we say by examining the code yourself.

Repository: [Link to GitHub repository]

## Contact

If you have questions about this Privacy Policy or BannerBanner's privacy practices:

- Open an issue on our GitHub repository
- Review the code yourself - it's open source!

## Compliance

This privacy policy is designed to comply with:
- Chrome Web Store Developer Program Policies
- General Data Protection Regulation (GDPR)
- California Consumer Privacy Act (CCPA)
- Other applicable privacy regulations

Since we don't collect data, compliance is straightforward: there's nothing to regulate.

## Summary

**What BannerBanner Does:**
✅ Automatically closes cookie banners based on your preferences
✅ Stores your settings locally on your device
✅ Works entirely in your browser

**What BannerBanner Doesn't Do:**
❌ Collect your personal information
❌ Track your browsing history
❌ Send data to any server
❌ Use analytics or telemetry
❌ Display ads or monetize your data

---

**You have our commitment:** BannerBanner was built to protect your privacy, not invade it. We'll never compromise that promise.

---

*This privacy policy is effective as of December 2024 and applies to version 1.0.0 and all subsequent versions of BannerBanner.*
