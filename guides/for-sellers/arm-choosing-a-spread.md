---
id: arm-choosing-a-spread
title: How to Choose Your Price Edge
---

# How to Choose Your Price Edge

Your price edge is the single most important setting as an ARM seller. It controls how much above or below the market rate you price your USDC. The protocol stores this as `spreadBps`, but the user-facing choice is easier to think about as a premium or discount versus market.

## Understanding Premiums and Discounts

Your price edge is shown as a **percentage** relative to the market rate. You can adjust it from **-5% to +5%**.

| Price edge | What It Means | Trade-off |
|--------|---------------|-----------|
| +0.5% | Slightly above market | Very competitive, fast fills, lower margin |
| +1% | 1% above market | Good balance of volume and profit |
| +2% | 2% above market | Higher margin, slower fills |
| +3% | 3% above market | High margin, may sit unfilled |
| 0% (Market rate) | Exactly at market | Maximum competitiveness, no price-edge profit |
| -0.5% | Below market | Aggressive pricing to attract volume |

### Choosing the Right Price

There's no single correct price edge. It depends on the currency, competition, and your goals.

**Major currencies (EUR, GBP, USD-adjacent pairs):**
- These are high volume and competitive. Other sellers are pricing tightly.
- Typical range: **+0.5% to +1%**

**Emerging market currencies (BRL, TRY, ZAR, IDR, PHP, MXN):**
- Less competition, higher volatility, buyers expect to pay more.
- Typical range: **+1% to +3%**

:::info
Check the **Liquidity** tab on [peer.xyz](https://peer.xyz) to see what other sellers are charging. The orderbook visualization in Advanced mode also shows you exactly where your rate sits relative to other deposits.
:::

### Use the Orderbook

The Advanced flow shows you the full orderbook so you can see exactly where your rate lands relative to other sellers. If you're way out to the right of everyone else, you're too expensive. If you're at the far left, you might be leaving money on the table.

### Watch Your Fill Rate

- Orders filling instantly? You might be priced too low. Try increasing your premium slightly.
- Deposit sitting idle? Your premium may be too high. Reduce it or check the Liquidity tab for competitive rates.

### Different Prices for Different Currencies

You can add multiple currencies to a single deposit, each with its own price edge. Don't set the same premium across EUR, BRL, and JPY. Each market has different dynamics.

:::warning
If the market moves sharply and your rate drops below your cost basis, consider setting a floor rate to protect yourself. See [How to Set a Floor Rate](arm-floor-rates.md).
:::

➡️ _Next: Set your price edge using the [Express Flow](arm-spread-express.md) or [Advanced Flow](arm-spread-advanced.md)_
