---
id: v3-buyer-tee-verification
title: Buyer TEE Verification
---

# Buyer TEE Verification

## What this does

Buyer TEE Verification is the current buyer-side verification flow for supported payment platforms. The buyer client verifies the Attestation Service enclave, encrypts payment-platform session material to the enclave upload key, and the enclave checks the payment directly.

The result is the standard V3 `PaymentAttestation`. On-chain contracts do not need a special Buyer TEE path; they receive the same signed attestation format used by the other V3 fulfillment flows.

## Who is this for?

Use this page when you need to understand how Peer verifies buyer payments for supported platforms. This is intentionally high level; platform request details live in the Attestation Service implementation and client integration templates.

## Supported Platforms

Buyer TEE is not Venmo-only. The current service has built-in buyer-side transformers for:

| Payment family | Supported buyer TEE flows |
|---|---|
| Wallet apps | Venmo, Cash App, PayPal Personal, PayPal Business |
| Bank and transfer apps | Wise, Revolut, Monzo, Chime |
| Zelle rails | Chase, Bank of America, Citi |

Each transformer owns the platform-specific request shape and response parser. Integrators should treat those internals as service-owned rather than copying provider-specific headers or response fields from the docs.

## Flow

1. The buyer starts an order and pays the seller through the selected payment platform.
2. The client verifies the running AWS Nitro Enclave through `GET /attestation?nonce=...` before handling payment-platform session material.
3. The client encrypts the platform session material as a compact JWE to the enclave upload public key.
4. The client sends the encrypted session material, public provider params, destination chain, and intent snapshot to the Buyer TEE verification route.
5. The enclave decrypts the session material in memory, queries the payment platform over HTTPS, and normalizes the observed payment.
6. The shared `UnifiedPaymentVerifier` checks the normalized payment against the intent: method, currency, payee, timestamp, intent hash, conversion rate, and amount.
7. The enclave signs the standard EIP-712 `PaymentAttestation`.
8. The client submits that attestation to `OrchestratorV2.fulfillIntent`, where `UnifiedPaymentVerifierV2` verifies the signature and releases funds.

## Security Model

Buyer TEE authenticates payment evidence inside the enclave. The enclave performs the authenticated platform lookup, normalizes the payment, and signs only after the shared V3 verifier confirms the payment matches the intent.

Important properties:

- The client verifies the enclave measurement before encrypting session material.
- The service rejects plaintext buyer session material; the buyer flow uses encrypted session material only.
- The encrypted payload is bound to the enclave upload key and the selected verifier, which prevents accidental reuse against the wrong key or route.
- The payment-platform request runs inside the enclave with HTTPS/TLS checks for expected hostnames and certificate validity.
- The enclave signs only after the shared V3 verifier confirms the payment matches the intent.

The encrypted session payload should still be treated as sensitive. If it leaks, rotate the upstream payment-platform session because the encrypted payload can remain useful for as long as that upstream session remains valid.

## User Experience

In the buyer UI, this should feel like a normal payment verification step:

1. Pay the seller using the selected provider.
2. Return to Peer and confirm the payment is complete.
3. Authenticate or select the payment when prompted.
4. Wait while Peer verifies the payment securely.
5. Complete the order and receive crypto on-chain.

The user should not need to understand enclave internals to complete an order.
