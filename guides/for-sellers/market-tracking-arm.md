---
id: market-tracking-arm
title: Market Tracking (Automated Rates)
---

# Market Tracking (Automated Rates)

Market Tracking uses Automated Rate Management (ARM) to follow live market pricing.
Instead of updating each conversion rate manually, you set a spread and floor.

## What this does

With Market Tracking enabled for a payment/currency pair:

- The protocol reads a live oracle market rate.
- Your spread is applied to that market rate.
- Your floor still protects you when needed.

In simple terms: you keep a minimum acceptable rate while still tracking the market.

## What you control

- Spread percentage (your premium/discount vs market)
- Floor rate (minimum acceptable rate)
- Which payment and currency pairs use Market Tracking

## Market Tracking vs Fixed Rate

Use Market Tracking when:

- FX moves frequently
- You do not want to manually update rates every day
- You want pricing tied to live market data

Use Fixed Rate when:

- You want exact static pricing
- You prefer manual control per tuple

## Oracle stale behavior

If a market feed becomes stale, that tuple pauses and new orders for that tuple stop until pricing is healthy again.

:::info
A stale market feed does not move your funds. It only pauses matching for the affected tuple.
:::

## Enable Market Tracking on a new deposit

1. Start deposit creation from the **Sell** flow.
2. In the rate step, choose **Market Tracking** for the tuple.
3. Set your **spread (%)**.
4. Set your **floor**.
5. Review and confirm the deposit transaction.

For the full deposit flow, see [How to Provide Liquidity and Sell USDC](provide-liquidity-sell-usdc.md).

## Enable Market Tracking on an existing deposit

1. Go to the **Sell** tab.
2. Open your deposit details.
3. In **Conversion Rates**, click edit for a tuple.
4. Switch rate strategy to **Market Tracking**.
5. Set spread and floor.
6. Confirm the update transaction.

## Best practices

- Start with a wider spread (for example 2-3%) and tighten as fills stabilize.
- Keep a floor that reflects your minimum acceptable payout.
- Monitor fill speed by currency; different currencies often need different spreads.

## Next

- [How to Update USDC Conversion Rates](update-usdc-rates.md)
- [How to Provide Liquidity and Sell USDC](provide-liquidity-sell-usdc.md)
