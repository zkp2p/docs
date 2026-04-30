---
id: private-orders
title: How to Set Up Trusted Takers with Peer Relayer
---

# How to Set Up Trusted Takers with Peer Relayer

Trusted Takers lets you restrict who can take liquidity on your deposit to specific wallet addresses. Useful for private orderbooks, OTC flows, and accepting [Peer Pay](https://pay.peer.xyz) checkout volume exclusively.

## Who is this for?

- Makers who want to restrict deposits to a known counterparty
- Makers who want to accept Peer Pay checkout volume without exposing liquidity to the public orderbook

## How to enable Trusted Takers on a new deposit

1. Start a new deposit at https://peer.xyz
2. In the create-deposit flow (Express or Advanced), toggle on **Trusted Takers**
3. Peer Relayer is added by default when you first enable the toggle. You can remove it if you only want custom addresses.
4. Add any additional taker addresses (EVM, `.eth`, or `.peer` supported)
5. Review and approve the deposit. After the deposit lands on-chain, follow-up transactions (`setDepositWhitelistHook` + `addToWhitelist`) fire automatically.

## Key behaviors

- Takers not on the whitelist see the deposit as unavailable in the orderbook
- The Peer Relayer entry adds the relayer address used by [Peer Pay](https://pay.peer.xyz) checkout
- Smart wallets that support atomic batching combine both whitelist setup transactions into a single on-chain transaction
- You can add or remove whitelisted addresses later from the Trusted Takers tab on the deposit detail page

## Common issues

- **Deposit created but whitelist empty:** Open the deposit detail page, go to the Trusted Takers tab, and re-add addresses manually
- **Address resolution failed:** ENS and `.peer` names require the wallet to be connected to a chain that can resolve them. Paste a raw EVM address if resolution fails.
