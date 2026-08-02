# 🍌 Banana Town - Theme Documentation

## Welcome to Banana Town!

You've unlocked the most delightful aspect of BannerBanner - our fully immersive **Banana Town** themed experience! This isn't just a color scheme; it's a quirky fictional banana town where privacy protection happens with personality.

## The Two Banana Themes

### 🌞 Banana (Light Mode)
**The sunny side of Banana Town!**

This theme brings you into the bright, cheerful town square of Banana Town on a perfect tropical morning. Everything is bathed in warm golden yellows, soft banana cream backgrounds, and accents of fresh banana leaf greens.

- **Color Palette**: Golden yellows (#FFD93D, #FFCC00), cream backgrounds, leaf green accents
- **Vibe**: Morning market energy, optimistic and sunny
- **Perfect for**: Daytime browsing, feeling energized and happy

### 🌙 Dark Banana (Dark Mode)
**Banana Town after sunset!**

When the sun goes down in Banana Town, the cozy nighttime atmosphere emerges. Deep charcoal backgrounds are illuminated by soft glowing banana-yellow lights, like fireflies dancing through banana leaves. It's readable, comfortable, and never harsh on the eyes.

- **Color Palette**: Deep charcoal/near-black backgrounds, muted golds, soft glowing yellows
- **Vibe**: Cozy evening café, moonlit banana groves
- **Perfect for**: Night owls, reducing eye strain, maintaining the fun in dark mode

## Banana Town Citizens - The Cameos

When BannerBanner successfully closes a cookie banner in Banana Town themes, you'll be visited by one of our delightful banana citizens! Each appearance is randomly selected and fully animated.

### Meet the Citizens:

1. **Worker Banana in Overalls** 🍌👷
   - Rides a zipline across the top of your screen
   - Hardworking, always on the move
   - Duration: 3 seconds

2. **Attorney Banana (Esq.)** 🍌⚖️
   - Professional banana in a sharp suit
   - Walks in confidently, adjusts glasses, tips hat
   - Duration: 3.5 seconds

3. **Kid Banana** 🍌🚲
   - Young banana learning to ride a bicycle
   - Slightly wobbly but determined!
   - Duration: 4 seconds

4. **Newspaper Banana** 🍌📰
   - Relaxed banana floating in a comfy chair
   - Casually reading the Banana Town Gazette
   - Duration: 3.5 seconds

5. **The Banana Bunch Band** 🍌🍌🍌🍌
   - Synchronized dance troupe
   - Quick choreographed routine before peeling off-screen
   - Duration: 3 seconds

6. **Detective Banana** 🍌🔍
   - Banana with magnifying glass
   - Inspects the closed banner area and nods approvingly
   - Duration: 3.5 seconds

7. **Grandpa Banana** 🍌🧓
   - Wise old banana on a park bench
   - Feeds tiny bird-bananas
   - Duration: 4 seconds

8. **Chef Banana** 🍌👨‍🍳
   - Culinary expert banana
   - Flips pancake-bananas with expertise
   - Duration: 3.2 seconds

## Visual Design Elements

### Custom UI Components (when in Banana themes)

- **Buttons**: Curved banana shapes with subtle peel textures and hover animations
- **Cards**: Banana leaf corner ornaments and soft peel texturing
- **Scrollbars**: Banana-shaped thumbs with leaf-pattern tracks
- **Inputs**: Rounded "banana" shapes with bright yellow focus rings
- **Tooltips**: Banana-shadow styling with small banana icon decorations
- **Separators**: Gradient lines with centered banana emoji
- **Badges**: Auto-prefixed with banana emoji

### Background Patterns

**Banana (Light)**:
- Diagonal stripe patterns in subtle banana yellow
- Morning light gradient effect
- Soft leaf accent corners on cards

**Dark Banana**:
- Radial glows like moonlight through banana groves
- Repeating leaf silhouette patterns
- Firefly-like soft glowing accents

## Accessibility Features

### Respects User Preferences
- **prefers-reduced-motion**: If enabled, cameo animations are simplified to gentle fades
- **WCAG AA Contrast**: All color combinations meet or exceed 4.5:1 contrast ratios
- **Readable at Night**: Dark Banana maintains high readability with soft glows instead of harsh contrast

### Performance
- GPU-accelerated animations for smooth 60fps
- Lightweight CSS animations (no heavy JS)
- Maximum one cameo at a time to prevent visual overload

## Implementation Details

### CSS Classes
When Banana or Dark Banana theme is active, the body element receives:
- `.banana-theme` for light mode
- `.dark-banana-theme` for dark mode

This triggers all banana-specific styles including:
- Custom scrollbars
- Background patterns
- Themed component styling

### Color Variables
Theme colors are applied via CSS custom properties:
```css
--background: oklch(0.96 0.10 92);  /* Warm banana cream */
--primary: oklch(0.68 0.20 88);     /* Rich banana yellow */
--accent: oklch(0.78 0.22 92);      /* Bright highlight banana */
/* ...and many more */
```

### Animation System
Cameos use:
- `framer-motion` for React-based animation orchestration
- CSS `@keyframes` for performance-critical animations
- Emoji characters for banana citizens (zero image assets!)

## Fun Facts

- **Zero Images**: All banana citizens are created with emoji and CSS
- **Fully Themable**: Every surface adapts to the banana aesthetic
- **Performance First**: Despite the rich theming, animations are GPU-accelerated
- **Easter Eggs**: Try switching to banana theme exactly 8 times in a row... 🍌🎉

## Variable Names & Code Style

The codebase embraces the banana theme even in the code! You'll find delightful variable and function names like:
- `spawnZiplineBanana()`
- `/* the mayor banana approves */`
- `.banana-peel-texture`
- `BANANA_CAMEOS`

This keeps the code fun and maintainable while staying clean and professional.

---

**Made with 🍌 and ❤️ in Banana Town**

*"Where privacy protection meets tropical delight"*
