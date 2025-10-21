---
id: v3-migration
slug: /protocol/v3/migration
title: Migration Guide (V2 → V3)
---

# Migration Guide (V2 → V3)

This guide helps integrators move from the V2 proof flow to the V3 attestation flow with minimal changes.

Key differences
- Off-chain verification
  - V2: proof JSON (e.g., Reclaim/TLSN) was parsed/validated on-chain by per‑platform verifier contracts.
  - V3: proofs are validated off-chain by the Attestation Service, which emits a signed `PaymentAttestation` verified by a single `UnifiedPaymentVerifier` on-chain.
- On-chain interface
  - V2: multiple verifiers per platform with heterogeneous calldata.
  - V3: one `paymentProof` encoding a `PaymentAttestation` and a fixed snapshot format.
- Intent signing
  - V2: simpler intent signing.
  - V3: the gating signature binds more fields (payment method, fiat currency, conversion rate, orchestrator/escrow addresses).

What stays the same
- Non-custodial: Escrow only holds and transfers funds.
- PeerAuth: proof generation UX and API are the same.
- Currency/method hashing: still keccak256 bytes32 on-chain.

API changes you’ll notice
- Gating (Curator): use the v2 verify endpoint with the expanded request. See /protocol/gating-service.
- Quoter: response now includes deposit success metrics and optional filters.

On-chain calls (before/after)
- Signal
  - V2: `Escrow.signalIntent(depositId, amount, to, verifierAddr, fiatCurrency, gatingSig)`
  - V3: `Orchestrator.signalIntent({ escrow, depositId, amount, to, paymentMethod, fiatCurrency, conversionRate, gatingServiceSignature, signatureExpiration, referrer, referrerFee, postIntentHook, data })`
- Fulfill
  - V2: `Escrow.fulfillIntent(bytes proof, bytes32 intentHash)` with proof JSON bytes
  - V3: `Orchestrator.fulfillIntent({ paymentProof: abi.encode(PaymentAttestation), intentHash, verificationData, postIntentHookData })`

Client changes
1) Keep your PeerAuth integration — generate proofs as before.
2) Replace the on-chain proof encoding with the V3 attestation encoding from the Attestation Service response.
3) Switch your signal/fulfill calls to `Orchestrator` entry points.
4) Update gating requests to pass the V3 fields (`paymentMethod`, `fiatCurrency`, `conversionRate`, `orchestratorAddress`, `escrowAddress`).

Validation tips
- If `UnifiedPaymentVerifier` rejects with snapshot mismatch errors, compare the attestation snapshot vs on-chain intent fields.
- If `Nullifier has already been used`, you attempted to reuse the same provider `paymentId` for the same `paymentMethod`.
- If `Data hash mismatch`, ensure the ABI-encoded `(PaymentDetails, IntentSnapshot)` matches the `dataHash` in the signature.

