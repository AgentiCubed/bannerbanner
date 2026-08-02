# BannerBanner - Privacy Banner Preference Manager

A privacy-first tool that automatically configures cookie consent banners to user preferences, defaulting to "necessary only" cookies to protect user privacy while streamlining the browsing experience.

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

### Feature 5: Banner Pattern Library with Learning System
- **Functionality**: Comprehensive list of supported patterns with ability to learn new banner types and save custom patterns
- **Purpose**: Builds user confidence and allows system to adapt to new or unsupported banners
- **Trigger**: User navigates to "Patterns" tab or encounters unknown banner
- **Progression**: View patterns list → Search frameworks → Add custom pattern for unsupported banner → System learns and applies to future encounters
- **Success criteria**: All patterns display correctly, custom patterns can be added, learning system persists across sessions

### Feature 6: Banana Celebration Notification
- **Functionality**: Shows animated banana with thumbs up when banner is successfully removed
- **Purpose**: Provides delightful, positive feedback confirming banner was handled automatically
- **Trigger**: Banner successfully closed by the system
- **Progression**: Banner closes → Banana appears with animation → Thumbs up gesture → Fades after 3 seconds → Can be disabled in settings
- **Success criteria**: Animation is smooth and celebratory, doesn't obstruct content, can be toggled off

## Edge Case Handling

- **No Preference Set**: Default to "Necessary Only" automatically on first launch, with clear indication this is the privacy-protective default
- **Conflicting Advanced Settings**: If user selects "All Cookies" preset but has individual toggles off, advanced settings take precedence with visual indicator
- **Rapid Preference Changes**: Debounce save operations to avoid excessive writes while providing immediate UI feedback
- **Empty States**: If no preference history exists, show helpful onboarding message explaining the purpose and benefits

## Design Direction

The design should evoke a sense of **digital sanctuary and empowerment**. Users should feel like they're taking control of their privacy with a tool that's professional yet approachable. The aesthetic should be clean and modern with subtle security-oriented visual cues (shields, locks, checkmarks) used sparingly. The color palette should inspire trust while the typography should be clear and authoritative.

## Color Selection

A trustworthy, privacy-focused palette with strong contrast and clear visual hierarchy.

- **Primary Color**: Deep Blue (oklch(0.45 0.15 255)) - Communicates trust, security, and professionalism; used for primary actions and branding
- **Secondary Colors**: 
  - Slate Gray (oklch(0.35 0.02 255)) - Professional supporting color for secondary UI elements
  - Light Blue Gray (oklch(0.96 0.01 255)) - Soft background for cards and panels
- **Accent Color**: Vibrant Teal (oklch(0.65 0.14 200)) - Attention-grabbing highlight for active states, toggles, and CTAs
- **Foreground/Background Pairings**: 
  - Background Light (oklch(0.98 0 0)): Dark text oklch(0.25 0.02 255) - Ratio 11.2:1 ✓
  - Primary Blue (oklch(0.45 0.15 255)): White text (oklch(1 0 0)) - Ratio 8.9:1 ✓
  - Accent Teal (oklch(0.65 0.14 200)): Dark text (oklch(0.25 0.02 255)) - Ratio 5.8:1 ✓
  - Card Background (oklch(0.96 0.01 255)): Medium text (oklch(0.35 0.02 255)) - Ratio 7.5:1 ✓

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
  - `Tabs` - Navigation between Settings, Preview, and Info views
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
