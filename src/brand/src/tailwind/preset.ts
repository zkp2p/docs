/**
 * Peer Brand Tailwind Preset
 *
 * A complete Tailwind CSS preset that extends the theme with all Peer brand tokens.
 * Works with Tailwind v3.x and v4.x.
 *
 * @example
 * ```typescript
 * // tailwind.config.ts
 * import { peerPreset } from '@zkp2p/brand/tailwind';
 *
 * export default {
 *   presets: [peerPreset],
 *   // client-specific overrides
 * }
 * ```
 */

import type { Config } from "tailwindcss";
import {
  colors,
  borders,
  text,
  gradientValues,
  fontFamilies,
  fontWeights,
  fontSizes,
  lineHeights,
  letterSpacing,
  radii,
  spacing,
  shadows,
  transitions,
  breakpoints,
  zIndices,
} from "../tokens";

/**
 * Peer brand color palette for Tailwind
 *
 * Usage: bg-peer-black, text-peer-white, border-peer-border-dark, etc.
 */
const peerColors = {
  // Core palette
  black: colors.black,
  white: colors.white,
  "light-grey": colors.lightGrey,
  "rich-black": colors.richBlack,
  obsidian: colors.obsidian,
  grey: colors.grey,

  // IGNITE gradient colors
  ignite: {
    yellow: colors.igniteYellow,
    red: colors.igniteRed,
  },

  // Semantic colors
  success: colors.success,
  warning: colors.warning,
  error: colors.error,
  "error-alt": colors.errorAlt,
  link: colors.link,

  // Text colors
  text: {
    primary: text.primary,
    secondary: text.secondary,
    placeholder: text.placeholder,
    dark: text.dark,
    "dark-alt": text.darkAlt,
  },

  // Border colors
  border: {
    dark: borders.dark,
    light: borders.light,
    "card-light": borders.cardLight,
    subtle: borders.subtle,
  },
} as const;

/**
 * CSS variable-based colors for shadcn/ui compatibility
 *
 * These use CSS custom properties defined in variables.css
 * to support light/dark mode theming.
 */
const cssVarColors = {
  border: "var(--peer-border-dark)",
  input: "var(--peer-rich-black)",
  ring: "var(--peer-ignite-red)",
  background: "var(--peer-black)",
  foreground: "var(--peer-white)",
  primary: {
    DEFAULT: "var(--peer-ignite-red)",
    foreground: "var(--peer-black)",
  },
  secondary: {
    DEFAULT: "var(--peer-rich-black)",
    foreground: "var(--peer-white)",
  },
  destructive: {
    DEFAULT: "var(--peer-error)",
    foreground: "var(--peer-white)",
  },
  muted: {
    DEFAULT: "var(--peer-rich-black)",
    foreground: "var(--peer-grey)",
  },
  accent: {
    DEFAULT: "var(--peer-ignite-yellow)",
    foreground: "var(--peer-black)",
  },
  popover: {
    DEFAULT: "var(--peer-rich-black)",
    foreground: "var(--peer-white)",
  },
  card: {
    DEFAULT: "var(--peer-rich-black)",
    foreground: "var(--peer-white)",
  },
} as const;

/**
 * Font family configuration
 */
const fontFamily = {
  headline: [fontFamilies.headline.replace(/'/g, ""), "sans-serif"],
  body: [fontFamilies.body.replace(/'/g, ""), "sans-serif"],
  sans: [fontFamilies.body.replace(/'/g, ""), "sans-serif"],
};

/**
 * Font size configuration with line-height pairs
 * Typed as tuples for Tailwind compatibility
 */
type FontSizeConfig = [string, { lineHeight: string }];
const fontSize: Record<string, FontSizeConfig> = {
  // Headlines (PP Valve)
  hero: [`${fontSizes.hero}px`, { lineHeight: `${lineHeights.tight}` }],
  h1: [`${fontSizes.h1}px`, { lineHeight: `${lineHeights.tight}` }],
  h2: [`${fontSizes.h2}px`, { lineHeight: `${lineHeights.tight}` }],
  h3: [`${fontSizes.h3}px`, { lineHeight: `${lineHeights.tight}` }],
  h4: [`${fontSizes.h4}px`, { lineHeight: `${lineHeights.tight}` }],
  h5: [`${fontSizes.h5}px`, { lineHeight: `${lineHeights.tight}` }],
  h6: [`${fontSizes.h6}px`, { lineHeight: `${lineHeights.tight}` }],

  // Body (Inter)
  "body-lg": [
    `${fontSizes.bodyLarge}px`,
    { lineHeight: `${lineHeights.body}` },
  ],
  body: [`${fontSizes.body}px`, { lineHeight: `${lineHeights.body}` }],
  "body-sm": [
    `${fontSizes.bodySmall}px`,
    { lineHeight: `${lineHeights.body}` },
  ],

  // UI Elements
  button: [`${fontSizes.button}px`, { lineHeight: `${lineHeights.single}` }],
  caption: [`${fontSizes.caption}px`, { lineHeight: `${lineHeights.body}` }],
  label: [`${fontSizes.label}px`, { lineHeight: `${lineHeights.relaxed}` }],
  sub1: [`${fontSizes.sub1}px`, { lineHeight: "2" }],
  sub2: [`${fontSizes.sub2}px`, { lineHeight: "2" }],
  badge: [`${fontSizes.badge}px`, { lineHeight: `${lineHeights.single}` }],
};

/**
 * Border radius configuration
 */
const borderRadius = {
  none: `${radii.none}px`,
  xs: `${radii.xs}px`,
  sm: `${radii.sm}px`,
  md: `${radii.md}px`,
  lg: `${radii.lg}px`,
  xl: `${radii.xl}px`,
  "2xl": `${radii["2xl"]}px`,
  full: `${radii.full}px`,
} as const;

/**
 * Spacing configuration (4px base)
 */
const spacingConfig = Object.fromEntries(
  Object.entries(spacing).map(([key, value]) => [`peer-${key}`, `${value}px`]),
) as Record<string, string>;

/**
 * Box shadow configuration
 */
const boxShadow = {
  "peer-sm": shadows.sm,
  "peer-md": shadows.md,
  "peer-lg": shadows.lg,
  "peer-inner": shadows.inner,
} as const;

/**
 * Z-index configuration
 */
const zIndex = Object.fromEntries(
  Object.entries(zIndices).map(([key, value]) => [`peer-${key}`, `${value}`]),
) as Record<string, string>;

/**
 * Transition configuration
 */
const transitionDuration = {
  fast: "150ms",
  normal: "200ms",
  slow: "300ms",
} as const;

/**
 * Screen breakpoints
 */
const screens = {
  mobile: `${breakpoints.mobile}px`,
  tablet: `${breakpoints.tablet}px`,
  laptop: `${breakpoints.laptop}px`,
  desktop: `${breakpoints.desktop}px`,
  wide: `${breakpoints.wide}px`,
} as const;

/**
 * Custom keyframe animations
 */
const keyframes = {
  "accordion-down": {
    from: { height: "0" },
    to: { height: "var(--radix-accordion-content-height)" },
  },
  "accordion-up": {
    from: { height: "var(--radix-accordion-content-height)" },
    to: { height: "0" },
  },
  "fade-in": {
    "0%": { opacity: "0", transform: "translateY(10px)" },
    "100%": { opacity: "1", transform: "translateY(0)" },
  },
  "slide-in-up": {
    "0%": { transform: "translateY(100%)", opacity: "0" },
    "100%": { transform: "translateY(0)", opacity: "1" },
  },
  "slide-out-down": {
    "0%": { transform: "translateY(0)", opacity: "1" },
    "100%": { transform: "translateY(100%)", opacity: "0" },
  },
  shake: {
    "0%, 100%": { transform: "translateX(0)" },
    "10%, 30%, 50%, 70%, 90%": { transform: "translateX(-2px)" },
    "20%, 40%, 60%, 80%": { transform: "translateX(2px)" },
  },
  "subtle-pulse": {
    "0%, 100%": { opacity: "0.05" },
    "50%": { opacity: "0.1" },
  },
  "gradient-shift": {
    "0%": { backgroundPosition: "0% 50%" },
    "50%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },
} as const;

/**
 * Animation presets
 */
const animation = {
  "accordion-down": "accordion-down 0.2s ease-out",
  "accordion-up": "accordion-up 0.2s ease-out",
  "fade-in": "fade-in 0.5s ease-out",
  "slide-in-up": "slide-in-up 0.3s ease-out",
  "slide-out-down": "slide-out-down 0.2s ease-in",
  shake: "shake 0.3s ease-in-out",
  "subtle-pulse": "subtle-pulse 3s ease-in-out infinite",
  "gradient-shift": "gradient-shift 3s ease infinite",
} as const;

/**
 * Background image utilities for IGNITE gradient
 */
const backgroundImage = {
  // Standard orientations
  "peer-ignite": `linear-gradient(90deg, ${gradientValues.start} 0%, ${gradientValues.end} 100%)`,
  "peer-ignite-hover": `linear-gradient(270deg, ${gradientValues.start} 0%, ${gradientValues.end} 100%)`,
  "peer-ignite-vertical": `linear-gradient(180deg, ${gradientValues.start} 0%, ${gradientValues.end} 100%)`,
  "peer-ignite-text": `linear-gradient(90deg, ${gradientValues.start}, ${gradientValues.end})`,

  // Figma-precise angles
  "peer-ignite-diagonal": `linear-gradient(8.27deg, ${gradientValues.start} 8.73%, ${gradientValues.end} 89.42%)`,
  "peer-ignite-steep": `linear-gradient(42.6deg, ${gradientValues.start} 19.59%, ${gradientValues.end} 69.63%)`,
} as const;

/**
 * Peer Brand Tailwind Preset
 *
 * Extends Tailwind theme with all Peer brand design tokens.
 * Compatible with both Tailwind v3.x and v4.x.
 */
export const peerPreset: Config = {
  darkMode: ["class"],
  content: [],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        peer: peerColors,
        ...cssVarColors,
      },
      fontFamily,
      fontSize,
      fontWeight: {
        regular: `${fontWeights.regular}`,
        medium: `${fontWeights.medium}`,
        semibold: `${fontWeights.semibold}`,
        bold: `${fontWeights.bold}`,
        extrabold: `${fontWeights.extrabold}`,
      },
      letterSpacing: {
        headline: letterSpacing.headline,
        normal: letterSpacing.normal,
        wide: letterSpacing.wide,
        tight: letterSpacing.tight,
        snug: letterSpacing.snug,
        button: letterSpacing.button,
      },
      lineHeight: {
        tight: `${lineHeights.tight}`,
        headline: `${lineHeights.headline}`,
        body: `${lineHeights.body}`,
        relaxed: `${lineHeights.relaxed}`,
        single: `${lineHeights.single}`,
      },
      borderRadius,
      spacing: spacingConfig,
      boxShadow,
      zIndex,
      screens,
      transitionDuration,
      keyframes,
      animation,
      backgroundImage,
    },
  },
  plugins: [],
};

export default peerPreset;
