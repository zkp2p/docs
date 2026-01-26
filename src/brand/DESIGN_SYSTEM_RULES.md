# Peer Design System Rules

Generated from **Figma Peer UI Toolkit** (node 140:8907)
Source: https://www.figma.com/design/t6mxz4O8CtFKTNO58yt2cE

---

## Color Palette

### Primary Colors

| Token       | Hex       | Usage                      |
| ----------- | --------- | -------------------------- |
| `black`     | `#000000` | Primary background         |
| `white`     | `#FFFFFF` | Primary text on dark       |
| `richBlack` | `#181818` | Cards, elevated surfaces   |
| `lightGrey` | `#EEEEEE` | Light backgrounds, borders |

### IGNITE Gradient

The signature Peer gradient representing "value flowing freely between people."

| Token          | Hex       |
| -------------- | --------- |
| `igniteYellow` | `#FFE500` |
| `igniteRed`    | `#FF3A33` |

**Gradient CSS:**

```css
/* Primary (left to right) */
linear-gradient(93.42deg, #FFE500 3.94%, #FF3A33 91.73%)

/* Hover state (reversed) */
linear-gradient(-86.58deg, #FFE500 3.94%, #FF3A33 91.73%)
```

---

## Typography

### Font Families

| Font         | Usage             | Critical Rule        |
| ------------ | ----------------- | -------------------- |
| **PP Valve** | Headlines only    | **ALWAYS UPPERCASE** |
| **Inter**    | Body, UI, buttons | Normal case          |

### Desktop Type Scale

#### Headlines (PP Valve Plain Semibold)

All headlines: `line-height: 0.9`, `letter-spacing: 0`, `text-transform: uppercase`

| Level | Size  | Figma Name |
| ----- | ----- | ---------- |
| hero  | 110px | H1         |
| h1    | 96px  | H2         |
| h2    | 64px  | H3         |
| h3    | 48px  | H4         |
| h5    | 32px  | H5         |

#### Body (Inter Medium)

All body: `line-height: 1.3`, `letter-spacing: 0`

| Level     | Size | Figma Name |
| --------- | ---- | ---------- |
| bodyLarge | 24px | Body 1     |
| body      | 20px | Body 2     |
| bodySmall | 16px | Body 3     |

#### Subheadings (Inter Semi Bold)

All subheadings: `line-height: 2`, `letter-spacing: 0.1em (10%)`, `text-transform: uppercase`

| Level | Size |
| ----- | ---- |
| sub1  | 18px |
| sub2  | 14px |

### Mobile Type Scale

#### Headlines (PP Valve Plain Semibold)

| Level | Size |
| ----- | ---- |
| h1    | 48px |
| h2    | 40px |
| h3    | 36px |
| h4    | 32px |
| h5    | 26px |

#### Body (Inter Medium)

| Level     | Size |
| --------- | ---- |
| bodyLarge | 20px |
| body      | 18px |
| bodySmall | 16px |

---

## Button Components

### Variants

From Figma Components section (node 140:8051):

1. **Primary (Gradient)** - IGNITE gradient background, black text
2. **Secondary (Outline)** - Transparent with white border
3. **Tertiary (Ghost)** - Transparent, no border

### States

- **Normal** - Default appearance
- **Hover** - Gradient reversed direction / border color change
- **Disabled** - Reduced opacity, no interactions

### Button Styling Rules

```typescript
{
  fontFamily: "'Inter', sans-serif",
  fontWeight: 600,
  fontSize: 14,
  lineHeight: 1,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  borderRadius: 10, // radii.md
  padding: "16px 24px"
}
```

---

## Border Radius

| Token | Value | Usage                  |
| ----- | ----- | ---------------------- |
| `xs`  | 4px   | Small elements, badges |
| `sm`  | 8px   | Tags, pills            |
| `md`  | 10px  | **Buttons, inputs**    |
| `lg`  | 16px  | Modals                 |
| `xl`  | 24px  | Cards                  |
| `2xl` | 32px  | Large containers       |

---

## Usage in Code

### TypeScript Import

```typescript
import {
  colors,
  gradients,
  typography,
  mobileTypography,
  radii,
} from "@zkp2p/brand";

// Desktop headline
const heroStyle = {
  ...typography.hero,
  color: colors.white,
};

// Mobile headline
const mobileHeroStyle = {
  ...mobileTypography.h1,
  color: colors.white,
};

// Button with gradient
const buttonStyle = {
  ...typography.button,
  background: gradients.ignite,
  color: colors.black,
  borderRadius: radii.md,
};
```

### CSS Variables

```css
@import "@zkp2p/brand/variables.css";

.headline {
  font-family: var(--peer-font-headline);
  font-weight: var(--peer-font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0;
  line-height: 0.9;
}

.button {
  background: var(--peer-gradient-ignite);
  color: var(--peer-black);
  border-radius: var(--peer-radius-md);
  font-family: var(--peer-font-body);
  font-weight: var(--peer-font-weight-semibold);
  letter-spacing: var(--peer-letter-spacing-wide);
  text-transform: uppercase;
}
```

---

## Critical Rules

1. **PP Valve must ALWAYS be uppercase** - Never use lowercase with this font
2. **Headlines have 0 letter-spacing** - Don't add tracking to PP Valve
3. **All headlines use line-height 0.9** - Tight leading for impact
4. **Subheadings and buttons use 10% tracking** - Wide letter-spacing (0.1em)
5. **IGNITE gradient is the primary CTA** - Use sparingly for impact
6. **Button radius is 10px** - Consistent border-radius for all buttons

---

## Figma References

- **UI Toolkit**: node 140:8907
- **Colours**: node 140:7583
- **Typography Desktop**: node 140:7673
- **Typography Mobile**: node 140:8460
- **Components Desktop**: node 140:8051
- **Components Mobile**: node 140:8845
