---
id: chargeback-protection
title: Private Orders (Chargeback Protection)
---

# Private Orders (Chargeback Protection)

Private Orders restrict your deposit so that only approved buyers can place orders against it. This protects you from chargebacks by ensuring orders only come from trusted sources.

## Who is this for?

Sellers who want extra protection when providing liquidity on higher-risk payment platforms like PayPal or Cash App, where buyers can dispute payments after the fact.

## How it works

When you enable Private Orders on a deposit:

1. Your deposit becomes invisible to the general order book
2. Only buyers you explicitly approve (or buyers routed through trusted channels) can place orders
3. A **Private** badge appears on your deposit in the dashboard
4. You control exactly who can interact with your liquidity

## When to use it

- You accept payments on platforms with chargeback risk (PayPal, Cash App)
- You want to limit orders to known, trusted counterparties
- You prefer a smaller number of reliable buyers over open market exposure

## Trade-offs

:::warning Fewer potential takers
Enabling Private Orders means fewer buyers can see and fill your deposit. Your liquidity may sit idle longer compared to an open deposit. Only enable this if chargeback protection matters more than fill speed for your situation.
:::

## How to enable Private Orders

### Step 1: Open your deposit

Navigate to your deposit detail page by clicking on an active deposit in the **Sell** tab.

### Step 2: Go to the Private Orders tab

In the deposit detail view, find the **Private Orders** tab in the tabbed section.

### Step 3: Toggle it on

Click the **Enable** toggle. You will need to confirm a transaction to set up the on-chain whitelist.

### Step 4: Add approved buyers

Once enabled, you can add buyer wallet addresses to your approved list:

- Paste wallet addresses or ENS names into the input field
- Click **Add** to submit them on-chain
- You can also import a list from a CSV file

### Step 5: Share your private link

Use the share feature to send your private order link directly to approved buyers. They can use this link to place orders against your deposit.

## Managing your approved list

- **View approved buyers**: The tab shows all currently whitelisted addresses along with their order history and volume
- **Remove buyers**: Click the remove button next to any address to revoke their access
- **Monitor activity**: Track how many orders and volume each approved buyer has generated

## The Private badge

When Private Orders is enabled, your deposit shows a **Private** badge in:

- Your deposit list (Sell tab)
- The deposit detail header
- Order views associated with the deposit

This badge is only visible to you — buyers see the deposit through their private link without any special indicator.

## Disabling Private Orders

Toggle the **Enable** switch off in the Private Orders tab. This removes the whitelist restriction and makes your deposit visible to all buyers again. You will need to confirm a transaction.

:::info Your approved list is preserved
Disabling Private Orders does not delete your approved buyer list. If you re-enable it later, your previous list will still be there.
:::
