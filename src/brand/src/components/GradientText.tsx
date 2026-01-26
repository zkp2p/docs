import {
  useEffect,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from "react";
import { gradients } from "../tokens";

export type GradientVariant =
  | "ignite"
  | "ignite-vertical"
  | "ignite-diagonal"
  | "ignite-steep";

const gradientMap: Record<GradientVariant, string> = {
  ignite: gradients.igniteText,
  "ignite-vertical": gradients.igniteVertical,
  "ignite-diagonal": gradients.igniteDiagonal,
  "ignite-steep": gradients.igniteSteepDiagonal,
};

export interface GradientTextProps {
  /**
   * Text content to display with gradient
   */
  children: ReactNode;

  /**
   * Gradient variant to apply
   * - ignite: Horizontal left-to-right (default)
   * - ignite-vertical: Top to bottom
   * - ignite-diagonal: Slight diagonal (8.27deg)
   * - ignite-steep: Steeper diagonal (42.6deg)
   */
  variant?: GradientVariant;

  /**
   * HTML element to render
   * @default "span"
   */
  as?: ElementType;

  /**
   * CSS class name for additional styling
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * Enable gradient animation
   * @default false
   */
  animate?: boolean;
}

const baseStyles: CSSProperties = {
  backgroundClip: "text",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
  display: "inline-block",
};

const animatedStyles: CSSProperties = {
  backgroundSize: "200% 200%",
  animation: "gradient-shift 3s ease infinite",
};

const gradientShiftStyleId = "peer-gradient-shift-keyframes";
const gradientShiftKeyframes = `
@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
`;

let hasInjectedGradientShift = false;

const ensureGradientShiftKeyframes = () => {
  if (hasInjectedGradientShift || typeof document === "undefined") {
    return;
  }

  if (document.getElementById(gradientShiftStyleId)) {
    hasInjectedGradientShift = true;
    return;
  }

  const styleTag = document.createElement("style");
  styleTag.id = gradientShiftStyleId;
  styleTag.textContent = gradientShiftKeyframes;
  document.head.appendChild(styleTag);
  hasInjectedGradientShift = true;
};

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches);

    updatePreference();

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", updatePreference);
      return () => mediaQuery.removeEventListener("change", updatePreference);
    }

    mediaQuery.addListener(updatePreference);
    return () => mediaQuery.removeListener(updatePreference);
  }, []);

  return prefersReducedMotion;
};

/**
 * Gradient Text Component
 *
 * Applies the IGNITE gradient to text content. The gradient represents
 * "the spark of connection" and "value flowing freely between people".
 *
 * @example
 * ```tsx
 * import { GradientText } from '@zkp2p/brand/components';
 *
 * // Basic usage
 * <GradientText>Welcome to Peer</GradientText>
 *
 * // As a heading
 * <GradientText as="h1" className="text-4xl font-bold">
 *   TRADE P2P
 * </GradientText>
 *
 * // With animation
 * <GradientText animate>Live Now</GradientText>
 *
 * // Different gradient angle
 * <GradientText variant="ignite-diagonal">Special Offer</GradientText>
 * ```
 */
export function GradientText({
  children,
  variant = "ignite",
  as: Component = "span",
  className,
  style,
  animate = false,
}: GradientTextProps) {
  const gradient = gradientMap[variant];
  const prefersReducedMotion = usePrefersReducedMotion();
  const shouldAnimate = animate && !prefersReducedMotion;

  useEffect(() => {
    if (shouldAnimate) {
      ensureGradientShiftKeyframes();
    }
  }, [shouldAnimate]);

  const combinedStyles: CSSProperties = {
    ...baseStyles,
    backgroundImage: gradient,
    ...(shouldAnimate ? animatedStyles : {}),
    ...style,
  };

  return (
    <Component className={className} style={combinedStyles}>
      {children}
    </Component>
  );
}

export default GradientText;
