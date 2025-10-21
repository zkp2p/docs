---
id: gating-service
title: Gating Service
---

The Gating Service is a periphery service that acts as a trusted relayer of identity verification and payment details offchain. The Gating Service does not have access to seller or buyer funds. All actions that the service conducts can be verifiably checked by either party to prevent undetected malicious behavior.

The Gating Service has 2 roles

1.  Gate signalIntent on behalf of the seller to only allow specified wallets from transacting with the seller liquidity. The Gating Service performs validations on the wallet address and other metadata and if buyer passes, then sign the intent with an ECDSA private key and return the seller payment data for buyer to send to. Anyone can create a gating service / relayer for different purposes if they do not want to use ZKP2P's default relayer. E.g. a relayer that requires KYC for large OTC trades, a relayer to gate for members of a specific community. Users can choose not to interact with a relayer and use the blockchain as a DB as well.

2.  Store offchain payment identifiers (e.g. Venmo User ID) in the deposit flow for sellers to introduce a layer of privacy to the blockchain

### API Reference

Our current gating service API is hosted at api.zkp2p.xyz. Check out the docs: [API](https://docs.zkp2p.xyz/developer/api/onramp-integration)

# Gating Service (V3)

The Gating Service authorizes buyers to take a seller’s liquidity and returns a signature bound to deposit/payment parameters. In V3, the Curator v2 endpoint accepts a richer request to reduce round-trips and bind more context into the signature.

Endpoint
- `POST /v2/verify/intent` (Curator)

Request (shape)
```
{
  "processorName": "venmo",
  "depositId": "123",
  "amount": "98000000",                    // token amount (destination token decimals)
  "toAddress": "0xRecipient",
  "payeeDetails": "0x…",                   // bytes32 hashed off-chain payee id
  "paymentMethod": "0x…",                  // bytes32 (keccak256("venmo"))
  "fiatCurrency": "0x…",                   // bytes32 (keccak256("USD"))
  "conversionRate": "1000000000000000000", // 1e18-scaled
  "chainId": "8453",
  "orchestratorAddress": "0x…",
  "escrowAddress": "0x…"
}
```

Response (shape)
```
{
  "signedIntent": "0x…", // gating signature
  "intentData": {
    "orchestratorAddress": "0x…",
    "escrowAddress": "0x…",
    "depositId": "123",
    "amount": "98000000",
    "recipientAddress": "0xRecipient",
    "paymentMethod": "0x…",
    "fiatCurrency": "0x…",
    "conversionRate": "1000000000000000000",
    "signatureExpiration": "1700000005000", // ms since epoch
    "chainId": "8453",
    "gatingServiceSignature": "0x…"
  },
  "depositData": {
    // provider-specific info if needed
  }
}
```

How it’s used on-chain
- Pass `gatingServiceSignature` and `signatureExpiration` into `Orchestrator.signalIntent` along with `depositId`, `amount`, `to`, `paymentMethod`, `fiatCurrency`, and `conversionRate`.
- The Orchestrator verifies the signature against the deposit’s configured gating service and rejects expired signatures.

Notes
- `paymentMethod` and `fiatCurrency` must be the on-chain byte32 hashes used by the seller’s deposit; the signature binds to them.
- `payeeDetails` is the hashed off-chain recipient id. On fulfillment, the attestation’s `PaymentDetails.payeeId` must match `payeeDetails` in the snapshot.
