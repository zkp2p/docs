---
id: build-new-provider
title: Build a New Provider
---

## Overview

ZKP2P is an open and permissionless protocol. We've now made it very easy for any developer around the world to get started building a new payment integration on ZKP2P. To build a new integration for your local payment platform, you will need to implement

1.  A zkTLS provider template to generate a proof of payment

2.  A verifier contract in Solidity

If you have any questions please do not hesitate to contact us on [Telegram](https://t.me/zk_p2p/4710)

[](https://docs.zkp2p.xyz/developer/build-a-new-provider#id-1.-build-a-zktls-provider-template)

## 1. Build a zkTLS Provider Template

We've built a developer tool ([developer.zkp2p.xyz](https://developer.zkp2p.xyz/)) to make it very simple for developers to create and test new payment providers. To get started, follow the instructions in the [README](https://github.com/zkp2p/providers)

Testing a new integration on developer.zkp2p.xyz

[](https://docs.zkp2p.xyz/developer/build-a-new-provider#id-2.-create-a-verifier-contract)

## 2. Create a Verifier contract

The verifier contract extracts and validates that the payment proof data. Simply implement the [IPaymentVerifier interface](https://github.com/zkp2p/zkp2p-v2-contracts/blob/main/contracts/verifiers/interfaces/IPaymentVerifier.sol). Look at the example verifiers as reference

Get started in the [ZKP2P V2 contracts](https://github.com/zkp2p/zkp2p-v2-contracts) repo

[](https://docs.zkp2p.xyz/developer/integrate-zkp2p/zkp2p-offramp-integration)

