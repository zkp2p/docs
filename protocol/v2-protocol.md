---
id: developer-v2-protocol
title: The ZKP2P V2 Protocol
---

# The ZKP2P V2 Protocol

## Introduction

The ZKP2P V2 Protocol enables trust minimized and fully noncustodial buying and selling of any offchain digital asset (e.g. fiat currencies) for any onchain asset (e.g. USDC, Ethereum, Solana). The protocol functions as a set of onchain smart contracts that escrows and unlocks tokens upon satisfaction of a predefined predicate (i.e. proof of web2 payment). These predicates can be defined in the form of any cryptographic primitive whether proxy-TLS (zkTLS), MPC-TLS (TLSNotary), zkEmail or TEEs.

# Why ZKP2P V2?

With ZKP2P V1, we launched the first ever trust minimized fiat to crypto on/offramp in production, enabling swaps between USD in Venmo, EUR in Revolut and INR in HDFC Bank for USDC. These swaps were powered by ZK proofs using the [zkEmail](https://prove.email/) library. V1 intended to be an alpha proof of concept which explored and pushed the edge of what could be done by bringing valuable web2 data for use onchain in a privacy preserving and verifiable way, while solving the biggest pain point that exists in crypto.

ZKP2P V2 is a doubling down of this vision to create an exchange that enables fast, cheap, low fraud and DeFi composable swaps between offchain and onchain assets. V2 extends upon V1 and solves many of its limitations including:

1. Complex user flows
2. Fragmentation of liquidity
3. Difficulty for external integrations directly at the protocol layer
4. No optional identity verification layer to unlock higher limits
5. Proving speed

# Solution
1. ZKP2P V2 is a set of generic escrow smart contracts, crypto primitives and supporting relayers and interfaces that enable seamless exchange between web2 and web3. The protocol now supports the following:
2.Generic to any payment platform and fiat currency as long as the platform uses a server
3. Optional identity verification service for sellers to enable higher limits. Some sellers may want to limit which buyers can transact with them, which is now handled by this service
4. Privacy of payment identifier. Previously, payments IDs were stored onchain, these have been moved to a offchain relayer role. Funds are always escrowed onchain and are not accessible to anyone else
5. Capital efficiency for sellers. Sellers can specify all fiat and platforms they are willing to receive payment in supported in the protocol for their deposited liquidity. This is in contrast to providing liquidity for each pool by itself
6. Supports any cryptographic primitives including TEEs. Cryptographic primitives have been evolving rapidly and will continue to do so, therefore, the protocol must adapt to be able to support any primitive in the future
7. OAuth using a headless extension. V2 introduces a new extension based flow that mirrors OAuth while preserving privacy and expanding access to what can be authenticated
8. Composable. All transactions can be aggregated with rest of ecosystem such as bridging, swapping or minting.
9. Wallet and gas abstraction. The protocol now supports any third party to sponsor gas or provision a wallet for the user. The user does not even need to own an account abstracted wallet to transact.
10. Non custodial. V2 moves all logic that is not associated with fund transfers or custody to supporting relayers which decreases latency and steps for parties transacting in the protocol. While leveraging the blockchain for decentralization, and the non custodial nature of smart contracts. No one has access to user funds except themselves. And that will always remain the case

## User Flow
**Signal Intent:** The buyer indicates an intention to on-ramp by creating an order and specifying the amount of the onchain asset they wish to receive. Once the order is created, the corresponding offramper's liquidity is locked in escrow the buyer a period of time to complete the offchain payment and generate a proof of transaction.

**Perform Off-chain Payment.** Execute an offchain payment in fiat currency through the payment service to the designated seller

**Proof of Payment:** After payment, the buyer generates a proof of payment data and it's authenticity along with also extracting the following from the payment data:
- Off-ramper’s Off-chain payment ID
- Payment amount
- Payment timestamp
- Payment currency
- Other optional state (e.g. transaction status) to be handled by the Verifier

**Unlocking Escrow.** The smart contract checks the proof of payment along with the following to unlock the escrowed funds:
- Verification of the on-ramper’s intent
- Correspondence of the deposit to the correct off-ramper
- Adequacy of the payment amount
- Timing of the payment post-intent

Below is an illustrative example of a flow using MPC-TLS (TLSNotary) which can be extended to any crypto primitive.

![Protocol Overview](/img/developer/ZKP2PProtocolOverview.png)  

## The Tech Stack
**Escrow Protocol:** Smart contracts on the Ethereum blockchain enable trustless transactions and manage the logic of the protocol.

**Circuits / zkTLS protocol:** Cryptographic primitives that enable generation of private, secure and verifiable credentials to validate payments were made properly in a web2 context. Under the hood, these are proxy-TLS (Reclaim), MPC-TLS (TLSNotary), zkEmail and TEEs

**PeerAuth Extension / Appclip:**  Browser extension and mobile appclip that enables users to generate privacy preserving web proofs using any cryptographic primitive (zkTLS, TLSNotary, zkEmail etc) similar to OAuth

**Gating Service:**  Backend service that curates validates intents enabling sellers to only offer liquidity to users who pass any optional additional verification. Sellers trust the Gating Service to prevent buyers from submitting an intent to their liquidity if they haven't satisfied certain requirements (e.g. user identity). The gating service does not custody or touch funds ever. Conforms to a standard gating service specification as defined by the ZKP2P protocol.

**User Interface (UI):** The UI is the front-end through which users interact with the protocol.

## Supported Cryptographic Primitives

### ZK-Email Libraries
ZKP2P builds upon the 0xParc/PSE [zkEmail](https://prove.email/) libraries to enable proof generation related to the contents of payment confirmation emails. These libraries are essential for verifying transaction details without exposing private information.

### TLSNotary Libraries
ZKP2P utilizes [TLSNotary](https://tlsnotary.org/) for certain flows to enable TLS data to be used on-chain in a privacy preserving way.

### TLSProxy Libraries
ZKP2P V2 utilizes [Reclaim protocol's](https://reclaimprotocol.org/) proxy-TLS flow to verify payments.


