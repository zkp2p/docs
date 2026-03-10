---
title: Smart Contracts
---

# V2 Smart Contracts

Protocol V2 off-ramping is built around EscrowV2 custody, Orchestrator-mediated intent execution, payment verifier contracts, and optional delegated rate managers.

## Main components

### EscrowV2

EscrowV2 is the core liquidity contract. It:

- holds maker funds
- stores payment-method and currency tuples
- enforces fixed floors and oracle-backed ARM floors
- optionally delegates tuple pricing to a rate manager
- locks and unlocks funds for intents

Start with [Escrow](escrow/index.md).

### RateManagerV1

`RateManagerV1` is the reference delegated rate management contract on `main`.

It is a pure rate registry. It does not custody funds and it does not enforce deposit floors. EscrowV2 does that when resolving the effective rate.

See [RateManagerV1](rate-manager-v1.md).

### Payment verifiers

Payment verifiers validate offchain payment proofs during fulfillment.

See [IPaymentVerifier](ipaymentverifier.md).

### Deployments

Contract addresses for supported environments are listed in [Deployments](deployments.md).

## ARM and DRM in the V2 stack

V2 rate management has two layers:

- `Automated Rate Management`: tuple-level fixed floors plus optional oracle-backed spread config inside EscrowV2
- `Delegated Rate Management`: deposit-level assignment to an external `IRateManager`

The detailed resolution rules are documented in [Escrow Rate Management](escrow/rate-management.md).
