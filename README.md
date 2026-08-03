# 🍌 BannerBanner - Privacy Banner Manager

**Automatically manage cookie consent banners with your privacy preferences.**

BannerBanner is a browser extension that detects and closes cookie banners on websites, applying your privacy preferences automatically. No more clicking through tedious consent dialogs!

## ✨ Features

- 🛡️ **Automatic Banner Detection** - Recognizes 8+ major cookie consent frameworks
- 🎯 **Privacy-First Defaults** - Starts with "Necessary Only" to protect your privacy
- 🎨 **Beautiful Themes** - Light, Dark, Banana, and Dark Banana themes
- 🍌 **Delightful Celebrations** - Random banana animations when banners are closed
- 📊 **Statistics Dashboard** - Track how many banners you've avoided
- 🧪 **Pattern Training** - Teach BannerBanner to recognize new banner types
- ⚙️ **Advanced Mode** - Granular control over individual cookie categories
- 🍌🎓 **Bananers** - Learning companions that investigate, dismiss, and remember popups (see below)

## 🚀 Quick Start

### Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run locally (web app mode):**
   ```bash
   npm run dev
   ```

3. **Build the browser extension:**
   ```bash
   npm run build:extension
   ```

4. **Load in Chrome:**
   - Open `chrome://extensions/`
   - Enable "Developer mode"
   - Click "Load unpacked"
   - Select the `dist/` folder

### Testing

Visit any website with a cookie banner (e.g., bbc.com, cnn.com) and watch BannerBanner automatically close it based on your preferences!

## 📖 Documentation

- **[Extension MVP Guide](EXTENSION_MVP.md)** - How the browser extension works
- **[Extension README](extension/README.md)** - Build and deployment instructions
- **[PRD](PRD.md)** - Product requirements and design decisions
- **[MVP Assessment](MVP_ASSESSMENT.md)** - Detailed feature analysis
- **[Banana Town Docs](BANANA_TOWN_DOCS.md)** - Theme implementation details

## 🎯 Supported Banner Frameworks

- ✅ Cookiebot
- ✅ OneTrust
- ✅ CookieYes
- ✅ Quantcast Choice
- ✅ Usercentrics
- ✅ TrustArc
- ✅ Osano
- ✅ Cookie Notice

Users can train BannerBanner to recognize additional frameworks through the built-in training wizard.

## 🍌🎓 Bananers — Popup-Dismissing Learning Companions

The **Learn** section of the extension introduces *bananers*: anthropomorphized banana characters you deploy to investigate and dismiss popups (cookie consent modals, newsletter interstitials, ad overlays) — and learn from every takedown.

- **Opt-in per site** — bananers only run on sites you invite them to. Open the toolbar popup on any site and click *"Deploy a bananer here"*; host permission is requested for that origin only (no blanket `<all_urls>` access).
- **Investigate & dismiss** — a content script injected at `document_start` detects popups heuristically, inspects their DOM/CSS/listeners, picks a dismissal strategy (reject/close/click, or peel-off removal), and acts it out with an animated character and educational captions.
- **Learn & remember** — every dismissal is fingerprinted into a knowledge base (`chrome.storage.local`). On repeat visits, known popups are suppressed *before they even paint* and dismissed near-instantly.
- **Learn dashboard** — the options page hosts the character roster (XP and levels per bananer), a per-banner-type memory browser with animated replays of past takedowns, and preferences (auto-dismiss, character visibility, captions, pre-paint suppression) plus opted-in site management.

Meet the crew: 🍌🔍 Peelock Holmes (cookie consent), 🍌📰 Scoop (newsletters), 🍌💥 Splat (ad overlays), and 🍌🎓 Professor Nana (mystery popups).

## 🛠️ Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **shadcn/ui** - Component library
- **Framer Motion** - Animations
- **Chrome Extension API** - Browser integration

## 🍌 About Banana Town

BannerBanner features a delightful "Banana Town" theme with 8 unique banana character animations:

1. 🍌💼 Zipline Banana
2. 🍌👔 Lawyer Banana
3. 🍌🚲 Bicycle Banana
4. 🍌📰 Newspaper Banana
5. 🍌🍌🍌 Dance Troupe
6. 🍌🔍 Detective Banana
7. 🍌🪑🐦 Park Bench Banana
8. 🍌👨‍🍳 Chef Banana

These playful animations appear when banners are successfully closed, making privacy protection fun!

## 📦 Project Structure

```
.
├── src/                    # React application
│   ├── components/         # UI components
│   ├── hooks/              # React hooks
│   └── lib/                # Utilities and types
├── extension/              # Browser extension files
│   ├── manifest.json       # Extension configuration
│   ├── background.js       # Service worker
│   ├── content.js          # Banner detection script
│   └── build-extension.sh  # Build script
└── dist/                   # Built extension (after build)
```

## 🤝 Contributing

Contributions welcome! Areas for improvement:

- [ ] Add more banner patterns
- [ ] Firefox support (Manifest V2)
- [ ] Automated pattern testing
- [ ] Community pattern sharing backend
- [ ] Per-site preference overrides
- [ ] More banana animations! 🍌

## 📄 License

The Spark Template files and resources from GitHub are licensed under the terms of the MIT license, Copyright GitHub, Inc.

## 🧹 Just Exploring?

No problem! If you were just checking things out and don't need to keep this code:

- Simply delete your Spark
- Everything will be cleaned up — no traces left behind
