/**
 * Peer Brand Utility Functions
 *
 * Helper functions for working with brand tokens
 */

/**
 * Add opacity to a hex color
 *
 * @param amount - Opacity value from 0 to 100
 * @param hexColor - Hex color string (e.g., '#FF3A33')
 * @returns Hex color with alpha channel
 *
 * @example
 * ```typescript
 * import { opacify, colors } from '@zkp2p/brand';
 *
 * const semiTransparent = opacify(50, colors.igniteRed);
 * // Returns '#FF3A3380'
 * ```
 */
export function opacify(amount: number, hexColor: string): string {
  if (!hexColor.startsWith("#")) {
    return hexColor;
  }

  if (hexColor.length !== 7) {
    throw new Error(
      `opacify: provided color ${hexColor} was not in hexadecimal format (e.g. #000000)`,
    );
  }

  if (amount < 0 || amount > 100) {
    throw new Error("opacify: provided amount should be between 0 and 100");
  }

  const opacityHex = Math.round((amount / 100) * 255)
    .toString(16)
    .padStart(2, "0");

  return `${hexColor.slice(0, 7)}${opacityHex}`;
}

/**
 * Convert pixel value to rem
 *
 * @param px - Pixel value
 * @param base - Base font size (default: 16)
 * @returns rem string
 *
 * @example
 * ```typescript
 * import { pxToRem } from '@zkp2p/brand';
 *
 * const fontSize = pxToRem(20); // '1.25rem'
 * ```
 */
export function pxToRem(px: number, base = 16): string {
  return `${px / base}rem`;
}

/**
 * Create a CSS custom property reference
 *
 * @param name - Variable name without --peer- prefix
 * @returns CSS var() reference
 *
 * @example
 * ```typescript
 * import { cssVar } from '@zkp2p/brand';
 *
 * const color = cssVar('black'); // 'var(--peer-black)'
 * ```
 */
export function cssVar(name: string): string {
  return `var(--peer-${name})`;
}

/**
 * Create a gradient at a custom angle
 *
 * @param angle - Angle in degrees
 * @returns CSS gradient string
 *
 * @example
 * ```typescript
 * import { createIgniteGradient } from '@zkp2p/brand';
 *
 * const gradient = createIgniteGradient(45);
 * // 'linear-gradient(45deg, #FFE500 0%, #FF3A33 100%)'
 * ```
 */
export function createIgniteGradient(angle: number): string {
  return `linear-gradient(${angle}deg, #FFE500 0%, #FF3A33 100%)`;
}

/**
 * Get responsive font size array for styled-components
 *
 * @param mobile - Mobile font size
 * @param tablet - Tablet font size
 * @param desktop - Desktop font size
 * @returns Array of font sizes
 *
 * @example
 * ```typescript
 * import { responsiveFontSize } from '@zkp2p/brand';
 *
 * const fontSize = responsiveFontSize(32, 48, 64);
 * // ['32px', '48px', '64px']
 * ```
 */
export function responsiveFontSize(
  mobile: number,
  tablet: number,
  desktop: number,
): [string, string, string] {
  return [`${mobile}px`, `${tablet}px`, `${desktop}px`];
}
