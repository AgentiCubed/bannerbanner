> **SUPERSEDED for v0.1 product claims.** This document describes alpha-era Spark UI / planning work. Canonical scope, safety rules, and release status live in [`docs/MVP_CONTRACT.md`](docs/MVP_CONTRACT.md), [`docs/RELEASE_GATES.md`](docs/RELEASE_GATES.md), [`docs/STATUS.md`](docs/STATUS.md), and [`PRD.md`](PRD.md). Do not treat features listed below (training, granular categories, TrustArc/Osano, all-site automation, community sharing) as shipped.


# 🧪 BannerBanner Testing Guide

Complete guide for testing BannerBanner on real websites with live cookie banners.

## Table of Contents

- [Quick Start](#quick-start)
- [Extension Setup](#extension-setup)
- [Testing Process](#testing-process)
- [Test Sites](#test-sites)
- [Troubleshooting](#troubleshooting)
- [Advanced Testing](#advanced-testing)

---

## Quick Start

### Prerequisites
- Chrome or Chromium-based browser (Chrome, Edge, Brave, etc.)
- BannerBanner extension loaded in developer mode
- Basic understanding of browser DevTools (F12)

### 5-Minute Test
1. Load the extension from `/extension` directory
2. Set privacy preference to "Necessary Only"
3. Open https://www.bbc.com in **incognito mode**
4. Watch the cookie banner automatically close
5. Verify banana celebration appears (if enabled)

---

## Extension Setup

### 1. Load Unpacked Extension

1. Open Chrome and navigate to `chrome://extensions/`
2. Toggle **Developer mode** (top right corner) to ON
3. Click **Load unpacked**
4. Select the `/extension` directory from this project
5. Verify the BannerBanner icon appears in your toolbar

### 2. Configure Preferences

Click the BannerBanner icon in your toolbar to open the popup:

- **Privacy Level**: Choose your default privacy stance
  - `Necessary Only` - Maximum privacy (recommended for testing)
  - `Functional` - Includes preference cookies
  - `Analytics` - Includes usage tracking
  - `All Cookies` - Accept everything
  
- **Automatic Closing**: Ensure this is enabled
- **Banana Celebration**: Enable for visual feedback when banners close

### 3. Grant Permissions

The extension requires:
- `activeTab` - To detect banners on the current page
- `storage` - To save your preferences
- Host permissions - To run on all websites

---

## Testing Process

### Best Practices

#### ✅ DO:
- **Use incognito/private mode** for each test (ensures fresh cookies)
- **Test one site at a time** and record results
- **Clear cache and cookies** between tests if not using incognito
- **Check browser console** (F12) for debugging info
- **Take screenshots** of successful/failed attempts
- **Note the banner type** detected (OneTrust, Cookiebot, etc.)

#### ❌ DON'T:
- Test multiple sites in rapid succession (can cache behaviors)
- Assume failure - some banners load slowly
- Ignore console errors - they reveal root causes
- Test with other cookie extensions enabled (conflicts)

### Step-by-Step Testing

#### Step 1: Prepare Environment
```
1. Open new incognito window (Ctrl+Shift+N / Cmd+Shift+N)
2. Open DevTools (F12)
3. Go to Console tab
4. Keep it visible during test
```

#### Step 2: Visit Test Site
```
1. Navigate to test URL
2. Wait 3-5 seconds for page to fully load
3. Observe banner behavior
```

#### Step 3: Evaluate Success

**✓ SUCCESS INDICATORS:**
- Cookie banner appears briefly (1-2 seconds max)
- Banner closes automatically without interaction
- Banana celebration animation appears (if enabled)
- Console shows: "✅ Banner closed: [BannerType]"
- No banner reappears on page refresh

**✗ FAILURE INDICATORS:**
- Banner stays visible for >3 seconds
- Banner requires manual interaction
- Console shows errors or warnings
- Banner reappears after refresh

#### Step 4: Verify Cookie Settings

1. Open DevTools → **Application** tab
2. Navigate to **Cookies** → Select site domain
3. Verify only necessary cookies are present
4. Analytics/marketing cookies should be absent or set to `rejected`

#### Step 5: Record Results

Document:
- ✅ Pass / ❌ Fail
- Banner framework detected (OneTrust, Cookiebot, etc.)
- Time to close (in seconds)
- Any errors or unexpected behavior
- Screenshots for reference

---

## Test Sites

### High Priority (Major News & Media)

| Site | URL | Banner Type | Expected Behavior |
|------|-----|-------------|-------------------|
| **BBC** | https://www.bbc.com | OneTrust | Auto-close in 1-2s |
| **CNN** | https://www.cnn.com | OneTrust | Auto-close in 1-2s |
| **Forbes** | https://www.forbes.com | TrustArc | Auto-close in 2-3s |
| **The Guardian** | https://www.theguardian.com | Custom | Auto-close in 1-2s |

### Medium Priority (E-commerce & Services)

| Site | URL | Banner Type | Expected Behavior |
|------|-----|-------------|-------------------|
| **Etsy** | https://www.etsy.com | Cookiebot | Auto-close in 1-2s |
| **Medium** | https://medium.com | Custom | Auto-close in 1-2s |
| **LinkedIn** | https://www.linkedin.com | OneTrust | Auto-close in 1-2s |

### Low Priority (Additional Coverage)

| Site | URL | Banner Type | Notes |
|------|-----|-------------|-------|
| **TechCrunch** | https://techcrunch.com | Various | May use multiple frameworks |
| **IMDB** | https://www.imdb.com | Custom | Amazon's consent manager |
| **Reddit** | https://www.reddit.com | Custom | Dynamic loading |

### Testing Notes

**BBC (OneTrust)**
- Banner loads immediately on page load
- Has "Accept All" and "Reject All" buttons clearly labeled
- Settings modal available for granular control
- Test on multiple sections (News, Sport, etc.)

**CNN (OneTrust)**
- Similar to BBC but may have region-specific variants
- Test on article pages vs. homepage
- Video players may trigger additional consents

**Forbes (TrustArc)**
- Banner can be slow to load (2-3 second delay)
- May show "Continue to site" option
- Sometimes uses overlay instead of banner

**The Guardian**
- Custom implementation - good edge case test
- Preference center is feature-rich
- May require multiple interactions for full customization

---

## Troubleshooting

### Banner Not Detected

**Symptom:** Cookie banner appears but doesn't close automatically

**Possible Causes:**
1. Banner uses unknown framework/pattern
2. Selectors have changed (site updated their implementation)
3. Banner loads dynamically after detection window
4. Extension permissions not granted

**Solutions:**
```
1. Check console for detection messages
2. Verify extension has permission for the domain
3. Reload page and wait longer (some banners delay 5+ seconds)
4. Report unknown banner via the "Learn" tab
5. Check if site is using a new version of known framework
```

### Banner Detected But Not Closed

**Symptom:** Console shows detection but banner remains visible

**Possible Causes:**
1. Click handler blocked by site
2. CORS/CSP restrictions
3. Button selector changed
4. Shadow DOM implementation

**Solutions:**
```
1. Check console for click errors
2. Verify button selectors in DevTools
3. Test with "Open Settings" instead of direct rejection
4. Report issue with site details
```

### Extension Not Running

**Symptom:** No console messages, no detection at all

**Possible Causes:**
1. Extension disabled
2. Incognito permissions not granted
3. Site excluded from manifest permissions
4. Content script failed to inject

**Solutions:**
```
1. Visit chrome://extensions/ - verify extension is enabled
2. Check "Allow in incognito" is toggled ON
3. Verify manifest.json includes correct host permissions
4. Reload extension (click refresh icon)
5. Check background service worker for errors
```

### Cookies Still Set After Rejection

**Symptom:** Marketing/analytics cookies present after banner closes

**Possible Causes:**
1. Site doesn't respect consent choices
2. Third-party scripts loaded before consent
3. Cookies set via HTTP headers (not JavaScript)
4. LocalStorage/SessionStorage used instead

**Solutions:**
```
1. This may be a site compliance issue, not extension failure
2. Verify banner actually clicked "Reject" (check console logs)
3. Some sites set cookies regardless - report to site operator
4. Consider using additional privacy extensions (uBlock Origin, etc.)
```

---

## Advanced Testing

### Testing Custom Patterns

If you encounter an unknown banner:

1. Go to the **Learn** tab in BannerBanner
2. Click **"Train Unknown Banners"**
3. Follow the step-by-step wizard:
   - Identify the container element
   - Point to "Accept All" button
   - Point to "Reject All" button
   - Optionally find Settings button
4. Test the new pattern
5. Share publicly (optional) to help other users

### Testing Edge Cases

**Delayed Banners:**
- Some sites delay banner loading (anti-bot measure)
- Wait up to 10 seconds before marking as failure
- Check if banner appears after scrolling

**Modal Overlays:**
- Some banners use full-screen overlays
- Verify overlay is removed after banner closes
- Check if page is still interactive

**Multi-Step Consents:**
- Some sites show multiple banners (cookies + newsletter + location)
- Test each consent type independently
- Verify all are handled appropriately

**Geolocation-Specific:**
- EU users see GDPR-compliant banners
- Non-EU may see different or no banners
- Use VPN to test different regions

### Performance Testing

Monitor extension impact:

1. Open DevTools → **Performance** tab
2. Record page load with extension enabled
3. Record page load with extension disabled
4. Compare:
   - Total load time
   - JavaScript execution time
   - DOM manipulation overhead

**Expected Impact:**
- < 100ms additional load time
- < 50ms JavaScript execution
- Minimal DOM manipulation (only banner elements)

### Automated Testing

For CI/CD integration:

```javascript
// Example Puppeteer test
const puppeteer = require('puppeteer');

async function testBannerBanner(url) {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      '--disable-extensions-except=/path/to/extension',
      '--load-extension=/path/to/extension'
    ]
  });
  
  const page = await browser.newPage();
  await page.goto(url);
  
  // Wait for extension to process
  await page.waitForTimeout(5000);
  
  // Check if banner is gone
  const bannerPresent = await page.$('.cookie-banner') !== null;
  
  console.log(`Banner present: ${bannerPresent}`);
  await browser.close();
}
```

---

## Reporting Issues

### What to Include

When reporting a failed test:

1. **Site URL** - Exact page that failed
2. **Banner Type** - Framework name if known
3. **Browser** - Chrome version, OS
4. **Console Logs** - Copy relevant errors
5. **Screenshots** - Banner appearance
6. **Steps to Reproduce** - Exact sequence
7. **Expected vs. Actual** - What should happen vs. what did

### Where to Report

- GitHub Issues: [Link to issues page]
- Extension Popup: Feedback form
- Testing Tab: Results tracker

---

## Testing Checklist

Use this checklist for systematic testing:

### Pre-Test Setup
- [ ] Extension loaded in developer mode
- [ ] Incognito mode ready
- [ ] DevTools open to Console
- [ ] Preferences configured
- [ ] Test site list prepared

### For Each Site
- [ ] Open in fresh incognito tab
- [ ] Wait for full page load
- [ ] Observe banner behavior
- [ ] Check console logs
- [ ] Verify cookie settings
- [ ] Record pass/fail
- [ ] Take screenshots if needed
- [ ] Note any anomalies

### Post-Test
- [ ] Results documented
- [ ] Issues filed (if any)
- [ ] Patterns updated (if needed)
- [ ] Summary report created

---

## Success Metrics

### Definition of Success

A test is successful when:
- ✅ Banner detected within 3 seconds of page load
- ✅ Banner closed within 2 seconds of detection
- ✅ Correct preference applied (verify in cookies)
- ✅ No errors in console
- ✅ Page remains functional after banner removal
- ✅ Banner doesn't reappear on refresh

### Target Coverage

**MVP Success Criteria:**
- 80%+ success rate on top 20 test sites
- All major frameworks (OneTrust, Cookiebot, TrustArc) working
- < 3 second average time to close
- Zero page breakage incidents

**Production Ready:**
- 95%+ success rate on top 50 sites
- All common frameworks covered
- < 2 second average time to close
- Graceful degradation for unknown patterns

---

## Next Steps

After completing basic testing:

1. **Expand Test Coverage** - Add more sites to your test list
2. **Test Edge Cases** - Delayed banners, dynamic content, etc.
3. **Regional Testing** - Use VPN to test GDPR vs. non-GDPR regions
4. **Mobile Testing** - Test on mobile browsers if supported
5. **Contribute Patterns** - Share successful custom patterns
6. **Performance Optimization** - Profile and improve detection speed

---

## Additional Resources

- **Extension Development**: See `/extension/README.md`
- **Pattern Library**: See `/src/lib/banner-patterns.ts`
- **User Guide**: See `USER_GUIDE.md`
- **Contributing**: See `CONTRIBUTING.md` (if available)

---

**Last Updated:** [Current Date]
**Tested With:** Chrome 120+, BannerBanner v1.0.0
