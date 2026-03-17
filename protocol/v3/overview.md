---
id: v3-overview
title: ZKP2P Protocol V3 — Overview
---

# ZKP2P Protocol V3 — Overview

ZKP2P V3 is the current production protocol. It enables faster, more flexible, and easier-to-integrate P2P exchange by moving proof verification off-chain into a standardized Attestation Service, and by consolidating on-chain verification logic into a single Unified Payment Verifier. The protocol remains fully non-custodial: contracts only move funds, while verification and orchestration are modular and replaceable.

### What's new vs V2
- Off-chain verification: the Attestation Service validates provider proofs (e.g., Reclaim/TLSNotary), normalizes them, and signs an EIP-712 PaymentAttestation used on-chain.
- Single on-chain verifier: `UnifiedPaymentVerifierV2` validates the EIP-712 signature and enforces protocol rules (intent bounds, nullifiers, release capping).
- Cleaner intent path: the gating service signs intents with richer context (payment method, fiat currency, conversion rate, orchestrator/escrow addresses) to reduce round trips.
- Extensible: adding providers is purely off-chain (transformers) with a stable on-chain attestation format.
- Oracle-driven rate floors: depositors can configure oracle adapters (Chainlink) per currency to auto-adjust minimum conversion rates based on market prices.
- Delegated rate management: depositors can opt into external rate managers (RateManagerV1) that set rates on their behalf, enabling programmatic rate updates with fee sharing.
- Pre-intent hooks: two dedicated hook slots per deposit (generic + whitelist) that run before state changes during `signalIntent`. Enable on-chain gating (signature validation, address whitelists) without the off-chain gating service.
- Manager fees: rate managers can charge fees (capped at 5%) snapshotted at signal time and distributed at fulfillment.
- Multi-recipient referral fees: `referralFees[]` array replaces the single `referrer` + `referrerFee` fields.
- Multi-orchestrator support: `OrchestratorRegistry` allows multiple orchestrator contracts to interact with EscrowV2, replacing the single orchestrator address pattern.

### Flow
- Buyer (on-ramper): pays off-chain and receives on-chain tokens.
- Seller (off-ramper): supplies token liquidity in Escrow and receives off-chain fiat.
- Gating Service (Curator): authorizes intent creation for sellers, returns payee details and a signature.
- Attestation Service: verifies provider proofs and issues PaymentAttestations.
- On-chain: EscrowV2, OrchestratorV2, OrchestratorRegistry, RateManagerV1, UnifiedPaymentVerifierV2, AttestationVerifier (witness set).
- Pre-intent hooks run before fund locking during `signalIntent`.

### High-level flow
1) Quote: client fetches quotes (developer docs cover API).
2) Intent signing: client calls the gating API (Curator v2 endpoint) to obtain `gatingServiceSignature` tied to deposit/payment method/fiat.
3) Signal Intent (on-chain): call `OrchestratorV2.signalIntent(...)` with depositId, amount, to, paymentMethod, fiatCurrency, conversionRate, referralFees, `gatingServiceSignature`. Pre-intent hooks validate the intent before state changes.
4) Pay off-chain: buyer pays seller's off-chain identifier (hashed on-chain as `payeeDetails`).
5) Generate proof: via PeerAuth; send proof + intent details to Attestation Service.
6) Attestation: Attestation Service returns a `PaymentAttestation` EIP-712 signature and an ABI-encoded payload.
7) Fulfill (on-chain): call `OrchestratorV2.fulfillIntent({ paymentProof: abi.encode(PaymentAttestation), intentHash, ... })`. Orchestrator routes to `UnifiedPaymentVerifierV2` to check the attestation, then unlocks and transfers tokens.

### Trust model
- Off-chain witnesses: Attestation Service signatures are verified on-chain by `AttestationVerifier` (e.g., `SimpleAttestationVerifier` with a witness key). Witness rotation is on-chain governed.
- Intent integrity: snapshot values in the attestation are checked against on-chain intent state; nullifiers prevent double-spend; release amount is capped to the signaled amount.
- Oracle adapter safety: oracle adapters are view-only (no state mutation). Staleness checks ensure stale data is rejected. Oracle rates can only raise the floor, never lower it below the fixed rate.
- Pre-intent hook constraints: hooks can only revert to reject. They cannot modify state or approve intents conditionally — it's pass/fail.
- Manager fee caps: manager fees are capped at 5% (`MAX_MANAGER_FEE = 5e16`) and snapshotted at signal time so they cannot be changed retroactively.
