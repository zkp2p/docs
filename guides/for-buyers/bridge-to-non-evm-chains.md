---
id: bridge-to-non-evm-chains
title: Bridge USDC to Non-EVM Chains
---

Peer lets you convert USDC on Base to non-EVM cryptocurrencies. This uses the NEAR Intents cross-chain bridge powered by the 1Click API.

## Supported Destination Chains

| Chain | Token | Address Format |
|-------|-------|---------------|
| Zcash | ZEC | Transparent (`t1...`/`t3...`) or Sapling shielded (`zs1...`) |
| Dogecoin | DOGE | Starts with `D`, 34 characters |
| Litecoin | LTC | Starts with `L`/`M`/`ltc1` |
| XRP | XRP | Starts with `r`, 25-35 characters |
| Cardano | ADA | Starts with `addr1` |
| Dash | DASH | Starts with `X`, 34 characters |

## How to Bridge

1. Open the Peer app at `app.peer.xyz`.
2. Select the destination chain from the bridge dropdown.
3. Enter the amount of USDC to bridge.
4. Paste your destination chain address.
5. Review the quote, including the estimated output amount and completion time.
6. Confirm the swap.
7. Wait for completion. The bridge typically takes 2-10 minutes depending on the destination chain.
8. Track status in the app until the swap shows as complete.

## Fees

The bridge charges a 0.95% fee on each swap. This is included in the quoted output amount.

## Troubleshooting

:::warning
- **Failed swaps:** If a swap fails, funds are automatically refunded to your Base wallet address.
- **Slow completion:** Bridge times vary by chain. If a swap takes longer than expected, check the status in the app.
- **Invalid address:** Double-check your destination address format matches the chain requirements above.
:::
