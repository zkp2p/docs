# Protocol Documentation

Technical documentation for the ZKP2P protocol - a permissionless, non-custodial P2P protocol for exchanging off-chain fiat for on-chain crypto.

## Protocol Overview

ZKP2P enables peer-to-peer fiat-to-crypto exchanges using zkTLS proofs to verify off-chain payments without exposing sensitive data.

**Core flow:**
1. Seller deposits tokens to Escrow with accepted payment methods/currencies
2. Buyer creates intent (locks liquidity)
3. Buyer makes off-chain fiat payment (Venmo, Revolut, etc.)
4. Buyer generates zkTLS proof via PeerAuth extension
5. Proof verified → Escrow releases tokens to buyer

## Version Structure

Two protocol versions are documented:

| Version | Status | Deployment | Key Difference |
|---------|--------|------------|----------------|
| **V3** | Current | Base mainnet | Off-chain attestation service, unified verifier |
| **V2** | Legacy | Sepolia testnet | On-chain per-platform verifiers |

### V3 Architecture (Current)

```
User → PeerAuth → Attestation Service → UnifiedPaymentVerifier → Escrow
         ↑                  ↓
    zkTLS proof    EIP-712 attestation
```

- **Orchestrator**: Manages intent lifecycle
- **Escrow**: Custody-focused, handles deposits/releases
- **UnifiedPaymentVerifier**: Validates EIP-712 signed attestations
- **Attestation Service**: Off-chain proof validation

### V2 Architecture (Legacy)

```
User → PeerAuth → On-chain Verifier (per platform) → Escrow
```

- One verifier contract per payment platform
- Proof verification happens on-chain

## Directory Structure

```
protocol/
├── zkp2p-protocol.md           # High-level overview, version history
├── gating-service.md           # Identity verification service
├── v3/
│   ├── overview.md             # V3 architecture summary
│   ├── attestation-service.md  # Proof verification API
│   ├── smart-contracts.md      # Contract overview
│   ├── deployments.md          # Contract addresses, payment methods
│   ├── migration.md            # V2 → V3 migration guide
│   └── smart-contracts/
│       ├── escrow/
│       ├── orchestrator.md
│       ├── unified-payment-verifier.md
│       └── post-intent-hooks.md
├── v2/
│   └── smart-contracts/
│       ├── deployments.md      # V2 addresses, currency codes
│       ├── ipaymentverifier.md
│       └── escrow/
└── peerauth-extension/
    ├── index.md                # Extension overview
    └── zk-tls.md               # zkTLS technical deep-dive
```

## Key Terminology

| Term | Definition |
|------|------------|
| **Intent** | Buyer's commitment to purchase, locks seller liquidity |
| **Deposit** | Seller's token position in Escrow |
| **Verifier** | Contract/service that validates payment proofs |
| **Attestation** | EIP-712 signed proof of payment (V3) |
| **Nullifier** | Unique identifier preventing double-spend |
| **zkTLS** | Zero-knowledge TLS proof (TLSNotary or Reclaim) |

## Documentation Patterns

### Deployments Tables

Contract addresses use HTML tables with chain icons:

```html
<table>
  <tr><th>Contract</th><th>Address</th></tr>
  <tr><td>Escrow</td><td><code>0x...</code></td></tr>
</table>
```

### Payment Method Identifiers

V3 uses bytes32 identifiers:
- `keccak256("venmo")` → payment method
- `keccak256("USD")` → currency

### Code Examples

- Solidity for contract interfaces
- TypeScript for SDK usage
- Include precision notes (USDC = 6 decimals, rates = 18 decimals)

## Common Updates

1. **New deployment**: Update `deployments.md` with contract addresses
2. **New payment method**: Add to supported methods table in deployments
3. **Contract changes**: Reference `zkp2p-v2-contracts` repo for source
