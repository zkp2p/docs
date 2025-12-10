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

| Tier | Volume Threshold | Per-Intent Cap | Cooldown |
|------|------------------|----------------|----------|
| Peer Peasant | $0 | $100 | 24 hours |
| Peer | $500 | $250 | 12 hours |
| Peer Plus | $2,000 | $1,000 | 6 hours |
| Peer Pro | $10,000 | $2,500 | No cooldown |
| Peer Platinum | $25,000 | $5,000 | No cooldown |

## Cooldown Periods

In addition to per-intent caps, each tier has a cooldown period between intents. Lower tiers have longer cooldowns to encourage progression and prevent abuse, while higher tiers enjoy unrestricted access.

- **Peer Peasant**: 24-hour cooldown between intents
- **Peer**: 12-hour cooldown between intents
- **Peer Plus**: 6-hour cooldown between intents
- **Peer Pro**: No cooldown restrictions
- **Peer Platinum**: No cooldown restrictions

If you attempt to create an intent while your cooldown is still active, you'll receive an error message indicating how much time remains before your next transaction is available.

## How Reputation is Calculated

Your tier is determined by two factors:

1. **Total Fulfilled Volume** — The cumulative USD value of orders you've successfully completed. This determines your base tier.

2. **Lock Score** — A penalty score where lower is better. High lock scores can demote you to a lower tier.

### Lock Score Details

- New users start with no history and are placed in Peer Peasant ($100 cap)
- Cancelling orders after 15 minutes increases your lock score
- Completing orders dilutes your lock score over time
- Lock score is calculated as: `lockScore / max(totalFulfilledVolume, $250)`

Cancellations within 15 minutes don't count against you — we get that you might need to back out quickly if something's off.

### Lock Score Penalty Thresholds

Your diluted lock score can demote you by up to 4 tiers:

| Diluted Lock Score | Tier Penalty |
|--------------------|--------------|
| ≥ 50 | -1 tier |
| ≥ 200 | -2 tiers |
| ≥ 500 | -3 tiers |
| ≥ 1000 | -4 tiers |

For example, if your fulfilled volume qualifies you for Peer Plus but your diluted lock score is 200, you'd be demoted 2 tiers to Peer Peasant.

## Where to See Your Tier

- **Profile Page** — Your tier, badge, order limit, and cooldown status are displayed in the sidebar
- **Order Creation** — If you exceed your cap or cooldown is active, you'll see an error with your current limit or remaining cooldown time
- **Discord** — Verify your wallet to receive your tier role

## Tier Benefits

### All Users

- Clear limits based on your history
- Visual badge showing your reputation
- Transparent scoring system

### Peer Platinum (T4)

- Private Discord channel
- Early access to ZKP2P mobile app
