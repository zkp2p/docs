/**
 * Peer Brand Design Tokens
 *
 * Single source of truth for all Peer brand values.
 * Extracted from Figma Brand Book: https://www.figma.com/design/uwou994XdkDmul4n8uz9cE
 *
 * @packageDocumentation
 */

/* ==========================================================================
   COLORS
   ========================================================================== */

/**
 * Core brand colors from Figma Brand Book
 */
export const colors = {
  // ─────────────────────────────────────────────────────────────────────────
  // Primary Palette (Section 21 - Colour Palette)
  // ─────────────────────────────────────────────────────────────────────────

  /** Primary background, strong contrast */
  black: "#000000",

  /** Primary text on dark backgrounds */
  white: "#FFFFFF",

  /** Light backgrounds, softer surfaces */
  lightGrey: "#EEEEEE",

  // ─────────────────────────────────────────────────────────────────────────
  // Extended Palette
  // ─────────────────────────────────────────────────────────────────────────

  /** Secondary/elevated surfaces, cards on black */
  richBlack: "#181818",

  /** Darker text backgrounds (from Figma: Obsidian) */
  obsidian: "#101010",

  /** Secondary text, muted elements */
  grey: "#777777",

  // ─────────────────────────────────────────────────────────────────────────
  // IGNITE Gradient Colors (Section 21)
  // The gradient represents "value flowing freely between people"
  // ─────────────────────────────────────────────────────────────────────────

  /** IGNITE gradient start (yellow) */
  igniteYellow: "#FFE500",

  /** IGNITE gradient end (red) */
  igniteRed: "#FF3A33",

  // ─────────────────────────────────────────────────────────────────────────
  // Semantic Colors
  // ─────────────────────────────────────────────────────────────────────────

  /** Success states, valid inputs */
  success: "#4BB543",

  /** Warning states, caution */
  warning: "#FFC107",

  /** Error states, invalid inputs (from Figma: NopeRed) */
  error: "#FF4040",

  /** Legacy error color (slightly different red) */
  errorAlt: "#DF2E2D",

  /** Links and interactive elements */
  link: "#1F95E2",
} as const;

/**
 * Border colors for various contexts
 */
export const borders = {
  /** Borders on dark backgrounds */
  dark: "#383838",

  /** Borders on light backgrounds */
  light: "#EEEEEE",

  /** Card borders on light backgrounds (from Figma) */
  cardLight: "#C9C9C9",

  /** Subtle borders */
  subtle: "#D3D3D3",
} as const;

/**
 * Text colors for various contexts
 */
export const text = {
  /** Primary text color (white on dark) */
  primary: "#FFFFFF",

  /** Secondary/muted text */
  secondary: "#777777",

  /** Placeholder text in inputs */
  placeholder: "#6C757D",

  /** Text on light backgrounds */
  dark: "#000000",

  /** Text on light backgrounds (obsidian variant) */
  darkAlt: "#101010",
} as const;

/* ==========================================================================
   GRADIENTS
   ========================================================================== */

/**
 * IGNITE gradient configurations
 *
 * The IGNITE gradient is the primary brand expression, representing
 * "the spark of connection" and "value flowing freely between people".
 *
 * From Figma Brand Book Section 21:
 * - Used sparingly for warmth and energy
 * - Primary expression of the Peer logo
 * - Apply to buttons, CTAs, and accent elements
 */
export const gradients = {
  // ─────────────────────────────────────────────────────────────────────────
  // Standard Orientations
  // ─────────────────────────────────────────────────────────────────────────

  /** Primary IGNITE gradient (left to right) - Default for buttons */
  ignite: "linear-gradient(90deg, #FFE500 0%, #FF3A33 100%)",

  /** Hover state gradient (reversed direction) */
  igniteHover: "linear-gradient(270deg, #FFE500 0%, #FF3A33 100%)",

  /** Vertical gradient (top to bottom) */
  igniteVertical: "linear-gradient(180deg, #FFE500 0%, #FF3A33 100%)",

  /** Horizontal gradient for text effects */
  igniteText: "linear-gradient(90deg, #FFE500, #FF3A33)",

  // ─────────────────────────────────────────────────────────────────────────
  // Figma-Precise Angles (extracted from brand book)
  // ─────────────────────────────────────────────────────────────────────────

  /** Near-horizontal gradient (-89.11deg) - Used in colour palette examples */
  igniteNearHorizontal:
    "linear-gradient(-89.11deg, #FFE500 3.94%, #FF3A33 91.73%)",

  /** Diagonal gradient (8.27deg) - Used in some compositions */
  igniteDiagonal: "linear-gradient(8.27deg, #FFE500 8.73%, #FF3A33 89.42%)",

  /** Steeper diagonal (42.6deg) - Used for gradient text bullets */
  igniteSteepDiagonal:
    "linear-gradient(42.6deg, #FFE500 19.59%, #FF3A33 69.63%)",
} as const;

/**
 * Gradient CSS values for background-image
 */
export const gradientValues = {
  /** Raw gradient stops for custom angles */
  stops: "#FFE500 0%, #FF3A33 100%",

  /** Gradient start color */
  start: "#FFE500",

  /** Gradient end color */
  end: "#FF3A33",
} as const;

/* ==========================================================================
   TYPOGRAPHY
   ========================================================================== */

/**
 * Font family definitions
 *
 * From Figma Brand Book Sections 27-28:
 * - PP Valve: Headlines (ALWAYS UPPERCASE)
 * - Inter: Body text, UI labels, buttons
 */
export const fontFamilies = {
  /** Headlines - geometric, precise, bold. MUST be uppercase. */
  headline: "'PP Valve', sans-serif",

  /** Body text - clean, balanced, readable */
  body: "'Inter', sans-serif",
} as const;

/**
 * Font weights
 *
 * PP Valve: Use Plain Semibold (600) for headlines
 * Inter: Use Medium (500) for body, Semi-Bold (600) for buttons
 */
export const fontWeights = {
  /** Regular weight */
  regular: 400,

  /** Medium weight - Inter body text */
  medium: 500,

  /** Semi-bold - PP Valve headlines, Inter buttons */
  semibold: 600,

  /** Bold - Inter subheadings */
  bold: 700,

  /** Extra-bold - PP Valve emphasis (rare) */
  extrabold: 800,
} as const;

/**
 * Font sizes (in pixels)
 *
 * From Figma Peer UI Toolkit (node 140:8907)
 *
 * Desktop headlines: H1=110, H2=96, H3=64, H4=48, H5=32
 * Mobile headlines: H1=48, H2=40, H3=36, H4=32, H5=26
 */
export const fontSizes = {
  // Desktop Headlines (PP Valve) - Figma "H1" through "H5"
  hero: 110, // Figma H1 (largest display)
  h1: 96, // Figma H2
  h2: 64, // Figma H3
  h3: 48, // Figma H4
  h4: 44, // Legacy - between H4 and H5
  h5: 32, // Figma H5
  h6: 24, // Legacy - below H5

  // Desktop Body (Inter) - Figma "Body 1" through "Body 3"
  bodyLarge: 24, // Figma Body1
  body: 20, // Figma Body2
  bodySmall: 16, // Figma Body3

  // UI Elements
  button: 14,
  caption: 12,
  sub1: 18, // Figma Sub1
  sub2: 14, // Figma Sub2
  subheading: 14, // Legacy alias for sub2
  label: 14,
  badge: 8,
} as const;

/**
 * Mobile font sizes (in pixels)
 *
 * From Figma Peer UI Toolkit - Mobile typography section
 */
export const mobileFontSizes = {
  // Mobile Headlines (PP Valve)
  h1: 48, // Figma Mobile H1
  h2: 40, // Figma Mobile H2
  h3: 36, // Figma Mobile H3
  h4: 32, // Figma Mobile H4
  h5: 26, // Figma Mobile H5

  // Mobile Body (Inter)
  bodyLarge: 20, // Figma Mobile Body1
  body: 18, // Figma Mobile Body2
  bodySmall: 16, // Figma Mobile Body3

  // UI Elements (same as desktop)
  button: 14,
  caption: 12,
  sub1: 18,
  sub2: 14,
} as const;

/**
 * Line heights
 *
 * Headlines use tighter line-height (0.9-1.02)
 * Body uses more open line-height (1.3-1.5)
 */
export const lineHeights = {
  /** Tight - PP Valve headlines */
  tight: 0.9,

  /** Headline default */
  headline: 1.02,

  /** Body text default */
  body: 1.3,

  /** Relaxed - subheadings */
  relaxed: 1.5,

  /** Single line (buttons) */
  single: 1,
} as const;

/**
 * Letter spacing values
 *
 * From Figma Peer UI Toolkit (node 140:8907)
 * Headlines: 0 tracking
 * Subheadings: 10% tracking (0.1em)
 * Buttons: 10% tracking (0.1em)
 */
export const letterSpacing = {
  /** Headlines - no tracking per Figma */
  headline: "0",

  /** Normal - body text */
  normal: "0",

  /** Subheadings and buttons - 10% tracking */
  wide: "0.1em",

  // Legacy aliases
  tight: "-0.02em",
  snug: "-0.01em",
  subheading: "0.02em",
  button: "0.1em",
} as const;

/**
 * Complete typography presets - Desktop
 *
 * Ready-to-use typography configurations matching Figma Peer UI Toolkit.
 * All headlines use PP Valve with 0 letter-spacing per Figma.
 * Line height for all headlines is 0.9.
 */
export const typography = {
  // ─────────────────────────────────────────────────────────────────────────
  // Headlines (PP Valve - UPPERCASE, line-height 0.9, letter-spacing 0)
  // ─────────────────────────────────────────────────────────────────────────

  hero: {
    fontFamily: fontFamilies.headline,
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes.hero,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.headline,
    textTransform: "uppercase" as const,
  },

  h1: {
    fontFamily: fontFamilies.headline,
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes.h1,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.headline,
    textTransform: "uppercase" as const,
  },

  h2: {
    fontFamily: fontFamilies.headline,
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes.h2,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.headline,
    textTransform: "uppercase" as const,
  },

  h3: {
    fontFamily: fontFamilies.headline,
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes.h3,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.headline,
    textTransform: "uppercase" as const,
  },

  h4: {
    fontFamily: fontFamilies.headline,
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes.h4,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.headline,
    textTransform: "uppercase" as const,
  },

  h5: {
    fontFamily: fontFamilies.headline,
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes.h5,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.headline,
    textTransform: "uppercase" as const,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Body Text (Inter - Medium 500, line-height 1.3)
  // ─────────────────────────────────────────────────────────────────────────

  bodyLarge: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.medium,
    fontSize: fontSizes.bodyLarge,
    lineHeight: lineHeights.body,
    letterSpacing: letterSpacing.normal,
  },

  body: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.medium,
    fontSize: fontSizes.body,
    lineHeight: lineHeights.body,
    letterSpacing: letterSpacing.normal,
  },

  bodySmall: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.medium,
    fontSize: fontSizes.bodySmall,
    lineHeight: lineHeights.body,
    letterSpacing: letterSpacing.normal,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // Subheadings (Inter - Semi Bold 600, line-height 2, 10% tracking)
  // ─────────────────────────────────────────────────────────────────────────

  sub1: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes.sub1,
    lineHeight: 2,
    letterSpacing: letterSpacing.wide,
    textTransform: "uppercase" as const,
  },

  sub2: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes.sub2,
    lineHeight: 2,
    letterSpacing: letterSpacing.wide,
    textTransform: "uppercase" as const,
  },

  // Legacy alias
  subheading: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes.sub2,
    lineHeight: 2,
    letterSpacing: letterSpacing.wide,
    textTransform: "uppercase" as const,
  },

  // ─────────────────────────────────────────────────────────────────────────
  // UI Elements (Inter)
  // ─────────────────────────────────────────────────────────────────────────

  button: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes.button,
    lineHeight: lineHeights.single,
    letterSpacing: letterSpacing.wide,
    textTransform: "uppercase" as const,
  },

  caption: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.medium,
    fontSize: fontSizes.caption,
    lineHeight: lineHeights.body,
    letterSpacing: letterSpacing.normal,
  },

  label: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.medium,
    fontSize: fontSizes.label,
    lineHeight: lineHeights.relaxed,
    letterSpacing: letterSpacing.normal,
  },
} as const;

/**
 * Mobile typography presets
 *
 * Scaled-down typography for mobile devices per Figma toolkit.
 */
export const mobileTypography = {
  // Headlines (PP Valve - UPPERCASE, line-height 0.9)
  h1: {
    fontFamily: fontFamilies.headline,
    fontWeight: fontWeights.semibold,
    fontSize: mobileFontSizes.h1,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.headline,
    textTransform: "uppercase" as const,
  },

  h2: {
    fontFamily: fontFamilies.headline,
    fontWeight: fontWeights.semibold,
    fontSize: mobileFontSizes.h2,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.headline,
    textTransform: "uppercase" as const,
  },

  h3: {
    fontFamily: fontFamilies.headline,
    fontWeight: fontWeights.semibold,
    fontSize: mobileFontSizes.h3,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.headline,
    textTransform: "uppercase" as const,
  },

  h4: {
    fontFamily: fontFamilies.headline,
    fontWeight: fontWeights.semibold,
    fontSize: mobileFontSizes.h4,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.headline,
    textTransform: "uppercase" as const,
  },

  h5: {
    fontFamily: fontFamilies.headline,
    fontWeight: fontWeights.semibold,
    fontSize: mobileFontSizes.h5,
    lineHeight: lineHeights.tight,
    letterSpacing: letterSpacing.headline,
    textTransform: "uppercase" as const,
  },

  // Body (Inter - Medium 500, line-height 1.3)
  bodyLarge: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.medium,
    fontSize: mobileFontSizes.bodyLarge,
    lineHeight: lineHeights.body,
    letterSpacing: letterSpacing.normal,
  },

  body: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.medium,
    fontSize: mobileFontSizes.body,
    lineHeight: lineHeights.body,
    letterSpacing: letterSpacing.normal,
  },

  bodySmall: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.medium,
    fontSize: mobileFontSizes.bodySmall,
    lineHeight: lineHeights.body,
    letterSpacing: letterSpacing.normal,
  },

  // Subheadings (same as desktop)
  sub1: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.semibold,
    fontSize: mobileFontSizes.sub1,
    lineHeight: 2,
    letterSpacing: letterSpacing.wide,
    textTransform: "uppercase" as const,
  },

  sub2: {
    fontFamily: fontFamilies.body,
    fontWeight: fontWeights.semibold,
    fontSize: mobileFontSizes.sub2,
    lineHeight: 2,
    letterSpacing: letterSpacing.wide,
    textTransform: "uppercase" as const,
  },
} as const;

/* ==========================================================================
   SPACING & LAYOUT
   ========================================================================== */

/**
 * Button size presets (height in pixels)
 *
 * Standardized button heights for consistent UI
 */
export const buttonSizes = {
  /** Extra small buttons - inline actions */
  xs: 32,

  /** Small buttons - compact UI elements */
  sm: 36,

  /** Default buttons - secondary actions */
  default: 40,

  /** Medium buttons - standard actions */
  md: 44,

  /** Large buttons - primary CTAs */
  lg: 48,
} as const;

/**
 * Spinner size presets (in pixels)
 *
 * Standardized loading spinner sizes for consistent UI
 */
export const spinnerSizes = {
  /** Extra small - inline indicators, badges */
  xs: 12,

  /** Small - inline spinners, small buttons */
  sm: 16,

  /** Medium - standard loading states */
  md: 20,

  /** Large - prominent loading indicators */
  lg: 24,

  /** Extra large - section loading states */
  xl: 32,

  /** 2X large - full-page loading, hero sections */
  "2xl": 40,

  /** 3X large - app-level loading states */
  "3xl": 48,
} as const;

/**
 * Border radius values
 *
 * From Figma Brand Book examples and UI patterns
 */
export const radii = {
  /** No radius */
  none: 0,

  /** Small elements, badges */
  xs: 4,

  /** Tags, pills */
  sm: 8,

  /** Buttons, inputs */
  md: 10,

  /** Modals, dialogs */
  lg: 16,

  /** Cards, sections */
  xl: 24,

  /** Large containers */
  "2xl": 32,

  /** Pills, fully rounded */
  full: 9999,
} as const;

/**
 * Spacing scale (in pixels)
 *
 * 4px base unit
 */
export const spacing = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
} as const;

/* ==========================================================================
   EFFECTS
   ========================================================================== */

/**
 * Shadow definitions
 */
export const shadows = {
  /** Subtle elevation */
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",

  /** Card elevation */
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",

  /** Modal/overlay elevation */
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",

  /** Inner shadow for pressed states */
  inner: "inset 0.624px 0.624px 0.125px 0px rgba(255, 255, 255, 0.25)",
} as const;

/**
 * Transition presets
 */
export const transitions = {
  /** Fast interactions */
  fast: "0.15s ease",

  /** Standard transitions */
  normal: "0.2s ease",

  /** Smooth animations */
  slow: "0.3s ease",

  /** Background color changes */
  background: "background 0.2s ease",

  /** All properties */
  all: "all 0.2s ease",
} as const;

/* ==========================================================================
   RESPONSIVE BREAKPOINTS
   ========================================================================== */

/**
 * Breakpoint values (in pixels)
 */
export const breakpoints = {
  /** Mobile devices */
  mobile: 425,

  /** Tablets */
  tablet: 768,

  /** Laptops */
  laptop: 1024,

  /** Desktops */
  desktop: 1280,

  /** Large screens */
  wide: 1440,
} as const;

/**
 * Media query strings
 */
export const media = {
  mobile: `(max-width: ${breakpoints.mobile}px)`,
  tablet: `(max-width: ${breakpoints.tablet}px)`,
  laptop: `(max-width: ${breakpoints.laptop}px)`,
  desktop: `(max-width: ${breakpoints.desktop}px)`,
  wide: `(min-width: ${breakpoints.wide}px)`,
} as const;

/* ==========================================================================
   Z-INDEX SCALE
   ========================================================================== */

/**
 * Z-index layering system
 */
export const zIndices = {
  /** Below default */
  hide: -1,

  /** Default layer */
  base: 0,

  /** Slightly elevated */
  docked: 10,

  /** Dropdowns */
  dropdown: 1000,

  /** Sticky elements */
  sticky: 1100,

  /** Fixed headers */
  fixed: 1200,

  /** Overlays */
  overlay: 1300,

  /** Modals */
  modal: 1400,

  /** Popovers */
  popover: 1500,

  /** Tooltips */
  tooltip: 1600,

  /** Toast notifications */
  toast: 1700,
} as const;

/* ==========================================================================
   LOGO SPECIFICATIONS
   ========================================================================== */

/**
 * Logo usage guidelines from Figma Brand Book Section 17
 */
export const logo = {
  /** Minimum height on screen (pixels) */
  minSizeScreen: 22,

  /** Minimum height in print (inches) */
  minSizePrint: 0.24,

  /** Clear space multiplier (relative to logo height) */
  clearSpaceRatio: 1,

  /** Available variants */
  variants: ["colour", "black", "white"] as const,

  /** Primary/preferred variant */
  preferredVariant: "colour" as const,
} as const;

/* ==========================================================================
   COMBINED THEME EXPORT
   ========================================================================== */

/**
 * Complete Peer brand theme
 *
 * Single export containing all design tokens
 */
export const peerTheme = {
  colors,
  borders,
  text,
  gradients,
  gradientValues,
  fontFamilies,
  fontWeights,
  fontSizes,
  mobileFontSizes,
  lineHeights,
  letterSpacing,
  typography,
  mobileTypography,
  buttonSizes,
  spinnerSizes,
  radii,
  spacing,
  shadows,
  transitions,
  breakpoints,
  media,
  zIndices,
  logo,
} as const;

export type PeerTheme = typeof peerTheme;
export type Colors = typeof colors;
export type Gradients = typeof gradients;
export type Typography = typeof typography;
export type MobileTypography = typeof mobileTypography;
