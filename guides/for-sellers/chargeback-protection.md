---
id: chargeback-protection
title: Chargeback Protection
---

# Chargeback Protection

Chargeback Protection limits who can fill your deposit. When it is enabled, only orders routed through Peer's Pay signal relayer can fill your deposit.

This means every order that reaches your deposit has already been validated before it gets to you. For payment methods like PayPal and Cash App, that lowers the risk of a buyer payment turning into a chargeback dispute later.

### Who Can Enable It

You can enable Chargeback Protection if you are:

- The deposit owner
- A vault delegate managing the deposit on the owner's behalf

### How to Enable It

1. Open the details page for the deposit you want to protect.
2. Find the **Chargeback Protection** toggle in the deposit controls section.
3. Turn the toggle on.
4. Confirm both wallet prompts to finish setup.

:::info Expect two wallet prompts
Turning on Chargeback Protection sends two on-chain transactions. The first turns on protection for the deposit, and the second authorizes Peer's Pay relayer to fill it. Both transactions must complete before the deposit becomes protected.
:::

### What the Protected Badge Means

After Chargeback Protection is enabled, a **Protected** badge appears:

- In the deposit list
- In the deposit header
- On individual orders

This badge confirms that only validated orders can fill the deposit.

### When to Use It

Chargeback Protection is a good fit for payment methods where disputes and reversals are more common, such as:

- PayPal
- Cash App

:::warning Lower-risk payment methods may not need it
Chargeback Protection is less important for platforms like Revolut, Wise, and Monzo, where payments settle instantly and chargebacks are not part of the normal flow.
:::

### Trade-offs

Chargeback Protection improves safety, but it can reduce how many buyers are able to fill your deposit. Only orders routed through Pay can take the deposit, so fills may be slower.

If you care more about safety than speed, turn it on. If you care more about getting filled as quickly as possible, you may prefer to leave it off.
