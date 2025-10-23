---
id: v3-overview
title: ZKP2P Protocol V3 — Overview
---

# ZKP2P Protocol V3 — Overview

ZKP2P V3 makes the protocol faster, more flexible, and easier to integrate by moving proof verification off-chain into a standardized Attestation Service, and by consolidating on-chain verification logic into a single Unified Payment Verifier. The protocol remains fully non-custodial: contracts only move funds, while verification and orchestration are modular and replaceable.

### What’s new vs V2
- Off-chain verification: the Attestation Service validates provider proofs (e.g., Reclaim/TLSNotary), normalizes them, and signs an EIP‑712 PaymentAttestation used on-chain.
- Single on-chain verifier: `UnifiedPaymentVerifier` validates the EIP‑712 signature and enforces protocol rules (intent bounds, nullifiers, release capping).
- Cleaner intent path: the gating service signs intents with richer context (payment method, fiat currency, conversion rate, orchestrator/escrow addresses) to reduce round trips.
- Extensible: adding providers is purely off-chain (transformers) with a stable on-chain attestation format.

### Flow
- Buyer (on‑ramper): pays off-chain and receives on-chain tokens.
- Seller (off‑ramper): supplies token liquidity in Escrow and receives off-chain fiat.
- Gating Service (Curator): authorizes intent creation for sellers, returns payee details and a signature.
- Attestation Service: verifies provider proofs and issues PaymentAttestations.
- On-chain: Escrow, Orchestrator, UnifiedPaymentVerifier, AttestationVerifier (witness set).

###High‑level flow
1) Quote: client fetches quotes (developer docs cover API). 
2) Intent signing: client calls the gating API (Curator v2 endpoint) to obtain `gatingServiceSignature` tied to deposit/payment method/fiat.
3) Signal Intent (on-chain): call `Orchestrator.signalIntent(...)` with depositId, amount, to, paymentMethod, fiatCurrency, conversionRate, `gatingServiceSignature`.
4) Pay off‑chain: buyer pays seller’s off-chain identifier (hashed on-chain as `payeeDetails`).
5) Generate proof: via PeerAuth; send proof + intent details to Attestation Service.
6) Attestation: Attestation Service returns a `PaymentAttestation` EIP‑712 signature and an ABI-encoded payload.
7) Fulfill (on‑chain): call `Orchestrator.fulfillIntent({ paymentProof: abi.encode(PaymentAttestation), intentHash, ... })`. Orchestrator routes to `UnifiedPaymentVerifier` to check the attestation, then unlocks and transfers tokens.

### Trust model
- Off-chain witnesses: Attestation Service signatures are verified on-chain by `AttestationVerifier` (e.g., `SimpleAttestationVerifier` with a witness key). Witness rotation is on-chain governed.
- Intent integrity: snapshot values in the attestation are checked against on-chain intent state; nullifiers prevent double-spend; release amount is capped to the signaled amount.
