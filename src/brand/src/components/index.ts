/**
 * @zkp2p/brand/components
 *
 * React components for the Peer brand design system.
 * All components are tree-shakeable with React as a peer dependency.
 *
 * @example
 * ```tsx
 * import { Logo, Icon, GradientText } from '@zkp2p/brand/components';
 *
 * function Header() {
 *   return (
 *     <header>
 *       <Logo href="/" size="lg" />
 *       <GradientText as="h1">Welcome to Peer</GradientText>
 *       <Icon name="peer-icon-1" size="md" />
 *     </header>
 *   );
 * }
 * ```
 */

export { Logo, type LogoProps, type LogoVariant, type LogoSize } from "./Logo";

export {
  Icon,
  type IconProps,
  type IconSize,
  type PeerIconName,
  peerIconNames,
} from "./Icon";

export {
  GradientText,
  type GradientTextProps,
  type GradientVariant,
} from "./GradientText";

export { BackgroundNoise, type BackgroundNoiseProps } from "./BackgroundNoise";
