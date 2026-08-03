# 🍌 Getting Started with BannerBanner

**Welcome!** BannerBanner automatically closes annoying cookie banners based on your privacy preferences. Here's how to use it.

---

## First Time Setup (2 Minutes)

### 1. Install the Extension

**From Chrome Web Store:** (Once published)
1. Visit the BannerBanner page on Chrome Web Store
2. Click "Add to Chrome"
3. Click "Add extension" when prompted
4. You'll see the BannerBanner icon appear in your toolbar

**From Source:** (For now)
1. Download or clone this repository
2. Run `npm install && npm run build:extension`
3. Open Chrome and go to `chrome://extensions/`
4. Enable "Developer mode" (top right toggle)
5. Click "Load unpacked" and select the `dist/` folder

### 2. Choose Your Privacy Level

Click the BannerBanner icon in your toolbar to open settings:

**Four options:**

- 🛡️ **Necessary Only** (Recommended)
  - Maximum privacy
  - Only cookies required for the site to work
  - Rejects all tracking, analytics, and marketing

- ⚙️ **Functional**
  - Necessary + cookies that remember your preferences
  - Still rejects analytics and marketing

- 📊 **Analytics**
  - Necessary + Functional + anonymous usage statistics
  - Still rejects marketing/advertising

- ✅ **All Cookies**
  - Accept everything
  - Least privacy but fullest site features

**That's it!** BannerBanner will now handle cookie banners automatically.

---

## How It Works

### What Happens Behind the Scenes

1. **You visit a website** (e.g., BBC.com)
2. **A cookie banner appears**
3. **BannerBanner detects it** (usually within 1 second)
4. **Clicks the right button** based on your preference:
   - Necessary Only → Clicks "Reject All"
   - All Cookies → Clicks "Accept All"
   - Others → May click "Settings" to customize
5. **Banner disappears**
6. **🍌 Banana celebration appears** (optional, see settings)

### You Don't See the Banner

That's the point! BannerBanner closes it **before it interrupts you**.

The only thing you'll see is a quick banana animation confirming the banner was handled (unless you turn that off).

---

## Settings Explained

Click the BannerBanner icon to access all settings:

### Settings Tab

**Automatic Banner Closing:**
- Toggle on/off if you want manual control
- When off, banners appear normally (extension doesn't intervene)

**Privacy Preference:**
- Choose one of the four levels (see above)
- Changes apply immediately to all future banners

**Advanced Settings:**
- Toggle individual cookie categories:
  - ✅ Necessary (always on, can't disable)
  - ⚙️ Functional
  - 📊 Analytics  
  - 📢 Marketing
- This overrides the preset levels

### Theme Tab

Choose how the extension looks:

- ☀️ **Light** - Clean, bright interface
- 🌙 **Dark** - Eye-friendly for night browsing
- 🍌 **Banana** - Playful yellow theme
- 🌙🍌 **Dark Banana** - Cozy banana theme for night

### Patterns Tab

See all supported cookie banner frameworks:
- Cookiebot
- OneTrust
- CookieYes
- Quantcast Choice
- Usercentrics
- And more!

### Learn Tab

**Teach BannerBanner new patterns!**

If you encounter a banner that isn't recognized:
1. Click "Start Training"
2. Follow the step-by-step wizard
3. Point out the Accept and Reject buttons
4. Save the pattern
5. BannerBanner will recognize it next time!

### Preview Tab

**See how it works behind the scenes**

Watch a demonstration of how BannerBanner detects and closes banners automatically.

### Info Tab

**Learn more:**
- How it works
- Supported frameworks
- Privacy levels explained
- Advanced mode guide

**Toggle banana celebrations:**
- Show fun animations when banners are closed
- Disable if you prefer a serious interface

---

## FAQ

### Does BannerBanner see my browsing data?

**No.** BannerBanner only:
- Looks for cookie banners on pages you visit
- Stores your preferences locally
- Never sends data to external servers
- Doesn't track what sites you visit

### What data is stored?

Locally on your device only:
- Your privacy preference setting
- Your theme choice
- Count of how many banners you've avoided
- Custom patterns you've trained

This syncs across your Chrome browsers if you're signed in.

### Can I use different settings for different websites?

Not yet, but it's on the roadmap! For now, one preference applies to all sites.

### What if BannerBanner doesn't recognize a banner?

Two options:
1. Use the **Learn** tab to train BannerBanner to recognize it
2. Turn off automatic closing for that site and handle it manually

### Does it work on mobile?

Not yet - currently Chrome desktop only. Mobile support planned for future.

### Is it free?

Yes! Completely free, no ads, no premium tiers.

### Can I turn off the banana animations?

Yes! Go to **Info** tab and toggle "Show Banana Celebration" off.

---

## Tips & Tricks

### 💡 Quick Settings Access

Pin the BannerBanner icon to your toolbar:
1. Click the puzzle piece icon in Chrome toolbar
2. Find BannerBanner
3. Click the pin icon

### 💡 Check Your Stats

Click the extension icon to see:
- How many banners you've avoided
- Your privacy score
- Number of supported frameworks

### 💡 Change Preference Quickly

Click the icon → Settings tab → Pick a new level → Done!

No save button needed - changes apply instantly.

### 💡 Temporary Disable

If a site isn't working right:
1. Click the icon
2. Toggle "Automatic Banner Closing" off
3. Refresh the page
4. Handle the banner manually
5. Toggle back on when done

### 💡 Try Banana Theme

If you haven't already:
1. Click icon → Theme tab
2. Select "Banana" or "Dark Banana"
3. Watch the banana emojis spin! 🍌

It's delightful and makes privacy protection fun.

---

## Troubleshooting

### Extension icon is grayed out

The extension is disabled. Click it and toggle "Automatic Banner Closing" on.

### Banners aren't being closed

**Check:**
1. Is automatic closing enabled? (Settings tab)
2. Is the banner framework supported? (Patterns tab)
3. Try the Learn tab to train a custom pattern

### Preference changes aren't saving

**Try:**
1. Click the icon to open popup
2. Change setting
3. Close and reopen popup to verify
4. If still broken, right-click icon → "Manage extension" → "Reload"

### Banana celebrations won't stop

They should auto-dismiss after 3-6 seconds. If stuck:
1. Refresh the page
2. Or disable in Info tab → "Show Banana Celebration" off

### Website broke after using BannerBanner

Very rare, but if it happens:
1. Toggle automatic closing off for that site
2. Refresh the page
3. Report the issue (see Support below)

---

## Support

### Report a Bug

1. GitHub: [Create an issue](https://github.com/YOUR_USERNAME/bannerbanner/issues)
2. Email: support@bannerbanner.com
3. Include:
   - Website URL where it happened
   - Your preference setting
   - What you expected vs. what happened

### Request a Feature

Same channels as above! We love feedback.

### Contribute

BannerBanner is open source! Contributions welcome:
- Add new banner patterns
- Improve detection logic
- Design new banana animations
- Translate to other languages

See `README.md` for developer setup.

---

## Privacy Promise

**BannerBanner will never:**
- ❌ Track your browsing
- ❌ Sell your data
- ❌ Show you ads
- ❌ Require an account
- ❌ Send data to external servers

**BannerBanner will always:**
- ✅ Be free and open source
- ✅ Respect your privacy preferences
- ✅ Store data only on your device
- ✅ Be transparent about what it does

Full privacy policy: [Link to privacy policy]

---

## About Banana Town 🍌

The banana animations are more than just fun - they're **feedback**!

When you see a banana character (lawyer, chef, detective, etc.), you know:
- ✅ BannerBanner detected a cookie banner
- ✅ It applied your preference successfully
- ✅ The banner was closed automatically
- ✅ You can keep browsing without interruption

It's privacy protection that makes you smile. 😊

### The Banana Characters

Each one has personality:
1. 🍌💼 **Zipline Banana** - Efficient, gets things done
2. 🍌👔 **Lawyer Banana** - Professional, serious about privacy
3. 🍌🚲 **Bicycle Banana** - Eco-friendly, sustainable privacy
4. 🍌📰 **Newspaper Banana** - Informed, educated choices
5. 🍌🍌🍌 **Dance Troupe** - Celebrating your privacy!
6. 🍌🔍 **Detective Banana** - Investigating cookie abuse
7. 🍌🪑🐦 **Park Bench Banana** - Relaxed, peaceful browsing
8. 🍌👨‍🍳 **Chef Banana** - Cooking up fresh privacy

Random selection each time keeps it fresh and delightful!

---

## What's Next?

### Coming Soon
- Firefox support
- Safari extension
- Mobile browsers
- More banana animations (got ideas? Share them!)
- Community pattern sharing
- Per-site preferences

### Stay Updated
- Star the GitHub repo
- Follow on Twitter: @BannerBanner (if we make one!)
- Check Chrome Web Store for updates

---

## Thank You! 🎉

Thank you for choosing BannerBanner and taking control of your online privacy!

Every cookie banner you avoid:
- ✅ Saves you time (2-5 seconds each)
- ✅ Protects your privacy (rejects tracking)
- ✅ Reduces web clutter (cleaner browsing)
- ✅ Makes a banana happy 🍌

**Happy browsing!** 🚀

---

**Questions?** Check the Info tab in the extension or visit our GitHub repo.

**Love BannerBanner?** Leave a review on the Chrome Web Store! ⭐⭐⭐⭐⭐
