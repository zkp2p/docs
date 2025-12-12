---
id: reputation
title: Reputation
---

# Taker Tiers: ZKP2P Reputation System

## What are Taker Tiers?

Taker Tiers are ZKP2P's onchain reputation system. Your tier determines your per-intent cap and cooldown period when onramping through ZKP2P.

The more orders you complete, the higher your tier, and the larger your order caps and shorter your cooldown periods.

## Why Taker Tiers?

P2P systems work best when participants are reliable. When a taker locks an order, then abandons it without cancelling, it:

- Ties up maker liquidity unnecessarily
- Wastes time for liquidity providers
- Degrades the experience for everyone

Taker Tiers incentivize good behavior by rewarding consistent, reliable users with higher limits.

Similar to other reputation systems on other P2P platforms, except this is computed entirely from your onchain activity.

## The Five Tiers

| Tier | Volume Threshold | Base Per-Intent Cap | Base Cooldown |
|------|------------------|---------------------|---------------|
| Peer Peasant | $0 | $100 | 12 hours |
| Peer | $500 | $250 | 6 hours |
| Peer Plus | $2,000 | $1,000 | No cooldown |
| Peer Pro | $10,000 | $2,500 | No cooldown |
| Peer Platinum | $25,000 | $5,000 | No cooldown |

## Platform-Based Limits

Not all payment platforms carry the same risk. ZKP2P adjusts your caps and cooldowns based on the payment platform you're using.

### Why Platform Risk Matters

Different payment platforms have varying levels of buyer protection and reversal windows:

- **PayPal**: 180-day buyer protection, easiest disputes - highest fraud risk
- **Venmo/CashApp**: ACH-backed, bank reversal possible within 90 days
- **Zelle**: Bank-to-bank, harder but possible to reverse
- **Revolut/Wise/Monzo**: Instant settlement, no reversals - lowest fraud risk

### Platform Risk Levels

| Risk Level | Platforms | Cap Multiplier | Has Cooldown | Notes |
|------------|-----------|----------------|--------------|-------|
| **Low Risk** | Revolut, Wise, Monzo | 2x | No | Instant settlement, no chargebacks |
| **Low Risk** | MercadoPago | 1.5x | No | Regional instant settlement |
| **Medium Risk** | Zelle (all banks) | 0.75x | Yes | Bank-to-bank, harder to reverse |
| **High Risk** | Venmo, CashApp | 0.5x | Yes | ACH-backed, 90-day reversal window |
| **Highest Risk** | PayPal | 0.25x | Yes | Requires Peer Plus tier to access |

### Effective Caps by Platform

Your effective cap = Base Tier Cap × Platform Multiplier

**Example for a Peer user ($250 base cap):**

| Platform | Multiplier | Effective Cap |
|----------|------------|---------------|
| Revolut | 2x | $500 |
| Wise | 2x | $500 |
| Monzo | 2x | $500 |
| MercadoPago | 1.5x | $375 |
| Zelle | 0.75x | $187.50 |
| Venmo | 0.5x | $125 |
| CashApp | 0.5x | $125 |
| PayPal | - | Locked (requires Peer Plus) |

### Platform Access Requirements

Some high-risk platforms require a minimum tier to access:

| Platform | Minimum Tier Required | Volume to Unlock |
|----------|----------------------|------------------|
| PayPal | Peer Plus | $2,000 |

Users below the required tier will see the platform as "Locked" and cannot create orders for that platform until they reach the required tier.

## Cooldown Periods

Cooldowns prevent rapid-fire order creation and only apply to higher-risk platforms.

**Low-risk platforms (Revolut, Wise, Monzo, MercadoPago) have NO cooldown regardless of your tier.**

### Cooldown by Tier

For platforms with cooldown enforcement (Zelle, Venmo, CashApp, PayPal):

| Tier | Cooldown Duration |
|------|-------------------|
| Peer Peasant | 12 hours |
| Peer | 6 hours |
| Peer Plus | No cooldown |
| Peer Pro | No cooldown |
| Peer Platinum | No cooldown |

### How Cooldowns Work

- Cooldown is **per-user**, not per-platform
- If you're on cooldown, you cannot use any high-risk platform until the cooldown expires
- Low-risk platforms can be used immediately regardless of cooldown status
- If you attempt to create an order while on cooldown, you'll see an error with the remaining time

**Example**: A Peer user completes a Venmo order. They must wait 6 hours before using Venmo, CashApp, Zelle, or PayPal again. However, they can immediately use Revolut, Wise, Monzo, or MercadoPago.

## How Reputation is Calculated

Your tier is determined by two factors:

1. **Total Fulfilled Volume** — The cumulative USD value of orders you've successfully completed. This determines your base tier.

2. **Lock Score** — A penalty score where lower is better. High lock scores can demote you to a lower tier.

### Lock Score Details

- New users start with no history and are placed in Peer Peasant ($100 cap)
- Cancelling orders after 15 minutes increases your lock score
- Completing orders dilutes your lock score over time

Cancellations within 15 minutes don't count against you — we get that you might need to back out quickly if something's off.

### Lock Score Penalty Thresholds

Your diluted lock score can demote you by up to 4 tiers:

| Diluted Lock Score | Tier Penalty |
|--------------------|--------------|
| 50+ | -1 tier |
| 200+ | -2 tiers |
| 500+ | -3 tiers |
| 1000+ | -4 tiers |

For example, if your fulfilled volume qualifies you for Peer Plus but your diluted lock score is 200, you'd be demoted 2 tiers to Peer Peasant.

## Where to See Your Tier

- **Profile Page** — Your tier, badge, order limit, and cooldown status are displayed in the sidebar
- **Order Creation** — If you exceed your cap or cooldown is active, you'll see an error with your current limit or remaining cooldown time
- **Platform Selection** — Each platform shows its effective cap and any restrictions
- **Discord** — Verify your wallet to receive your tier role

## Tier Benefits

### All Users

- Clear limits based on your history
- Visual badge showing your reputation
- Transparent scoring system
- Platform-specific caps optimized for risk

### Peer Plus and Above

- Access to PayPal
- No cooldown periods on any platform
- Higher effective caps across all platforms

### Peer Platinum

- Private Discord channel
- Early access to ZKP2P mobile app
- Maximum caps on all platforms
