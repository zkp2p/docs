---
id: v3-buyer-tee-verification
title: Buyer TEE Verification
---

# Buyer TEE Verification

## What this does

Buyer TEE verification is the buyer-side enclave flow for payment evidence that cannot or should not be represented as a Reclaim proof. The buyer encrypts platform session material to the Attestation Service enclave upload key, sends that compact JWE with public provider params and the intent snapshot, and the AWS Nitro Enclave performs the payment-platform HTTPS request itself.

The service decrypts the session material in enclave memory, normalizes the payment with a platform-specific buyer TEE transformer, runs the same V3 `UnifiedPaymentVerifier` checks used by Reclaim and Seller Automated Release, and signs the standard EIP-712 `PaymentAttestation`.

## Who is this for?

Use this page when you are integrating `POST /buyer/verify/{platform}/{actionType}` or comparing the buyer TEE evidence source against [Buyer zkTLS / Reclaim](./buyer-zktls-reclaim.md).

## Endpoints

| Endpoint | Purpose |
|---|---|
| `GET /buyer/supported` | Lists registered buyer TEE verifiers and the typed data spec they sign. |
| `POST /buyer/verify/{platform}/{actionType}` | Verifies a buyer payment by querying the payment platform inside the enclave and returns a signed `PaymentAttestation`. |

Buyer TEE verification only runs in Nitro envelope mode. Non-enclave deployments return `503 Buyer TEE verification requires SIGNER_MODE=envelope`.

## Supported Buyer TEE Transformers

| Platform | Action type | Currency | Required `sessionMaterial` fields inside JWE | Public `params` |
|---|---|---|---|---|
| `venmo` | `transfer_venmo` | USD | `Cookie` | `SENDER_ID`, `index` |
| `cashapp` | `transfer_cashapp` | USD | `Cookie`, `x-csrf-token`, `x-device-name`, `x-request-signature`, `x-request-uuid`, `cash-web-request`, `x-web-device-info`, `x-web-context`, `x-bt-id` | `SENDER_ID`, `index` |
| `monzo` | `transfer_monzo` | GBP | `Authorization` | `TX_ID` |
| `wise` | `transfer_wise` | Multi-currency | `Cookie` or `X-Access-Token` | `PROFILE_ID`, `TRANSACTION_ID` |
| `revolut` | `transfer_revolut` | Multi-currency | `Cookie`, `x-device-id` | `index` |
| `citi` | `transfer_zelle` | USD | `Cookie` | `index` |
| `chime` | `transfer_chime` | USD | `Cookie`, `body` | `{}` |
| `chase` | `transfer_zelle` | USD | `Cookie`, `x-jpmc-channel`, `x-jpmc-csrf-token`, `Referer`, `Origin` | `index` |
| `bankofamerica` | `transfer_zelle` | USD | `Cookie` | `index` |
| `paypal` | `transfer_paypal` | Multi-currency | `Cookie` | `PAYMENT_ID` |
| `paypal` | `transfer_business_paypal` | Multi-currency | `Cookie` | `PAYMENT_ID` |

`params` must always be an object. Public provider-template values keep their exact field names, such as `SENDER_ID`, `TX_ID`, `PROFILE_ID`, `TRANSACTION_ID`, and `PAYMENT_ID`. Captured request bodies, including the Chime GraphQL body, belong in encrypted `sessionMaterial`, not public `params`.

PayPal transfer settlement is hard-cut to Buyer TEE and Seller TEE. Personal PayPal Buyer TEE uses `PAYMENT_ID` to fetch the buyer-visible detail row, then hashes the resolved seller/receiver transaction id for `paymentId` and nullification. PayPal Business Buyer TEE hashes the buyer-visible `PAYMENT_ID`.

## High-Level Flow

1. The client calls `GET /attestation?nonce=...`, verifies the Nitro attestation document, checks the expected PCR8 measurement, and extracts the enclave upload public key.
2. The client encrypts buyer session material as a compact JWE using `RSA-OAEP-256` and `A256GCM`.
3. The buyer signals an intent on-chain and pays the seller off-chain.
4. The client calls `POST /buyer/verify/{platform}/{actionType}` with `encryptedSessionMaterial`, public `params`, `chainId`, and the intent snapshot.
5. The enclave decrypts the JWE, verifies the plaintext binding fields, resolves `UnifiedPaymentVerifierV2` from `chainId`, and selects the matching buyer TEE transformer.
6. The transformer performs the upstream HTTPS request from inside the enclave. The TLS client enforces `https://`, the expected hostname, Node CA authorization, TLS 1.2 or 1.3, non-legacy ciphers, certificate validity, leaf hostname match, adjacent certificate signatures, non-redirect status, and uncompressed JSON before parsing.
7. The transformer normalizes method, payee, amount, currency, timestamp, and payment id.
8. `UnifiedPaymentVerifier` checks the normalized payment against the intent and computes `releaseAmount`.
9. The enclave signs EIP-712 `PaymentAttestation(bytes32 intentHash,uint256 releaseAmount,bytes32 dataHash)` and returns the same attestation shape used by `/verify/*` and `/seller/verify/*`.

## Encrypted Session Material

The service rejects plaintext `sessionMaterial`. The request must use `encryptedSessionMaterial`, a compact JWE encrypted to the attested upload public key returned by `GET /attestation`.

The decrypted JWE plaintext must be strict JSON with these fields:

```json
{
  "platform": "venmo",
  "actionType": "transfer_venmo",
  "sessionMaterial": {
    "Cookie": "..."
  },
  "boundPubKeySha256": "<sha256-of-attested-upload-public-key>"
}
```

The service rejects the envelope if the payload has extra top-level fields, is bound to a different upload key, or is bound to a different `{ platform, actionType }` than the route being called. The enclave decrypts in memory, uses the `sessionMaterial` object for the upstream request, and discards the plaintext after verification.

Buyer TEE verification does not enforce a capture-age limit or one-use replay limit. A leaked encrypted JWE is valid for as long as the upstream platform session remains active, so treat disclosure of the JWE like disclosure of the underlying platform credential and rotate the upstream session.

## Request Shape

`POST /buyer/verify/venmo/transfer_venmo`

```json
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

Fields:

| Field | Required | Description |
|---|---|---|
| `encryptedSessionMaterial` | Yes | Compact JWE encrypted to the verified enclave upload public key. |
| `params` | Yes | Transformer-specific public params. Use `{}` for platforms with no public params. |
| `chainId` | Yes | Destination chain id. Production Base is `8453`; staging Base Sepolia is `84532`. |
| `verifyingContract` | No | Deprecated parity field. The service resolves `UnifiedPaymentVerifierV2` from `chainId`. |
| `intent` | Yes | Intent snapshot supplied by the caller. The verifier checks the observed payment against these values before signing. |

## Transformer Responsibilities

Each buyer TEE transformer owns its upstream request shape and response parser in code. Across platforms, the transformer must:

| Step | Requirement |
|---|---|
| Authenticate | Use only session material decrypted from the attested-key JWE. |
| Fetch | Query the expected platform hostname through the enclave TLS client. |
| Locate payment | Use public `params` and platform response fields to select the buyer's outgoing payment. |
| Validate response | Reject unauthorized sessions, redirects, compressed responses, malformed JSON, unexpected response shapes, wrong payment states, and missing receiver identifiers. |
| Normalize | Produce `NormalizedPaymentDetails` with method hash, payee hash, amount in fiat minor units, currency hash, timestamp in milliseconds, and payment id hash. |

For example, Venmo uses `SENDER_ID` and `index` as public params, reads the authenticated buyer feed with decrypted cookies, and hashes the receiver id and payment id into the unified payment details. Other providers use their own equivalent response fields and request headers.

## How It Differs From Reclaim

| Area | Buyer zkTLS / Reclaim | Buyer TEE |
|---|---|---|
| API | `POST /verify/{platform}/{actionType}` | `POST /buyer/verify/{platform}/{actionType}` |
| Request evidence | `proofType: "reclaim"` plus a stringified Reclaim proof | `encryptedSessionMaterial` compact JWE plus public `params` |
| Who contacts the payment platform | The buyer proof flow contacts the platform while generating the Reclaim proof | The Nitro Enclave contacts the platform during verification |
| Authenticity root | Reclaim claim identifier, provider hash, attestor allowlist, and attestor claim signature | Nitro attestation, attested upload-key JWE binding, and in-enclave HTTPS/TLS validation |
| Proof handler | `ReclaimProofHandler.verifySignature` verifies proof authenticity before transformation | No external proof handler; the buyer TEE transformer fetches and validates the platform response itself |
| PeerAuth | Used by browser/mobile proof generation | Not used for the TEE request path |
| Source tag | `buyer-zktls` | `buyer-tee` |
| On-chain format | Standard V3 `PaymentAttestation` | Same standard V3 `PaymentAttestation` |

Both paths converge on the same `UnifiedPaymentVerifier` checks and the same on-chain `UnifiedPaymentVerifierV2` contract. The difference is the off-chain evidence source and where platform data is authenticated.

## Verifier Checks

After normalization, buyer TEE attestations use the same V3 checks as Buyer zkTLS / Reclaim and Seller Automated Release:

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
| Nitro verification fails | The client should not encrypt or send buyer session material to that service instance. |
| `503 Buyer TEE verification requires SIGNER_MODE=envelope` | The API was called on a non-enclave deployment. |
| Unknown buyer TEE verifier | The `{platform, actionType}` route is not registered in the buyer TEE transformer registry. |
| Missing `encryptedSessionMaterial` | Plaintext `sessionMaterial` is rejected; send an attested-key compact JWE. |
| Invalid JWE envelope | The JWE cannot be decrypted with the enclave upload key, uses the wrong algorithms, or includes unsupported protected-header fields. |
| Invalid JWE binding | The plaintext is missing binding fields, has extra top-level fields, is bound to another upload key, or is bound to another `{platform, actionType}`. |
| Unauthorized session | The payment platform rejected the decrypted buyer session material. |
| No matching payment | The transformer could not find the expected outgoing payment from the public params and platform response. |
| Platform lookup fails | The enclave could not fetch or parse the platform response. |
| Verifier check fails | The observed payment does not satisfy the intent. |
