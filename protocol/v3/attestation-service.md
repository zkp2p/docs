---
id: v3-attestation-service
slug: /protocol/v3/attestation-service
title: Attestation Service (V3)
---

# Attestation Service (V3)

The Attestation Service validates provider proofs off-chain and returns a standardized, signed EIP‑712 PaymentAttestation that the on-chain `UnifiedPaymentVerifier` can verify.

Base URL
- Local dev: `http://localhost:8080`

Endpoints
- `GET /verify/supported` — list supported verifiers with their typed data spec.
- `POST /verify/{platform}/{actionType}` — verify a provider proof and produce a PaymentAttestation.

POST /verify/{platform}/{actionType}
Request body (shape)
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
    "timestampBufferMs": "5000"              // ms as decimal string
  }
}
```

Response (shape)
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
    "encodedPaymentDetails": "0x…",     // ABI-encoded (PaymentDetails)
    "metadata": "0x…"                   // ABI-encoded (IntentSnapshot)
  }
}
```

How to build `paymentProof` for fulfillIntent
1) Construct the `PaymentAttestation` struct in TypeScript/ethers:
```ts
import { ethers } from "ethers";

// Values from Attestation Service response
const sig = resp.responseObject.signature;
const typed = resp.responseObject.typedDataValue; // { intentHash, releaseAmount, dataHash }
const encodedPaymentDetails = resp.responseObject.encodedPaymentDetails; // bytes
const metadata = resp.responseObject.metadata; // bytes

// Signatures array (single signer in SimpleAttestationVerifier)
const signatures: string[] = [sig];

// data is ABI-encoded (PaymentDetails, IntentSnapshot)
const data = ethers.AbiCoder.defaultAbiCoder().encode(
  [
    // PaymentDetails
    "tuple(bytes32 method,bytes32 payeeId,uint256 amount,bytes32 currency,uint256 timestamp,bytes32 paymentId)",
    // IntentSnapshot
    "tuple(bytes32 intentHash,uint256 amount,bytes32 paymentMethod,bytes32 fiatCurrency,bytes32 payeeDetails,uint256 conversionRate,uint256 signalTimestamp,uint256 timestampBuffer)"
  ],
  [
    ethers.AbiCoder.defaultAbiCoder().decode(
      ["tuple(bytes32,bytes32,uint256,bytes32,uint256,bytes32)"],
      encodedPaymentDetails
    )[0],
    ethers.AbiCoder.defaultAbiCoder().decode(
      ["tuple(bytes32,uint256,bytes32,bytes32,bytes32,uint256,uint256,uint256)"],
      metadata
    )[0]
  ]
);

// Final attestation struct
const attestation = {
  intentHash: typed.intentHash,
  releaseAmount: typed.releaseAmount,
  dataHash: typed.dataHash,
  signatures,
  data,
  metadata: "0x" // optional/unused path; keep zero-bytes if not used
};

// Encode for Orchestrator.fulfillIntent
const paymentProof = ethers.AbiCoder.defaultAbiCoder().encode([
  "tuple(bytes32 intentHash,uint256 releaseAmount,bytes32 dataHash,bytes[] signatures,bytes data,bytes metadata)"
], [attestation]);
```
2) Call `fulfillIntent` with `paymentProof` and the on-chain `intentHash`.

Choosing `chainId` and `verifyingContract`
- `chainId` must match the destination chain where `UnifiedPaymentVerifier` lives.
- `verifyingContract` is the on-chain `UnifiedPaymentVerifier` address; it is part of the EIP‑712 domain and must match exactly.
