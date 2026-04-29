---
id: delegation
title: Delegation State Machine
---

# Delegation State Machine

## What this covers

How to reason about deposit delegation, when to clear an existing vault assignment, and how the React helper automates the current EscrowV2 path.

## When to use this

Use this when you are building vault tooling, delegation UIs, or any workflow where a depositor can switch a deposit between managers.

## The current route

At the hook-utility level, the stable route is direct EscrowV2 delegation:

```ts
import { getDelegationRoute } from '@zkp2p/sdk';

const route = getDelegationRoute(client, escrowAddress);
console.log(route); // 'v2'
```

Low-level compatibility methods such as `setDepositRateManager()` still exist on the client, but `useVaultDelegation()` and the exported routing helpers currently target the direct V2 path.

## Classify the current state

```ts
import { classifyDelegationState } from '@zkp2p/sdk';

const state = classifyDelegationState(
  currentRateManagerId,
  currentRegistry,
  targetRateManagerId,
  targetRegistry,
);

// 'not_delegated' | 'delegated_here' | 'delegated_elsewhere'
```

How to interpret it:

- `not_delegated`: safe to delegate immediately
- `delegated_here`: already on the correct vault, so skip the write
- `delegated_elsewhere`: switch required

## Delegate one deposit

```tsx
import { useVaultDelegation } from '@zkp2p/sdk/react';

const { delegateDeposit, clearDelegation } = useVaultDelegation({
  client,
  sendTransaction: async ({ to, data, value }) => {
    return walletClient.sendTransaction({ to, data, value, account });
  },
});

await delegateDeposit({
  escrow: '0xEscrowAddress',
  depositId: 42n,
  registry: '0xVaultAddress',
  rateManagerId: '0xRateManagerId',
  currentRateManagerId,
  currentRateManagerRegistry: currentRegistry,
});
```

## Switching vaults

If a deposit is already delegated elsewhere:

- with `sendBatch`: `useVaultDelegation()` can batch clear + set into one smart-account operation
- without `sendBatch`: clear first, then delegate in a second step

```tsx
const { delegateDeposit } = useVaultDelegation({
  client,
  sendTransaction,
  sendBatch: async (calls) => smartAccount.sendUserOperation({ calls }),
});
```

## Useful helpers

```ts
import {
  ZERO_RATE_MANAGER_ID,
  isZeroRateManagerId,
  normalizeRateManagerId,
  normalizeRegistry,
} from '@zkp2p/sdk';

console.log(ZERO_RATE_MANAGER_ID);
console.log(isZeroRateManagerId(currentRateManagerId));
console.log(normalizeRateManagerId(currentRateManagerId));
console.log(normalizeRegistry(currentRegistry));
```

These helpers are useful when your UI stores values from several sources and you want one canonical comparison format.

## Key points

- In the current SDK, the public routing helpers resolve to direct EscrowV2 delegation
- `delegated_elsewhere` is the state that requires a clear-first path unless you batch
- `useVaultDelegation()` is the easiest integration surface because it handles skips, clears, and smart-account batching logic for you
- Keep delegation comparisons normalized; address casing differences should not produce false state changes
