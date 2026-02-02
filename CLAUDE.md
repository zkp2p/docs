# ZKP2P Documentation Site

Docusaurus 3.8.1 documentation site for Peer (ZKP2P) - a permissionless P2P protocol for exchanging fiat currencies for crypto.

**Live site**: https://docs.peer.xyz

## Architecture

### Multi-Docs Plugin Structure

Four separate documentation plugins with independent sidebars:

| Plugin | Path | Route | Sidebar | Audience |
|--------|------|-------|---------|----------|
| `guides` | `/guides` | `/guides/*` | `guides-sidebars.js` | End users (buyers/sellers) |
| `protocol` | `/protocol` | `/protocol/*` | `protocol-sidebars.js` | Technical readers |
| `developer` | `/developer` | `/developer/*` | `developer-sidebars.js` | Integration developers |
| `brand-kit` | `/brand-kit` | `/brand-kit/*` | `brand-kit-sidebars.js` | Partners/designers |

### Custom Implementations

- **Blog system**: Disabled in preset, custom implementation via `src/pages/blogs.js`
- **Dark mode only**: Light theme disabled (`colorMode.disableSwitch: true`)
- **Raw markdown loader**: Webpack plugin for importing `.md` files as source strings

## Directory Structure

```
docs/
├── guides/                    # User guides (buyers/sellers)
│   ├── for-buyers/
│   ├── for-sellers/
│   ├── introduction/
│   └── privacy-safety/
├── protocol/                  # Protocol technical docs
│   ├── v2/                    # Legacy V2 contracts
│   ├── v3/                    # Current V3 architecture
│   └── peerauth-extension/    # Browser extension docs
├── developer/                 # Integration documentation
│   └── integrate-zkp2p/
├── brand-kit/                 # Brand asset downloads
├── blogs/                     # Blog markdown (SEO/fallback)
├── src/
│   ├── brand/                 # Design system package (@zkp2p/brand)
│   ├── css/                   # Global styles
│   └── pages/                 # Custom React pages
├── static/                    # Static assets
├── docusaurus.config.js       # Main config
└── *-sidebars.js              # Sidebar configs
```

## Development

```bash
yarn start     # Dev server at localhost:3000
yarn build     # Production build to /build
yarn serve     # Serve production build
yarn clear     # Clear Docusaurus cache
```

## Documentation Conventions

### Frontmatter

All docs require YAML frontmatter:

```yaml
---
id: unique-doc-id
title: Document Title
slug: /optional-custom-slug  # optional
---
```

### Markdown Patterns

- **Admonitions**: `:::info`, `:::note`, `:::warning`, `:::danger`
- **Code blocks**: Use language hints (`ts`, `json`, `bash`, `solidity`)
- **Tables**: HTML tables for complex layouts (deployments, addresses)
- **Links**: Relative paths from section root

### Writing Guidelines

1. Start with "What this does" overview
2. Include "Who is this for?" when relevant
3. Provide copy-paste code examples
4. Document all parameters in tables
5. End with troubleshooting/common issues

## Key Files

| File | Purpose |
|------|---------|
| `docusaurus.config.js` | Site config, plugins, navbar, footer |
| `*-sidebars.js` | Section-specific sidebar navigation |
| `src/css/custom.css` | Global styles (~1650 lines) |
| `src/brand/` | Design system package with CLAUDE.md |

## Related Repositories

- `zkp2p-v2-contracts` - Smart contract source (deployments reference this)
- `zkp2p-clients` - Web app monorepo
- `@zkp2p/sdk` - SDK documented in developer section
