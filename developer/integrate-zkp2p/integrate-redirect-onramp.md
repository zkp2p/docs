---
id: integrate-redirect-onramp
title: Onramp Integration
---

# Onramp Integration

:::info Try the demo
Try the demo at [https://demo.zkp2p.xyz](https://demo.zkp2p.xyz). This flow requires the Peer extension and is only available on desktop.
:::

Integrate the ZKP2P onramp directly into your application by using the Peer extension deeplink flow. Simply request a connection and open the onramp in the extension side panel with `window.peer.onramp()`. With a single call, you can offer your users fast onchain onboarding, complete with:

- Multiple payment platforms (Venmo, Revolut, Wise, Cash App and many more)
- Supported blockchains (Base, Solana, Ethereum, Polygon, Hyperliquid, Arbitrum and 20+ chains)
- Supported assets (USDC, SOL, ETH, USDT, etc.)
- Gasless transactions

<div style={{textAlign: 'center'}}>
  <img src="/img/developer/Integration1.png" alt="Onramp modal shown in the Peer side panel" width="400" />
  <p><em>Onramp modal shown in the Peer side panel</em></p>
</div>

### Quickstart

Integration is simple:

1. Open https://chromewebstore.google.com/detail/peerauth-authenticate-and/ijpgccednehjpeclfcllnjjcmiohdjih and install the Peer extension. After install, it will redirect back to the original tab.
2. Ensure `window.peer` is available.
3. Request a connection to the extension with `window.peer.requestConnection()`.
4. Build your deeplink query params.
5. Call `window.peer.onramp()` with the query string to open the side panel.

```ts
const waitForPeer = () =>
  new Promise<void>((resolve) => {
    if (window.peer) return resolve();
    window.addEventListener('peer#initialized', () => resolve(), { once: true });
  });

await waitForPeer();
const approved = await window.peer.requestConnection();
if (!approved) {
  throw new Error('Peer connection not approved');
}

const params = new URLSearchParams({
  referrer: 'Rampy Pay',
  referrerLogo: 'https://demo.zkp2p.xyz/Rampy_logo.svg',
  callbackUrl: 'https://demo.zkp2p.xyz',
  inputCurrency: 'USD',
  inputAmount: '10',
  paymentPlatform: 'venmo',
  toToken: '8453:0x0000000000000000000000000000000000000000',
  recipientAddress: '0x84e113087C97Cd80eA9D78983D4B8Ff61ECa1929',
});

window.peer.onramp(`?${params.toString()}`);
```

### Deeplink Query Parameters

Pass these parameters as a query string to `window.peer.onramp()`. You can pass the string with or without a leading `?`.

| Parameter | Description | Type | Example |
|-----------|-------------|------|---------| 
| `referrer` | (Required) Your application name | String | `referrer=Rampy` |
| `referrerLogo` | (Recommended) Your application logo | String | `referrerLogo=https://<logo-link>` |
| `callbackUrl` | (Recommended) URL to which users are redirected after successful onramp | String | `callbackUrl=https://<your-app>/<success>` |
| `inputCurrency` | (Optional) Input currency user wants to swap. Defaults to users's national currency or USD. | String | `inputCurrency=USD` |
| `inputAmount` | (Optional) Amount of input currency the user wants to swap | Number (upto 2 decimal places) | `inputAmount=12.34` |
| `paymentPlatform` | (Optional) Payment platform user will onramp from | String | `paymentPlatform=venmo` |
| `amountUsdc` | (Optional) Amount of output USDC the user wants to ramp to. Include 6 decimal places. | String | `amountUsdc=1000000` |
| `toToken` | (Optional) Output token the user will onramp to | String (Has to be in the format explained below) | `toToken=8453:0x0000000000000000000000000000000000000000` |
| `recipientAddress` | (Optional) Address to which the output tokens will be sent. | String | `recipientAddress=0xf39...66` |

### To Token

The `toToken` parameter specifies the destination chain and token in a single string, using the format:

```
chainId:tokenAddress
```

- **chainId** — The numeric Chain ID of the target network, below is the current list of supported chains.

| Chain | chainID |
|:-------------:|:---------:|
| Base | 8453 |
| Solana | 792703809 |
| Polygon | 137 |
| BNB | 56 |
| Avalanche | 43114 |
| FlowEVM | 747 |
| Arbitrum | 42161 |
| HyperEVM | 999 |
| Hyperliquid | 1337 |
| Scroll | 534352 |
| Ethereum | 1 |

- **tokenAddress** — The on‑chain token address:
  - For EVM chains, include the full 0x‑prefixed address (use the zero address `0x0000…0000` for native currency).
  - For non‑EVM chains (e.g. Solana), use the native token's base‑58 address.

- **Base ETH:** `8453:0x0000000000000000000000000000000000000000`
- **Solana SOL:** `792703809:11111111111111111111111111111111`
- **Ethereum Mainnet ETH:** `1:0x0000000000000000000000000000000000000000`
- **Avalanche USDC:** `43114:0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e`
- **Hyperliquid USDC:** `1337:0x0000000000000000000000000000000000000000`

### Examples

#### Onramp to Base ETH

```ts
const params = new URLSearchParams({
  referrer: 'Rampy Pay',
  referrerLogo: 'https://demo.zkp2p.xyz/Rampy_logo.svg',
  callbackUrl: 'https://demo.zkp2p.xyz',
  toToken: '8453:0x0000000000000000000000000000000000000000',
  recipientAddress: '0x84e113087C97Cd80eA9D78983D4B8Ff61ECa1929',
});

window.peer.onramp(`?${params.toString()}`);
```

#### Onramp 10 USD to Solana

```ts
const params = new URLSearchParams({
  referrer: 'Rampy Pay',
  referrerLogo: 'https://demo.zkp2p.xyz/Rampy_logo.svg',
  callbackUrl: 'https://demo.zkp2p.xyz',
  inputCurrency: 'USD',
  inputAmount: '10',
  toToken: '792703809:11111111111111111111111111111111',
  recipientAddress: '<insert-sol-address>',
});

window.peer.onramp(`?${params.toString()}`);
```

#### Onramp 10 EUR via Revolut to Mainnet ETH

:::note
Payment platform is not enforced. After opening the onramp in the side panel, the user can choose a different payment platform to complete the flow.
:::

```ts
const params = new URLSearchParams({
  referrer: 'Rampy Pay',
  referrerLogo: 'https://demo.zkp2p.xyz/Rampy_logo.svg',
  callbackUrl: 'https://demo.zkp2p.xyz',
  inputCurrency: 'EUR',
  inputAmount: '10',
  paymentPlatform: 'Revolut',
  toToken: '1:0x0000000000000000000000000000000000000000',
  recipientAddress: '0x84e113087C97Cd80eA9D78983D4B8Ff61ECa1929',
});

window.peer.onramp(`?${params.toString()}`);
```

#### Onramp Exact USDC Amount

Onramp exactly 1 USDC on Base to a recipient address. Users can choose their preferred currency and payment method. The best available quote is fetched and displayed so the user can complete the order.

:::note
- Exact amount output is currently only available for USDC and not for other tokens
- `amountUsdc` overrides any output token (`toToken`) and input (`inputAmount`) params
- `recipientAddress` is required for the exact output flow
:::

```ts
const params = new URLSearchParams({
  referrer: 'Rampy Pay',
  referrerLogo: 'https://demo.zkp2p.xyz/Rampy_logo.svg',
  callbackUrl: 'https://demo.zkp2p.xyz',
  amountUsdc: '1000000',
  recipientAddress: '0x84e113087C97Cd80eA9D78983D4B8Ff61ECa1929',
});

window.peer.onramp(`?${params.toString()}`);
```

<div style={{textAlign: 'center'}}>
  <img src="/img/developer/Integration2.png" alt="Request instructions shown in the Peer side panel" width="400" />
  <p><em>Request instructions shown in the Peer side panel</em></p>
</div>

### Help?

For any issues or support, reach out to [ZKP2P Team](mailto:team@zkp2p.xyz).
