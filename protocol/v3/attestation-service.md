---
id: v3-attestation-service
title: Attestation Service
---

# Attestation Service

The Attestation Service validates payment evidence off-chain and returns a standardized, signed EIP-712 `PaymentAttestation` that the on-chain `UnifiedPaymentVerifierV2` can verify.

Base URLs
- Production: `https://attestation-service.zkp2p.xyz` (Base mainnet, runs inside an AWS Nitro Enclave)
- Local dev: `http://localhost:8080`

## Main Surfaces
- Enclave attestation: clients verify the running Nitro Enclave before trusting signatures or encrypting session material.
- Buyer TEE verification: the current buyer flow for supported payment methods.
- Buyer proof verification: generic buyer-generated provider proof verification.
- Seller Automated Release: seller-side credential bundle upload and payment resolution.

## Trust model

The buyer proof (`/verify/*`), buyer TEE (`/buyer/verify/*`), and seller-side (`/seller/*`) flows run inside an AWS Nitro Enclave. The code that validates evidence, checks the seven payment-detail invariants, and signs the EIP-712 `PaymentAttestation` executes inside the enclave.

- The EIP-712 signing key is wrapped by an AWS KMS Customer Managed Key whose decrypt policy is gated on the enclave's PCR8 measurement. The key is unwrapped in enclave memory at first use and never leaves the enclave; no operator, AWS, or attacker outside the enclave can extract it.
- Build artifacts (PCR0/PCR1/PCR2/PCR8) are reproducible from the published source tree. The expected signer address and PCR8 are baked into the enclave image and returned by `/attestation` alongside the NSM document.
- Clients can verify the attestation document and PCR8 match the published values before encrypting session material or trusting any signed PaymentAttestation. Reference verifier: [`@zkp2p/zkp2p-attestation`](https://www.npmjs.com/package/@zkp2p/zkp2p-attestation).
- On-chain, the enclave's signer is registered as a witness on `MultiAttestationVerifier`. Signatures from any other key are rejected at `fulfillIntent`.

The previous (legacy) deployment ran the same code on commodity infrastructure with the signing key held in plaintext environment variables; that deployment is sunsetted and the canonical hostname now points at the enclave.

## Verification Paths

### Buyer TEE

Buyer TEE is the current buyer verification flow for supported platforms. The buyer client verifies the Nitro enclave, encrypts payment-platform session material to the attested upload key, and sends that encrypted material with public provider params and the intent snapshot. The enclave decrypts in memory, contacts the payment platform over HTTPS, validates and normalizes the response, runs `UnifiedPaymentVerifier`, and signs the result with source tag `buyer-tee`.

Buyer TEE supports Venmo, Cash App, Monzo, Wise, Revolut, Chime, Chase Zelle, Bank of America Zelle, Citi Zelle, PayPal Personal, and PayPal Business. See [Buyer TEE Verification](./buyer-tee-verification.md) for the high-level flow and security model.

### Buyer Proof Verification

This generic path accepts buyer-generated provider proofs, transforms extracted proof context into normalized payment details, runs `UnifiedPaymentVerifier`, and signs the result. It remains part of the Attestation Service surface, but supported buyer payment methods should use Buyer TEE.

### Seller Automated Release

Seller Automated Release uses encrypted seller credential bundles to resolve matching payments from the seller side. It shares the same verifier and attestation output shape. See [Seller Automated Release](./seller-automated-release.md).

## Shared Output

All verification paths return the same kind of signed EIP-712 `PaymentAttestation`. The response includes the signer, signature, typed attestation values, encoded payment details, and metadata identifying the source path. The client packages that attestation as `paymentProof` and calls `OrchestratorV2.fulfillIntent`.

## Choosing `chainId` and `verifyingContract`

- `chainId` must match the destination chain where `UnifiedPaymentVerifierV2` lives.
- `verifyingContract` is deprecated in API requests. The service resolves the on-chain `UnifiedPaymentVerifierV2` address from `chainId` (`0x46A58Dc65587D4D7B8198C6A25eEdf5b2535Da94` on Base). If callers still include `verifyingContract`, it must match the service-resolved address.
