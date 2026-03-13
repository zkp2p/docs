---
id: offramp-integration
title: Offramp Integration
slug: /developer/offramp
---

# Offramp Integration

`@zkp2p/sdk` gives liquidity providers a single `Zkp2pClient` for deposit creation, deposit management, and ARM tuple configuration.

This page focuses on:

- Creating and managing deposits
- Managing tuple pricing with Fixed Rate and ARM (Market Tracking)

## Who is this for?

This guide is for integrators building seller/offramp workflows that need to:

- Create deposits
- Configure payment methods and currencies
- Manage fixed and oracle-backed tuple pricing
- Query deposit state

## Installation

```bash
bun add @zkp2p/sdk viem
# or
npm install @zkp2p/sdk viem
# or
yarn add @zkp2p/sdk viem
# or
pnpm add @zkp2p/sdk viem
```

## Quick start

```ts
import { Zkp2pClient } from '@zkp2p/sdk';
import { createWalletClient, custom } from 'viem';
import { base } from 'viem/chains';

const walletClient = createWalletClient({
  chain: base,
  transport: custom(window.ethereum),
});

const client = new Zkp2pClient({
  walletClient,
  chainId: base.id,
  runtimeEnv: 'production', // 'production' | 'preproduction' | 'staging'
  apiKey: 'YOUR_CURATOR_API_KEY', // optional if you pass payeeDetailsHashes directly
  indexerApiKey: 'YOUR_INDEXER_API_KEY', // optional, for indexer proxy auth
});
```

`OfframpClient` is still exported as a backward-compatible alias, but `Zkp2pClient` is the canonical name.

## Core deposit operations

### Create a deposit

```ts
import { Currency } from '@zkp2p/sdk';

const { hashedOnchainIds } = await client.registerPayeeDetails({
  processorNames: ['wise'],
  depositData: [{ email: 'maker@example.com' }],
});

const { hash } = await client.createDeposit({
  token: '0xUSDC_ADDRESS',
  amount: 10_000_000000n, // 10,000 USDC (6 decimals)
  intentAmountRange: { min: 10_000000n, max: 1_000_000000n },
  processorNames: ['wise'],
  depositData: [{ email: 'maker@example.com' }],
  conversionRates: [[
    { currency: Currency.USD, conversionRate: '1020000000000000000' },
    { currency: Currency.EUR, conversionRate: '950000000000000000' },
  ]],
  payeeDetailsHashes: hashedOnchainIds,
  delegate: '0xDELEGATE_ADDRESS', // optional intent-ops delegate
  intentGuardian: '0xGUARDIAN_ADDRESS', // optional
  retainOnEmpty: true, // optional
});
```

### Update deposit settings

```ts
await client.setAcceptingIntents({ depositId: 1n, accepting: true });

await client.setIntentRange({
  depositId: 1n,
  min: 25_000000n,
  max: 500_000000n,
});

await client.setCurrencyMinRate({
  depositId: 1n,
  paymentMethod: '0xPAYMENT_METHOD_HASH',
  fiatCurrency: '0xFIAT_CURRENCY_HASH',
  minConversionRate: 1_020_000_000_000_000_000n, // 1.02 (18 decimals)
});
```

### Manage funds

```ts
await client.addFunds({ depositId: 1n, amount: 500_000000n });
await client.removeFunds({ depositId: 1n, amount: 100_000000n });
await client.withdrawDeposit({ depositId: 1n });
```

### Prepared transaction flow

Every `PrepareableMethod` supports `.prepare()` if you want to separate build/send:

```ts
const prepared = await client.setOracleRateConfig.prepare({
  depositId: 1n,
  paymentMethodHash: '0xPAYMENT_METHOD_HASH',
  currencyHash: '0xCURRENCY_HASH',
  config: {
    adapter: '0xADAPTER',
    adapterConfig: '0x...',
    spreadBps: 50,
    maxStaleness: 86_400,
  },
});

// send prepared.to + prepared.data with your own transaction pipeline
```

## Rate modes

Each payment-method/currency tuple can run one of these pricing strategies:

1. Fixed Rate: depositor sets `minConversionRate` manually.
2. Market Tracking (ARM): depositor sets oracle + spread config (`setOracleRateConfig`).

Precision and units:

- USDC amounts: 6 decimals
- Rates and fees: 18-decimal bigint units
- ARM spread: signed basis points (`50 = +0.50%`, `-50 = -0.50%`)

## ARM (Automated Rate Management)

Use ARM to track oracle prices with a configurable spread.

### Configure oracle pricing for a tuple

```ts
import {
  Currency,
  resolveFiatCurrencyBytes32,
  getPaymentMethodsCatalog,
  getSpreadOracleConfig,
} from '@zkp2p/sdk';

const paymentMethods = getPaymentMethodsCatalog(client.chainId, client.runtimeEnv);
const paymentMethodHash = paymentMethods.wise.paymentMethodHash;
const currencyHash = resolveFiatCurrencyBytes32(Currency.EUR);

const oracle = getSpreadOracleConfig(Currency.EUR);
if (!oracle) throw new Error('No oracle feed configured for EUR');

await client.setOracleRateConfig({
  depositId: 1n,
  paymentMethodHash,
  currencyHash,
  config: {
    adapter: oracle.adapter,
    adapterConfig: oracle.adapterConfig,
    spreadBps: 75,
    maxStaleness: oracle.maxStaleness,
  },
});
```

### Remove oracle pricing for a tuple

```ts
await client.removeOracleRateConfig({
  depositId: 1n,
  paymentMethodHash,
  currencyHash,
});
```

### Batch ARM updates

```ts
await client.setOracleRateConfigBatch({
  depositId: 1n,
  paymentMethods: [paymentMethodHash],
  currencies: [[currencyHash]],
  configs: [[{
    adapter: oracle.adapter,
    adapterConfig: oracle.adapterConfig,
    spreadBps: 25,
    maxStaleness: 86_400,
  }]],
});
```

### ARM at deposit creation (overrides)

`createDeposit` supports on-chain override arrays when you need tuple-level control.
If you use overrides, provide these together:

- `paymentMethodsOverride`
- `paymentMethodDataOverride`
- `currenciesOverride`

```ts
import {
  Currency,
  resolveFiatCurrencyBytes32,
  getSpreadOracleConfig,
} from '@zkp2p/sdk';

const eurOracle = getSpreadOracleConfig(Currency.EUR);
if (!eurOracle) throw new Error('EUR oracle not configured');

await client.createDeposit({
  token: '0xUSDC_ADDRESS',
  amount: 1_000_000000n,
  intentAmountRange: { min: 10_000000n, max: 100_000000n },
  processorNames: ['wise'],
  depositData: [{ email: 'maker@example.com' }],
  conversionRates: [[{ currency: Currency.EUR, conversionRate: '900000000000000000' }]],
  paymentMethodsOverride: ['0xPAYMENT_METHOD_HASH'],
  paymentMethodDataOverride: [{
    intentGatingService: '0xGATING_SERVICE',
    payeeDetails: '0xPAYEE_HASH',
    data: '0x',
  }],
  currenciesOverride: [[{
    code: resolveFiatCurrencyBytes32(Currency.EUR),
    minConversionRate: 900_000_000_000_000_000n,
    oracleRateConfig: {
      adapter: eurOracle.adapter,
      adapterConfig: eurOracle.adapterConfig,
      spreadBps: 60,
      maxStaleness: eurOracle.maxStaleness,
    },
  }]],
});
```

Useful ARM constants/utilities exported by the SDK:

- `CHAINLINK_ORACLE_ADAPTER`
- `PYTH_ORACLE_ADAPTER`
- `DEFAULT_ORACLE_MAX_STALENESS_SECONDS`
- `CHAINLINK_ORACLE_FEEDS`
- `PYTH_ORACLE_FEEDS`
- `encodeSpreadOracleAdapterConfig(...)`
- `getSpreadOracleConfig(...)`

## Indexer queries for deposits

```ts
const deposits = await client.indexer.getDeposits(
  { status: 'ACTIVE', depositor: '0xYOUR_ADDRESS' },
  { limit: 25, orderBy: 'updatedAt', orderDirection: 'desc' },
);

const deposit = await client.indexer.getDepositById('8453_0xESCROW_ADDRESS_1');
const firstTuple = deposit?.currencies?.[0];
console.log(firstTuple?.rateSource);
```

`MethodCurrency.rateSource` indicates why a tuple's current rate is active:

- `ORACLE`: market tracking rate active
- `ESCROW_FLOOR`: floor rate is active
- `ORACLE_HALTED`: oracle configured but stale/invalid; tuple halted
- `NO_FLOOR`: no active floor/rate configured

## React hooks

```tsx
import {
  useCreateDeposit,
  useSetAcceptingIntents,
  useSetIntentRange,
  useSetCurrencyMinRate,
  useAddFunds,
  useRemoveFunds,
  useWithdrawDeposit,
} from '@zkp2p/sdk/react';
```

- `useCreateDeposit`: creates deposits
- `useSetAcceptingIntents`: toggles intent acceptance
- `useSetIntentRange`: updates per-order min/max
- `useSetCurrencyMinRate`: updates fixed floor rate per tuple
- `useAddFunds` / `useRemoveFunds` / `useWithdrawDeposit`: manages liquidity

## Next pages

- [Automated Rate Management](automated-rate-management.md)
