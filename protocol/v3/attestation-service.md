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
- Identity registration: clients prove a live payment-platform identity before curator registration.
- Buyer TEE verification: the current buyer flow for supported payment methods.
- Buyer proof verification: generic buyer-generated provider proof verification.
- Seller Autopilot: seller-side credential bundle upload and payment resolution.

## Trust model

The identity (`/identity`), buyer proof (`/verify/*`), buyer TEE (`/buyer/verify/*`), and seller-side (`/seller/*`) flows run inside an AWS Nitro Enclave. The code that validates evidence, checks payment or identity invariants, and signs EIP-712 outputs executes inside the enclave.

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

### Identity Registration

Identity registration proves a live platform identity and returns a signed EIP-712 `IdentityAttestation`. The request shape is:

```text
POST {attestationServiceUrl}/identity
```

```ts
{
  platform: 'venmo',
  actionType: 'register_venmo',
  callerAddress: '0x0000000000000000000000000000000000000002',
  encryptedSessionMaterial: '<compact-jwe>',
  params: { SENDER_ID: '123456789' },
}
```

Supported identity actions:

| Platform | Action type | Encrypted session material | Public params |
| --- | --- | --- | --- |
| `venmo` | `register_venmo` | `Cookie` | `SENDER_ID` |
| `paypal` | `register_paypal` | `Cookie` | none |
| `wise` | `register_wise` | `Cookie`, `X-Access-Token` | `PROFILE_ID` |

`callerAddress` is required and is bound into the signed `IdentityAttestation`, so verifiers must check the expected caller address in addition to platform, action type, payee hash, canonical identity `dataHash`, and `validUntil`.

For Venmo, the current service derives the stories replay URL from public `params.SENDER_ID`; clients should not encrypt or send a captured `sessionMaterial.url`. The encrypted Venmo identity session material only needs a replayable `Cookie` header. The enclave verifies the authenticated account id before replaying `https://account.venmo.com/api/stories?feedType=me&externalId={SENDER_ID}` and requires a valid response with a `stories` array.

### Seller Autopilot

Seller Autopilot uses encrypted seller credential bundles to resolve matching payments from the seller side. It shares the same verifier and attestation output shape. See [Seller Autopilot](./seller-autopilot.md).

## Shared Output

Payment verification paths return a signed EIP-712 `PaymentAttestation`. The response includes the signer, signature, typed attestation values, encoded payment details, and metadata identifying the source path. The client packages that attestation as `paymentProof` and calls `OrchestratorV2.fulfillIntent`.

Identity registration returns a signed EIP-712 `IdentityAttestation` plus normalized identity details:

```ts
{
  identity: {
    platform,
    actionType,
    method,
    payeeId,
    payeeIdHash,
    username,
    metadata,
  },
  typedDataValue: {
    method,
    actionType,
    callerAddress,
    payeeIdHash,
    dataHash,
    issuedAt,
    validUntil,
  },
  signature,
  signer,
}
```

Identity attestations are used by registration APIs and are not submitted to `OrchestratorV2.fulfillIntent`.

## Choosing `chainId` and `verifyingContract`

- `chainId` must match the destination chain where `UnifiedPaymentVerifierV2` lives.
- `verifyingContract` is deprecated in API requests. The service resolves the on-chain `UnifiedPaymentVerifierV2` address from `chainId` (`0x46A58Dc65587D4D7B8198C6A25eEdf5b2535Da94` on Base). If callers still include `verifyingContract`, it must match the service-resolved address.
