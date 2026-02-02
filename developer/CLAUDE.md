# Developer Documentation

Integration guides for developers building on ZKP2P.

## Target Audiences

| Document | Audience | Integration Type |
|----------|----------|------------------|
| `integrate-zkp2p/integrate-redirect-onramp.md` | App developers | Embed fiat onramp in web apps |
| `offramp-integration.md` | Liquidity providers | Manage USDC deposits for offramp |
| `post-intent-hooks.md` | Protocol developers | Custom fulfillment logic (Solidity) |
| `build-new-provider.md` | Protocol developers | zkTLS provider templates (JSON) |

## Directory Structure

```
developer/
├── integrate-zkp2p/
│   └── integrate-redirect-onramp.md    # @zkp2p/sdk onramp
├── offramp-integration.md              # OfframpClient SDK
├── post-intent-hooks.md                # IPostIntentHook Solidity
└── build-new-provider.md               # Provider JSON templates
```

## SDK Packages

| Package | Purpose |
|---------|---------|
| `@zkp2p/sdk` | Main SDK (peerExtensionSdk, OfframpClient) |
| `@zkp2p/providers` | Payment provider template definitions |

## Documentation Patterns

### Standard Structure

```markdown
## Overview
Brief description of what this enables.

## Prerequisites
Who should use this and what they need.

## Installation
npm/yarn/pnpm/bun commands.

## Quick Start
Minimal working example.

## API Reference
Parameter tables with types and descriptions.

## Common Issues
Troubleshooting section.
```

### Code Examples

**TypeScript SDK pattern:**
```typescript
// 1. Import
import { SomeClient } from '@zkp2p/sdk';

// 2. Initialize
const client = new SomeClient({ walletClient, chainId });

// 3. Use
await client.someAction({ ...params });
```

**Solidity contract pattern:**
```solidity
import { IInterface } from "zkp2p-v2-contracts/contracts/interfaces/IInterface.sol";

contract MyContract is IInterface {
  // Implementation
}
```

### Formatting Conventions

- Use Docusaurus admonitions: `:::info`, `:::note`, `:::warning`
- Parameter tables for all API methods
- BigInt notation for on-chain amounts: `10000000000n`
- Always document decimal precision (USDC = 6, rates = 18)
- Link to Discord for support

## Common Updates

1. **SDK changes**: Update code examples to match current API
2. **New integration type**: Follow existing document structure
3. **Deployment updates**: Cross-reference protocol/deployments.md
