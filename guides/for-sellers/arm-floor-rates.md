---
id: arm-floor-rates
title: How to Set a Floor Rate
---

# How to Set a Floor Rate

A floor rate is the minimum conversion rate you're willing to accept. It's a safety net that prevents ARM from pricing your USDC below a level you're comfortable with.

## How Floor Rates Work

The protocol always uses the **higher** of your ARM-calculated rate and your floor rate:

| Scenario | ARM Rate | Floor Rate | Rate Used |
|----------|----------|------------|-----------|
| Normal market | 1.08 | 1.05 | **1.08** (ARM wins) |
| Market dip | 1.03 | 1.05 | **1.05** (Floor wins) |
| Oracle feed down | -| 1.05 | **Paused** (no trades) |

The floor protects you from the rate going too low. It does **not** kick in during oracle feed outages. When a feed is down, the deposit pauses entirely for that currency pair until the feed recovers.

## When to Use a Floor Rate

- **You have a known cost basis.** If you bought USDC at a certain FX rate and need to sell above it to break even, set your floor there.
- **Volatile currencies.** Emerging market currencies can swing. A floor prevents you from accidentally selling at a loss during a spike.
- **Peace of mind.** Even if you trust ARM, a floor means you never have to worry about worst-case pricing.

## Setting a Floor Rate

Floor rates are available in the **Advanced** flow (toggle Advanced on in the top right).

1. **Enable the Floor Toggle**

   At the bottom of the rate configuration panel, you'll see the **Floor** section:

   > "Orders below this rate are not accepted, even if market prices drop. This protects you during volatility."

   Toggle the floor **on**.

2. **Enter Your Floor Rate**

   Type in the minimum rate you're willing to accept in the currency's units. For example, if you're selling USDC for USD and never want to go below 1.01 USD per USDC, enter **1.01**.

3. **Check the Orderbook**

   When the floor is active, a red **"Min"** line appears on the orderbook chart showing exactly where your floor sits relative to the market and your current rate. Your rate (yellow "You" line) will never drop below this red line.

   ![Spread and floor configured](/img/arm/arm-advanced-spread-floor.png)

4. **Review and Confirm**

   The **Configured Rates** summary on the left will show both your spread and floor:

   - "Spread vs market +1.25%"
   - "Floor: 1.01 USD / USDC"

   Click **Review Deposit** to confirm.

## Using Floor Rates to Lock In Fixed Pricing

If you want to opt out of ARM entirely and use a fixed rate, set a floor rate above the current ARM-calculated rate. When the floor is above the ARM rate, the floor always wins, giving you a fixed rate.

You can do this per currency pair. Keep ARM active on EUR but lock in a fixed rate on TRY, for example.

:::warning
Fixed rates don't update automatically. If the market moves above your floor, your deposit might become uncompetitive. If the market drops well below your floor, you'll keep accepting orders at the floor rate.
:::

## Removing a Floor Rate

To go back to pure ARM pricing, toggle the floor **off** on the deposit screen and confirm the update.

## Tips

- **Set floors based on your actual cost basis**, not arbitrary round numbers.
- **Review floors periodically.** A floor you set months ago might be way off from current market conditions.
- **Floor rates are per-currency.** Set different floors for different currencies based on your exposure and risk tolerance.

➡️ _Next: [How to Monitor Your ARM Rates](arm-monitoring.md)_
