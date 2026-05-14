---
id: v3-seller-automated-release
title: Seller Automated Release
---

# Seller Automated Release

## TEE

Seller Automated Release (SAR) is an enclave-resident verification flow. Seller credential material is encrypted to an upload key that is generated inside the AWS Nitro Enclave. The enclave validates that credential material against the payment platform, converts it into an encrypted bundle, and later uses the bundle to verify payments and sign a V3 `PaymentAttestation`.

The important primitive is the TEE boundary: plaintext seller credentials are only available inside the measured enclave process.

## Enclave Responsibilities

| Responsibility | Detail |
|---|---|
| Generate upload key | The enclave generates an RSA seller-upload key at startup. The private key stays in enclave memory. |
| Prove the upload key | The public upload key is embedded in the Nitro attestation document so clients can verify it before encryption. |
| Decrypt uploads | Seller credential uploads are compact JWE payloads encrypted to the attested upload key. |
| Validate credentials | The enclave uses the uploaded material to prove live access to the claimed payment account. |
| Encrypt bundles | Validated credentials are encrypted with a per-bundle AES-256-GCM key wrapped by AWS KMS. |
| Verify payments | The enclave decrypts the bundle in memory, queries the platform, normalizes the payment, and runs verifier checks. |
| Sign attestations | The enclave signs the final EIP-712 `PaymentAttestation` for on-chain settlement. |

## Nitro Verification Package

Clients should use `@zkp2p/zkp2p-attestation` to verify the Nitro attestation document before encrypting seller credentials.

```bash
npm install @zkp2p/zkp2p-attestation
```

The package verifies nonce binding, freshness, the AWS Nitro certificate chain, the COSE signature, and the trusted PCR8 pin. It then extracts the enclave's attested seller-upload public key.

```ts
import { createNitroAttestationClient } from "@zkp2p/zkp2p-attestation";

const nitro = createNitroAttestationClient({
  environment: "staging", // or "production"
});

const verified = await nitro.fetchAndVerifyAttestation();

console.log(verified.attestedSellerUploadKey.publicKeySha256Hex);
console.log(verified.payload.pcr8Hex);
```

For the normal upload path, the package can verify the enclave and create the compact JWE in one call:

```ts
const encryptedUpload = await nitro.createEncryptedSellerCredentialUpload({
  payeeId: "1130030979",
  sessionMaterial: {
    apiToken: "<wise-api-token>",
    profileId: "41246868",
    balanceId: "61249083",
    currency: "EUR",
  },
});
```

Advanced callers can split verification from encryption within a single session:

```ts
const verified = await nitro.fetchAndVerifyAttestation();

const encryptedUpload = await nitro.encryptSellerCredentialUpload({
  key: verified.attestedSellerUploadKey,
  payeeId: "1130030979",
  sessionMaterial: {
    apiToken: "<wise-api-token>",
    profileId: "41246868",
    balanceId: "61249083",
    currency: "EUR",
  },
});
```

Do not cache the attested upload key across enclave restarts. A restart generates a new upload key, and ciphertext sealed to the old key fails closed.

## Upload Sealing

Seller credential material is sealed as compact JWE with:

| Layer | Value |
|---|---|
| Key management | `RSA-OAEP-256` |
| Content encryption | `A256GCM` |
| Recipient key | Seller-upload public key from the verified Nitro document |

The encrypted plaintext includes:

| Field | Purpose |
|---|---|
| `payeeId` | Platform-native seller recipient identifier. |
| `sessionMaterial` | Platform-specific credential material. |
| `boundPubKeySha256` | SHA-256 of the attested DER SPKI upload key. |
| `issuedAtMs` | Upload freshness timestamp. |
| `jweId` | Unique replay-rejection identifier. |

The enclave rejects uploads that are stale, replayed, or bound to a different upload key.

## Credential Bundle Encryption

After live validation, the enclave encrypts the credential into a reusable bundle.

| Bundle layer | Mechanism |
|---|---|
| Data encryption key | Fresh AES-256 key from AWS KMS `GenerateDataKey`. |
| Credential ciphertext | AES-256-GCM over `{ payeeId, credential }`. |
| Wrapped key | KMS ciphertext blob for later enclave decrypt. |
| Bundle signature | EIP-712 signature over the encrypted bundle fields. |
| Validation timestamp | `credentialValidatedAt`, sampled immediately after platform validation succeeds. |

The plaintext data encryption key is zeroed after use. Later verification unwraps the KMS-wrapped key, decrypts the bundle in memory, and discards plaintext after the platform lookup.

## In-Enclave Verification

During payment verification, the enclave performs:

```text
1. KMS unwrap bundle key.
2. AES-GCM decrypt credential bundle.
3. Check keccak256(decryptedPayeeId) against the intent payee hash.
4. Query the payment platform with the seller credential material.
5. Normalize the payment into method, payee, amount, currency, timestamp, and payment id.
6. Run UnifiedPaymentVerifier checks.
7. Sign the EIP-712 PaymentAttestation.
```

The key binding is:

```text
keccak256(decryptedPayeeId) == intent.payeeDetails
```

This binds the decrypted credential to the seller identity in the intent.

## Verifier Checks

| Check | Requirement |
|---|---|
| Payment method | Observed platform hash matches `intent.paymentMethod`. |
| Fiat currency | Observed currency hash matches `intent.fiatCurrency`. |
| Payee | Decrypted payee hash matches `intent.payeeDetails`. |
| Timestamp | Payment timestamp plus policy buffer is greater than or equal to intent timestamp. |
| Intent hash | Payment evidence is bound to the requested intent hash. |
| Conversion rate | Intent conversion rate is positive. |
| Amount | Observed payment amount is positive. |

Release amount:

```text
min(paymentAmount * 10^18 * 10^4 / conversionRate, intentAmount)
```

`paymentAmount` is in fiat minor units. The `10^4` factor adjusts fiat cents into 6-decimal USDC units.

## Supported Credential Types

| Platform | Credential material | Payee identifier |
|---|---|---|
| `venmo` | Session cookie bundle and request headers. | Venmo account id. |
| `cashapp` | Session cookie bundle, headers, and request payload hints. | Cashtag without leading `$`. |
| `wise` | Personal API token, profile id, balance id, and currency. | Wise multi-currency-account recipient id. |
| `paypal` | Gmail OAuth mailbox evidence for PayPal receiver emails. | Seller PayPal email address. |

## Failure Semantics

| Failure | Meaning |
|---|---|
| Nitro verification fails | The client must not encrypt credentials to that enclave. |
| Upload decrypt fails | The ciphertext was not sealed to the current enclave upload key or failed authentication. |
| Upload binding fails | The payload is stale, replayed, or bound to a different key. |
| Credential validation fails | The credential does not prove live access to the claimed payment account. |
| Bundle decrypt fails | The encrypted bundle has been corrupted, tampered with, or wrapped for incompatible KMS context. |
| Payee hash check fails | The decrypted credential does not belong to the intent payee. |
| Platform lookup fails | The enclave cannot prove the payment from the available seller-side data. |
| Verifier check fails | The observed payment does not satisfy the intent. |
