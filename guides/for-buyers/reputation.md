---
id: reputation
title: Tiers
---

# Peer Tiers

## What are Peer Tiers?

Peer Tiers are Peer's onchain reputation system. Your tier determines four things when you onramp (buy crypto) on Peer:

- Your **per-order limit**
- Your **trading fee discount**
- Your **cooldown** between orders
- Which **payment methods** you can use

Higher tiers unlock larger orders, lower fees, shorter cooldowns, and access to more payment methods. Everything is calculated from your onchain activity — there is no application or KYC.

## How you earn a tier

Your tier is based on your **Peer Pay volume**: the cumulative value of your liquidity that has been filled through Peer Pay. The more volume you build, the higher your tier climbs.

You're always placed in the highest tier whose volume requirement you meet. New wallets start at Peer Peasant.

:::info
Limits, thresholds, cooldowns, and fee discounts are set by the protocol and read live by the app. The numbers on this page are the current defaults and may be tuned over time — the app always shows your real, current values.
:::

## The five tiers

| Tier | Peer Pay volume | Per-order limit | Cooldown | Fee discount |
|------|----------------:|----------------:|:--------:|:------------:|
| Peer Peasant | $0 | $100 | 12 hours | — |
| Peer | $2,500 | $250 | 6 hours | 0.05% |
| Peer Plus | $20,000 | $1,000 | None | 0.10% |
| Peer Pro | $75,000 | $2,500 | None | 0.20% |
| Peer Platinum | $300,000 | $5,000 | None | 0.30% |

The per-order limit shown here is the **base limit** for your tier. Your actual limit on each payment method is adjusted by that method's risk level — see [Payment methods and limits](#payment-methods-and-limits) below.

## What your tier unlocks

- **Larger orders** — your base limit grows from $100 at Peasant to $5,000 at Platinum, and goes higher still on low-risk payment methods.
- **Lower fees** — higher tiers earn a discount on the standard trading fee, up to 0.30% at Platinum.
- **Shorter cooldowns** — the wait between orders shrinks as you climb and disappears entirely at Peer Plus and above.
- **More payment methods** — some methods (such as PayPal) require a minimum tier before you can use them.

## Payment methods and limits

Payment methods don't all carry the same risk. Methods that can be reversed or charged back are limited more tightly than methods that settle instantly and can't be reversed. Peer adjusts your limit and cooldown for each method accordingly.

### Low-risk methods — open to everyone

Instant, irreversible methods. **No cooldown and no minimum tier**, available at every tier with the highest limits — up to 5× your tier's base limit.

| Method | Limit | Cooldown |
|--------|-------|:--------:|
| Revolut, Wise, Monzo, MercadoPago, Luxon | Up to 5× your base limit | None |
| N26 | Up to 5× your base limit (max $10,000) | None |
| Alipay | Up to 5× your base limit (max $50) | None |

### Higher-risk methods — tier-gated

Reversible methods that carry chargeback risk. Your limit is your base limit times the method's factor, and a cooldown applies.

| Method | Limit factor | Cooldown | Minimum tier |
|--------|:------------:|:--------:|:------------:|
| Zelle | 1.5× | Yes | — |
| Venmo | 1× (max $5,000) | Yes | — |
| Cash App | 1× | Yes | — |
| Chime | 1× | Yes | — |
| PayPal | 0.75× | Yes | Peer Plus |

:::note
At the Peer Peasant tier, Venmo is limited to $5 per order.
:::

### Effective limit example

Your limit on a method = your tier's base limit × the method's factor.

For a **Peer** user (base limit $250):

| Method | Factor | Your limit |
|--------|:------:|-----------:|
| Revolut / Wise / Monzo / MercadoPago | 5× | $1,250 |
| Zelle | 1.5× | $375 |
| Venmo / Cash App / Chime | 1× | $250 |
| PayPal | — | Locked (requires Peer Plus) |

You can always see your exact limit for each method in the app before creating an order.

## Cooldowns

A cooldown is a short waiting period between orders. It applies only to higher-risk (reversible) methods — low-risk methods never have a cooldown.

| Tier | Cooldown |
|------|:--------:|
| Peer Peasant | 12 hours |
| Peer | 6 hours |
| Peer Plus and above | None |

How cooldowns work:

- The cooldown is **per wallet**, not per method.
- While on cooldown, you can't start a new order on any higher-risk method until it ends.
- Low-risk methods (Revolut, Wise, Monzo, and so on) stay available even during a cooldown.
- If you try to order while on cooldown, the app shows the time remaining.

**Example:** a Peer user completes a Venmo order, then waits 6 hours before using Venmo, Cash App, Zelle, or PayPal again — but can use Revolut, Wise, or Monzo right away.

## Staying in good standing

Your tier can be reduced if you repeatedly lock orders and then fail to complete them. Locking a maker's liquidity and walking away ties up their funds and degrades the experience for everyone, so this behavior carries a penalty.

- Completing orders reliably keeps your standing clean.
- Abandoning orders (cancelling well after you've locked them) raises a penalty score.
- Completing more orders dilutes that penalty over time.
- A quick cancellation right after locking — within about 15 minutes — does **not** count against you.

A high enough penalty score can demote you by up to four tiers below the level your volume would otherwise reach.

| Penalty score | Tier reduction |
|--------------:|:--------------:|
| 50+ | −1 tier |
| 200+ | −2 tiers |
| 500+ | −3 tiers |
| 1,000+ | −4 tiers |

For example, if your volume qualifies you for Peer Plus but your penalty score is 200, you'd be demoted two tiers.

## Where to see your tier

- **Profile** — your current tier, per-order limit, fee discount, and cooldown status.
- **Order screen** — each payment method shows your effective limit and any restriction (including "Locked" if your tier is too low to use it).
- **When a limit applies** — if an order exceeds your limit or a cooldown is active, the app shows your current limit or the remaining time.

:::note
Peer also maintains an invite-only **Peer President** tier for select partners, with the highest limits and no cooldowns.
:::
