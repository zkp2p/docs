---
id: v2-ipaymentverifier
title: IPaymentVerifier
---

### Overview

The IPaymentVerifier interface contract verifies off-chain payment proofs. This enables on-chain actions (such as releasing escrowed funds) once a valid proof that a payment occurred is provided. Verifiers can be added to the Escrow which unlock new payment platforms and currencies that users can transact with

### Structs

```
struct VerifyPaymentData {
        bytes paymentProof;                     // Payment proof
        address depositToken;                   // Address of deposit token
        uint256 amount;                         // Amount of deposit token
        uint256 timestamp;                      // Timestamp of payment
        string payeeDetails;                    // Payee details
        bytes32 fiatCurrency;                   // Fiat currency
        uint256 conversionRate;                 // Conversion rate of deposit token to fiat currency
        bytes data;                             // Additional data
}
```

Additional data may include mail server key hash if using zkEmail, notary public key for TLSNotary or witness proxy for TLSProxy (Reclaim)

### External Functions

#### verifyPayment

```
function verifyPayment(
    IPaymentVerifier.VerifyPaymentData calldata _verifyPaymentData
)
    external
    override
    returns (bool, bytes32)
```

Description: Override function that must be implemented when adding a new Verifier. The `escrow` contract calls this method to confirm that a payment was indeed made according to the provided proof. If successful:

-   The payment is nullified (cannot be claimed again).

-   Returns a boolean indicating success and the `intentHash`.
