---
id: v3-smart-contracts
title: Smart Contracts
---

# Smart Contracts (V3)

This page summarizes the V3 on-chain contracts and links to detailed pages for each component.

Orchestrator
- Purpose: lifecycle for intents (signal, fulfill), protocol/referrer fees, routing to verifiers, and post-intent hooks.
- Key entry points
  - `signalIntent(SignalIntentParams)`
    - Inputs: `escrow`, `depositId`, `amount`, `to`, `paymentMethod` (bytes32), `fiatCurrency` (bytes32), `conversionRate` (1e18 fixed), `referrer`, `referrerFee`, `gatingServiceSignature`, `signatureExpiration`, optional `postIntentHook`, `data`.
    - Emits `IntentSignaled(intentHash, escrow, depositId, paymentMethod, owner, to, amount, fiatCurrency, conversionRate, timestamp)`.
  - `fulfillIntent(FulfillIntentParams)`
    - Inputs: `paymentProof` (ABI-encoded `PaymentAttestation`), `intentHash`, optional `verificationData`, optional `postIntentHookData`.
    - Routes to the configured `IPaymentVerifier`, unlocks funds, transfers net of fees, and emits `IntentFulfilled`.

UnifiedPaymentVerifier
- Purpose: canonical on-chain verifier for off-chain attestations.
- Typed data
  - Type: `PaymentAttestation(bytes32 intentHash,uint256 releaseAmount,bytes32 dataHash)`
  - Domain: name `UnifiedPaymentVerifier`, version `1`, chainId, verifyingContract.
- Attestation payload
  - `intentHash`: binds the attestation to an on-chain intent.
  - `releaseAmount`: token amount to release on-chain (after FX, before fees). Capped to `intent.amount` during verification.
  - `dataHash`: hash of the `data` blob.
  - `signatures[]`: witness signatures checked by `AttestationVerifier`.
  - `data`: ABI-encoded `(PaymentDetails, IntentSnapshot)`.
    - `PaymentDetails`:
      - `method`: bytes32 (payment method, e.g., keccak256("venmo"))
      - `payeeId`: bytes32 (hashed off-chain recipient id)
      - `amount`: uint256 (smallest fiat unit, e.g., cents)
      - `currency`: bytes32 (fiat currency code hash)
      - `timestamp`: uint256 (ms)
      - `paymentId`: bytes32 (hashed provider transaction id)
    - `IntentSnapshot`:
      - `intentHash`, `amount`, `paymentMethod`, `fiatCurrency`, `payeeDetails`, `conversionRate`, `signalTimestamp`, `timestampBuffer`

Verification rules (key checks)
- EIP‑712 signature validates over `(intentHash, releaseAmount, dataHash)` and the domain separator.
- `keccak256(data) == dataHash` to prevent tampering.
- Snapshot must match on-chain intent fields at fulfillment time.
- Nullifier: `keccak256(paymentMethod || paymentId)` must be unused; it is recorded to prevent reuse.
- Release capping: if `releaseAmount > intent.amount`, the verifier reduces to `intent.amount`.

SimpleAttestationVerifier
- Purpose: witness management and threshold signature verification for the attestation digest.
- Governance can update the witness set; threshold defaults to 1 in `SimpleAttestationVerifier`.

Escrow
- Holds deposits and tracks payment methods + currencies per deposit.
- Orchestrator calls into Escrow to lock/unlock and transfer funds.

Events (selected)
- `IntentSignaled`, `IntentFulfilled`, `PaymentMethodAdded/Removed`, `AttestationVerifierUpdated`.

Notes
- All string-like identifiers (payment method, currency code, payee id, payment id) are keccak256-hashed to bytes32 on-chain.
- `conversionRate` uses 1e18 precision (same as PRECISE_UNIT).

See details
- Escrow: /protocol/v3/smart-contracts/escrow
- Orchestrator: /protocol/v3/smart-contracts/orchestrator
- Unified Payment Verifier: /protocol/v3/smart-contracts/unified-payment-verifier
