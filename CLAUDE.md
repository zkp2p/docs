# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the documentation website for ZKP2P (Zero-Knowledge Peer-to-Peer), a trust-minimized fiat-to-crypto on/off ramp protocol. The site is built with Docusaurus 3.8.1 and contains user guides, developer documentation, and integration resources.

## Development Commands

```bash
# Install dependencies
yarn

# Start development server
yarn start

# Build production site
yarn build

# Serve production build locally
yarn serve

# Deploy to GitHub Pages
yarn deploy
# or with SSH:
USE_SSH=true yarn deploy

# Clear cache
yarn clear
```

## Architecture & Structure

### Key Directories

- `/guides/` - User documentation:
  - `introduction/` - Project overview
  - `for-buyers/` - Buyer guides
  - `for-sellers/` - Seller guides
  - `brand-kit.md` - Branding assets
- `/protocol/` - Protocol documentation:
  - Smart contracts, zkTLS, security, privacy
  - PeerAuth extension documentation
- `/developer/` - Developer integration documentation:
  - Integration guides for on/off ramping
  - Building new providers
- `/src/` - React components and custom styling
- `/static/img/` - Images organized by feature (onramping, verification, etc.)

### Documentation Organization

The documentation is split into three main sections with separate sidebars:
- **User** (`guides-sidebars.js`) - User guides for buyers/sellers
- **Protocol** (`protocol-sidebars.js`) - Smart contracts, zkTLS, security
- **Developer** (`developer-sidebars.js`) - Integration guides, provider development

Resource links (Team, GitHub, Twitter, Telegram, Website) are located in the footer.

## Technical Details

- **Framework**: Docusaurus 3.8.1 with React 19.0.0
- **Node**: Requires >= 18.0
- **Package Manager**: Yarn with node-modules linker
- **Deployment**: GitHub Pages to https://zkp2p.xyz/
- **Repository**: zkp2p/docs

## Key Features Documented

1. **User**: Onboarding, verification, liquidity provision, rate updates
2. **Protocol**: V2 Protocol overview, smart contracts, zkTLS, security, privacy
3. **Developer**: Integration guides, provider development

## Theme and Design

The documentation uses a dark-only theme with:
- Font: Graphik with weights: 300 (regular), 535 (medium), 600 (bold)
- Primary color: #FF3F3E (red)
- Background: #171717 (main)
- Text colors: #FFFFFF (primary), #9CA3AA (secondary), #6C757D (muted)
- Border color: rgba(255, 255, 255, 0.06) for cards, 0.1 on hover
- Link color: #0066CC
- Border radius: 16-20px for elements
- Minimal glassmorphism effects with backdrop-filter

Features:
- Dark mode only (no light theme)
- Hero background uses hero_pattern.png at 4% opacity
- Subtle radial gradient overlay
- Clean, minimal card design
- No theme switcher
- Professional typography with letter-spacing on headings

When modifying documentation, ensure consistency with existing structure and maintain clear categorization between user guides, protocol documentation, and developer resources.