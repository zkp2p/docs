---
title: Smart Contracts
---

# 📜 Smart Contracts

[](https://docs.zkp2p.xyz/developer/smart-contracts#escrow)

## Escrow

The `Escrow` contract is designed to orchestrate the interaction between different actors in the ecosystem. It manages user registrations, deposits, and transaction intents, and employs Zero-Knowledge Proofs for validation purposes. Additionally, it provides mechanisms for dispute resolution, instant verification, and governance controls to maintain system integrity and ensure a secure and trustless environment for P2P transactions.

[](https://docs.zkp2p.xyz/developer/smart-contracts#verifiers)

## Verifiers

The Verifiers are contracts designed to verify and process on-chain proof of off-chain transactions, ensuring they conform to specified protocols. It validates various elements of the transactions including transaction amount, timestamp, recipient ID and intent hash. Through these validations, it facilitates secure transaction processing in the system.

Verifiers conform to a `BasePaymentVerifier` [specification](https://github.com/zkp2p/zkp2p-v2-contracts/blob/main/contracts/verifiers/BasePaymentVerifier.sol). For an example of an implemented payment verifier, please check [here](https://github.com/zkp2p/zkp2p-v2-contracts/blob/main/contracts/verifiers/VenmoReclaimVerifier.sol).

[](https://docs.zkp2p.xyz/developer/smart-contracts#nullifier-registry)

## Nullifier Registry

The `NullifierRegistry` is a smart contract that records unique identifiers (nullifiers) to prevent duplication in actions like user registrations. It controls writer permissions for adding nullifiers and offers transparent logging of these actions through emitted events.