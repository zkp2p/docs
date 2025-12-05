---
id: reputation
title: Reputation
---

# Taker Tiers: ZKP2P Reputation System

## What are Taker Tiers?

Taker Tiers are ZKP2P's onchain reputation system. Your tier determines your per-order limit when onramping through ZKP2P.

The more orders you complete, the higher your tier, and the larger your order caps.

## Why Taker Tiers?

P2P systems work best when participants are reliable. When a taker locks an order, then abandons it without cancelling, it:

- Ties up maker liquidity unnecessarily
- Wastes time for liquidity providers
- Degrades the experience for everyone

Taker Tiers incentivize good behavior by rewarding consistent, reliable users with higher limits.

Similar to other reputation system on other P2P platforms, except this is computed entirely from your onchain activity.

## The Five Tiers

| Tier | Name | Per-Order Limit |
|------|------|-----------------|
| T0 | Peer Peasant | $100 |
| T1 | Peer | $500 |
| T2 | Peer Plus | $1,000 |
| T3 | Peer Pro | $5,000 |
| T4 | Peer Platinum | $10,000 |

## How Reputation is Calculated

Your tier is determined by your **lock score** — a penalty score where lower is better.

- New users start with no history and are placed in Peer Peasant ($100 cap)
- Cancelling orders after 15 minutes increases your lock score
- Completing orders dilutes your lock score over time

Cancellations within 15 minutes don't count against you, we get that you might need to back out quickly if something's off.

## Where to See Your Tier

- **Profile Page** — Your tier, badge, and order limit are displayed in the sidebar
- **Order Creation** — If you exceed your cap, you'll see an error with your current limit
- **Discord** — Verify your wallet to receive your tier role

## Tier Benefits

### All Users

- Clear limits based on your history
- Visual badge showing your reputation
- Transparent scoring system

### Peer Platinum (T4)

- Private Discord channel
- Early access to ZKP2P mobile app

