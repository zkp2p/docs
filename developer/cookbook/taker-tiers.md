---
id: taker-tiers
title: Taker Tiers
---

# Taker Tiers

## What this covers

How to fetch taker tier data, render caps and cooldowns, and wire the React hook into your onramp UI.

## When to use this

Use this when you want to show a buyer what they can do before they open a quote or submit an intent.

## Fetch a taker tier

```ts
const response = await client.getTakerTier({
  owner: '0x0000000000000000000000000000000000000001',
  chainId: 8453,
});

console.log(response.responseObject);
```

The tier can be one of:

- `PEASANT`
- `PEER`
- `PLUS`
- `PRO`
- `PLATINUM`
- `PEER_PRESIDENT`

Important response fields:

- `perIntentCapBaseUnits`
- `perIntentCapDisplay`
- `cooldownHours`
- `cooldownActive`
- `nextIntentAvailableAt`
- `platformLimits`

## Render friendly UI

```ts
import { getNextTierCap, getTierDisplayInfo } from '@zkp2p/sdk/react';

const tier = response.responseObject;
const display = getTierDisplayInfo(tier);

console.log(display.tierLabel, display.capDisplay);
console.log('next cap:', getNextTierCap(tier.tier));
```

`platformLimits` gives you per-rail overrides such as minimum tier and cooldown behavior for high-risk payment methods.

## Use the React hook

```tsx
import { useGetTakerTier } from '@zkp2p/sdk/react';

const { getTakerTier, takerTier, isLoading, error } = useGetTakerTier({
  client,
  owner: buyerAddress,
  chainId: 8453,
  autoFetch: true,
});
```

This is a good fit for onramp buttons, order forms, and quote pages where the connected wallet already exists.

## Key points

- Taker tiers are user-facing policy, not just analytics data
- `perIntentCapDisplay` is convenient for copy, but `perIntentCapBaseUnits` is the safer value for calculations
- `platformLimits` lets you explain why one payment rail has tighter rules than another
- `useGetTakerTier({ autoFetch: true })` is the easiest path in React
