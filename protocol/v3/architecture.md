---
id: v3-architecture
slug: /protocol/v3/architecture
title: Architecture
---

# Architecture (V3)

Components
- PeerAuth: local browser extension used to authenticate with providers and export proof materials. It exposes a `window.zktls` API (see developer API docs) used to authenticate and generate proofs.
- Attestation Service: Express/TypeScript service that
  - Validates provider proofs (currently Reclaim)
  - Normalizes platform-specific data to a common shape
  - Produces a signed EIP‑712 PaymentAttestation
  - Endpoints: `GET /verify/supported`, `POST /verify/{platform}/{actionType}`
- On-chain
  - Orchestrator: manages lifecycle (signal/fulfill), fees, and routes verification to the Unified Payment Verifier.
  - Escrow: custody of deposits and accounting of remaining/locked funds; exposes deposit config (payment methods, currencies, gating).
  - UnifiedPaymentVerifier: validates EIP‑712 signatures from the Attestation Service, verifies snapshot vs intent, applies nullifier and release rules.
  - AttestationVerifier: pluggable witness verification. `SimpleAttestationVerifier` checks a threshold of witness signatures.
- Curator (Gating): API that signs intents and provides hashed off‑chain payee details.

Data flow (fulfillment)
1) PeerAuth produces a provider proof (e.g., Reclaim JSON proof).
2) Client calls Attestation Service with: proof JSON, `chainId`, `verifyingContract` (address of on-chain UnifiedPaymentVerifier), and `intent` fields: 
   - `intentHash`, `amount` (wei), `timestampMs`, `paymentMethod` (bytes32), `fiatCurrency` (bytes32), `conversionRate` (fixed 1e18), `payeeDetails` (bytes32), `timestampBufferMs`.
3) Attestation Service returns:
   - `signature` (EIP‑712 signature), `typedDataSpec`, `typedDataValue` (PaymentAttestation), and ABI-encoded `encodedPaymentDetails`/`metadata`.
4) Client ABI-encodes a `PaymentAttestation` containing `intentHash`, `releaseAmount`, `dataHash`, `signatures[]`, and `data` (which encodes `PaymentDetails` and `IntentSnapshot`).
5) Client calls `Orchestrator.fulfillIntent` with the encoded payment proof bytes and the `intentHash`.
6) Orchestrator passes the proof to `UnifiedPaymentVerifier.verifyPayment`, which:
   - Reconstructs the EIP‑712 digest and checks witness signatures via `AttestationVerifier`.
   - Verifies `dataHash == keccak256(data)`.
   - Decodes `PaymentDetails` and `IntentSnapshot` and checks:
     - `snapshot.intentHash == intentHash`
     - Snapshot matches on-chain intent fields: amount, paymentMethod, fiatCurrency, conversionRate, signalTimestamp, payeeDetails
   - Nullifies the payment (`keccak256(paymentMethod || paymentId)`) to prevent reuse.
   - Computes final `releaseAmount` (caps to `intent.amount` if necessary).
7) Orchestrator unlocks funds from Escrow and transfers net of fees.

Identifiers and hashing
- Payment method, fiat currency, payee id, and payment id are keccak256-hashed into bytes32 for privacy and compactness on-chain.
- `intentHash` is the on-chain identifier returned by `signalIntent`.

Security & trust anchors
- EIP‑712 domain binds signatures to the specific `UnifiedPaymentVerifier` address and chain id.
- Witness keys live in the `AttestationVerifier` contract and can be rotated by governance.
- Nullifier registry ensures each (paymentMethod, paymentId) pair can only be used once.

Performance notes
- Moving proof verification off-chain reduces on-chain gas and latency.
- Unified verifier reduces contract surface area and simplifies audits.
