---
id: use-cases
title: What Can You Build?
slug: /use-cases
---

# What Can You Build?

## What this does

This page shows the main product shapes that external developers build on top of ZKP2P so you can pick the right starting point before you dive into the API surface.

## 1. Embedded onramp

Let users fund your product without leaving your app. This is the fastest path for wallets, games, trading apps, and consumer dapps that want a "Buy with Peer" button next to any action gated by token balance.

The usual SDK surface is `peerExtensionSdk.onramp()`, `peerExtensionSdk.onIntentFulfilled()`, `useGetTakerTier()`, and `getQuote()` when you want to preview liquidity before opening the extension.

Start with [Build an Onramp Widget](/developer/tutorials/onramp-widget) and [Onramp Integration](/developer/integrate-zkp2p/integrate-redirect-onramp).

## 2. Maker or liquidity bot

Run supply-side infrastructure that creates deposits, updates rates, watches for signaled intents, and manages liquidity over time. This is the right fit for market makers, treasury teams, and liquidity desks.

The usual SDK surface is `ensureAllowance()`, `registerPayeeDetails()`, `createDeposit()`, `addFunds()`, `withdrawDeposit()`, `client.indexer.getIntentsForDeposits()`, and `pruneExpiredIntents()`.

Start with [Build a Maker Bot](/developer/tutorials/maker-bot) and [Offramp Integration](/developer/offramp).

## 3. Vault dashboard

Build an analytics and control plane for delegated rate management. This is the right fit if you operate a vault, compare managers, or need a rate-history and PnL surface for depositors.

The usual SDK surface is `client.indexer.getRateManagers()`, `getRateManagerDetail()`, `getRateManagerDelegations()`, `getManagerDailySnapshots()`, `getProfitSnapshotsByDeposits()`, and `classifyDelegationState()`.

Start with [Build a Vault Dashboard](/developer/tutorials/vault-dashboard).

## 4. Payment integration

Add a new fiat rail to the ecosystem by building a provider template for PeerAuth and the mobile app. This is the right fit when you want to bring a new bank, payment app, or regional transfer method into ZKP2P.

The main surface is the provider/template layer rather than `Zkp2pClient`, but app teams still use the SDK later for quotes, intent handling, and fulfillment around that provider.

Start with [Build a Payment Integration](/developer/build-payment-integration).

## 5. Custom settlement logic

Add your own logic after fulfillment, such as bridging, splitting, or routing funds into another protocol. This is useful when a plain USDC receipt is not the final product experience you want.

The usual SDK surface is `signalIntent()`, `fulfillIntent()`, `postIntentHook`, `postIntentHookData`, and the protocol hook contracts.

Start with [Intent Hooks](/developer/api/v3/post-intent-hooks).

## 6. Analytics tools and explorers

Build search, reporting, and monitoring tools across deposits, intents, volumes, fund activity, and vault performance. This is the right fit for internal ops dashboards, public explorers, and BI pipelines.

The main surface is `client.indexer.*`, raw `query()` access, and the converter helpers such as `convertIndexerDepositToEscrowView()` and `convertDepositsForLiquidity()`.

Start with [Indexer Pagination & Filtering](/developer/cookbook/indexer-queries) and [Client Reference](/developer/sdk/client-reference).

## 7. Smart-account and wallet infrastructure

Support EIP-4337, batched user operations, relayers, and custom senders without giving up the ZKP2P flow. This is the right fit for wallets, account-abstraction stacks, and enterprise custody products.

The main surface is the prepared-transaction pattern: `signalIntent.prepare()`, `fulfillIntent.prepare()`, `prepareCreateDeposit()`, `useCreateVault()`, and `useVaultDelegation({ sendBatch })`.

Start with [Prepared Transactions](/developer/cookbook/prepared-transactions).

## Picking a starting doc

- Building a taker UX: start at [Quickstart](/developer/quickstart)
- Embedding a funding CTA: start at [Build an Onramp Widget](/developer/tutorials/onramp-widget)
- Supplying liquidity: start at [Build a Maker Bot](/developer/tutorials/maker-bot)
- Operating a vault: start at [Build a Vault Dashboard](/developer/tutorials/vault-dashboard)
- Looking up specific methods: keep [Client Reference](/developer/sdk/client-reference) open
