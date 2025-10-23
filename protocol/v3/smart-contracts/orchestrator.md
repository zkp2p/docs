---
title: Orchestrator
---

## Overview

The Orchestrator manages the lifecycle of intents and fee distribution. It verifies gating signatures, locks liquidity in Escrow on signal, routes attestation verification to the `UnifiedPaymentVerifier` on fulfillment, and transfers funds net of protocol/referrer fees. It also supports optional post‑intent hooks.

---

## Constants

- `uint256 internal constant PRECISE_UNIT = 1e18;`
- `uint256 constant MAX_REFERRER_FEE = 5e16; // 5%`
- `uint256 constant MAX_PROTOCOL_FEE = 5e16; // 5%`

---

## Key State

- `uint256 immutable chainId` — deployment chain id.
- `mapping(bytes32 => Intent) intents` — active intents by hash; `mapping(address => bytes32[]) accountIntents` — per-user list.
- `mapping(bytes32 => uint256) intentMinAtSignal` — snapshot of deposit min amount at signal for partial-release protection.
- Registries: `EscrowRegistry`, `PaymentVerifierRegistry`, `PostIntentHookRegistry`, `RelayerRegistry`.
- Fees: `protocolFee` (1e18), `protocolFeeRecipient`, `allowMultipleIntents` flag, `intentCounter`.

---

## Signal Intent

`function signalIntent(SignalIntentParams calldata params) external`

SignalIntentParams
```
struct SignalIntentParams {
  address escrow;            // Escrow holding the deposit
  uint256 depositId;         // Deposit id
  uint256 amount;            // Destination token amount to lock
  address to;                // Recipient of released funds
  bytes32 paymentMethod;     // keccak256("venmo"), etc.
  bytes32 fiatCurrency;      // keccak256("USD"), etc.
  uint256 conversionRate;    // taker-proposed rate (>= deposit min), 1e18
  address referrer;          // optional
  uint256 referrerFee;       // optional (<= MAX_REFERRER_FEE)
  bytes gatingServiceSignature; // signature from deposit's gating service
  uint256 signatureExpiration;  // ms/seconds epoch depending on off-chain convention
  IPostIntentHook postIntentHook; // optional hook
  bytes data;                // hook data
}
```

Behavior
- Validates the deposit and method/currency support via registries.
- Verifies `gatingServiceSignature` binds `(orchestrator, escrow, depositId, amount, to, paymentMethod, fiatCurrency, conversionRate, expiration, chainId)`.
- Locks funds on Escrow with `lockFunds(depositId, intentHash, amount)`.
- Emits `IntentSignaled` with snapshot values.

---

## Fulfill Intent

`function fulfillIntent(FulfillIntentParams calldata params) external`

FulfillIntentParams
```
struct FulfillIntentParams {
  bytes paymentProof;        // ABI-encoded PaymentAttestation
  bytes32 intentHash;        // intent to fulfill
  bytes verificationData;    // optional
  bytes postIntentHookData;  // optional
}
```

Behavior
- Decodes `paymentProof` and forwards to the `IPaymentVerifier` (UnifiedPaymentVerifier) resolved via the registry/payment method.
- Requires attestation validity and snapshot match; receives `releaseAmount`.
- Instructs Escrow to `unlockAndTransferFunds` to Orchestrator, then applies protocol/referrer fees and sends net to `to` (or to the post‑intent hook).
- Supports partial releases: if the attestation indicates less than the signaled amount, only that portion is released; remaining lock is returned to deposit liquidity.

---

## Other Operations

- `cancelIntent(bytes32 intentHash)` — prune and unlock.
- `releaseFundsToPayer(bytes32 intentHash)` — manual release path for the depositor under configured rules.
- `pruneIntents(bytes32[] intentIds)` — called by Escrow to prune expired intents.

---

## Events (selected)

- `IntentSignaled(intentHash, escrow, depositId, paymentMethod, owner, to, amount, fiatCurrency, conversionRate, timestamp)`
- `IntentFulfilled(intentHash, fundsTransferredTo, amount, isManualRelease)`
- `ProtocolFeeUpdated(protocolFee)` / `ProtocolFeeRecipientUpdated(addr)`
