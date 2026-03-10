---
id: create-a-vault
title: How to Create a Vault
---

# How to Create a Vault

A vault is Peer's user-facing version of delegated rate management.

When you create a vault, you become the manager for delegated deposits. Deposit owners keep custody of their USDC and keep their own floor protection, while you set the active rates for the pairs their deposits delegate to your vault.

## What vault managers control

- Vault name and metadata
- Vault fee
- Minimum liquidity required to delegate
- The active rate for each payment-method and currency pair

## What vault managers do not control

- The depositor's funds
- The depositor's payment accounts
- The depositor's floor protection
- Whether a depositor stays delegated to the vault

## Create a vault

1. Open the **Vaults** section in Peer.
2. Click **Create Vault**.
3. Enter a vault name.
4. Set the live fee and the max fee cap.
5. Optionally set a minimum USDC balance required to delegate.
6. Optionally add a metadata URI.
7. Review the vault terms and submit the transaction.

## Fee model

- Vault fees are charged per order.
- The fee cannot be raised above the vault's configured max fee.
- Vault detail pages show both the current fee and the max fee.

## Minimum liquidity

Minimum liquidity is checked when a deposit opts into the vault.

If a deposit's total liquidity is below the vault minimum, delegation is rejected until the depositor adds more funds.

## Managing vault rates

After the vault is created, you can set rates for any supported payment-method and currency pair. A delegated deposit only quotes if:

- the vault has a non-zero rate for that pair
- the depositor's own floor for that pair is still valid

If the vault rate is lower than the depositor's floor, the depositor floor wins.

## Operating tips

- Keep your configured rates broad enough to cover the pairs depositors actually delegate.
- Watch delegated balance, daily volume, and filled intents from the vault detail page.
- Remember that setting a pair to zero effectively disables that pair for delegated deposits.

## Related guides

- [How to Delegate a Deposit to a Vault](delegate-to-a-vault.md)
- [Automated Rate Management (Market Tracking)](market-tracking-arm.md)
