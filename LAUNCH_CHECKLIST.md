> **SUPERSEDED for v0.1 product claims.** This document describes alpha-era Spark UI / planning work. Canonical scope, safety rules, and release status live in [`docs/MVP_CONTRACT.md`](docs/MVP_CONTRACT.md), [`docs/RELEASE_GATES.md`](docs/RELEASE_GATES.md), [`docs/STATUS.md`](docs/STATUS.md), and [`PRD.md`](PRD.md). Do not treat features listed below (training, granular categories, TrustArc/Osano, all-site automation, community sharing) as shipped.


# 📋 Chrome Web Store Launch Checklist

## Pre-Submission Requirements

### 1. Extension Assets ✅/❌

- [ ] **Icons Created**
  - [ ] `dist/icons/icon-16.png` (16×16px)
  - [ ] `dist/icons/icon-32.png` (32×32px)
  - [ ] `dist/icons/icon-48.png` (48×48px)
  - [ ] `dist/icons/icon-128.png` (128×128px)
  - [ ] All icons use shield + banana design
  - [ ] High contrast, readable at small sizes
  - [ ] PNG format with transparency

- [ ] **Screenshots**
  - [ ] Main interface (1280×800 or 640×400)
  - [ ] Settings panel
  - [ ] Theme selector
  - [ ] Statistics dashboard
  - [ ] Banner training wizard
  - [ ] At least 3-5 total screenshots

- [ ] **Promotional Images**
  - [ ] Small promo tile: 440×280px
  - [ ] Large promo tile: 920×680px (optional)
  - [ ] Marquee promo tile: 1400×560px (optional)

### 2. Store Listing Content ✅/❌

- [ ] **Title** (Max 45 chars)
  - Suggestion: "BannerBanner - Auto Cookie Consent"

- [ ] **Summary** (Max 132 chars)
  - Suggestion: "Automatically manage cookie banners with your privacy preferences. Reject, accept, or customize - BannerBanner handles it all."

- [ ] **Description** (Max 16,000 chars)
  - [ ] What it does
  - [ ] Key features (bullet points)
  - [ ] How it works
  - [ ] Privacy focus
  - [ ] Banana Town easter egg mention
  - [ ] Support/contact info

- [ ] **Category**
  - Best fit: "Productivity"
  - Alternative: "Privacy & Security"

- [ ] **Language**
  - [ ] English (primary)
  - [ ] Additional languages if applicable

### 3. Legal & Privacy ✅/❌

- [ ] **Privacy Policy**
  - [ ] Create privacy policy document
  - [ ] Host publicly (GitHub Pages, website, etc.)
  - [ ] Include in manifest.json
  - [ ] Cover data collection (if any)
  - [ ] Explain chrome.storage usage
  - [ ] State: "No data sent to external servers"

- [ ] **Permissions Justification**
  - [ ] Document why each permission is needed:
    - `storage` - Save user preferences
    - `activeTab` - Interact with current page
    - `<all_urls>` - Detect banners on all sites

### 4. Technical Requirements ✅/❌

- [ ] **Build & Package**
  - [ ] Run `npm run build:extension`
  - [ ] Verify all files in `dist/`
  - [ ] Create ZIP: `cd dist && zip -r ../bannerbanner.zip .`
  - [ ] ZIP size under 100MB (should be <5MB)
  - [ ] No node_modules in ZIP
  - [ ] No .env or secrets in ZIP

- [ ] **Testing**
  - [ ] Load unpacked in Chrome (working ✅)
  - [ ] Test on 10+ real websites
  - [ ] All banner patterns working
  - [ ] Preferences save/load correctly
  - [ ] Statistics tracking accurate
  - [ ] Banana celebrations work
  - [ ] All themes display correctly
  - [ ] No console errors
  - [ ] Good performance (no lag)

- [ ] **Manifest Validation**
  - [ ] manifest_version: 3
  - [ ] name, version, description present
  - [ ] icons object complete
  - [ ] All file paths valid
  - [ ] Permissions minimal and justified

### 5. Developer Account ✅/❌

- [ ] **Chrome Web Store Developer**
  - [ ] Create account at [chrome.google.com/webstore/devconsole](https://chrome.google.com/webstore/devconsole)
  - [ ] Pay $5 one-time registration fee
  - [ ] Verify email address
  - [ ] Set up payment (if planning paid features)

### 6. Brand & Marketing ✅/❌

- [ ] **Social Presence** (Optional but recommended)
  - [ ] Twitter/X account
  - [ ] Website or landing page
  - [ ] Support email address
  - [ ] GitHub repository (already have!)

- [ ] **Support Channels**
  - [ ] Support email in manifest
  - [ ] FAQ or help documentation
  - [ ] Issue tracker (GitHub Issues)
  - [ ] Contact form or feedback mechanism

---

## Submission Process

### Step 1: Prepare ZIP
```bash
# From project root
npm run build:extension

# Verify icons are present
ls -la dist/icons/

# Create ZIP
cd dist
zip -r ../bannerbanner-extension.zip .
cd ..

# Verify ZIP contents
unzip -l bannerbanner-extension.zip
```

### Step 2: Chrome Web Store Dashboard

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Click "New Item"
3. Upload `bannerbanner-extension.zip`
4. Wait for upload and automated checks

### Step 3: Fill Out Listing

**Store Listing Tab:**
- Add title, summary, description
- Upload screenshots (drag to reorder)
- Add promotional images
- Select category
- Add icon (will auto-populate from manifest)

**Privacy Tab:**
- Add privacy policy URL
- Answer questions about data collection
- Justify permissions
- Certify compliance

**Pricing & Distribution:**
- Select "Free"
- Choose countries (suggest: Worldwide)
- Select languages supported

### Step 4: Submit for Review

1. Review all sections (green checkmarks)
2. Click "Submit for Review"
3. Wait for automated review (minutes)
4. Wait for manual review (1-3 business days)

### Step 5: Monitor Status

**Possible Outcomes:**
- ✅ **Approved** - Goes live immediately!
- ⚠️ **Rejected** - Review rejection reasons, fix, resubmit
- 🔄 **Pending** - Just wait

**Common Rejection Reasons:**
- Permissions not justified
- Missing privacy policy
- Misleading description
- Poor quality screenshots
- Manifest errors

---

## Post-Launch

### Immediately After Approval ✅/❌

- [ ] **Verify Listing**
  - [ ] Visit extension's Web Store page
  - [ ] Install from store (not sideload)
  - [ ] Test all functionality
  - [ ] Screenshots display correctly
  - [ ] Description formatted properly

- [ ] **Announce**
  - [ ] Post on social media
  - [ ] Share on Reddit (r/privacy, r/chrome, r/Chrome_Extensions)
  - [ ] Product Hunt launch (optional)
  - [ ] Hacker News Show HN (optional)

### First Week ✅/❌

- [ ] **Monitor**
  - [ ] Check reviews daily
  - [ ] Respond to feedback
  - [ ] Watch for bug reports
  - [ ] Monitor install count

- [ ] **Support**
  - [ ] Set up email filters for support
  - [ ] Create saved responses for common questions
  - [ ] Update FAQ based on feedback

### First Month ✅/❌

- [ ] **Iterate**
  - [ ] Collect feature requests
  - [ ] Fix reported bugs
  - [ ] Add most-requested patterns
  - [ ] Improve based on reviews

- [ ] **Marketing** (Optional)
  - [ ] Write blog post about development
  - [ ] Create tutorial video
  - [ ] Reach out to tech bloggers
  - [ ] Privacy advocacy groups

---

## Quality Checklist

Before submitting, verify:

### Functionality ✅
- [ ] Banner detection works on 20+ sites
- [ ] All privacy levels work correctly
- [ ] Advanced mode toggles categories
- [ ] Statistics track accurately
- [ ] Themes switch smoothly
- [ ] Training wizard completes successfully

### Performance ✅
- [ ] Content script loads quickly (<100ms)
- [ ] No noticeable page slowdown
- [ ] Memory usage reasonable (<50MB)
- [ ] No CPU spikes
- [ ] Animations don't block interaction

### User Experience ✅
- [ ] Popup opens instantly
- [ ] Settings save immediately
- [ ] Clear visual feedback
- [ ] No confusing error messages
- [ ] Helpful tooltips/descriptions
- [ ] Keyboard navigation works

### Code Quality ✅
- [ ] No console errors in production
- [ ] No TODO/FIXME comments in critical code
- [ ] TypeScript types complete
- [ ] No hardcoded credentials
- [ ] Proper error handling

---

## Suggested Privacy Policy

Create a file `PRIVACY.md` and host on GitHub Pages:

```markdown
# BannerBanner Privacy Policy

Last updated: [DATE]

## Data Collection

BannerBanner does NOT collect, store, or transmit any personal data to external servers.

## Local Storage

The extension stores the following data locally on your device:
- Your privacy preference settings
- Theme selection
- Statistics (number of banners closed)
- Custom banner patterns you create

This data is stored using Chrome's storage API and syncs across your devices if you're signed into Chrome.

## Permissions

BannerBanner requires these permissions:
- **storage**: Save your preferences locally
- **activeTab**: Interact with cookie banners on the current page
- **<all_urls>**: Detect banners on all websites you visit

## Third Parties

BannerBanner does not share data with any third parties. No analytics, no tracking, no external servers.

## Contact

Questions? Email: [YOUR_EMAIL]
```

---

## Estimated Timeline

- **Icon Creation**: 1-4 hours (or $20-50 if hiring)
- **Screenshots**: 30 minutes
- **Store Listing Copy**: 1 hour
- **Privacy Policy**: 30 minutes
- **Submission**: 30 minutes
- **Review Wait**: 1-3 business days
- **Total**: ~1 week from start to live

---

## Ready to Launch?

When you can check ALL boxes above, you're ready to submit! 🚀

**Current Status:**
- ✅ Extension built and working
- ✅ Documentation complete
- ✅ Test page created
- ❌ Icons needed
- ❌ Screenshots needed
- ❌ Privacy policy needed
- ❌ Store listing copy needed

**You're ~80% there!** 🎉

---

## Quick Launch Path (Minimum)

If you want to launch ASAP, absolute minimum:

1. ✅ Create 4 icons (use AI generator with prompt from ICON_GUIDE.md)
2. ✅ Take 3 screenshots (main UI, settings, stats)
3. ✅ Write 2-paragraph description
4. ✅ Create simple privacy policy (template above)
5. ✅ Submit!

**Time needed**: 3-4 hours if focused

---

**The extension is DONE. Now it's just marketing! 🍌**
