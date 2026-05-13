---
id: oracle-rates
title: Oracle Rate Configuration
---

# Oracle Rate Configuration

## What this covers

How to configure oracle-backed pricing floors on EscrowV2 deposits and how that floor interacts with fixed rates and delegated vault rates.

## When to use this

Use oracle config when you want deposit pricing to track a market reference instead of relying only on a manually updated fixed floor.

## Configure one payment-method and currency pair

```ts
import {
  getSpreadOracleConfig,
  resolveFiatCurrencyBytes32,
  resolvePaymentMethodHash,
  validateOracleFeedsOnChain,
} from '@zkp2p/sdk';

const paymentMethodHash = resolvePaymentMethodHash('wise', { env: 'production' });
const currencyHash = resolveFiatCurrencyBytes32('USD');
const oracle = getSpreadOracleConfig('USD');

if (!oracle) {
  throw new Error('No bundled oracle config for USD');
}

const liveFeeds = await validateOracleFeedsOnChain(client.publicClient);
if (!liveFeeds.has('USD')) {
  throw new Error('USD oracle feed is not currently live');
}

await client.setOracleRateConfig({
  depositId: 42n,
  paymentMethodHash,
  currencyHash,
  config: {
    adapter: oracle.adapter,
    adapterConfig: oracle.adapterConfig,
    spreadBps: -50,
    maxStaleness: oracle.maxStaleness,
  },
});
```

The `config` fields are:

- `adapter`: the deployed oracle adapter contract
- `adapterConfig`: feed-specific bytes for that adapter
- `spreadBps`: signed spread in basis points applied to the market price
- `maxStaleness`: maximum allowed age in seconds before the oracle is ignored

## Remove oracle pricing

```ts
await client.removeOracleRateConfig({
  depositId: 42n,
  paymentMethodHash,
  currencyHash,
});
```

After removal, the pair falls back to fixed-rate-only behavior.

## Batch-configure several currencies

```ts
const usdOracle = getSpreadOracleConfig('USD');
const eurOracle = getSpreadOracleConfig('EUR');

if (!usdOracle || !eurOracle) {
  throw new Error('Missing bundled oracle config for USD or EUR');
}

await client.setOracleRateConfigBatch({
  depositId: 42n,
  paymentMethods: [paymentMethodHash],
  currencies: [[
    resolveFiatCurrencyBytes32('USD'),
    resolveFiatCurrencyBytes32('EUR'),
  ]],
  configs: [[
    {
      adapter: usdOracle.adapter,
      adapterConfig: usdOracle.adapterConfig,
      spreadBps: -50,
      maxStaleness: usdOracle.maxStaleness,
    },
    {
      adapter: eurOracle.adapter,
      adapterConfig: eurOracle.adapterConfig,
      spreadBps: 0,
      maxStaleness: eurOracle.maxStaleness,
    },
  ]],
});
```

## How the final rate is chosen

EscrowV2 computes:

```text
escrowFloor = max(fixedRate, oracleRate)
effectiveRate = max(escrowFloor, delegatedRate)
```

Example:

- fixed rate: `1.00`
- oracle-derived rate: `1.02`
- delegated vault rate: `1.01`
- final effective rate: `1.02`

If the oracle becomes stale, its contribution becomes `0`, so the pair falls back to the fixed floor and then any delegated rate above it.

## Key points

- Oracle config is EscrowV2-only
- Negative `spreadBps` is allowed, but the effective multiplier must stay above zero
- `maxStaleness` is in seconds, not milliseconds
- A stale or invalid oracle does not halt a pair if a non-zero fixed rate still exists
- For background on the contract behavior, see [Escrow](/protocol/v3/smart-contracts/escrow)
