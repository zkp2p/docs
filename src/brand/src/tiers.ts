/**
 * Peer Tier System
 *
 * Tier colors and styling for the ZKP2P loyalty/gamification system.
 * Tiers are inspired by precious metals/gems to create visual hierarchy.
 *
 * Tier Hierarchy (by volume):
 * - PEASANT: $0-100 volume (Bronze)
 * - PEER: $100-1k volume (Silver)
 * - PLUS: $1k-10k volume (Gold)
 * - PRO: $10k-25k volume (Emerald)
 * - PLATINUM: $25k+ volume (Platinum)
 * - PEER_PRESIDENT: Invite-only (Diamond)
 *
 * @packageDocumentation
 */

/* ==========================================================================
   TIER TYPES
   ========================================================================== */

/**
 * Volume-based tier levels
 */
export type TierLevel =
  | "PEASANT"
  | "PEER"
  | "PLUS"
  | "PRO"
  | "PLATINUM"
  | "PEER_PRESIDENT";

/**
 * Standard tiers that can be ascended via volume
 */
export const VOLUME_BASED_TIERS: TierLevel[] = [
  "PEASANT",
  "PEER",
  "PLUS",
  "PRO",
  "PLATINUM",
];

/**
 * All valid tiers including special/invite-only ones
 */
export const ALL_TIERS: TierLevel[] = [...VOLUME_BASED_TIERS, "PEER_PRESIDENT"];

/* ==========================================================================
   TIER COLORS
   ========================================================================== */

/**
 * Primary tier colors - used for icons, badges, and accent elements
 *
 * These are semantic identity colors inspired by precious metals/gems,
 * intentionally distinct from the core Peer brand palette.
 */
export const tierColors = {
  /** Diamond (light cyan/ice blue) - PEER_PRESIDENT */
  diamond: "#B9F2FF",

  /** Platinum (elite silver) - PLATINUM */
  platinum: "#E5E4E2",

  /** Emerald (rich green) - PRO */
  emerald: "#50C878",

  /** Gold (darker gold) - PLUS */
  gold: "#D4A017",

  /** Silver (classic silver) - PEER */
  silver: "#C0C0C0",

  /** Bronze (warm bronze) - PEASANT */
  bronze: "#CD7F32",
} as const;

/**
 * Get the primary color for a tier
 */
export function getTierColor(tier: TierLevel | string): string {
  switch (tier) {
    case "PEER_PRESIDENT":
      return tierColors.diamond;
    case "PLATINUM":
      return tierColors.platinum;
    case "PRO":
      return tierColors.emerald;
    case "PLUS":
      return tierColors.gold;
    case "PEER":
      return tierColors.silver;
    case "PEASANT":
    default:
      return tierColors.bronze;
  }
}

/* ==========================================================================
   TIER COLOR SCHEMES
   ========================================================================== */

/**
 * Full color scheme for tier UI elements
 */
export interface TierColorScheme {
  /** Background gradient for cards/containers */
  bg: string;
  /** Border color */
  border: string;
  /** Icon background gradient */
  iconBg: string;
  /** Primary icon/text color */
  iconColor: string;
  /** Secondary/subtext color */
  subtextColor: string;
}

/**
 * Complete color schemes for each tier
 */
export const tierColorSchemes: Record<TierLevel, TierColorScheme> = {
  PEER_PRESIDENT: {
    bg: "linear-gradient(135deg, rgba(185, 242, 255, 0.20) 0%, rgba(135, 206, 235, 0.12) 50%, rgba(185, 242, 255, 0.18) 100%)",
    border: "rgba(185, 242, 255, 0.6)",
    iconBg:
      "linear-gradient(135deg, rgba(185, 242, 255, 0.35) 0%, rgba(135, 206, 235, 0.25) 100%)",
    iconColor: tierColors.diamond,
    subtextColor: "rgba(185, 242, 255, 0.95)",
  },
  PLATINUM: {
    bg: "linear-gradient(135deg, rgba(229, 228, 226, 0.18) 0%, rgba(200, 200, 210, 0.10) 50%, rgba(229, 228, 226, 0.15) 100%)",
    border: "rgba(229, 228, 226, 0.5)",
    iconBg:
      "linear-gradient(135deg, rgba(229, 228, 226, 0.3) 0%, rgba(200, 200, 210, 0.2) 100%)",
    iconColor: tierColors.platinum,
    subtextColor: "rgba(229, 228, 226, 0.95)",
  },
  PRO: {
    bg: "linear-gradient(135deg, rgba(80, 200, 120, 0.15) 0%, rgba(46, 139, 87, 0.08) 50%, rgba(34, 139, 34, 0.12) 100%)",
    border: "rgba(80, 200, 120, 0.4)",
    iconBg:
      "linear-gradient(135deg, rgba(80, 200, 120, 0.25) 0%, rgba(46, 139, 87, 0.15) 100%)",
    iconColor: tierColors.emerald,
    subtextColor: "rgba(80, 200, 120, 0.9)",
  },
  PLUS: {
    bg: "linear-gradient(135deg, rgba(212, 160, 23, 0.15) 0%, rgba(184, 134, 11, 0.08) 50%, rgba(153, 112, 9, 0.12) 100%)",
    border: "rgba(212, 160, 23, 0.4)",
    iconBg:
      "linear-gradient(135deg, rgba(212, 160, 23, 0.25) 0%, rgba(184, 134, 11, 0.15) 100%)",
    iconColor: tierColors.gold,
    subtextColor: "rgba(212, 160, 23, 0.9)",
  },
  PEER: {
    bg: "linear-gradient(135deg, rgba(192, 192, 192, 0.15) 0%, rgba(169, 169, 169, 0.08) 50%, rgba(150, 150, 150, 0.12) 100%)",
    border: "rgba(192, 192, 192, 0.4)",
    iconBg:
      "linear-gradient(135deg, rgba(192, 192, 192, 0.25) 0%, rgba(169, 169, 169, 0.15) 100%)",
    iconColor: tierColors.silver,
    subtextColor: "rgba(192, 192, 192, 0.9)",
  },
  PEASANT: {
    bg: "linear-gradient(135deg, rgba(205, 127, 50, 0.15) 0%, rgba(184, 115, 51, 0.08) 50%, rgba(139, 90, 43, 0.12) 100%)",
    border: "rgba(205, 127, 50, 0.4)",
    iconBg:
      "linear-gradient(135deg, rgba(205, 127, 50, 0.25) 0%, rgba(184, 115, 51, 0.15) 100%)",
    iconColor: tierColors.bronze,
    subtextColor: "rgba(205, 127, 50, 0.9)",
  },
};

/**
 * Get the full color scheme for a tier
 */
export function getTierColorScheme(tier: TierLevel | string): TierColorScheme {
  if (tier in tierColorSchemes) {
    return tierColorSchemes[tier as TierLevel];
  }
  return tierColorSchemes.PEASANT;
}

/* ==========================================================================
   TIER METADATA
   ========================================================================== */

/**
 * Tier display information
 */
export interface TierInfo {
  /** Tier level identifier */
  tier: TierLevel;
  /** Display name */
  name: string;
  /** Metal/gem inspiration */
  material: string;
  /** Primary color */
  color: string;
  /** Whether this tier is hidden from non-members */
  isHidden: boolean;
}

/**
 * Metadata for each tier
 */
export const tierInfo: Record<TierLevel, TierInfo> = {
  PEER_PRESIDENT: {
    tier: "PEER_PRESIDENT",
    name: "Peer President",
    material: "Diamond",
    color: tierColors.diamond,
    isHidden: true,
  },
  PLATINUM: {
    tier: "PLATINUM",
    name: "Platinum",
    material: "Platinum",
    color: tierColors.platinum,
    isHidden: false,
  },
  PRO: {
    tier: "PRO",
    name: "Pro",
    material: "Emerald",
    color: tierColors.emerald,
    isHidden: false,
  },
  PLUS: {
    tier: "PLUS",
    name: "Plus",
    material: "Gold",
    color: tierColors.gold,
    isHidden: false,
  },
  PEER: {
    tier: "PEER",
    name: "Peer",
    material: "Silver",
    color: tierColors.silver,
    isHidden: false,
  },
  PEASANT: {
    tier: "PEASANT",
    name: "Peasant",
    material: "Bronze",
    color: tierColors.bronze,
    isHidden: false,
  },
};

/* ==========================================================================
   TIER ANIMATIONS (CSS keyframe strings)
   ========================================================================== */

/**
 * CSS keyframe animations for tier icons.
 * Use with styled-components or inject into stylesheet.
 *
 * @example
 * ```typescript
 * import { keyframes } from 'styled-components';
 * import { tierAnimations } from '@zkp2p/brand/tiers';
 *
 * const goldGlow = keyframes`${tierAnimations.gold}`;
 * ```
 */
export const tierAnimations = {
  /** Subtle shimmer for silver tier */
  silver: `
    0%, 100% { opacity: 0.85; }
    50% { opacity: 1; }
  `,

  /** Soft glow pulse for gold tier */
  gold: `
    0%, 100% {
      filter: drop-shadow(0 0 2px rgba(212, 160, 23, 0.3));
    }
    50% {
      filter: drop-shadow(0 0 4px rgba(212, 160, 23, 0.5));
    }
  `,

  /** Rich glow for emerald tier */
  emerald: `
    0%, 100% {
      filter: drop-shadow(0 0 2px rgba(80, 200, 120, 0.4));
      opacity: 0.9;
    }
    50% {
      filter: drop-shadow(0 0 5px rgba(80, 200, 120, 0.6));
      opacity: 1;
    }
  `,

  /** Elegant shimmer for platinum tier */
  platinum: `
    0%, 100% {
      filter: drop-shadow(0 0 2px rgba(229, 228, 226, 0.4));
      opacity: 0.9;
    }
    50% {
      filter: drop-shadow(0 0 5px rgba(229, 228, 226, 0.6));
      opacity: 1;
    }
  `,

  /** Premium rotating glow for platinum elite */
  platinumElite: `
    0% {
      filter: drop-shadow(0 0 3px rgba(229, 228, 226, 0.5)) drop-shadow(0 -1px 2px rgba(255, 255, 255, 0.3));
    }
    25% {
      filter: drop-shadow(1px 0 3px rgba(229, 228, 226, 0.5)) drop-shadow(1px 0 2px rgba(255, 255, 255, 0.3));
    }
    50% {
      filter: drop-shadow(0 0 4px rgba(229, 228, 226, 0.6)) drop-shadow(0 1px 2px rgba(255, 255, 255, 0.4));
    }
    75% {
      filter: drop-shadow(-1px 0 3px rgba(229, 228, 226, 0.5)) drop-shadow(-1px 0 2px rgba(255, 255, 255, 0.3));
    }
    100% {
      filter: drop-shadow(0 0 3px rgba(229, 228, 226, 0.5)) drop-shadow(0 -1px 2px rgba(255, 255, 255, 0.3));
    }
  `,

  /** Premium rotating glow for diamond (peer president) */
  diamond: `
    0% {
      filter: drop-shadow(0 0 3px rgba(185, 242, 255, 0.5)) drop-shadow(0 -1px 2px rgba(255, 255, 255, 0.3));
    }
    25% {
      filter: drop-shadow(1px 0 3px rgba(185, 242, 255, 0.5)) drop-shadow(1px 0 2px rgba(255, 255, 255, 0.3));
    }
    50% {
      filter: drop-shadow(0 0 4px rgba(185, 242, 255, 0.6)) drop-shadow(0 1px 2px rgba(255, 255, 255, 0.4));
    }
    75% {
      filter: drop-shadow(-1px 0 3px rgba(185, 242, 255, 0.5)) drop-shadow(-1px 0 2px rgba(255, 255, 255, 0.3));
    }
    100% {
      filter: drop-shadow(0 0 3px rgba(185, 242, 255, 0.5)) drop-shadow(0 -1px 2px rgba(255, 255, 255, 0.3));
    }
  `,
} as const;

/**
 * Get the animation keyframes for a tier
 */
export function getTierAnimation(tier: TierLevel | string): string | undefined {
  switch (tier) {
    case "PEER_PRESIDENT":
      return tierAnimations.diamond;
    case "PLATINUM":
      return tierAnimations.platinumElite;
    case "PRO":
      return tierAnimations.emerald;
    case "PLUS":
      return tierAnimations.gold;
    case "PEER":
      return tierAnimations.silver;
    case "PEASANT":
    default:
      return undefined; // No animation for peasant
  }
}

/* ==========================================================================
   RISK LEVEL COLORS
   ========================================================================== */

/**
 * Platform risk level type
 */
export type RiskLevel = "LOW" | "MEDIUM_HIGH" | "HIGH" | "HIGHEST" | "UNKNOWN";

/**
 * Colors for platform risk indicators
 */
export const riskColors: Record<RiskLevel, string> = {
  LOW: "#4BB543", // Success green
  MEDIUM_HIGH: "#FFC107", // Warning yellow
  HIGH: "#FF4040", // Error red
  HIGHEST: "#FF4040", // Error red
  UNKNOWN: "#6C757D", // Gray
};

/**
 * Get color for a risk level
 */
export function getRiskColor(level: RiskLevel | string): string {
  if (level in riskColors) {
    return riskColors[level as RiskLevel];
  }
  return riskColors.UNKNOWN;
}
