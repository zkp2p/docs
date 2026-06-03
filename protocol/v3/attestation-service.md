---
id: v3-attestation-service
title: Attestation Service
---

# Attestation Service

The Attestation Service validates payment evidence off-chain and returns a standardized, signed EIP-712 `PaymentAttestation` that the on-chain `UnifiedPaymentVerifierV2` can verify.

Base URLs
- Production: `https://attestation-service.zkp2p.xyz` (Base mainnet, runs inside an AWS Nitro Enclave)
- Local dev: `http://localhost:8080`

Endpoints
- `GET /verify/supported` - list buyer zkTLS/Reclaim verifiers with their typed data spec.
- `POST /verify/{platform}/{actionType}` - verify a buyer-generated provider proof and produce a `PaymentAttestation`.
- `GET /buyer/supported` - list buyer TEE verifiers with their typed data spec.
- `POST /buyer/verify/{platform}/{actionType}` - verify a buyer payment by querying the payment platform inside the enclave and produce a `PaymentAttestation`.
- `POST /seller/credentials/{platform}` - upload an encrypted seller credential bundle (Seller Automated Release).
- `POST /seller/verify/{platform}` - resolve a seller-side payment from a stored credential bundle and produce a `PaymentAttestation`.
- `GET /attestation?nonce=...` - return a Nitro NSM attestation document binding the response to the running enclave's code measurement. Used by clients to verify they are talking to the expected enclave before trusting any signed output or sending encrypted session material.

## Trust model

The buyer zkTLS (`/verify/*`), buyer TEE (`/buyer/verify/*`), and seller-side (`/seller/*`) flows run inside an AWS Nitro Enclave. The code that validates evidence, checks the seven payment-detail invariants, and signs the EIP-712 `PaymentAttestation` executes inside the enclave.

- The EIP-712 signing key is wrapped by an AWS KMS Customer Managed Key whose decrypt policy is gated on the enclave's PCR8 measurement. The key is unwrapped in enclave memory at first use and never leaves the enclave; no operator, AWS, or attacker outside the enclave can extract it.
- Build artifacts (PCR0/PCR1/PCR2/PCR8) are reproducible from the published source tree. The expected signer address and PCR8 are baked into the enclave image and returned by `/attestation` alongside the NSM document.
- Clients can verify the attestation document and PCR8 match the published values before encrypting session material or trusting any signed PaymentAttestation. Reference verifier: [`@zkp2p/zkp2p-attestation`](https://www.npmjs.com/package/@zkp2p/zkp2p-attestation).
- On-chain, the enclave's signer is registered as a witness on `MultiAttestationVerifier`. Signatures from any other key are rejected at `fulfillIntent`.

The previous (legacy) deployment ran the same code on commodity infrastructure with the signing key held in plaintext environment variables; that deployment is sunsetted and the canonical hostname now points at the enclave.

## Buyer zkTLS / Reclaim

`POST /verify/{platform}/{actionType}`

This path accepts a buyer-generated provider proof. For Reclaim, the service verifies the claim identifier and attestor signature, transforms the extracted proof context into normalized payment details, runs `UnifiedPaymentVerifier`, and signs the result with source tag `buyer-zktls`.

`proofType` currently supports only `reclaim`. Supported Reclaim transformers are documented in [Buyer zkTLS / Reclaim](./buyer-zktls-reclaim.md).

Request body:

```
{
  "proofType": "reclaim",
  "proof": "{...stringified provider proof JSON...}",
  "chainId": 8453,
  "verifyingContract": "0x...UnifiedPaymentVerifier",
  "intent": {
    "intentHash": "0x...",                  // bytes32 hex
    "amount": "50000000",                    // wei as decimal string
    "timestampMs": "1700000000000",          // ms as decimal string
    "paymentMethod": "0x...",                // bytes32
    "fiatCurrency": "0x...",                 // bytes32
    "conversionRate": "1000000000000000000", // 1e18-scaled
    "payeeDetails": "0x...",                 // bytes32
    "timestampBufferMs": "5000"              // optional; ms as decimal string
  }
}
```

## Buyer TEE

`POST /buyer/verify/{platform}/{actionType}`

This path does not accept a Reclaim proof. The buyer submits an attested-key compact JWE as `encryptedSessionMaterial`, public provider `params`, `chainId`, and the intent snapshot. The enclave decrypts the JWE in memory, contacts the payment platform over HTTPS, validates the authenticated response, normalizes the payment, runs `UnifiedPaymentVerifier`, and signs the result with source tag `buyer-tee`.

Buyer TEE supports Venmo, Cash App, Monzo, Wise, Revolut, Chime, Chase Zelle, Bank of America Zelle, Citi Zelle, PayPal personal, and PayPal Business. Current route keys and required params are documented in [Buyer TEE Verification](./buyer-tee-verification.md).

The request body must carry `encryptedSessionMaterial`. Plaintext `sessionMaterial` is rejected. The JWE plaintext is bound to `{ platform, actionType, boundPubKeySha256 }`, so the service rejects payloads encrypted for a different upload key or route.

Request body:

```
{
  "encryptedSessionMaterial": "<compact JWE>",
  "params": {
    "SENDER_ID": "buyer-venmo-id",
    "index": 0
  },
  "chainId": 8453,
  "intent": {
    "intentHash": "0x...",
    "amount": "50000000",
    "timestampMs": "1700000000000",
    "paymentMethod": "0x...",
    "fiatCurrency": "0x...",
    "conversionRate": "1000000000000000000",
    "payeeDetails": "0x...",
    "timestampBufferMs": "5000"
  }
}
```

## Response

All verification paths return the same response shape:

```
{
  "success": true,
  "message": "Attestation output",
  "responseObject": {
    "signature": "0x…",                // EIP-712 signature
    "signer": "0x…",                   // Attestation Service signer
    "domainSeparator": "0x…",
    "typeHash": "0x…",
    "typedDataSpec": {
      "primaryType": "PaymentAttestation",
      "types": {
        "PaymentAttestation": [
          { "name": "intentHash", "type": "bytes32" },
          { "name": "releaseAmount", "type": "uint256" },
          { "name": "dataHash", "type": "bytes32" }
        ]
      }
    },
    "typedDataValue": {
      "intentHash": "0x…",
      "releaseAmount": "…",
      "dataHash": "0x…"
    },
    "proofInput": "{…}",                // normalized proof input JSON string
    "platform": "venmo",
    "actionType": "transfer_venmo",
    "encodedPaymentDetails": "0x…",     // data blob: ABI-encoded PaymentDetails + IntentSnapshot
    "metadata": "0x…"                   // ABI-encoded source tag: buyer-zktls, buyer-tee, or seller-tee
  }
}
```

For buyer TEE responses, `proofInput` redacts `encryptedSessionMaterial`.

## How to build `paymentProof` for fulfillIntent

1) Construct the `PaymentAttestation` struct in TypeScript/ethers:

```ts
import { ethers } from "ethers";

// Values from Attestation Service response
const sig = resp.responseObject.signature;
const typed = resp.responseObject.typedDataValue; // { intentHash, releaseAmount, dataHash }

const attestation = {
  intentHash: typed.intentHash,
  releaseAmount: typed.releaseAmount,
  dataHash: typed.dataHash,
  signatures: [sig],
  data: resp.responseObject.encodedPaymentDetails,
  metadata: resp.responseObject.metadata
};

// Encode for Orchestrator.fulfillIntent
const paymentProof = ethers.AbiCoder.defaultAbiCoder().encode([
  "tuple(bytes32 intentHash,uint256 releaseAmount,bytes32 dataHash,bytes[] signatures,bytes data,bytes metadata)"
], [attestation]);
```

2) Call `fulfillIntent` with `paymentProof` and the on-chain `intentHash`.

## Choosing `chainId` and `verifyingContract`

- `chainId` must match the destination chain where `UnifiedPaymentVerifierV2` lives.
- `verifyingContract` is deprecated in API requests. The service resolves the on-chain `UnifiedPaymentVerifierV2` address from `chainId` (`0x46A58Dc65587D4D7B8198C6A25eEdf5b2535Da94` on Base). If callers still include `verifyingContract`, it must match the service-resolved address.
