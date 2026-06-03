---
id: v3-buyer-zktls-reclaim
title: Buyer zkTLS / Reclaim
---

# Buyer zkTLS / Reclaim

## What this does

Buyer zkTLS / Reclaim is the V3 buyer proof flow for payment evidence generated outside the Attestation Service. The buyer generates a Reclaim proof for a payment-platform response, posts the stringified proof JSON to the Attestation Service, and receives the standard signed EIP-712 `PaymentAttestation` used by `UnifiedPaymentVerifierV2`.

This is the proof-generation path used by PeerAuth-style browser and mobile flows. It is separate from [Buyer TEE Verification](./buyer-tee-verification.md), where the enclave contacts the payment platform directly.

## Endpoints

| Endpoint | Purpose |
|---|---|
| `GET /verify/supported` | Lists registered buyer zkTLS/Reclaim verifiers and the typed data spec they sign. Paused platforms are omitted. |
| `POST /verify/{platform}/{actionType}` | Verifies a buyer-generated Reclaim provider proof and returns a signed `PaymentAttestation`. |

`proofType` currently supports only `reclaim`. Buyer zkTLS platforms configured in `PAUSED_BUYER_ZKTLS_PLATFORMS` return `503` before proof validation or signing.

## Supported Reclaim Transformers

The Reclaim transformer registry key is `actionType:platform:proofType`.

| Platform | Action type | Currency | Notes |
|---|---|---|---|
| `venmo` | `transfer_venmo` | USD | Venmo transfer proof |
| `cashapp` | `transfer_cashapp` | USD | Cash App transfer proof |
| `wise` | `transfer_wise` | Multi-currency | Wise transfer proof |
| `revolut` | `transfer_revolut` | Multi-currency | Revolut transfer proof |
| `chime` | `transfer_chime` | USD | Chime transfer proof |
| `chase` | `transfer_zelle` | USD | Chase Zelle proof |
| `bankofamerica` | `transfer_zelle` | USD | Bank of America Zelle proof |
| `citi` | `transfer_zelle` | USD | Citi Zelle proof |
| `monzo` | `transfer_monzo` | GBP | Monzo transfer proof |
| `n26` | `transfer_n26` | EUR | N26 transfer proof |
| `luxon` | `transfer_luxon` | Multi-currency | Luxon transfer proof |
| `mercadopago` | `transfer_mercadopago` | Multi-currency | Mercado Pago transfer proof |
| `alipay` | `transfer_alipay` | CNY | Alipay transfer proof |

PayPal transfer settlement is intentionally not a Reclaim transformer flow. The legacy PayPal Reclaim transformer is not registered because the buyer-visible Reclaim proof cannot derive PayPal's seller/receiver transaction id. Use Buyer TEE or Seller TEE for PayPal so the seller/receiver transaction id can be the nullifier preimage. PayPal Business Buyer TEE uses `transfer_business_paypal` and hashes the buyer-visible `PAYMENT_ID`.

## Request Shape

`POST /verify/venmo/transfer_venmo`

```json
{
  "proofType": "reclaim",
  "proof": "<stringified Reclaim proof JSON>",
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
| `proofType` | Yes | Must be `reclaim`. |
| `proof` | Yes | Stringified Reclaim proof JSON. Some providers submit an array of Reclaim proofs. |
| `chainId` | Yes | Destination chain id. Production Base is `8453`; staging Base Sepolia is `84532`. |
| `verifyingContract` | No | Deprecated parity field. The service resolves `UnifiedPaymentVerifierV2` from `chainId`. |
| `intent` | Yes | Intent snapshot supplied by the caller. The verifier checks the observed payment against these values before signing. |

## Verification Flow

1. The client generates a Reclaim proof for the payment-platform response.
2. The client posts the proof, `chainId`, and intent snapshot to `POST /verify/{platform}/{actionType}`.
3. The service resolves `UnifiedPaymentVerifierV2` from `chainId`.
4. The service finds the registered transformer by `{actionType}:{platform}:reclaim`.
5. `ReclaimProofHandler.verifySignature` parses the proof, recomputes the claim identifier from provider, parameters, and context, checks that the provider hash matches the claim parameters, confirms the attestor is allowlisted, and verifies the Reclaim claim signature. It supports a single Reclaim proof or an array of proofs.
6. The platform transformer parses the proof context and extracted parameters into `NormalizedPaymentDetails`.
7. `UnifiedPaymentVerifier` checks the normalized payment against the intent and computes `releaseAmount`.
8. The enclave signs EIP-712 `PaymentAttestation(bytes32 intentHash,uint256 releaseAmount,bytes32 dataHash)` and returns the standard attestation response.

The proof handler verifies the Reclaim claim signature and intentionally does not verify `resultSignature`, which would require the full response encoding.

## How It Differs From Buyer TEE

| Area | Buyer zkTLS / Reclaim | Buyer TEE |
|---|---|---|
| API | `POST /verify/{platform}/{actionType}` | `POST /buyer/verify/{platform}/{actionType}` |
| Request evidence | `proofType: "reclaim"` plus a stringified Reclaim proof | `encryptedSessionMaterial` compact JWE plus public `params` |
| Who contacts the payment platform | The buyer proof flow contacts the platform while generating the Reclaim proof | The Nitro Enclave contacts the platform during verification |
| Authenticity root | Reclaim claim identifier, provider hash, attestor allowlist, and attestor claim signature | Nitro attestation, attested upload-key JWE binding, and in-enclave HTTPS/TLS validation |
| PeerAuth | Used by browser/mobile proof generation | Not used for the TEE request path |
| Source tag | `buyer-zktls` | `buyer-tee` |
| On-chain format | Standard V3 `PaymentAttestation` | Same standard V3 `PaymentAttestation` |

Both paths converge on the same `UnifiedPaymentVerifier` checks and the same on-chain `UnifiedPaymentVerifierV2` contract.

## Verifier Checks

After transformation, Reclaim attestations use the same V3 checks as Buyer TEE and Seller Automated Release:

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

## Response And Fulfillment

The response shape is the same as Buyer TEE and Seller Automated Release. `metadata` is an ABI-encoded source tag and is `buyer-zktls` for this flow.

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

Encode the returned attestation into `paymentProof` for `OrchestratorV2.fulfillIntent` the same way as the other V3 fulfillment paths.

## Failure Semantics

| Failure | Meaning |
|---|---|
| Paused platform | The platform is configured in `PAUSED_BUYER_ZKTLS_PLATFORMS` and returns `503` before proof validation. |
| Unknown verifier | The `{platform, actionType, proofType}` key is not registered. |
| Unsupported proof type | `proofType` is not `reclaim`. |
| Invalid claim identifier | The proof identifier does not recompute from provider, parameters, and context. |
| Provider hash mismatch | The proof context provider hash does not match the proof claim parameters. |
| Unrecognized attestor | The Reclaim attestor is not in the configured allowlist. |
| Invalid claim signature | Reclaim attestor claim signature verification failed. |
| Transformer parse failure | The proof context or extracted parameters do not match the platform transformer's expected shape. |
| Verifier check fails | The observed payment does not satisfy the intent. |
