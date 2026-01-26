import {
  useEffect,
  useState,
  type CSSProperties,
  type HTMLAttributes,
} from "react";
import { getIconUrl, peerIconNames, type PeerIconName } from "../assets";

export type IconSize = "sm" | "md" | "lg" | "xl";
const sizeMap: Record<IconSize, number> = {
  sm: 16,
  md: 24,
  lg: 32,
  xl: 48,
};

export interface IconProps extends Omit<
  HTMLAttributes<HTMLSpanElement>,
  "color"
> {
  /**
   * Icon name (peer-icon-1 through peer-icon-20)
   */
  name: PeerIconName | string;

  /**
   * Predefined sizes
   * - sm: 16px
   * - md: 24px
   * - lg: 32px
   * - xl: 48px
   */
  size?: IconSize;

  /**
   * Custom size in pixels (overrides size prop)
   */
  customSize?: number;

  /**
   * Icon color (CSS color value)
   * @default "currentColor"
   */
  color?: string;

  /**
   * CSS class name for styling
   */
  className?: string;

  /**
   * Inline styles
   */
  style?: CSSProperties;

  /**
   * Accessible label for the icon
   */
  "aria-label"?: string;
}

const supportsMasking = () => {
  if (typeof CSS === "undefined" || typeof CSS.supports !== "function") {
    return false;
  }

  return (
    CSS.supports("mask-image", 'url("")') ||
    CSS.supports("-webkit-mask-image", 'url("")')
  );
};

/**
 * Peer Icon Component
 *
 * Renders Peer brand icons from the icon set (peer-icon-1 through peer-icon-20).
 * Icons are rendered with a CSS mask for color customization.
 *
 * @example
 * ```tsx
 * import { Icon } from '@zkp2p/brand/components';
 *
 * // Basic usage
 * <Icon name="peer-icon-1" />
 *
 * // With size
 * <Icon name="peer-icon-5" size="lg" />
 *
 * // With custom size and color
 * <Icon name="peer-icon-10" customSize={40} color="#FF3A33" />
 *
 * // With accessibility label
 * <Icon name="peer-icon-1" aria-label="Transfer icon" />
 * ```
 */
export function Icon({
  name,
  size = "md",
  customSize,
  color = "currentColor",
  className,
  style,
  "aria-label": ariaLabel,
  ...restProps
}: IconProps) {
  const computedSize = customSize ?? sizeMap[size];
  const iconPath = getIconUrl(name);
  const maskImage = `url("${iconPath}")`;
  const labelledBy = restProps["aria-labelledby"];
  const hasAccessibleName = Boolean(ariaLabel || labelledBy);
  const resolvedRole =
    restProps.role ?? (hasAccessibleName ? "img" : "presentation");
  const resolvedAriaHidden =
    restProps["aria-hidden"] ?? (hasAccessibleName ? undefined : true);
  const [useMask, setUseMask] = useState(true);

  useEffect(() => {
    setUseMask(supportsMasking());
  }, []);

  if (!useMask) {
    return (
      <img
        {...restProps}
        src={iconPath}
        alt={ariaLabel ?? ""}
        width={computedSize}
        height={computedSize}
        className={className}
        role={resolvedRole}
        aria-label={ariaLabel}
        aria-hidden={resolvedAriaHidden}
        style={{
          width: computedSize,
          height: computedSize,
          display: "inline-block",
          verticalAlign: "middle",
          ...style,
        }}
      />
    );
  }

  return (
    <span
      {...restProps}
      role={resolvedRole}
      aria-label={ariaLabel}
      aria-hidden={resolvedAriaHidden}
      className={className}
      style={{
        width: computedSize,
        height: computedSize,
        display: "inline-block",
        verticalAlign: "middle",
        backgroundColor: color,
        maskImage,
        WebkitMaskImage: maskImage,
        maskRepeat: "no-repeat",
        WebkitMaskRepeat: "no-repeat",
        maskPosition: "center",
        WebkitMaskPosition: "center",
        maskSize: "contain",
        WebkitMaskSize: "contain",
        ...style,
      }}
    />
  );
}

/**
 * Available Peer icon names
 */
export { peerIconNames };
export type { PeerIconName };

export default Icon;
