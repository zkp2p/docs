---
id: delegate-to-a-vault
title: How to Delegate a Deposit to a Vault
---

# How to Delegate a Deposit to a Vault

Delegating a deposit to a vault lets someone else manage the active rates for your deposit.

This is useful when you want professional or shared rate management without giving up custody of your funds.

## What changes when you delegate

- The vault sets the active rate for delegated pairs.
- Your deposit still keeps its own floor protection.
- Vault fees can apply to orders routed through the vault.
- You can remove delegation later.

## What stays under your control

- Your USDC remains in your deposit.
- You still control adding funds, removing funds, pausing the deposit, and withdrawing.
- You still control the payment methods and currencies on the deposit.
- You still control the floor for each pair.

## Before you delegate

Check these vault details first:

- current fee and max fee
- supported rate coverage for the pairs you care about
- total delegated balance and recent volume
- any entry requirements, including minimum liquidity

## Delegate a deposit

1. Open the vault you want to use.
2. Click **Delegate**.
3. Select one or more eligible deposits.
4. Review any restrictions or minimum-liquidity requirements.
5. Submit the transaction.

If a deposit is already delegated somewhere else, you may need to clear the old delegation first.

## Reading delegated pricing

Once delegated, Peer shows:

- your **floor**
- the **vault rate**
- the resulting payout or buyer-facing rate
- the **rate source**

This lets you confirm whether the vault rate is active or whether your floor is the winning protection for that pair.

## Remove delegation

1. Open the deposit or the vault detail page.
2. Choose **Remove Delegation** or **Undelegate**.
3. Confirm the transaction.

After removal, your deposit goes back to direct rate management, using either Fixed Rate or Market Tracking for each pair.

## Related guides

- [How to Create a Vault](create-a-vault.md)
- [Automated Rate Management (Market Tracking)](market-tracking-arm.md)
- [How to Update USDC Conversion Rates](update-usdc-rates.md)
