# @zkp2p/brand

Peer Brand Design System - Single source of truth for all Peer brand assets and design tokens.

## Overview

This package provides:

- **Design Tokens** - TypeScript constants for colors, typography, spacing
- **CSS Variables** - Custom properties for use in stylesheets
- **Static Assets** - Logos, icons, videos, fonts
- **Utilities** - Helper functions for working with brand tokens

Extracted from **[Figma Brand Book](https://www.figma.com/design/uwou994XdkDmul4n8uz9cE)** and **[Figma UI Toolkit](https://www.figma.com/design/t6mxz4O8CtFKTNO58yt2cE?node-id=140-8907)** - the authoritative sources for all Peer brand specifications.

See `DESIGN_SYSTEM_RULES.md` for comprehensive Figma-derived rules.

## Package Structure

```
packages/brand/
├── src/
│   ├── index.ts          # Main exports
│   ├── tokens.ts         # Design tokens (colors, typography, etc.)
│   ├── utils.ts          # Helper functions
│   ├── variables.css     # CSS custom properties
│   └── fonts.css         # @font-face declarations
├── logos/
│   ├── peer-logo-colour.svg   # Primary gradient wordmark
│   ├── peer-logo-white.svg    # White wordmark (dark bg)
│   ├── peer-logo-black.svg    # Black wordmark (light bg)
│   ├── peer-profile.png       # Profile/avatar image
│   └── png/                   # PNG versions for compatibility
│       ├── peer-logo-colour.png
│       ├── peer-logo-white.png
│       ├── peer-logo-black.png
│       └── peer-profile.png
├── icons/
│   └── peer-icon-{1-20}.svg   # Custom Peer iconography
├── videos/
│   ├── hero-desktop.mp4       # Hero animation
│   ├── hero-mobile.mp4        # Mobile hero
│   └── {fast,fair,secure,simple}[-mobile].mp4
└── fonts/
    ├── PPValve-PlainSemibold.{woff2,woff,otf}  # Primary headline weight (600)
    ├── PPValve-PlainExtrabold.otf              # Bold emphasis (800)
    ├── Inter-Medium.woff2                      # Body text (500)
    └── Inter-SemiBold.woff2                    # Buttons (600)
```

## Quick Start

### TypeScript Tokens

```typescript
import {
  colors,
  gradients,
  typography,
  mobileTypography,
  radii,
} from "@zkp2p/brand";

// Colors
const bg = colors.black; // #000000
const text = colors.white; // #FFFFFF
const accent = colors.igniteRed; // #FF3A33

// Gradients
const cta = gradients.ignite; // linear-gradient(...)
const hover = gradients.igniteHover;

// Desktop Typography
const headline = typography.hero; // 110px headline
const body = typography.body; // 20px body text

// Mobile Typography
const mobileHeadline = mobileTypography.h1; // 48px headline
const mobileBody = mobileTypography.body; // 18px body text

// Border radius
const cardRadius = radii.xl; // 24
const buttonRadius = radii.md; // 10
```

### CSS Variables

```css
@import "@zkp2p/brand/variables.css";

.my-button {
  background: var(--peer-gradient-ignite);
  color: var(--peer-black);
  border-radius: var(--peer-radius-md);
  font-family: var(--peer-font-body);
  font-weight: var(--peer-font-weight-semibold);
  letter-spacing: var(--peer-letter-spacing-button);
  text-transform: uppercase;
}
```

### Static Assets

```typescript
// Logos
import peerLogo from "@zkp2p/brand/logos/peer-logo-colour.svg";

// Icons
import starIcon from "@zkp2p/brand/icons/peer-icon-1.svg";

// Videos
import heroVideo from "@zkp2p/brand/videos/hero-desktop.mp4";
```

### Fonts

```css
@import "@zkp2p/brand/fonts.css";

/* Fonts are now available */
h1 {
  font-family: "PP Valve", sans-serif;
}
body {
  font-family: "Inter", sans-serif;
}
```

## Color System

### Primary Palette (Figma Section 21)

| Token       | Hex       | Usage                      |
| ----------- | --------- | -------------------------- |
| `black`     | `#000000` | Primary background         |
| `white`     | `#FFFFFF` | Primary text on dark       |
| `lightGrey` | `#EEEEEE` | Light backgrounds, borders |
| `richBlack` | `#181818` | Elevated surfaces, cards   |
| `grey`      | `#777777` | Secondary/muted text       |

### IGNITE Gradient

The signature Peer gradient represents "value flowing freely between people."

| Token          | Value     | Usage          |
| -------------- | --------- | -------------- |
| `igniteYellow` | `#FFE500` | Gradient start |
| `igniteRed`    | `#FF3A33` | Gradient end   |

```typescript
gradients.ignite; // Primary CTA (93.42deg)
gradients.igniteHover; // Hover state (-86.58deg)
gradients.igniteVertical; // Top to bottom (180deg)
gradients.igniteText; // For gradient text (90deg)
```

### Semantic Colors

| Token     | Hex       | Usage             |
| --------- | --------- | ----------------- |
| `success` | `#4BB543` | Success states    |
| `warning` | `#FFC107` | Warning states    |
| `error`   | `#FF4040` | Error states      |
| `link`    | `#1F95E2` | Interactive links |

## Typography System

### Font Families (Figma Sections 27-28)

| Font         | Usage             | Rule                 |
| ------------ | ----------------- | -------------------- |
| **PP Valve** | Headlines         | **ALWAYS UPPERCASE** |
| **Inter**    | Body, UI, Buttons | Normal case          |

### Type Scale

**Desktop Headlines (PP Valve)** - All: `line-height: 0.9`, `letter-spacing: 0`
| Preset | Size | Figma Name |
|--------|--------|------------|
| `hero` | 110px | H1 |
| `h1` | 96px | H2 |
| `h2` | 64px | H3 |
| `h3` | 48px | H4 |
| `h5` | 32px | H5 |

**Mobile Headlines (PP Valve)** - All: `line-height: 0.9`, `letter-spacing: 0`
| Preset | Size |
|--------|-------|
| `h1` | 48px |
| `h2` | 40px |
| `h3` | 36px |
| `h4` | 32px |
| `h5` | 26px |

**Desktop Body (Inter)** - All: `line-height: 1.3`, `weight: 500`
| Preset | Size | Figma Name |
|-------------|------|------------|
| `bodyLarge` | 24px | Body 1 |
| `body` | 20px | Body 2 |
| `bodySmall` | 16px | Body 3 |

**Mobile Body (Inter)** - All: `line-height: 1.3`, `weight: 500`
| Preset | Size |
|-------------|------|
| `bodyLarge` | 20px |
| `body` | 18px |
| `bodySmall` | 16px |

**Subheadings (Inter)** - All: `line-height: 2`, `letter-spacing: 0.1em`, `weight: 600`
| Preset | Size |
|--------|------|
| `sub1` | 18px |
| `sub2` | 14px |

**UI Elements (Inter)**
| Preset | Size | Weight | Letter Spacing | Transform |
|-----------|------|--------|----------------|-----------|
| `button` | 14px | 600 | 0.1em | UPPERCASE |
| `caption` | 12px | 500 | 0 | none |

## Spacing & Layout

### Border Radius

| Token | Value | Usage                  |
| ----- | ----- | ---------------------- |
| `xs`  | 4px   | Small elements, badges |
| `sm`  | 8px   | Tags, pills            |
| `md`  | 10px  | Buttons, inputs        |
| `lg`  | 16px  | Modals                 |
| `xl`  | 24px  | Cards                  |
| `2xl` | 32px  | Large containers       |

### Spacing Scale (4px base)

```typescript
spacing[1]; // 4px
spacing[2]; // 8px
spacing[4]; // 16px
spacing[6]; // 24px
spacing[8]; // 32px
spacing[12]; // 48px
```

## Logo Guidelines (Figma Section 17)

### Usage Rules

1. **Primary**: Gradient wordmark (`peer-logo-colour.svg`) - preferred
2. **On dark backgrounds**: Gradient or white wordmark
3. **On light backgrounds**: Black wordmark
4. **Minimum size**: 22px height (screen), 0.24in (print)
5. **Clear space**: Equal to logo height on all sides

### Logo Files

| File                   | Usage                          |
| ---------------------- | ------------------------------ |
| `peer-logo-colour.svg` | **Primary** - dark backgrounds |
| `peer-logo-white.svg`  | Dark backgrounds (no gradient) |
| `peer-logo-black.svg`  | Light backgrounds              |
| `peer-profile.png`     | Social media, avatars          |

**PNG versions** (in `logos/png/`) - Use for email clients, legacy systems, or contexts where SVG isn't supported.

## Utility Functions

```typescript
import {
  opacify,
  pxToRem,
  cssVar,
  createIgniteGradient,
} from "@zkp2p/brand/utils";

// Add opacity to colors
opacify(50, "#FF3A33"); // '#FF3A3380'

// Convert px to rem
pxToRem(20); // '1.25rem'

// Get CSS variable reference
cssVar("black"); // 'var(--peer-black)'

// Create gradient at custom angle
createIgniteGradient(45); // 'linear-gradient(45deg, #FFE500 3.94%, #FF3A33 91.73%)'
```

## Integration Examples

### styled-components

```typescript
import styled from "styled-components";
import { colors, gradients, typography, radii, borders } from "@zkp2p/brand";

const Card = styled.div`
  background: ${colors.richBlack};
  border: 1px solid ${borders.dark};
  border-radius: ${radii.xl}px;
  padding: 24px;
`;

const PrimaryButton = styled.button`
  background: ${gradients.ignite};
  color: ${colors.black};
  border: none;
  border-radius: ${radii.md}px;
  font-family: ${typography.button.fontFamily};
  font-weight: ${typography.button.fontWeight};
  font-size: ${typography.button.fontSize}px;
  letter-spacing: ${typography.button.letterSpacing};
  text-transform: ${typography.button.textTransform};
  padding: 16px 24px;
  cursor: pointer;

  &:hover {
    background: ${gradients.igniteHover};
  }
`;

const Headline = styled.h1`
  font-family: ${typography.h1.fontFamily};
  font-weight: ${typography.h1.fontWeight};
  font-size: ${typography.h1.fontSize}px;
  line-height: ${typography.h1.lineHeight};
  letter-spacing: ${typography.h1.letterSpacing};
  text-transform: ${typography.h1.textTransform};
  color: ${colors.white};
`;
```

### CSS-in-JS (Object Style)

```typescript
import { typography, colors, gradients, radii } from "@zkp2p/brand";

const buttonStyle = {
  ...typography.button,
  background: gradients.ignite,
  color: colors.black,
  borderRadius: radii.md,
  padding: "16px 24px",
};
```

### Tailwind (via CSS Variables)

```css
@import "@zkp2p/brand/variables.css";

/* In tailwind.config.js, extend with CSS variables */
```

## Visual System Principles (Figma Section 35)

1. **Inktraps** - Subtle details in PP Valve that add precision
2. **Form Connection** - Geometric shapes merge and overlap
3. **Connected Modules** - Mix of rounded and angular containers

## Figma References

- **Brand Book**: https://www.figma.com/design/uwou994XdkDmul4n8uz9cE
- **UI Reference**: https://www.figma.com/design/t6mxz4O8CtFKTNO58yt2cE

## Migration from Web Client Theme

If migrating from `clients/web/src/theme/colors.tsx`:

| Old Token            | New Token          |
| -------------------- | ------------------ |
| `peer.black`         | `colors.black`     |
| `peer.richBlack`     | `colors.richBlack` |
| `peer.borderDark`    | `borders.dark`     |
| `peer.textPrimary`   | `text.primary`     |
| `peer.textSecondary` | `text.secondary`   |
| `gradients.ignite`   | `gradients.ignite` |
