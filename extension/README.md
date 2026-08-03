# BannerBanner Browser Extension

## 🎯 Quick Links

- **🚀 [Quick Start Submission Guide](QUICK_START_SUBMISSION.md)** - 5-minute overview
- **📋 [Detailed Submission Checklist](SUBMISSION_CHECKLIST.md)** - Step-by-step guide
- **📝 [Complete Submission Guide](CHROME_WEB_STORE_SUBMISSION.md)** - Everything you need to know
- **🔒 [Privacy Policy](PRIVACY_POLICY.md)** - Ready-to-publish privacy policy
- **🎨 [Icon Design Guide](ICON_GUIDE.md)** - Icon specifications

---

## 🚀 Building the Extension

The BannerBanner extension is built from the main React application. Use the automated build script:

### Quick Build (Recommended)

```bash
# From the project root
./extension/build-extension.sh
```

This script will:
1. Build the React app with Vite
2. Copy extension files to `dist/`
3. Verify icons are present
4. Provide next steps

### Manual Build

If you prefer to build manually:

```bash
# 1. Build the web app
npm run build

# 2. Copy extension files
cp extension/manifest.json dist/
cp extension/background.js dist/
cp extension/content.js dist/
cp extension/bananer-characters.js dist/
cp extension/bananer.js dist/
cp extension/popup.html dist/
cp extension/popup.js dist/
cp extension/learn.html dist/
cp extension/learn.js dist/
cp extension/learn.css dist/

# 3. Copy icons (must be generated first)
mkdir -p dist/icons
cp extension/icons/icon-*.png dist/icons/
```

## 🎨 Generate Icons (REQUIRED)

Before building, you must generate extension icons:

1. **Open the icon generator:**
   ```bash
   open extension/icons/generate-icons.html
   # Or manually open in your browser
   ```

2. **Download all icon sizes:**
   - Click "Download All Icons as ZIP"
   - Extract to `extension/icons/` directory

3. **Verify icons:**
   ```bash
   ls extension/icons/
   # Should show: icon-16.png, icon-32.png, icon-48.png, icon-128.png
   ```

**Icon sizes:**
- `icon-16.png` - Toolbar icon (16×16px)
- `icon-32.png` - Toolbar icon @2x (32×32px)
- `icon-48.png` - Extension management page (48×48px)
- `icon-128.png` - Chrome Web Store listing (128×128px)

See [Icon Design Guide](ICON_GUIDE.md) for details.

---

### 3. Extension Structure

After building, your `dist/` directory should contain:

```
dist/
├── manifest.json          # Extension manifest
├── background.js          # Background service worker
├── content.js            # Content script for banner detection
├── popup.html            # Extension popup UI
├── icons/                # Extension icons (16, 32, 48, 128px)
├── assets/               # Built assets from Vite
└── [other build files]   # Compiled React app
```

### 4. Load in Chrome/Edge (Development)

1. Open Chrome or Edge browser
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right corner)
4. Click "Load unpacked" button
5. Select the `dist/` directory
6. Extension installed! 🎉

### 5. Local Testing

**Basic functionality:**
1. Click the BannerBanner icon in browser toolbar
2. Configure privacy preferences in settings
3. Visit test websites with cookie banners:
   - [BBC](https://www.bbc.com)
   - [CNN](https://www.cnn.com)
   - [Forbes](https://www.forbes.com)
4. Verify banner is detected and closed automatically
5. Check statistics update correctly

**Full test checklist:**

## 📦 Distribution

### Chrome Web Store

1. Zip the `dist/` directory:
   ```bash
   cd dist && zip -r ../bannerbanner-extension.zip . && cd ..
   ```

2. Upload to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)

3. Fill in:
   - Extension name: BannerBanner
   - Description: (from manifest.json)
   - Category: Productivity
   - Privacy policy URL
   - Screenshots and promotional images

### Firefox Add-ons

Firefox requires Manifest V2. Create a separate `manifest-firefox.json`:

```json
{
  "manifest_version": 2,
  "name": "BannerBanner",
  ...
}
```

Then submit to [Firefox Add-on Developer Hub](https://addons.mozilla.org/developers/)

## 🎨 Icons

Extension icons should be placed in `extension/icons/`:

- `icon-16.png` - Toolbar icon (small)
- `icon-32.png` - Toolbar icon (medium)  
- `icon-48.png` - Extension management page
- `icon-128.png` - Chrome Web Store listing

Use a shield with a banana or similar privacy-themed icon.

## 🔧 Development Workflow

1. Make changes to React app in `src/`
2. Test in browser via `npm run dev`
3. When ready, build with `npm run build`
4. Copy extension files: `cp -r extension/* dist/`
5. Reload extension in `chrome://extensions/`

## 📦 Chrome Web Store Submission

### Overview

Complete guides are available:
- **[Quick Start](QUICK_START_SUBMISSION.md)** - Fast track to submission (~3 hours)
- **[Detailed Checklist](SUBMISSION_CHECKLIST.md)** - Step-by-step with verification
- **[Complete Guide](CHROME_WEB_STORE_SUBMISSION.md)** - Everything explained in detail

### Fast Track Summary

1. **Generate Assets** (30 min)
   ```bash
   # Generate icons
   open extension/icons/generate-icons.html
   
   # Generate store graphics
   open extension/assets/generate-store-assets.html
   ```

2. **Build Extension** (5 min)
   ```bash
   ./extension/build-extension.sh
   cd dist && zip -r ../bannerbanner-v1.0.0.zip .
   ```

3. **Create Screenshots** (45 min)
   - Capture extension interface at 1280×800px
   - Minimum 1 screenshot, recommended 3-5
   - Annotate with key features

4. **Submit** (30 min)
   - Go to [Developer Dashboard](https://chrome.google.com/webstore/devconsole)
   - Upload ZIP file
   - Fill store listing (copy from guides)
   - Add screenshots and promotional graphics
   - Submit for review

5. **Wait for Approval** (1-3 days)
   - Monitor email for review status
   - Respond to any feedback
   - Celebrate when approved! 🎉

### Required for Submission

- ✅ 4 icon sizes (16, 32, 48, 128px)
- ✅ Extension ZIP file
- ✅ 1+ screenshot (1280×800px recommended)
- ✅ Privacy policy URL (see [PRIVACY_POLICY.md](PRIVACY_POLICY.md))
- ✅ Store description and summary
- ✅ Permissions justifications
- ✅ $5 one-time developer registration fee

### Optional but Recommended

- ✅ Promotional tile (440×280px)
- ✅ Marquee tile (1400×560px)
- ✅ 3-5 annotated screenshots
- ✅ Support URL (GitHub issues page)

---

## 🧪 Testing Before Submission

- [ ] Extension loads without errors
- [ ] Popup opens and displays UI correctly
- [ ] Preferences save and persist
- [ ] Banner detection works on test sites
- [ ] Banana celebration appears (if enabled)
- [ ] Stats update when banners are closed
- [ ] Theme switching works
- [ ] Training system saves custom patterns
- [ ] Extension works across multiple tabs
- [ ] Settings sync between popup and content script

## 🐛 Debugging

### View Console Logs

- **Popup**: Right-click extension icon → "Inspect popup"
- **Background script**: `chrome://extensions/` → "Inspect views: background page"
- **Content script**: Right-click page → "Inspect" → Console tab (filter by "BannerBanner")

### Common Issues

**Banner not detected:**
- Check content script is injected (Console → Sources)
- Verify pattern selectors match the banner's DOM structure
- Add debug logging to `content.js`

**Preferences not saving:**
- Check Chrome storage in DevTools → Application → Storage → Extension Storage
- Verify `chrome.storage` permissions in manifest

**Popup not loading:**
- Check for CSP errors in popup console
- Ensure all assets are in `dist/` and paths are correct

## 📝 Notes

- Content script uses vanilla JS (no React) for performance
- Background script is a service worker (Manifest V3)
- Popup uses the full React app
- Pattern library can be extended by users via the training UI
- Stats are stored in `chrome.storage.local` and synced across devices via `chrome.storage.sync`

## 🍌 Banana Town Features

The extension includes delightful banana-themed easter eggs:

- Random banana character animations on banner close
- Banana and Dark Banana themes
- Rotating banana emoji on theme cards
- Celebration messages

These can all be toggled in settings for users who prefer a more serious interface.
