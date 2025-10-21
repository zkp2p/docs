---
title: Unified Payment Verifier
---

## Overview

`UnifiedPaymentVerifier` verifies standardized off‑chain attestations produced by the Attestation Service. It validates EIP‑712 signatures via a pluggable `AttestationVerifier`, enforces snapshot consistency with on‑chain intent state, prevents replay via nullifiers, and caps the release amount to the signaled intent amount.

---

## Typed Data

- Primary type: `PaymentAttestation(bytes32 intentHash,uint256 releaseAmount,bytes32 dataHash)`
- Domain (EIP‑712):
  - `name = "UnifiedPaymentVerifier"`
  - `version = "1"`
  - `chainId = block.chainid`
  - `verifyingContract = address(this)`

Attestation struct passed on‑chain
```
struct PaymentAttestation {
  bytes32 intentHash;      // binds to on-chain intent
  uint256 releaseAmount;   // token amount to release (pre-fees)
  bytes32 dataHash;        // keccak256(data)
  bytes[] signatures;      // witness signatures
  bytes data;              // abi.encode(PaymentDetails, IntentSnapshot)
  bytes metadata;          // optional; not signed
}
```

Data payload
```
struct PaymentDetails {
  bytes32 method;     // payment method (bytes32)
  bytes32 payeeId;    // hashed off-chain recipient id
  uint256 amount;     // smallest fiat unit (e.g., cents)
  bytes32 currency;   // fiat code hash
  uint256 timestamp;  // ms epoch
  bytes32 paymentId;  // hashed provider transaction id
}

struct IntentSnapshot {
  bytes32 intentHash;
  uint256 amount;           // signaled token amount
  bytes32 paymentMethod;    // bytes32
  bytes32 fiatCurrency;     // bytes32
  bytes32 payeeDetails;     // bytes32 (must match PaymentDetails.payeeId)
  uint256 conversionRate;   // 1e18
  uint256 signalTimestamp;  // seconds
  uint256 timestampBuffer;  // ms/seconds window
}
```

---

## Verification Flow

1) Compute struct hash for `(intentHash, releaseAmount, dataHash)`.
2) Compute domain‑bound digest and verify witness `signatures` via `AttestationVerifier`.
3) Check `keccak256(attestation.data) == dataHash`.
4) Decode `(PaymentDetails, IntentSnapshot)` and validate snapshot against on‑chain `Orchestrator.getIntent(intentHash)` (amount, method, currency, conversionRate, signalTimestamp) and `Escrow.getDepositPaymentMethodData(...).payeeDetails`.
5) Nullify the payment: `keccak256(paymentMethod || paymentId)`; revert if already used.
6) Cap `releaseAmount` to `intent.amount`.

Returns `PaymentVerificationResult { success, intentHash, releaseAmount }` to the Orchestrator.

---

## Governance & Config

Provided by `BaseUnifiedPaymentVerifier`:
- `getPaymentMethods()` — list of supported methods (bytes32).
- `addPaymentMethod(method)` / `removePaymentMethod(method)` — owner‑only.
- `setAttestationVerifier(address)` — update the witness verifier; emits `AttestationVerifierUpdated`.
