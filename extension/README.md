# BannerBanner Browser Extension

## 🚀 Building the Extension

The BannerBanner extension is built from the main React application. Follow these steps to create a production-ready extension:

### 1. Build the Web App

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### 2. Prepare Extension Files

Copy the necessary extension files to the `dist/` directory:

```bash
# From the project root
cp -r extension/* dist/
```

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

1. Open Chrome/Edge
2. Navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked"
5. Select the `dist/` directory
6. The extension is now installed!

### 5. Testing

1. Click the BannerBanner icon in your browser toolbar
2. Configure your privacy preferences
3. Visit a website with a cookie banner (e.g., bbc.com, cnn.com)
4. Watch the banner get automatically detected and closed!

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

## 🧪 Testing Checklist

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
