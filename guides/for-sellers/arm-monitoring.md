---
id: arm-monitoring
title: How to Monitor Your ARM Rates
---

# How to Monitor Your ARM Rates

Once ARM is running on your deposit, check periodically that your rates are competitive and your feeds are healthy.

## Checking Your Rates on Peer

1. **View Your Deposit**

   - Go to [peer.xyz](https://peer.xyz) and click the **Sell** tab
   - Click on your active deposit to see the details

2. **Review Your Configured Rates**

   Your deposit detail shows:

   - Each **currency** and **payment method** you accept
   - Your current **spread** vs market (e.g. "+1.25%")
   - Your **floor rate** if set (e.g. "1.01 USD / USDC")

   To see how you compare to other sellers, check the **Liquidity** tab. Or edit your deposit to see the orderbook visualization in Advanced mode - the chart shows your position relative to all other deposits at different rates.

## Using the ARM Dashboard

The ARM dashboard at [arm.peer.xyz](https://arm.peer.xyz) gives you a real-time view of everything happening under the hood.

- **Feeds Tab**

  Shows the health of all oracle price feeds:

  - **Status** - whether each feed is active, stale, or down
  - **Last update** - when the feed last reported a new price
  - **Source** - whether Chainlink or Pyth is providing the data

  If a feed you depend on goes stale or offline, your deposit will automatically pause for that currency pair. Check this tab if orders stop coming in for a specific currency.

- **Tracked Feeds Tab**

  Shows detailed price data:

  - Chainlink and Pyth price answers side by side
  - On-chain rate snapshots
  - Historical feed behavior

  Useful for understanding if your spread is in line with what the oracles are reporting.

- **Deposits Tab**

  Shows deposits broken down by payment method and currency. Useful for seeing the broader market - how much liquidity is out there and at what rates.

- **Keeper Tab**

  Shows the status of the Pyth feed keeper, which pushes price updates on-chain. If the keeper is behind, price updates may lag. This is rarely an issue but worth checking if you notice stale rates.

## What to Watch For

- **Feed Health Issues**

  If a currency pair you support goes offline:
  - Your deposit **pauses** for that pair (no orders will match)
  - It **resumes automatically** when the feed recovers
  - Your floor rate does **not** kick in during outages - the deposit just stops matching

  Most outages are brief. Chainlink and Pyth have strong uptime records.

- **Rate Competitiveness**

  Check the Liquidity tab regularly:
  - Are your rates in the ballpark of other sellers?
  - Has the market shifted enough that your spread needs adjusting?
  - Are new sellers undercutting you on a specific currency?

- **Fill Rate**

  Track how quickly your orders are getting filled:
  - Consistently fast fills = your pricing is good (maybe too good - consider widening your spread)
  - Slow or no fills = your spread is too wide, or there's low demand for that currency

:::info
ARM can run without constant monitoring, but checking in and adjusting your spreads based on market conditions and fill rates will maximize your returns.
:::

➡️ _Back to: [ARM Overview](automated-rate-management.md)_
