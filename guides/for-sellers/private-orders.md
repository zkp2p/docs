---
id: private-orders
title: How to Create Private Orders with Peer Pay
---

# How to Create Private Orders with Peer Pay

Private Orders let you restrict who can take liquidity on your deposit to specific wallet addresses. Useful for private orderbooks, OTC flows, and accepting Peer Pay checkout volume exclusively.

## Who is this for?

- Makers who want to restrict deposits to a known counterparty
- Makers who want to accept Peer Pay checkout volume without exposing liquidity to the public orderbook

## How to enable Private Orders on a new deposit

1. Start a new deposit at https://peer.xyz
2. In the create-deposit flow (Express or Advanced), toggle on **Private Orders**
3. Optionally click the **Peer Pay** quick-pick chip to whitelist the canonical Peer Pay relayer address
4. Add any additional taker addresses (EVM, `.eth`, or `.peer` supported)
5. Review and approve the deposit -- Private Orders follow-up transactions (`setDepositWhitelistHook` + `addToWhitelist`) will fire automatically after the deposit lands on-chain

## Key behaviors

- Takers not on the whitelist see the deposit as unavailable in the orderbook
- The Peer Pay chip adds the relayer address used by [Peer Pay](https://pay.zkp2p.xyz) checkout
- Wallets that support batching will run whitelist setup in a single transaction bundle
- You can add or remove whitelisted addresses later from the Private Liquidity tab after the deposit is live

## Common issues

- **Deposit created but whitelist empty:** Open the deposit detail page > Private Liquidity tab, and re-add addresses manually
- **Address resolution failed:** ENS and `.peer` names require the wallet to be connected to a chain that can resolve them. Paste a raw EVM address if resolution fails.
