# 🚀 BannerBanner Quick Start

## In 5 Minutes

### 1. Build the Extension
```bash
npm install
npm run build:extension
```

### 2. Load in Chrome
1. Open `chrome://extensions/`
2. Toggle "Developer mode" ON (top right)
3. Click "Load unpacked"
4. Select the `dist/` folder
5. Pin the extension icon to toolbar

### 3. Test It
1. Click the BannerBanner icon
2. Set preference to "Necessary Only"
3. Visit https://www.bbc.com
4. Watch the cookie banner auto-close! 🎉

---

## File Structure

```
BannerBanner/
├── src/                        # React UI (popup)
│   ├── App.tsx                 # Main app component
│   ├── components/             # UI components
│   │   ├── SettingsPanel.tsx
│   │   ├── ThemeSelector.tsx
│   │   ├── BannerTrainerEnhanced.tsx
│   │   └── ...
│   ├── hooks/
│   │   └── use-auto-banner-handler.ts
│   └── lib/
│       └── banner-patterns.ts  # Pattern library
│
├── extension/                  # Extension files
│   ├── manifest.json           # Extension config
│   ├── background.js           # Service worker
│   ├── content.js              # Banner detection ⭐
│   ├── popup.html              # Popup entry
│   ├── test-page.html          # Test page
│   └── README.md               # Build guide
│
└── dist/                       # Built extension (after build)
    ├── All extension files copied here
    └── Ready to load in Chrome
```

---

## Key Files Explained

### `extension/content.js` ⭐ **MOST IMPORTANT**
This runs on EVERY website. It:
- Detects cookie banners using pattern library
- Clicks Accept/Reject based on preferences
- Shows banana celebrations
- Updates statistics

**To add a new banner pattern:**
```javascript
{
  name: 'NewBanner',
  containerSelectors: ['#banner-id', '.banner-class'],
  acceptSelectors: ['#accept-btn'],
  rejectSelectors: ['#reject-btn'],
  settingsSelectors: ['#settings-btn'],
}
```

### `extension/background.js`
Service worker that:
- Sets defaults on install
- Tracks statistics
- Routes messages between popup and content scripts
- Syncs preferences across tabs

### `src/App.tsx`
React app that:
- Provides settings UI
- Shows statistics
- Manages themes
- Displays pattern library
- Handles training wizard

---

## Development Workflow

### Making Changes

#### To React UI:
1. Edit files in `src/`
2. Test with `npm run dev` (web app mode)
3. Build extension: `npm run build:extension`
4. Reload extension in Chrome

#### To Content Script:
1. Edit `extension/content.js`
2. Rebuild: `npm run build:extension`
3. Go to `chrome://extensions/`
4. Click reload icon on BannerBanner card
5. Refresh test page

#### To Background Script:
1. Edit `extension/background.js`
2. Rebuild: `npm run build:extension`
3. Go to `chrome://extensions/`
4. Click reload icon
5. Right-click extension icon → "Inspect service worker"

---

## Testing

### Local Test Page
```bash
# After building extension, open:
open dist/extension/test-page.html
# OR
open extension/test-page.html
```

Click buttons to spawn simulated banners and watch the extension detect and close them.

### Real Websites
1. BBC.com - OneTrust
2. CNN.com - OneTrust
3. Forbes.com - TrustArc
4. Any news site - Usually has a banner!

### Debugging

**Popup Console:**
Right-click extension icon → "Inspect popup"

**Background Console:**
`chrome://extensions/` → "Inspect views: service worker"

**Content Script Console:**
Regular page console (right-click → Inspect)
Look for logs starting with `[BannerBanner]`

**Check Storage:**
DevTools → Application → Storage → Extension Storage

---

## Common Tasks

### Add a Banner Pattern

**In `src/lib/banner-patterns.ts`:**
```typescript
export const BANNER_PATTERNS: BannerPattern[] = [
  // ... existing patterns
  {
    id: 'new-banner',
    name: 'New Banner Name',
    framework: 'Framework Name',
    containerSelector: '#banner-container',
    acceptSelector: '#accept-button',
    rejectSelector: '#reject-button',
    settingsSelector: '#settings-button',
    // ... other fields
  }
];
```

**In `extension/content.js`:**
```javascript
const BANNER_PATTERNS = [
  // ... existing patterns
  {
    name: 'New Banner Name',
    containerSelectors: ['#banner-container'],
    acceptSelectors: ['#accept-button'],
    rejectSelectors: ['#reject-button'],
    settingsSelectors: ['#settings-button'],
  }
];
```

Then rebuild: `npm run build:extension`

### Change Preferences

Click extension icon → Settings tab → Select preference level

Options:
- **Necessary Only** - Reject all optional cookies
- **Functional** - Allow functional cookies
- **Analytics** - Allow analytics cookies  
- **All Cookies** - Accept everything

Toggle "Advanced Settings" for category-level control.

### Toggle Banana Celebrations

Click extension icon → Info tab → "Show Banana Celebration" toggle

### Change Theme

Click extension icon → Theme tab → Select theme:
- Light
- Dark
- Banana 🍌
- Dark Banana 🌙🍌

---

## Build for Production

### 1. Build
```bash
npm run build:extension
```

### 2. Add Icons
Create these in `dist/icons/`:
- icon-16.png
- icon-32.png
- icon-48.png
- icon-128.png

See `extension/ICON_GUIDE.md` for design specs.

### 3. Test
Load in Chrome, test on 10+ websites

### 4. Package
```bash
cd dist
zip -r bannerbanner-extension.zip .
```

### 5. Submit
Upload to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)

---

## Troubleshooting

### Extension Not Showing
- Check it's enabled in `chrome://extensions/`
- Look for errors in service worker console
- Verify manifest.json is valid

### Banners Not Closing
- Check content script is injected (Console → Sources)
- Verify pattern selector matches the banner's DOM
- Look for console errors in page console
- Test with `extension/test-page.html` first

### Preferences Not Saving
- Check extension has storage permission
- Inspect Chrome storage in DevTools
- Verify background script is running

### Build Errors
- Run `npm install` again
- Clear `dist/` and rebuild
- Check for TypeScript errors: `npm run build`

---

## Quick Commands

```bash
# Development
npm run dev              # Run as web app (for UI testing)

# Building
npm run build            # Build React app only
npm run build:extension  # Build full extension

# Other
npm run lint             # Check code quality
npm run preview          # Preview production build
```

---

## Stats & Features

- **8** banner frameworks supported
- **8** unique banana animations
- **4** themes (Light, Dark, Banana, Dark Banana)
- **4** privacy levels + custom mode
- **6** main UI tabs
- **~15,000** lines of code
- **100%** MVP complete ✅

---

## Resources

- [Extension MVP Guide](EXTENSION_MVP.md) - Technical deep dive
- [Build Instructions](extension/README.md) - Detailed build guide
- [Icon Guide](extension/ICON_GUIDE.md) - Icon design specs
- [PRD](PRD.md) - Product requirements
- [MVP Assessment](MVP_ASSESSMENT.md) - Feature analysis

---

## Need Help?

1. Check the console logs (they're verbose!)
2. Test with `extension/test-page.html`
3. Review `EXTENSION_MVP.md` for architecture
4. Look at existing patterns in `extension/content.js`

---

## 🍌 Most Important

**The content script (`extension/content.js`) is where banners get detected and closed.**

Everything else is UI and coordination. If you want to add support for a new banner type, that's the file to edit!

---

**Happy banner busting! 🎯🍌**
