---
id: integrate-redirect-onramp
title: ZKP2P Redirect Integration
---

# ZKP2P Redirect Integration

:::info Try the demo
Try the demo at [https://demo.zkp2p.xyz](https://demo.zkp2p.xyz). Currently, redirect integration is only available on desktop.
:::

Integrate the ZKP2P onramp directly into your application by using our redirect flow. With a single link, you can offer your users fast and affordable onchain onboarding, complete with:

- Multiple payment platforms (Venmo, Revolut, Wise, Cash App)
- Supported blockchains (Base, Solana, Ethereum, Polygon, etc.)
- Supported assets (USDC, SOL, ETH, USDT, etc.)
- Gasless transactions

<div style={{textAlign: 'center'}}>
  <img src="/img/developer/Integration1.png" alt="Integration modal that user sees upon landing on zkp2p" width="400" />
  <p><em>Integration modal that user sees upon landing on zkp2p</em></p>
</div>

### Quickstart

Integration is simple:

1. Customize the query parameters in the URL.
2. Embed the link within your application.
3. Users will redirect to ZKP2P for seamless onramping
4. Users are redirected back to your site upon successful onramping

### Redirect URL Query Parameters

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

```
https://zkp2p.xyz/swap?
referrer=Rampy+Pay
&referrerLogo=https://demo.zkp2p.xyz/Rampy_logo.svg
&callbackUrl=https://demo.zkp2p.xyz
&toToken=8453:0x0000000000000000000000000000000000000000
&recipientAddress=0x84e113087C97Cd80eA9D78983D4B8Ff61ECa1929
```

#### Onramp 10 USD to Solana

```
https://zkp2p.xyz/swap?
referrer=Rampy+Pay
&referrerLogo=https://demo.zkp2p.xyz/Rampy_logo.svg
&callbackUrl=https://demo.zkp2p.xyz
&inputCurrency=USD
&inputAmount=10
&toToken=792703809:11111111111111111111111111111111
&recipientAddress=<insert-sol-address>
```

#### Onramp 10 EUR via Revolut to Mainnet ETH

:::note
Payment platform is not enforced. Upon landing on zkp2p the user can chose to select a different payment platform to complete the flow.
:::

```
https://zkp2p.xyz/swap?
referrer=Rampy+Pay
&referrerLogo=https://demo.zkp2p.xyz/Rampy_logo.svg
&callbackUrl=https://demo.zkp2p.xyz
&inputCurrency=EUR
&inputAmount=10
&paymentPlatform=Revolut
&toToken=1:0x0000000000000000000000000000000000000000
&recipientAddress=0x84e113087C97Cd80eA9D78983D4B8Ff61ECa1929
```

#### Onramp Exact USDC Amount

Onramp exactly 1 USDC on Base to a recipient address. Users can choose their preferred currency and payment method. The best available quote is fetched and displayed so the user can complete the order.

:::note
- Exact amount output is currently only available for USDC and not for other tokens
- `amountUsdc` overrides any output token (`toToken`) and input (`inputAmount`) params
- `recipientAddress` is required for the exact output flow
:::

```
https://zkp2p.xyz/swap?
referrer=Rampy+Pay
&referrerLogo=https://demo.zkp2p.xyz/Rampy_logo.svg
&callbackUrl=https://demo.zkp2p.xyz
&amountUsdc=1000000
&recipientAddress=0x84e113087C97Cd80eA9D78983D4B8Ff61ECa1929
```

<div style={{textAlign: 'center'}}>
  <img src="/img/developer/Integration2.png" alt="Request instructions shown to user on zkp2p app" width="400" />
  <p><em>Request instructions shown to user on zkp2p app</em></p>
</div>

### Help?

For any issues or support, reach out to [ZKP2P Team](mailto:team@zkp2p.xyz).
