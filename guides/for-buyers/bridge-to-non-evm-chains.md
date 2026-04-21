---
id: bridge-to-non-evm-chains
title: Bridge USDC to Non-EVM Chains
---

# Bridge USDC to Non-EVM Chains

Peer lets you convert USDC on Base to non-EVM cryptocurrencies using the NEAR Intents cross-chain bridge. Send USDC from your wallet and receive native crypto on the destination chain.

## Supported Chains

| Chain | Token | Address Format |
|-------|-------|---------------|
| Zcash | ZEC | Transparent (`t1...` / `t3...`) or Sapling shielded (`zs1...`) |
| Dogecoin | DOGE | Starts with `D`, 34 characters |
| Litecoin | LTC | Starts with `L`, `M`, or `ltc1` |
| XRP | XRP | Starts with `r`, 25-35 characters |
| Cardano | ADA | Starts with `addr1` |
| Dash | DASH | Starts with `X`, 34 characters |

## How to Bridge

### Step 1: Open the Bridge

Go to [app.peer.xyz](https://app.peer.xyz) and select the **Bridge** tab.

### Step 2: Select Destination Chain

Choose your destination chain from the dropdown (e.g. Zcash, Dogecoin, Litecoin).

### Step 3: Enter Amount

Enter the amount of USDC you want to bridge. The app displays a quote showing how much crypto you'll receive on the destination chain.

### Step 4: Enter Destination Address

Paste your destination chain wallet address. Make sure the address format matches the chain you selected (see the table above).

### Step 5: Review and Confirm

Review the quoted output amount and estimated completion time, then confirm the swap.

### Step 6: Wait for Completion

The bridge typically takes 2-10 minutes depending on the destination chain. Track the status in the app until the swap shows as complete.

## Fees

The bridge charges a **0.95% fee** on each swap. This fee is already included in the quoted output amount you see before confirming.

## Troubleshooting

:::warning

**Swap failed or stuck?**

- **Failed swaps**: If a swap fails, funds are automatically refunded to your Base wallet address. No action needed.
- **Slow completion**: Bridge times vary by chain and network conditions. If a swap takes longer than expected, check the status in the app before taking any action.
- **Invalid address error**: Double-check that your destination address format matches the requirements for your selected chain in the table above.
- **Still need help?** Join [Peer Telegram](https://t.me/+XDj9FNnW-xs5ODNl) for support.

:::
