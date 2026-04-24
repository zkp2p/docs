---
title: Smart Contracts
---

# Smart Contracts

[](https://docs.peer.xyz/developer/smart-contracts#escrow)

## Escrow

The `Escrow` contract orchestrates interactions between actors in the ecosystem. It manages user registrations, deposits, and transaction intents, and uses Zero-Knowledge Proofs for validation. It also provides dispute resolution, instant verification, and governance controls to maintain a secure and trustless environment for P2P transactions.

[](https://docs.peer.xyz/developer/smart-contracts#verifiers)

## Verifiers

Verifiers check and process on-chain proof of off-chain transactions, ensuring they conform to specified protocols. They validate transaction amount, timestamp, recipient ID, and intent hash before the system processes the transaction.

Verifiers conform to a `BasePaymentVerifier` [specification](https://github.com/zkp2p/zkp2p-v2-contracts/tree/main/contracts/verifiers/BaseVerifiers).

[](https://docs.peer.xyz/developer/smart-contracts#nullifier-registry)

## Nullifier Registry

The `NullifierRegistry` is a smart contract that records unique identifiers (nullifiers) to prevent duplication in actions like user registrations. It controls writer permissions for adding nullifiers and offers transparent logging of these actions through emitted events.
