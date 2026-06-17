---
id: gating-service
title: Gating Service
---

The Gating Service is a periphery service that acts as a trusted relayer of identity verification and payment details offchain. The Gating Service does not have access to seller or buyer funds. Either party can verifiably check all service actions to prevent undetected malicious behavior.

The Gating Service has 2 roles

1.  Gate signalIntent on behalf of the seller to only allow specified wallets from transacting with the seller liquidity. The Gating Service performs validations on the wallet address and other metadata and if buyer passes, then sign the intent with an ECDSA private key and return the seller payment data for buyer to send to. Anyone can create a gating service / relayer for different purposes if they do not want to use ZKP2P's default relayer. E.g. a relayer that requires KYC for large OTC trades, a relayer to gate for members of a specific community. Users can choose not to interact with a relayer and use the blockchain as a DB as well.

2.  Store offchain payment identifiers (e.g. Venmo User ID) in the deposit flow for sellers to introduce a layer of privacy to the blockchain

### On-Chain Pre-Intent Hooks

V3 also supports on-chain deposit-level access control via pre-intent hooks on OrchestratorV2. These provide an alternative or complement to the off-chain gating service:

- **SignatureGatingPreIntentHook**: Requires an EIP-191 signature from a configurable signer per deposit — similar to the off-chain gating service but enforced on-chain.
- **WhitelistPreIntentHook**: Restricts intents to a whitelisted set of taker addresses per deposit and payment method.

See [Pre-Intent Hooks](/protocol/v3/smart-contracts/pre-intent-hooks) for details.

### API Reference

Our current gating service API is hosted at `https://api.zkp2p.xyz`. SDK clients should pass this as the root `baseApiUrl`; do not append `/v1`, `/v2`, or `/v3`.

### Curator maker and credential routes

The same API host also exposes curator routes used by the SDK for maker payee registration and Seller Autopilot credential storage.

| Route | Method | Purpose |
| --- | --- | --- |
| `/v2/makers/create` | `POST` | Register or recover maker payee details from `{ processorName, offchainId, telegramUsername?, metadata? }` and return `hashedOnchainId`. This route does not require SDK auth headers. |
| `/v2/makers/{processorName}/{payeeDetails}/seller-credential` | `POST` | Store an encrypted seller credential bundle under a platform and hashed payee details. |
| `/v2/makers/{processorName}/{payeeDetails}/seller-credential/google-oauth` | `POST` | Upload a PayPal or Venmo Google OAuth seller credential through curator's encryption path. |
| `/v2/makers/{processorName}/{payeeDetails}/seller-credential/status` | `GET` | Read public seller credential status. The response is keyed by platform and payee hash, not maker id. |
| `/v2/verify/seller/{platform}` | `POST` | Internal seller-credential proxy used by Seller Autopilot verification. |

`payeeDetails` is the bytes32 hash returned as `hashedOnchainId` by `/v2/makers/create` or derived inside the enclave for Wise. SDK helpers verify that an encrypted credential bundle's `payeeIdHash` matches the curator-registered `hashedOnchainId` before storing the bundle.

Venmo identity registration is not a curator credential-storage request. First request an identity attestation from the Attestation Service `POST /identity` with `platform: "venmo"`, `actionType: "register_venmo"`, `callerAddress`, encrypted session material containing only a replayable `Cookie`, and public `params.SENDER_ID`. Then submit the returned `IdentityAttestation` to the registration flow that requires it.
