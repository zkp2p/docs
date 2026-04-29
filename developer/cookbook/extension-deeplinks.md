---
id: extension-deeplinks
title: Extension Deeplinks
---

# Extension Deeplinks

## What this covers

How to open the Peer extension onramp with prefilled params, resume an active intent, and open common side-panel routes.

## When to use this

Use this when your product wants the Peer extension to own the final funding UX while your app supplies the destination, amount, and branding.

:::note Browser requirement
`peerExtensionSdk` requires a browser window with the Peer extension installed. If you need a mobile handoff, mirror the same params in your app layer and keep the desktop path on `peerExtensionSdk.onramp()`.
:::

## Open the onramp with prefilled params

```ts
import { createPeerExtensionSdk } from '@zkp2p/sdk';

const peerSdk = createPeerExtensionSdk({ window });

peerSdk.onramp({
  referrer: 'Acme Wallet',
  referrerLogo: 'https://acme.xyz/logo.png',
  inputCurrency: 'USD',
  inputAmount: '25',
  paymentPlatform: 'wise',
  toToken: '8453:0x0000000000000000000000000000000000000000',
  recipientAddress: '0x0000000000000000000000000000000000000001',
});
```

Use:

- `inputAmount` when the user thinks in fiat
- `amountUsdc` when you want an exact Base USDC output amount in base units
- `intentHash` when you want to reopen an already-created order at the payment step

## Resume an active intent

```ts
peerSdk.onramp({
  intentHash: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
});
```

This is useful if your UI stores active orders and offers a "continue payment" button.

## Open common side-panel routes

The extension supports direct route opens through `openSidebar(route)`.

```ts
peerSdk.openSidebar('/buy');
peerSdk.openSidebar('/send');
peerSdk.openSidebar('/verify');
peerSdk.openSidebar('/proofs');
```

Use `openSidebar()` when you want a specific extension view without constructing a full onramp payload.

## Check compatibility first

```ts
const version = await peerSdk.getVersion();
console.log('peer extension version:', version);
```

This is useful when you need to gate new UI behind a minimum extension version.

## `toToken` format

`toToken` is always:

```text
chainId:tokenAddress
```

Examples:

- Base ETH: `8453:0x0000000000000000000000000000000000000000`
- Base USDC: `8453:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`
- Ethereum ETH: `1:0x0000000000000000000000000000000000000000`
- Solana SOL: `792703809:11111111111111111111111111111111`

## Key points

- Register `onIntentFulfilled()` before calling `onramp()`
- Prefer a scoped client from `createPeerExtensionSdk({ window })` instead of relying on the default singleton
- Use `intentHash` to resume flows and `openSidebar()` to jump to a known route
- Keep mobile handoff logic outside the SDK; the SDK wrapper itself is desktop-extension-first
