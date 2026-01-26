export interface BackgroundNoiseProps {
  className?: string;
  /**
   * URL to the noise texture image. Import from @zkp2p/brand/textures/noise.png
   */
  texture?: string;
}

/**
 * BackgroundNoise - Subtle grain texture overlay for the Peer brand.
 *
 * Uses a tiled PNG texture from Figma for consistent appearance across all sections.
 * Should be positioned as an absolute layer BEHIND content but ABOVE the background color.
 *
 * ## Usage in Landing Page Sections
 *
 * Each section that needs noise should include it with this pattern:
 *
 * ```tsx
 * import { BackgroundNoise } from "@zkp2p/brand/components";
 * import noiseTexture from "@zkp2p/brand/textures/noise.png";
 *
 * function MySection() {
 *   return (
 *     <section className="relative bg-white">
 *       {/* Noise texture - z-[1], just above bg-white *\/}
 *       <div className="pointer-events-none absolute inset-0 z-[1]">
 *         <BackgroundNoise className="h-full w-full" texture={noiseTexture} />
 *       </div>
 *
 *       {/* Content - z-10, above noise *\/}
 *       <div className="relative z-10">
 *         {/* Your content here *\/}
 *       </div>
 *     </section>
 *   );
 * }
 * ```
 *
 * ## Layering Rules
 * - Background color: z-auto (default)
 * - Noise overlay: z-[1]
 * - Content: z-10
 * - Header/Nav: z-50
 *
 * This ensures noise appears as a subtle texture on the background without
 * affecting content readability.
 */
export function BackgroundNoise({
  className = "",
  texture,
}: BackgroundNoiseProps) {
  if (!texture) {
    return <div className={`pointer-events-none ${className}`} />;
  }

  return (
    <div
      className={`pointer-events-none ${className}`}
      style={{
        backgroundImage: `url(${texture})`,
        backgroundRepeat: "repeat",
      }}
    />
  );
}
