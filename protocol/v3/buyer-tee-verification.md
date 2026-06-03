---
id: v3-buyer-tee-verification
title: Buyer TEE Verification
---

# Buyer TEE Verification

## What this does

Buyer TEE verification is the buyer-side enclave flow for payment evidence that is produced by querying the payment platform from inside the Attestation Service TEE. Instead of submitting a Reclaim proof, the buyer submits a platform transaction id and short-lived session material. The AWS Nitro Enclave uses that material to fetch the payment, normalize the result, run the V3 verifier checks, and sign the same `PaymentAttestation` used by every other V3 fulfillment path.

## Who is this for?

Use this page when you are integrating a buyer flow that does not generate a Reclaim proof through PeerAuth, or when you need to understand how the buyer TEE source differs from the buyer zkTLS source.

## Endpoints

| Endpoint | Purpose |
|---|---|
| `GET /buyer/supported` | Lists buyer TEE verifiers and the typed data spec they sign. |
| `POST /buyer/verify/{platform}/{actionType}` | Verifies a buyer payment inside the enclave and returns a signed `PaymentAttestation`. |

Current supported verifier:

| Platform | Action type | Currency | Source tag |
|---|---|---|---|
| `venmo` | `transfer_venmo` | `USD` | `buyer-tee` |

Buyer TEE verification only runs when the service is in Nitro envelope mode. Non-enclave deployments return `503` for this API.

## High-Level Flow

1. The client verifies the running enclave with `GET /attestation?nonce=...` and the pinned PCR8 value before sending sensitive session material.
2. The buyer signals an intent on-chain and pays the seller off-chain.
3. The client calls `POST /buyer/verify/{platform}/{actionType}` with the platform transaction id, buyer session material, `chainId`, and intent snapshot.
4. The enclave resolves the `UnifiedPaymentVerifierV2` address from `chainId`, normalizes the intent, and selects the buyer TEE transformer.
5. The transformer makes the platform HTTPS request from inside the enclave. The TLS client enforces `https://`, the expected hostname, TLS 1.2 or 1.3, certificate-chain validity, and allowed ciphers.
6. The transformer finds the outgoing payment, confirms it belongs to the authenticated buyer account, and normalizes method, payee, amount, currency, timestamp, and payment id.
7. `UnifiedPaymentVerifier` checks the normalized payment against the intent and computes `releaseAmount`.
8. The enclave signs EIP-712 `PaymentAttestation(bytes32 intentHash,uint256 releaseAmount,bytes32 dataHash)` and returns the same attestation shape used by `/verify/*` and `/seller/verify/*`.

## Request Shape

`POST /buyer/verify/venmo/transfer_venmo`

```json
{
  "txId": "4404236547182699730",
  "sessionMaterial": {
    "buyerUsername": "buyer_user",
    "accountId": "123456789",
    "sessionCookie": "venmo_access_token=...",
    "requestHeaders": {
      "user-agent": "..."
    }
  },
  "metadata": {
    "nextId": "optional-pagination-cursor"
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

Fields:

| Field | Required | Description |
|---|---|---|
| `txId` | Yes | Platform transaction id. For Venmo, this must be alphanumeric and at least 16 characters. |
| `sessionMaterial` | Yes | Platform-specific buyer auth material. It is parsed and used by the enclave transformer, then redacted from `proofInput` in the service response. |
| `metadata` | No | Platform-specific query metadata. Venmo supports `nextId` pagination when the first page does not include the target payment. |
| `chainId` | Yes | Destination chain id. Production Base is `8453`; staging Base Sepolia is `84532`. |
| `verifyingContract` | No | Deprecated parity field. The service resolves `UnifiedPaymentVerifierV2` from `chainId`. |
| `intent` | Yes | Intent snapshot supplied by the caller. The verifier checks the observed payment against these values before signing. |

## Venmo Normalization

The Venmo buyer TEE transformer reads the authenticated buyer feed and only accepts an outgoing payment that matches all of the following:

| Check | Requirement |
|---|---|
| Payment id | `story.paymentId` equals `txId`. |
| Payment type | Story type is `payment` and subtype is one of the supported payment subtypes. |
| Buyer account | The sender is the authenticated account id from `sessionMaterial.accountId`. |
| Buyer username | The authenticated sender username exactly matches `sessionMaterial.buyerUsername`. |
| Receiver | The story exposes a receiver id; this becomes `keccak256(receiverId)`. |
| Amount | The story amount parses to a positive USD-cent amount. |
| Response shape | Venmo returns JSON with identity encoding; compressed or non-JSON responses are rejected. |

Normalized payment details:

| Payment field | Value |
|---|---|
| `method` | `keccak256("venmo")` |
| `payeeId` | `keccak256(receiverId)` |
| `amount` | USD cents as `uint256` |
| `currency` | `keccak256("USD")` |
| `timestamp` | Venmo payment timestamp in milliseconds |
| `paymentId` | `keccak256(txId)` |

## How It Differs From Reclaim

| Area | Reclaim buyer zkTLS | Buyer TEE |
|---|---|---|
| API | `POST /verify/{platform}/{actionType}` | `POST /buyer/verify/{platform}/{actionType}` |
| Request evidence | `proofType: "reclaim"` plus a stringified Reclaim proof | `txId` plus platform-specific buyer session material |
| Who contacts the payment platform | The buyer proof flow contacts the platform while generating the Reclaim proof | The Nitro Enclave contacts the platform during verification |
| Authenticity root | Reclaim attestor signature, claim identifier, provider hash, and proof context | Nitro measurement plus an in-enclave HTTPS request to the expected platform hostname |
| Proof handler | `ReclaimProofHandler` verifies the Reclaim claim signature before transformation | No external proof handler; the buyer TEE transformer fetches and validates the platform response itself |
| PeerAuth | Used by browser/mobile proof generation | Not used for the TEE request path |
| Source tag | `buyer-zktls` | `buyer-tee` |
| On-chain format | Standard V3 `PaymentAttestation` | Same standard V3 `PaymentAttestation` |

Both paths converge on the same `UnifiedPaymentVerifier` checks and the same on-chain `UnifiedPaymentVerifierV2` contract. The difference is only the off-chain evidence source and where the platform data is authenticated.

## Verifier Checks

After normalization, buyer TEE attestations use the same V3 checks as buyer zkTLS and Seller Automated Release:

| Check | Requirement |
|---|---|
| Payment method | Observed method hash matches `intent.paymentMethod`. |
| Fiat currency | Observed currency hash matches `intent.fiatCurrency`. |
| Payee | Observed payee hash matches `intent.payeeDetails`. |
| Timestamp | Payment timestamp plus the configured buffer is greater than or equal to the intent timestamp. |
| Intent hash | The attestation is signed for the requested intent hash. |
| Conversion rate | Intent conversion rate is positive. |
| Amount | Observed payment amount is positive. |

Release amount:

```text
min(paymentAmount * 10^18 * 10^4 / conversionRate, intentAmount)
```

`paymentAmount` is in fiat minor units. The `10^4` factor adjusts fiat cents into 6-decimal USDC units.

## Response And Fulfillment

The response body matches the standard Attestation Service response:

```json
{
  "success": true,
  "message": "Attestation output",
  "responseObject": {
    "platform": "venmo",
    "actionType": "transfer_venmo",
    "signature": "0x...",
    "signer": "0x...",
    "typedDataValue": {
      "intentHash": "0x...",
      "releaseAmount": "...",
      "dataHash": "0x..."
    },
    "encodedPaymentDetails": "0x...",
    "metadata": "0x..."
  }
}
```

`encodedPaymentDetails` is the `data` blob used by the on-chain attestation. It contains the ABI-encoded payment details and intent snapshot. `metadata` is an ABI-encoded source tag and is `buyer-tee` for this flow. It is useful for off-chain attribution and is not part of the signed `dataHash`.

Use the returned fields to build `paymentProof` exactly as you would for the Reclaim or Seller Automated Release paths:

```ts
import { ethers } from "ethers";

const typed = resp.responseObject.typedDataValue;

const attestation = {
  intentHash: typed.intentHash,
  releaseAmount: typed.releaseAmount,
  dataHash: typed.dataHash,
  signatures: [resp.responseObject.signature],
  data: resp.responseObject.encodedPaymentDetails,
  metadata: resp.responseObject.metadata,
};

const paymentProof = ethers.AbiCoder.defaultAbiCoder().encode(
  ["tuple(bytes32 intentHash,uint256 releaseAmount,bytes32 dataHash,bytes[] signatures,bytes data,bytes metadata)"],
  [attestation],
);
```

## Failure Semantics

| Failure | Meaning |
|---|---|
| Nitro verification fails | The client should not send buyer session material to that service instance. |
| `503 Buyer TEE verification requires SIGNER_MODE=envelope` | The API was called on a non-enclave deployment. |
| Invalid session material | Required platform auth fields are missing or malformed. |
| Unauthorized session | The payment platform rejected the buyer session. |
| No matching payment | The current page of the buyer feed did not contain `txId`; Venmo responses may include `nextCursor` for another request. |
| Platform lookup fails | The enclave could not fetch or parse the platform response. |
| Verifier check fails | The observed payment does not satisfy the intent. |
