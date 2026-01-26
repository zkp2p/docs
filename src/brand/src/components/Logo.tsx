import type { CSSProperties } from "react";
import { getLogoUrl, type LogoVariant } from "../assets";
export type LogoSize = "sm" | "md" | "lg" | "xl";

const sizeMap: Record<LogoSize, number> = {
  sm: 22, // Minimum size per brand guidelines
  md: 32,
  lg: 48,
  xl: 64,
};

export type { LogoVariant };

export interface LogoProps {
  /**
   * Logo variant
   * - colour: Primary gradient wordmark (default, preferred)
   * - white: White wordmark for dark backgrounds
   * - black: Black wordmark for light backgrounds
   */
  variant?: LogoVariant;

  /**
   * Predefined sizes
   * - sm: 22px (minimum size per brand guidelines)
   * - md: 32px
   * - lg: 48px
   * - xl: 64px
   */
  size?: LogoSize;

  /**
   * Custom height in pixels (overrides size prop)
   */
  height?: number;

  /**
   * Custom width in pixels (maintains aspect ratio if only height is set)
   */
  width?: number;

  /**
   * CSS class name for styling
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * Accessible label for the logo
   * @default "Peer"
   */
  alt?: string;

  /**
   * When provided, wraps the logo in a link
   */
  href?: string;

  /**
   * Link target (only used when href is provided)
   * @default "_self"
   */
  target?: "_self" | "_blank" | "_parent" | "_top";
}

/**
 * Peer Logo Component
 *
 * Renders the Peer wordmark logo in various sizes and color variants.
 * Follows brand guidelines for minimum size (22px) and clear space.
 *
 * @example
 * ```tsx
 * import { Logo } from '@zkp2p/brand/components';
 *
 * // Basic usage
 * <Logo />
 *
 * // With size and variant
 * <Logo size="lg" variant="white" />
 *
 * // As a link
 * <Logo href="/" />
 * ```
 */
export function Logo({
  variant = "colour",
  size = "md",
  height,
  width,
  className,
  style,
  alt = "Peer",
  href,
  target = "_self",
}: LogoProps) {
  const computedHeight = height ?? sizeMap[size];
  const logoPath = getLogoUrl(variant);

  const imgElement = (
    <img
      src={logoPath}
      alt={alt}
      height={computedHeight}
      width={width}
      className={className}
      style={{
        height: computedHeight,
        width: width ?? "auto",
        display: "block",
        ...style,
      }}
    />
  );

  if (href) {
    return (
      <a
        href={href}
        className={className}
        target={target}
        rel={target === "_blank" ? "noopener noreferrer" : undefined}
        style={{ display: "inline-block" }}
      >
        {imgElement}
      </a>
    );
  }

  return imgElement;
}

export default Logo;
