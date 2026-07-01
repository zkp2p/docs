---
id: tiers
title: Tiers
---

# Peer Tiers

## What are Peer Tiers?

Peer Tiers rank wallets by their Peer activity. Your tier determines four things when you onramp (buy crypto) on Peer:

- Your **per-order limit**
- Your **trading fee discount**
- Your **cooldown** between orders
- Which **payment methods** you can use

Higher tiers unlock larger orders, lower fees, shorter cooldowns, and access to more payment methods. Everything is calculated from Peer activity and route-specific verification; there is no manual application.

## How you earn a tier

Your tier is based on your **weighted maker volume**: the value of your liquidity that has been filled through Peer, adjusted by each payment rail's tier-volume multiplier. The more qualifying maker volume you build, the higher your tier climbs.

You're always placed in the highest tier whose volume requirement you meet. New wallets start at Peer Peasant.

:::info
Limits, thresholds, cooldowns, and fee discounts are set by the protocol and read live by the app. The numbers on this page are the current defaults and may be tuned over time — the app always shows your real, current values.
:::

## How your tier is calculated

Your tier comes from two things working together:

1. **Your base tier** — set by your **weighted maker volume** (above). The more qualifying maker volume you build, the higher your base tier.
2. **A reliability penalty** — a *lock score* that can pull your tier down if you repeatedly lock makers' liquidity and don't follow through.

Your final tier is your base tier minus any reliability penalty. The penalty can only ever **demote** you — it never blocks you outright, and it's offset by the orders you actually complete. In practice:

- **Reliable, active takers feel almost nothing.** The penalty is diluted by your completed-order volume, so a few abandoned locks barely move it when you have real fulfillment history.
- **Lock-and-abandon behavior with little completed volume gets demoted fast** — the penalty isn't diluted, so it climbs past the thresholds quickly.

See [Staying in good standing](#staying-in-good-standing) for what raises the penalty and how far it can demote you.

## The five tiers

| Tier | Peer Pay volume | Cooldown | Fee discount |
|------|----------------:|:--------:|:------------:|
| Peer Peasant | $0 | 12 hours | — |
| Peer | $1,000 | 6 hours | 0.05% |
| Peer Plus | $10,000 | None | 0.10% |
| Peer Pro | $50,000 | None | 0.20% |
| Peer Platinum | $100,000 | None | 0.30% |

Your per-order limit is **set for each payment method individually** — there's no single across-the-board number. Each method has its own limit at every tier, listed in [Payment methods and limits](#payment-methods-and-limits) below. The app always shows your real limit for a method before you create an order.

## What your tier unlocks

- **Larger orders** — every tier raises your per-order limit on each payment method. On the lowest-risk methods it rises from $500 at Peasant to $25,000 at Platinum (see the per-method tables below).
- **Lower fees** — higher tiers earn a discount on the standard trading fee, up to 0.30% at Platinum.
- **Shorter cooldowns** — the wait between orders shrinks as you climb and disappears entirely at Peer Plus and above.
- **More payment methods** — some methods (such as PayPal) require a minimum tier before you can use them.

## Payment methods and limits

Payment methods don't all carry the same risk. Methods that can be reversed or charged back are limited more tightly than methods that settle instantly and can't be reversed. Each method has its own per-order limit at every tier, shown in the tables below (all amounts in USD).

### Low-risk methods — open to everyone

Instant, irreversible methods. **No cooldown and no minimum tier** — available at every tier, with the highest limits on Peer.

| Method | Peer Peasant | Peer | Peer Plus | Peer Pro | Peer Platinum |
|--------|-------------:|-----:|----------:|---------:|--------------:|
| Revolut | $500 | $1,250 | $5,000 | $12,500 | $25,000 |
| Wise | $500 | $1,250 | $5,000 | $12,500 | $25,000 |
| Monzo | $500 | $1,250 | $5,000 | $12,500 | $25,000 |
| MercadoPago | $500 | $1,250 | $5,000 | $12,500 | $25,000 |
| Luxon | $500 | $1,250 | $5,000 | $12,500 | $25,000 |
| N26 | $500 | $1,250 | $5,000 | $10,000 | $10,000 |
| Alipay | $50 | $50 | $50 | $50 | $50 |

### Higher-risk methods — cooldown applies

Reversible methods that carry chargeback risk. Limits are lower and a [cooldown](#cooldowns) applies between orders.

| Method | Peer Peasant | Peer | Peer Plus | Peer Pro | Peer Platinum |
|--------|-------------:|-----:|----------:|---------:|--------------:|
| Zelle | $150 | $375 | $1,500 | $3,750 | $7,500 |
| Venmo | $5 | $250 | $1,000 | $2,500 | $5,000 |
| Cash App | $100 | $250 | $1,000 | $2,500 | $5,000 |
| Chime | $100 | $250 | $1,000 | $2,500 | $5,000 |
| PayPal | Locked | Locked | $750 | $1,875 | $3,750 |

:::note
**PayPal** is locked below Peer Plus — you need to reach Peer Plus before you can use it. **Venmo** is limited to $5 per order at the Peer Peasant tier.
:::

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
