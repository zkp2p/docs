---
id: automated-rate-management
title: Automated Rate Management
---

# Automated Rate Management

ARM (Automated Rate Management) is EscrowV2's oracle-backed pricing for deposit tuples.
For each payment-method/currency pair, you can configure an oracle adapter and spread so rates track the market automatically.

## Overview

With ARM enabled for a tuple, EscrowV2 uses:

- Depositor floor (`minConversionRate`)
- Oracle-backed market rate with spread (`oracleRateConfig`)

Effective floor behavior is:

```text
effectiveFloor = max(minConversionRate, oracleRateAfterSpread)
```

## Tuple-level config model

`OracleRateConfig` on each tuple contains:

- `adapter`: oracle adapter contract
- `adapterConfig`: adapter-specific encoded config bytes
- `spreadBps`: signed basis points (`50 = +0.50%`, `-50 = -0.50%`)
- `maxStaleness`: allowed age of oracle data in seconds

Precision/units:

- USDC amounts: 6 decimals
- Conversion rates: 18-decimal bigint
- Spread: signed integer basis points

## SDK writes

### Resolve oracle config from SDK helpers

```ts
import {
  Currency,
  getSpreadOracleConfig,
  CHAINLINK_ORACLE_ADAPTER,
  PYTH_ORACLE_ADAPTER,
  DEFAULT_ORACLE_MAX_STALENESS_SECONDS,
} from '@zkp2p/sdk';

const eurOracle = getSpreadOracleConfig(Currency.EUR);
if (!eurOracle) throw new Error('No oracle config for EUR');
const adapter = eurOracle.adapter; // CHAINLINK_ORACLE_ADAPTER or PYTH_ORACLE_ADAPTER
const maxStaleness =
  eurOracle.maxStaleness ?? DEFAULT_ORACLE_MAX_STALENESS_SECONDS;
```

### Set ARM config for one tuple

```ts
import {
  Currency,
  resolveFiatCurrencyBytes32,
  getPaymentMethodsCatalog,
  getSpreadOracleConfig,
} from '@zkp2p/sdk';

const methods = getPaymentMethodsCatalog(client.chainId, client.runtimeEnv);
const paymentMethodHash = methods.wise.paymentMethodHash;
const currencyHash = resolveFiatCurrencyBytes32(Currency.EUR);

const oracle = getSpreadOracleConfig(Currency.EUR);
if (!oracle) throw new Error('No oracle config for EUR');

await client.setOracleRateConfig({
  depositId: 1n,
  paymentMethodHash,
  currencyHash,
  config: {
    adapter: oracle.adapter,
    adapterConfig: oracle.adapterConfig,
    spreadBps: 50,
    maxStaleness: 86_400,
  },
});
```

### Remove ARM config for one tuple

```ts
await client.removeOracleRateConfig({
  depositId: 1n,
  paymentMethodHash,
  currencyHash,
});
```

### Batch ARM config updates

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

### Create deposit with ARM preconfigured

`oracleRateConfig` can be included in `OnchainCurrencyEntry` via `currenciesOverride`.

```ts
import {
  Currency,
  resolveFiatCurrencyBytes32,
  getSpreadOracleConfig,
} from '@zkp2p/sdk';

const eurOracle = getSpreadOracleConfig(Currency.EUR);
if (!eurOracle) throw new Error('No oracle config for EUR');

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
      spreadBps: 40,
      maxStaleness: eurOracle.maxStaleness,
    },
  }]],
});
```

## Oracle constants and feed maps

The SDK exports:

- `CHAINLINK_ORACLE_ADAPTER`
- `PYTH_ORACLE_ADAPTER`
- `DEFAULT_ORACLE_MAX_STALENESS_SECONDS` (`86400`)
- `CHAINLINK_ORACLE_FEEDS`
- `PYTH_ORACLE_FEEDS`
- `encodeSpreadOracleAdapterConfig(...)`
- `getSpreadOracleConfig(...)`

## Indexer read model (`MethodCurrency`)

`client.indexer.getDepositById(...)` and related methods return tuple rows with `rateSource`.
Common values:

- `ORACLE`: oracle-backed rate is active
- `ESCROW_FLOOR`: escrow floor is active
- `ORACLE_HALTED`: oracle configured but stale/invalid
- `NO_FLOOR`: no usable floor/rate configured

## Oracle halt semantics

When oracle config exists but the oracle result is stale/invalid/zero/reverted, the tuple is halted.

:::warning
Oracle halt does **not** fall back to fixed floor automatically. The tuple pauses until oracle config is fixed or removed.
:::

Operationally, that means:

- Effective rate becomes zero for matching
- New orders for that tuple are blocked
- Funds remain in the deposit

## Next pages

- [Back to Offramp Integration](offramp-integration.md)
