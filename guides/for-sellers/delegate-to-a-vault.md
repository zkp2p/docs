---
id: delegate-to-a-vault
title: Delegate a Deposit to a Vault
---

# Delegate a Deposit to a Vault

Vault delegation lets a vault manager adjust your rates for you. Your USDC does not move to the vault manager. Delegation changes rate management, not custody.

### What delegation does

When you delegate a deposit, the vault manager updates your pricing on your behalf. This helps you stay competitive without manually changing rates yourself.

Peer describes it like this:

> Tip: Vaults auto-adjust your rates to stay competitive. Your deposit stays in your wallet.

### Who is this for

Use delegation if you do not want to manage rates yourself.

If you want to keep control of your own spreads and floor rates, use [Automated Rate Management (ARM)](automated-rate-management.md) instead.

### How to turn it on

On the new-deposit form, open the options stack and turn on `Delegate to Vault`. The toggle is available in both Express and Advanced mode.

The toggle is behind the `phase3VaultsEnabled` phase flag. If you do not see it yet, it has not been enabled for you.

### Choosing a vault

You can sort the vault list by `Volume` or `APR`. The panel shows up to three vaults at a time. If there are more matches, use the pagination dots to move between pages.

Each vault card shows `Vol`, `APR`, and `Managed`. Verified vaults show a green check.

If no vault matches your payment method and currency, you will see `No compatible vaults`.

### What happens after deposit

After your deposit is created, you will see a vault-delegation follow-up state for the vault you selected.

In Express mode, the action button reads `DELEGATE TO VAULT`. While the transaction is pending, it changes to `DELEGATING...`. In Advanced mode, the same step uses `Delegate to vault` and `Delegating...`.

When delegation succeeds, the deposit shows `Delegated` with the vault name.

In Express mode, if the vault cannot accept the delegation, the follow-up state is `Deposit created. Vault delegation unavailable` and the button changes to `VIEW DEPOSIT`.

In Express mode, if the delegation transaction fails, the error state is `Vault delegation failed`. In Advanced mode, the follow-up card shows the returned error and lets you retry.

### Where to go next

Browse live vaults on [Explore vaults](https://peer.xyz/vaults).

If you want the manager-side view, read [For Vault Managers](../for-vault-managers/index.md).

➡️ _Next: [Notifications and Alerts](notifications.md)_
