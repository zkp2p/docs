---
id: architecture
title: Architecture Overview
slug: /architecture
---

# Architecture Overview

## What this does

This page explains how the SDK fits into the rest of the ZKP2P stack so you can decide which surfaces belong in your app, which live off-chain, and which are enforced on-chain.

## Who is this for?

Read this before you build a production integration, especially if you need custom quote routing, analytics, vaults, smart-account support, or your own fulfillment UX.

## System diagram

```text
                                   historical queries, analytics
                         ┌────────────────────────────────────────────┐
                         │                 Indexer                     │
                         │      GraphQL: deposits, intents, vaults    │
                         └──────────────────────▲──────────────────────┘
                                                │
                                                │ client.indexer.*
                                                │
┌─────────────────────────────┐      quotes, payee registration, gating      ┌──────────────────────────┐
│          Your App           │◀──────────────────────────────────────────────▶│        Curator API       │
│ React app / Node service    │                                                │ /v2 quote / /v3 intent   │
│ Zkp2pClient / hooks /       │                                                │ seller credential proxy  │
│ peerExtensionSdk            │                                                └──────────────────────────┘
└──────────────┬──────────────┘
               │
               │ RPC-first reads + write transactions
               ▼
┌─────────────────────────────┐
│      ProtocolViewer + RPC   │
│ getDeposits/getIntent/etc.  │
└──────────────┬──────────────┘
               │
               │ signal / cancel / fulfill
               ▼
┌─────────────────────────────┐      verify attestation      ┌──────────────────────────┐
│       OrchestratorV2        │─────────────────────────────▶│ UnifiedPaymentVerifierV2 │
│ intent lifecycle + fees     │                              └──────────────────────────┘
└──────────────┬──────────────┘
               │ lock / unlock / transfer
               ▼
┌─────────────────────────────┐      delegated rates         ┌──────────────────────────┐
│          EscrowV2           │◀────────────────────────────▶│      RateManagerV1       │
│ deposits + custody + floors │                              │ vault / manager pricing   │
└──────────────┬──────────────┘                              └──────────────────────────┘
               ▲
               │ proof capture / onramp UX
               │
┌─────────────────────────────┐      proof -> attestation    ┌──────────────────────────┐
│     PeerAuth / Peer app     │─────────────────────────────▶│    Attestation Service   │
│ browser extension / mobile  │◀─────────────────────────────│ returns EIP-712 payload  │
└─────────────────────────────┘                              └──────────────────────────┘
```

## Component roles

### Your app

Your app owns the product UX: when to show quotes, how to collect destination addresses, what to do after a fill, and whether you want a fully embedded flow or a handoff into the Peer extension.

### `@zkp2p/sdk`

The SDK is the main integration layer. Use `Zkp2pClient` for reads, writes, quote APIs, vault operations, and indexer access. Use `@zkp2p/sdk/react` for transaction-state hooks and `peerExtensionSdk` for extension-side onramp flows.

### ProtocolViewer

The SDK is RPC-first for primary reads. Methods like `getDeposits()`, `getDeposit()`, `getIntents()`, and `getIntent()` read live protocol state through ProtocolViewer and the current escrow/orchestrator contracts instead of waiting for indexer sync.

### Curator API

Curator is the main off-chain coordination layer for quotes, payee-detail registration, quote enrichment, gating signatures, and seller credential APIs. If you only need live on-chain state, you can avoid it. If you need routing, quote search, or authenticated enrichment, you will use it.

### Indexer

The indexer is for history, pagination, filtering, vault analytics, and timeline-style queries. It is eventually consistent. Use it for dashboards and bots, not for the single source of truth immediately before sending a transaction.

### EscrowV2

EscrowV2 holds deposit liquidity, tracks supported payment methods and currencies, stores fixed floors and oracle configs, and enforces delegated rate-manager settings. It does not verify off-chain payment proofs or own the intent lifecycle.

### OrchestratorV2

OrchestratorV2 owns intent lifecycle actions such as signal, cancel, and fulfill. It snapshots fees, runs pre-intent hooks, asks EscrowV2 to lock and release funds, and routes verification through the unified verifier.

### UnifiedPaymentVerifierV2

This contract validates the attestation payload that comes back from the Attestation Service. It checks the proof snapshot against the signaled intent, prevents replay, and caps the release amount to what was reserved on-chain.

### Attestation Service

The attestation service is the off-chain proof verifier. It accepts the zkTLS or PeerAuth proof, validates it, and returns the EIP-712 payload that `fulfillIntent()` submits on-chain.

### PeerAuth / Peer extension

PeerAuth is the proof-capture surface for end users. In embedded onramp flows it can also handle the UX for payment submission, fulfillment callbacks, and optional bridge tracking.

### RateManagerV1

Vaults are exposed through rate managers. A manager can set rates on behalf of delegated deposits and charge a fee on filled intents. EscrowV2 always treats the depositor floor as the minimum and only lets a manager raise the effective rate above it.

## Data flow: onramp / taker flow

1. Your app collects `amount`, `fiatCurrency`, destination chain, destination token, and recipient.
2. Your app calls `client.getQuote()` or `client.getQuotesBestByPlatform()` to find live liquidity.
3. The user picks a quote. Your app calls `client.signalIntent()` or opens the Peer extension with `peerExtensionSdk.onramp()`.
4. OrchestratorV2 records the intent and asks EscrowV2 to lock the matching liquidity.
5. The user pays fiat off-chain and produces a proof in PeerAuth or the extension.
6. Your app or the extension calls `client.fulfillIntent()` with that proof.
7. The SDK sends the proof to the Attestation Service, gets an EIP-712 payload back, and submits the final on-chain transaction.
8. UnifiedPaymentVerifierV2 validates the attestation. OrchestratorV2 distributes protocol, referral, and manager fees, then releases the remaining funds to the taker.
9. If a bridge or swap is part of the destination path, the extension reports `bridge.status` so your app can keep tracking delivery.

## Data flow: maker / liquidity flow

1. A maker initializes `Zkp2pClient`, ensures allowance with `ensureAllowance()`, and optionally registers reusable payee details with `registerPayeeDetails()`.
2. The maker creates a deposit with `createDeposit()` and configures payment methods, fixed floors, optional oracle configs, and optional delegation.
3. EscrowV2 stores the deposit. The indexer backfills the deposit for later search and analytics.
4. Takers discover the deposit through curator quotes or indexer-based discovery.
5. When a taker signals an intent, OrchestratorV2 locks the matched liquidity on EscrowV2.
6. The maker watches signaled intents through `client.indexer.getIntentsForDeposits()` and uses their own off-chain logic to watch for incoming fiat.
7. The taker fulfills by submitting a payment proof. If the payment is bad or the intent is stale, the maker can reject or clean it up with `releaseFundsToPayer()` or `pruneExpiredIntents()`.
8. The maker later tops up with `addFunds()`, pauses with `setAcceptingIntents()`, or exits with `withdrawDeposit()`.

## Rate determination

For EscrowV2 deposits, the effective rate is:

```text
escrowFloor = max(fixedRate, oracleRate)
effectiveRate = max(escrowFloor, delegatedRate)
```

Example:

- fixed floor: `1.00`
- oracle-derived floor: `1.03`
- delegated vault rate: `1.01`
- effective rate used on-chain: `1.03`

If the oracle goes stale, its value is treated as `0`, so the rate falls back to the fixed floor and then to any delegated rate above that floor.

## Environments

| `runtimeEnv` | When to use it | Notes |
| --- | --- | --- |
| `production` | Real user traffic | Default SDK environment |
| `preproduction` | Integration testing against production-style services | Useful before a mainnet launch |
| `staging` | Development and rehearsals | SDK defaults skew toward the current staging deployment |

Use `getContracts(chainId, env)` when you want to inspect the exact addresses and ABIs behind the client.

## Common integration decisions

- Use RPC-first reads for "can I submit this transaction right now?"
- Use `client.indexer.*` for search, pagination, vault stats, and historical reporting
- Use `peerExtensionSdk.onramp()` when you want the fastest embedded funding UX
- Use `signalIntent.prepare()` and the other prepared-transaction methods for smart accounts and relayers

## Troubleshooting

- `getDeposits()` is empty but public liquidity exists: `getDeposits()` only returns deposits owned by the connected wallet. Use `client.indexer.getDeposits()` or quote APIs for market-wide discovery
- Indexer data looks stale: confirm with RPC-first methods before you submit a transaction
- `fulfillIntent()` seems to do two steps: that is expected. It talks to the Attestation Service first, then submits the final on-chain transaction
