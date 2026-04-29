---
id: batch-operations
title: Batch Operations
---

# Batch Operations

## What this covers

How to update many rate, oracle, currency, or delegation settings in one pass.

## When to use this

Use batch operations when a bot or vault operator needs to move several pairs together without N separate admin transactions.

## Set many vault floor rates at once

```ts
import {
  resolveFiatCurrencyBytes32,
  resolvePaymentMethodHash,
} from '@zkp2p/sdk';

const wise = resolvePaymentMethodHash('wise', { env: 'production' });
const revolut = resolvePaymentMethodHash('revolut', { env: 'production' });
const USD = resolveFiatCurrencyBytes32('USD');
const EUR = resolveFiatCurrencyBytes32('EUR');

await client.setVaultMinRatesBatch({
  rateManagerId,
  paymentMethods: [wise, revolut],
  currencies: [[USD, EUR], [EUR]],
  rates: [[
    1_010000000000000000n,
    940000000000000000n,
  ], [
    938000000000000000n,
  ]],
});
```

## Batch-update currency config

`updateCurrencyConfigBatch()` lets you change fixed floors and oracle settings together.

```ts
await client.updateCurrencyConfigBatch({
  depositId: 42n,
  paymentMethods: [wise],
  updates: [[
    {
      code: USD,
      minConversionRate: 1_010000000000000000n,
      updateOracle: true,
      oracleRateConfig: {
        adapter: usdOracle.adapter,
        adapterConfig: usdOracle.adapterConfig,
        spreadBps: -50,
        maxStaleness: usdOracle.maxStaleness,
      },
    },
    {
      code: EUR,
      minConversionRate: 940000000000000000n,
      updateOracle: false,
      oracleRateConfig: {
        adapter: usdOracle.adapter,
        adapterConfig: usdOracle.adapterConfig,
        spreadBps: 0,
        maxStaleness: usdOracle.maxStaleness,
      },
    },
  ]],
});
```

## Disable several currencies in one call

```ts
await client.deactivateCurrenciesBatch({
  depositId: 42n,
  paymentMethods: [wise, revolut],
  currencyCodes: [[USD, EUR], [EUR]],
});
```

## Batch delegation with a smart account

`useVaultDelegation()` supports multi-call delegation through `sendBatch`.

```tsx
import { useVaultDelegation } from '@zkp2p/sdk/react';

const escrowAddress = '0x0000000000000000000000000000000000000000' as const;

const { delegateDeposits, clearDelegations } = useVaultDelegation({
  client,
  sendTransaction,
  sendBatch: async (calls) => {
    return smartAccount.sendUserOperation({ calls });
  },
});

await delegateDeposits({
  registry: vaultAddress,
  rateManagerId,
  deposits: [
    {
      compositeDepositId: `8453_${escrowAddress}_12`,
      escrow: escrowAddress,
      depositId: 12n,
    },
    {
      compositeDepositId: `8453_${escrowAddress}_19`,
      escrow: escrowAddress,
      depositId: 19n,
    },
  ],
});
```

## Key points

- Group nested arrays by payment method index
- Batch methods are best paired with bots or admin tooling, not one-off manual UX
- `useVaultDelegation({ sendBatch })` is the easiest path for smart-account delegation switches
- If you only need one pair, prefer the single-item method for simpler failure handling
