---
id: monitor-your-deposit
title: How to Monitor Your Deposit
---

# How to Monitor Your Deposit

Use the Sell tab on [peer.xyz](https://peer.xyz) to track how much USDC is still available, how often your deposit is filling, and whether anything needs attention.

## Reading the Deposits Table

Your seller dashboard shows one row per deposit. Each column gives you a quick read on performance and availability.

- **#**

  The row number for that deposit in the table.

- **Remaining / Available**

  The amount of USDC on the deposit that has not been filled yet and can still be used for new orders.

- **PnL**

  Your realized profit and loss for that deposit. This appears when the PnL column is enabled.

- **Taken**

  Shows the total amount already taken from the deposit, a utilization percentage such as `48%`, and a color-coded progress bar. If nothing has been taken yet, the percentage and progress bar are hidden and the row shows just `-`.

- **Platforms**

  The logos of the payment platforms this deposit supports.

- **Currencies**

  The flags for the fiat currencies this deposit supports.

- **Status**

  Shows whether the deposit is `Active`, `Paused`, or `Closed`. This area can also include an `Oracle` badge, a lock icon for protected deposits, a delegation badge, and an `{n} active` pill when orders are currently being filled.

## Reading the Deposit Detail StatsBar

Click a deposit to open its detail view. The six-column StatsBar at the top summarizes how that deposit is performing.

- **Available**: "Liquidity available to fill new orders. Equals deposited minus locked."
- **Volume**: "Total cumulative order volume fulfilled from this deposit."
- **Utilization**: "Percentage of your original deposit that has been filled by orders."
- **Fills**: "Total number of fulfilled or manually released orders from this deposit."
- **Realized PnL**: "Total fees earned from fulfilled/released orders."
- **APR**: "Annualized realized return based on cumulative PnL since this deposit was created."

## What the Status Badges Mean

- **Active**

  Your deposit is live and can fill new orders.

- **Paused**

  Your deposit is temporarily not matching new orders.

- **Closed**

  Your deposit is no longer available for new orders.

- **Oracle**

  Price feed-driven rates are active on this deposit.

- **Lock icon**

  The deposit is protected, which means it is private or access-controlled.

- **Delegation badge**

  A vault or rate manager is managing this deposit.

- **`{n} active`**

  This shows how many live orders are currently being filled from the deposit.

:::info
Check these metrics regularly when you are tuning your spreads so you can spot slow fills, low availability, or settings that need adjustment.
:::

Back to: [For Sellers](./index.md)
