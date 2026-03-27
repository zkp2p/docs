---
id: sdk-overview
title: SDK Overview
slug: /sdk
---

# SDK Overview

## What this does

`@zkp2p/sdk` is the TypeScript SDK for building with Peer. Use it to manage deposits, signal and fulfill intents, access quote and taker-tier APIs, work with vault and rate-manager flows, and embed the Peer extension onramp. The current npm release is `0.2.3` and is published under the MIT license.

## Who is this for?

| You are building... | Start here | Why |
| --- | --- | --- |
| A liquidity provider or off-ramp dashboard | [Offramp Integration](/developer/offramp) | Covers deposit creation, funding, and deposit management end to end |
| An app that wants to open the Peer extension onramp | [Onramp Integration](/developer/integrate-zkp2p/integrate-redirect-onramp) | Covers `peerExtensionSdk` and the extension deeplink flow |
| A custom taker flow, backend, or internal tool | [Client Reference](/developer/sdk/client-reference) | Covers `Zkp2pClient`, intents, quotes, vaults, helpers, and API-backed flows |
| A React app | [React Hooks](/developer/sdk/react-hooks) | Covers the `@zkp2p/sdk/react` hook layer for transaction UX |

## Installation

Install the core SDK with `viem`. Add `react` only if you plan to use the hooks package.

```bash
npm install @zkp2p/sdk viem
# or
yarn add @zkp2p/sdk viem
# or
pnpm add @zkp2p/sdk viem
# or
bun add @zkp2p/sdk viem
```

For hooks:

```bash
npm install react
# or
yarn add react
# or
pnpm add react
# or
bun add react
```

:::note
`viem` is a peer dependency. `react >= 16.8.0` is an optional peer dependency that is only required for `@zkp2p/sdk/react`.
:::

## Architecture

The SDK is built around RPC-first reads and contract-safe write helpers.

- Common reads such as `getDeposits()`, `getDeposit()`, `getIntents()`, and `getIntent()` use ProtocolViewer and on-chain state first, which helps avoid indexer lag for core flows.
- Advanced history and filtering live behind `client.indexer.*`, which gives you GraphQL-backed access to richer search, pagination, and fulfillment records.
- Write methods are split between deposit management, intent operations, and vault/rate-manager flows, with prepared-transaction support for relayers and smart accounts.

### Module map

| Module | What it covers | Start here |
| --- | --- | --- |
| `Zkp2pClient` | The canonical SDK client for reads, writes, and API-backed flows | [Client Reference](/developer/sdk/client-reference) |
| `peerExtensionSdk` | Peer extension detection, connection, and onramp deeplink helpers | [Onramp Integration](/developer/integrate-zkp2p/integrate-redirect-onramp) |
| `client.indexer` | Advanced deposit, intent, and fulfillment queries | [Client Reference](/developer/sdk/client-reference#indexer) |
| Contract helpers | `getContracts`, `getRateManagerContracts`, `getPaymentMethodsCatalog`, `getGatingServiceAddress` | [Client Reference](/developer/sdk/client-reference#contract-helpers) |
| Currency and payment helpers | `currencyInfo`, `resolveFiatCurrencyBytes32`, payment-method hash helpers | [Client Reference](/developer/sdk/client-reference#contract-helpers) |
| Attribution and fee helpers | ERC-8021 helpers and referrer fee validation utilities | [Client Reference](/developer/sdk/client-reference#referrer-fees) |
| React hooks | Transaction-oriented hooks for deposits, intents, and vaults | [React Hooks](/developer/sdk/react-hooks) |

### Entry points

- Import the core SDK from `@zkp2p/sdk`
- Import hooks from `@zkp2p/sdk/react`

:::info Naming note
`OfframpClient` is a re-export alias of `Zkp2pClient`. Both names work, but `Zkp2pClient` is the canonical class name used by the published typings and the docs on this page.
:::

## Quick start

```ts
import { Zkp2pClient } from '@zkp2p/sdk';
import { createWalletClient, custom } from 'viem';
import { base } from 'viem/chains';

const walletClient = createWalletClient({
  chain: base,
  transport: custom(window.ethereum),
});

const client = new Zkp2pClient({
  walletClient,
  chainId: base.id,
});

const deposits = await client.getDeposits();
console.log(deposits.length);
```

## Runtime and network selection

The current SDK docs assume Base. Deployment selection is controlled by `chainId` plus `runtimeEnv`.

| Target | `chainId` | `runtimeEnv` | Notes |
| --- | --- | --- | --- |
| Base production | `8453` | `production` | Default customer-facing deployment |
| Base preproduction | `8453` | `preproduction` | Production contracts with preproduction services |
| Base staging | `8453` | `staging` | Staging services and V2-first routing defaults |

## Recommended starting points

If you are new to the SDK, use this order:

1. Read [Offramp Integration](/developer/offramp) or [Onramp Integration](/developer/integrate-zkp2p/integrate-redirect-onramp) for an end-to-end flow.
2. Use [Client Reference](/developer/sdk/client-reference) to look up concrete methods, request shapes, and helper exports.
3. Use [React Hooks](/developer/sdk/react-hooks) if you want component-level loading, error, and transaction state.

## Help?

If you run into issues, join our [Discord](https://discord.gg/4hNVTv2MbH).
