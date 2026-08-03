# BannerBanner - Privacy Banner Preference Manager

A privacy-first **browser extension** that automatically detects and closes cookie consent banners according to user preferences, defaulting to "necessary only" cookies to protect user privacy while streamlining the browsing experience.

**🎉 MVP STATUS: ACHIEVED** - Iteration 6 complete. Extension is fully functional and ready for Chrome Web Store submission after adding icons.

**Experience Qualities**:
1. **Protective** - The app should feel like a guardian of user privacy, with clear emphasis on safety and control
2. **Efficient** - Interactions should be immediate and friction-free, eliminating the tedious repetition of cookie consent dialogs
3. **Trustworthy** - The interface should inspire confidence through clarity, avoiding dark patterns or confusing options

**Complexity Level**: Complex Application (advanced functionality with pattern learning)
This is a privacy automation tool with preference management, pattern detection, automatic banner interaction, learning capabilities, and persistent state. It requires multiple views (settings, patterns, learning), pattern matching logic, and an extensible pattern library system.

## Essential Features

### Feature 1: Default Privacy Preference Setting
- **Functionality**: User can set their default cookie preference (Necessary Only, Functional, Analytics, All Cookies)
- **Purpose**: Establishes user's privacy stance that will be applied to all banner interactions
- **Trigger**: User opens settings panel or first launches the app
- **Progression**: View current preference → Select new preference from radio group → See immediate visual confirmation → Preference saved automatically
- **Success criteria**: Selected preference persists across sessions and is clearly displayed

### Feature 2: Category-Level Granular Control
- **Functionality**: Advanced mode allowing users to toggle individual cookie categories (Necessary, Functional, Analytics, Marketing)
- **Purpose**: Provides power users with precise control over their privacy settings
- **Trigger**: User toggles "Advanced Settings" or "Customize" option
- **Progression**: Click advanced toggle → Expanded view shows individual categories → Toggle specific categories on/off → See count of active categories → Auto-save changes
- **Success criteria**: Individual toggles reflect and override the preset, visual feedback shows active/inactive state clearly

### Feature 3: Automatic Banner Detection & Closure
- **Functionality**: Automatically detects and closes cookie banners without user interaction, applying saved preferences
- **Purpose**: Eliminates manual clicking and provides seamless privacy protection
- **Trigger**: Banner detected on page load or dynamically added to DOM
- **Progression**: Banner appears → System detects using pattern library → Applies user preferences automatically → Banner closes → Banana celebration appears
- **Success criteria**: Banner closes within 2 seconds, preferences applied correctly, visual feedback shown

### Feature 4: Statistics Dashboard
- **Functionality**: Display count of saved preferences, supported banner patterns, and privacy level score
- **Purpose**: Reinforces value proposition and provides satisfaction through quantified impact
- **Trigger**: Always visible on main screen or dedicated stats section
- **Progression**: User views stats → See preference summary → View privacy score and supported patterns count
- **Success criteria**: Numbers are meaningful and update in real-time as preferences change

### Feature 5: Banner Pattern Library with Enhanced Learning System
- **Functionality**: Comprehensive list of supported patterns with ultra-intuitive, step-by-step banner training wizard with visual guidance and examples
- **Purpose**: Builds user confidence and allows system to adapt to new or unsupported banners with zero technical knowledge required
- **Trigger**: User navigates to "Patterns" tab or encounters unknown banner, clicks "Start Training"
- **Progression**: View intro screen → Read simple overview → Click "I'll Guide You!" → Follow step-by-step visual instructions → Point to Accept button → Point to Reject button → Optionally find Settings → Auto-test → Celebrate success → Pattern saved
- **Success criteria**: All patterns display correctly, custom patterns can be added by ANY user regardless of technical skill, each step provides clear visual examples, progress bar shows advancement, training feels "boomer-easy" and confidence-inspiring, learning system persists across sessions

### Feature 6: Banana Celebration Notification
- **Functionality**: Shows animated banana with thumbs up when banner is successfully removed
- **Purpose**: Provides delightful, positive feedback confirming banner was handled automatically
- **Trigger**: Banner successfully closed by the system
- **Progression**: Banner closes → Banana appears with animation → Thumbs up gesture → Fades after 3 seconds → Can be disabled in settings
- **Success criteria**: Animation is smooth and celebratory, doesn't obstruct content, can be toggled off

### Feature 7: Theme Customization with Banana Delight
- **Functionality**: Users can select between Light, Dark, Banana, and Dark Banana visual themes, each with distinct personality
- **Purpose**: Provides personalization, accommodates different viewing preferences and environments, and adds playful joy through banana themes
- **Trigger**: User navigates to Appearance/Theme tab
- **Progression**: View theme grid (2x2) → See visual previews with animations → Select preferred theme → See instant visual update across all UI → Banana themes show rotating banana emoji and delightful messages → Theme preference persists
- **Success criteria**: Theme changes apply immediately with smooth transitions, all components adapt properly, banana themes feel joyful and distinctive (light and dark variants), preference saved across sessions, rotating banana animations on theme cards

## Edge Case Handling

- **No Preference Set**: Default to "Necessary Only" automatically on first launch, with clear indication this is the privacy-protective default
- **Conflicting Advanced Settings**: If user selects "All Cookies" preset but has individual toggles off, advanced settings take precedence with visual indicator
- **Rapid Preference Changes**: Debounce save operations to avoid excessive writes while providing immediate UI feedback
- **Empty States**: If no preference history exists, show helpful onboarding message explaining the purpose and benefits

## Design Direction

The design should evoke a sense of **digital sanctuary and empowerment**. Users should feel like they're taking control of their privacy with a tool that's professional yet approachable. The aesthetic should be clean and modern with subtle security-oriented visual cues (shields, locks, checkmarks) used sparingly. The color palette should inspire trust while the typography should be clear and authoritative.

**Theme System**: The application now supports four distinct themes that maintain the core brand identity while offering flexibility:
- **Light**: Clean, bright interface optimized for daytime use with high contrast
- **Dark**: Eye-friendly darker palette for low-light environments
- **Banana**: Playful yellow-toned theme that embraces the banana celebration motif with tropical warmth
- **Dark Banana**: Moonlit tropical theme combining the joy of bananas with the comfort of dark mode

## Color Selection

A trustworthy, privacy-focused palette with strong contrast and clear visual hierarchy. Colors are defined per theme:

### Light Theme (Default)
- **Primary Color**: Deep Blue (oklch(0.45 0.15 255)) - Communicates trust, security, and professionalism
- **Secondary Colors**: 
  - Slate Gray (oklch(0.35 0.02 255)) - Professional supporting color for secondary UI elements
  - Light Blue Gray (oklch(0.96 0.01 255)) - Soft background for cards and panels
- **Accent Color**: Vibrant Teal (oklch(0.65 0.14 200)) - Attention-grabbing highlight for active states
- **Foreground/Background Pairings**: 
  - Background Light (oklch(0.98 0 0)): Dark text oklch(0.25 0.02 255) - Ratio 11.2:1 ✓
  - Primary Blue (oklch(0.45 0.15 255)): White text (oklch(1 0 0)) - Ratio 8.9:1 ✓
  - Accent Teal (oklch(0.65 0.14 200)): Dark text (oklch(0.25 0.02 255)) - Ratio 5.8:1 ✓

### Dark Theme
- **Primary Color**: Bright Blue (oklch(0.65 0.18 255)) - Vibrant but not harsh for dark backgrounds
- **Background**: Deep Slate (oklch(0.15 0.01 255)) - Rich dark base
- **Accent Color**: Bright Cyan (oklch(0.7 0.16 180)) - Pops against dark background
- **Foreground/Background Pairings**:
  - Background Dark (oklch(0.15 0.01 255)): Light text oklch(0.95 0.01 255) - Ratio 12.1:1 ✓
  - Primary on Dark: Ensures WCAG AAA compliance

### Banana Theme
  
- **Primary Color**: Golden Yellow (oklch(0.7 0.18 85)) - Warm, energetic banana-inspired hue
- **Background**: Cream (oklch(0.95 0.08 95)) - Soft yellow-tinted base
- **Accent Color**: Bright Banana (oklch(0.75 0.2 90)) - Vibrant tropical highlight
- **Design Philosophy**: Embraces the playful banana celebration while maintaining readability
- **Foreground/Background Pairings**:
  - Background Cream (oklch(0.95 0.08 95)): Brown text oklch(0.25 0.05 60) - Ratio 9.8:1 ✓

### Dark Banana Theme

- **Primary Color**: Bright Banana (oklch(0.75 0.2 85)) - Glowing tropical warmth for dark backgrounds
- **Background**: Deep Brown-Yellow (oklch(0.18 0.04 70)) - Rich dark base with banana undertones
- **Card**: Chocolate Brown (oklch(0.22 0.05 75)) - Deeper brown containers
- **Accent Color**: Vibrant Yellow (oklch(0.8 0.22 90)) - High-energy yellow highlights
- **Design Philosophy**: Brings banana joy to dark mode with moonlit tropical vibes and cozy warmth
- **Foreground/Background Pairings**:
  - Background Dark (oklch(0.18 0.04 70)): Light Yellow text oklch(0.95 0.06 95) - Ratio 11.5:1 ✓
  - Accent Yellow (oklch(0.8 0.22 90)): Dark text oklch(0.15 0.04 70) - Ratio 10.2:1 ✓

## Font Selection

Typography should convey clarity, authority, and modernity - fonts that are highly legible for privacy-critical information.

- **Primary Font**: Space Grotesk - A distinctive geometric sans-serif that feels technical and trustworthy without being sterile
- **Secondary Font**: Inter - For body text and UI elements, ensuring maximum readability

- **Typographic Hierarchy**:
  - H1 (App Title): Space Grotesk Bold/32px/tight (-0.02em)
  - H2 (Section Headers): Space Grotesk SemiBold/24px/tight (-0.01em)
  - H3 (Subsection): Space Grotesk Medium/18px/normal
  - Body (Settings Text): Inter Regular/16px/relaxed (0.025em)
  - Label (Form Labels): Inter Medium/14px/normal
  - Caption (Help Text): Inter Regular/13px/normal with muted color

## Animations

Animations should feel purposeful and security-oriented - nothing frivolous. Preference changes should have subtle confirmation feedback (gentle scale or color shift). Banner close animations should be smooth and satisfying (slide out with fade). Toggle switches should have crisp, immediate response. Loading states should use a simple pulse rather than spinners. Overall timing should be quick (150-250ms) to maintain the efficiency-focused experience.

## Component Selection

- **Components**:
  - `Card` - Main container for settings panel and preview area, with subtle shadows for depth
  - `Tabs` - Navigation between Settings, Appearance, Patterns, Learn, Preview, and Info views
  - `RadioGroup` - Preset preference selection (Necessary Only, Functional, Analytics, All)
  - `Switch` - Individual category toggles in advanced mode
  - `Label` - Clear form labels with proper ARIA associations
  - `Button` - Primary CTA for "Apply Settings" in preview, with hover states
  - `Badge` - Pill-style indicators for active preference count
  - `Separator` - Visual division between sections
  - `Alert` - Success/info messages when preferences are saved
  - `Progress` - Optional visual indicator for "privacy protection level"

- **Customizations**:
  - Custom shield icon component combining Phosphor icons with subtle gradient
  - Animated banner component for preview/demo with slide-out transition
  - Custom stats card with icon + number + label layout
  - Preference summary component showing active categories
  - **Theme selector** with visual preview cards showing Light, Dark, and Banana options
  - **Theme provider** with React Context for global theme state management
  - Animated theme transition with framer-motion for smooth color changes

- **States**:
  - Buttons: Solid fill for primary, outline for secondary, distinct hover with subtle lift (translate-y)
  - Switches: Accent color when on, muted gray when off, smooth slide transition
  - Radio groups: Accent border on selected, hover state on all options
  - Cards: Subtle hover elevation on interactive cards
  - Disabled: Reduced opacity (0.5) with cursor-not-allowed

- **Icon Selection**:
  - Shield (CheckFat) - Main app icon for protection/privacy
  - Cookie - Category indicators
  - Gear/Settings - Settings access
  - X or XCircle - Close/reject actions
  - Check or CheckCircle - Accept/confirm actions
  - ChartBar - Statistics display
  - Eye - Preview mode
  - Sliders - Advanced settings toggle

- **Spacing**:
  - Container padding: p-6 (24px)
  - Card internal padding: p-5 (20px)
  - Section gaps: gap-6 (24px)
  - Form element spacing: gap-4 (16px)
  - Inline element spacing: gap-2 (8px)
  - Page margins: mx-auto max-w-4xl for main content area

- **Mobile**:
  - Stack tabs vertically on mobile, horizontal on desktop
  - Single column layout for settings cards on mobile, two-column on tablet+
  - Larger touch targets (min-h-12) for switches and radio buttons on mobile
  - Collapsible advanced settings section on mobile to reduce scroll
  - Bottom-fixed CTA buttons on mobile for easy thumb access
  - Reduce container padding to p-4 on mobile screens
