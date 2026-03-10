---
id: market-tracking-arm
title: Automated Rate Management (Market Tracking)
---

# Automated Rate Management (Market Tracking)

Peer calls automated rate management **Market Tracking** in the seller UI.

Use it when you want a deposit to follow live FX automatically instead of manually typing a fixed rate for every pair.

## What you control

- The **spread** you want above live FX.
- An optional **floor** that protects you if the market moves against you.
- Which payment methods and currencies should use market tracking.

## How pricing works

For each payment-method and currency pair:

1. Peer reads the live oracle-backed market rate.
2. Your configured spread is applied on top of that market rate.
3. If you set a floor, the effective rate becomes the higher of:
   - your floor
   - the market-tracked rate

That means you keep upside from the spread while still protecting a minimum rate.

## When to use it

Market Tracking works best when:

- you want quotes to stay close to live FX
- you offer several currencies and do not want to edit each one manually
- you still want a minimum acceptable payout

Fixed rates work better when:

- you want a fully static price
- the supported currency does not yet have market tracking support
- you have a temporary special rate you do not want to follow the market

## What happens if the oracle is stale?

If the oracle price is stale, invalid, or unavailable for that pair, Peer halts quoting for that specific pair until fresh data is available.

:::warning
This does not withdraw your deposit or remove the payment method. It only disables quoting for the affected pair until the market input is usable again.
:::

## How to enable Market Tracking on a new deposit

1. Open **Sell** and start a new deposit.
2. Add your payment method and payee details.
3. In the rate section, choose **Market Tracking**.
4. Enter a spread percentage.
5. Add an optional floor rate if you want downside protection.
6. Review the effective rate preview and continue.

## How to switch an existing pair to Market Tracking

1. Open your deposit from the **Sell** tab.
2. Go to the platform and currency you want to edit.
3. Click the rate edit action.
4. Switch the modal from **Fixed Rate** to **Market Tracking**.
5. Enter the spread and optional floor.
6. Sign the update transaction.

## Best practices

- Start with a modest spread and watch fill speed for a few days.
- Use a floor on thin or volatile currency pairs.
- Review the liquidity table regularly so you do not drift too far above competing deposits.
- If a pair stops quoting, check whether that currency supports market tracking and whether the oracle feed is fresh.

## Related guides

- [How to Provide Liquidity and Sell USDC](provide-liquidity-sell-usdc.md)
- [How to Update USDC Conversion Rates](update-usdc-rates.md)
- [How to Delegate a Deposit to a Vault](delegate-to-a-vault.md)
