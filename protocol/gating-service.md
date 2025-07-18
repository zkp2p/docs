---
id: gating-service
title: Gating Service
---

The Gating Service is a periphery service that acts as a trusted relayer of identity verification and payment details offchain. The Gating Service does not have access to seller or buyer funds. All actions that the service conducts can be verifiably checked by either party to prevent undetected malicious behavior.

The Gating Service has 2 roles

1.  Gate [signalIntent](https://docs.zkp2p.xyz/developer/smart-contracts/escrow#signalintent) on behalf of the seller to only allow specified wallets from transacting with the seller liquidity. The Gating Service performs validations on the wallet address and other metadata and if buyer passes, then sign the intent with an ECDSA private key and return the seller payment data for buyer to send to. Anyone can create a gating service / relayer for different purposes if they do not want to use ZKP2P's default relayer. E.g. a relayer that requires KYC for large OTC trades, a relayer to gate for members of a specific community. Users can choose not to interact with a relayer and use the blockchain as a DB as well.

2.  Store offchain payment identifiers (e.g. Venmo User ID) in the [deposit flow](https://docs.zkp2p.xyz/developer/smart-contracts/escrow) for sellers to introduce a layer of privacy to the blockchain

![](https://docs.zkp2p.xyz/~gitbook/image?url=https%3A%2F%2F3629680097-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F6e2L3XxfmJSq8oZRw1gA%252Fuploads%252FjcATRW7pdKrKl5V1fp1B%252Fv2_protocol_2.png%3Falt%3Dmedia%26token%3Dc37542bc-48f8-43f3-a166-0f4cd69e3dfe&width=768&dpr=4&quality=100&sign=8905f623&sv=2)

### API Reference

Our current gating service API is hosted at api.zkp2p.xyz. Check out the docs:

[Swagger UI](https://api.zkp2p.xyz/docs)