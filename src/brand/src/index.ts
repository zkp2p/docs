/**
 * @zkp2p/brand
 *
 * Peer Brand Design System
 *
 * Single source of truth for all Peer brand assets and design tokens.
 *
 * @example
 * ```typescript
 * import { colors, gradients, typography, peerTheme } from '@zkp2p/brand';
 *
 * // Use individual tokens
 * const primaryBg = colors.black;
 * const ctaGradient = gradients.ignite;
 *
 * // Or use the complete theme
 * const theme = peerTheme;
 * ```
 *
 * @packageDocumentation
 */

// Re-export all tokens
export {
  // Colors
  colors,
  borders,
  text,

  // Gradients
  gradients,
  gradientValues,

  // Typography - Desktop
  fontFamilies,
  fontWeights,
  fontSizes,
  lineHeights,
  letterSpacing,
  typography,

  // Typography - Mobile
  mobileFontSizes,
  mobileTypography,

  // Layout
  buttonSizes,
  spinnerSizes,
  radii,
  spacing,
  shadows,
  transitions,
  breakpoints,
  media,
  zIndices,

  // Logo specs
  logo,

  // Complete theme
  peerTheme,
} from "./tokens";

// Re-export types
export type {
  PeerTheme,
  Colors,
  Gradients,
  Typography,
  MobileTypography,
} from "./tokens";

// Utility function for opacity
export { opacify } from "./utils";

// Tier system
export {
  // Types
  type TierLevel,
  type TierColorScheme,
  type TierInfo,
  type RiskLevel,

  // Constants
  VOLUME_BASED_TIERS,
  ALL_TIERS,
  tierColors,
  tierColorSchemes,
  tierInfo,
  tierAnimations,
  riskColors,

  // Functions
  getTierColor,
  getTierColorScheme,
  getTierAnimation,
  getRiskColor,
} from "./tiers";
