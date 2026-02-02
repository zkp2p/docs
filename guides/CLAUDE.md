# User Guides

End-user documentation for Peer buyers and sellers.

## Audience

Non-technical users learning to use the Peer platform for fiat-to-crypto and crypto-to-fiat exchanges.

## Directory Structure

```
guides/
├── introduction/
│   └── index.md                # Platform overview
├── for-buyers/
│   ├── complete-guide-to-onboarding.md
│   ├── how-to-onramp-on-peer.md
│   └── how-to-check-transaction-status.md
├── for-sellers/
│   ├── getting-started-as-a-seller.md
│   ├── how-to-create-a-deposit.md
│   ├── how-to-manage-your-deposit.md
│   └── how-to-fulfill-an-intent.md
└── privacy-safety/
    ├── how-peer-protects-you.md
    └── best-practices.md
```

## Writing Guidelines

### Tone

- Clear, approachable language
- Avoid technical jargon (or explain it)
- Step-by-step instructions
- Assume no blockchain experience

### Content Patterns

1. **Numbered steps** for procedures
2. **Screenshots** for UI guidance (reference `/static/img/`)
3. **Tips and warnings** using Docusaurus admonitions
4. **Links** to related guides

### Admonition Usage

```markdown
:::info
Helpful context or tips.
:::

:::warning
Important caveats or things to watch out for.
:::

:::danger
Critical security warnings.
:::
```

## Common Updates

1. **UI changes**: Update screenshots in `/static/img/`
2. **New feature**: Add guide following existing patterns
3. **Process changes**: Update step-by-step instructions
