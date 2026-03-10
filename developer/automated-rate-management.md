---
title: Automated Rate Management
slug: /developer/automated-rate-management
---

# Automated Rate Management

Automated rate management (ARM) is native EscrowV2 pricing logic.

There is no separate ARM contract. A deposit tuple becomes "automated" when you combine:

- a depositor-set fixed floor via `setCurrencyMinRate`, and/or
- an oracle-backed spread config via `setOracleRateConfig`

Peer's seller UI calls this mode `Market Tracking`.

## Contract model

ARM is configured per `(depositId, paymentMethod, currency)` tuple.

Relevant EscrowV2 entry points:

- `setCurrencyMinRate`
- `setOracleRateConfig`
- `setOracleRateConfigBatch`
- `removeOracleRateConfig`
- `getDepositCurrencyMinRate`
- `getEffectiveRate`

The tuple floor is resolved inside EscrowV2 as:

```text
escrowFloor = max(fixedFloor, oracleRateWithSpread)
```

If no rate manager is assigned, `getEffectiveRate` returns `escrowFloor`.

## Oracle halt semantics

This is the most important ARM edge case.

If a tuple has an oracle configured and the adapter quote is invalid, stale, future-dated, or zero, EscrowV2 resolves that tuple to `0`.

That means:

- the tuple is halted
- `getEffectiveRate` returns `0`
- the fixed floor does not automatically take over while the oracle config is still present

To restore fixed-floor-only behavior, remove the oracle config with `removeOracleRateConfig`.

## SDK write examples

```ts
import {
  resolveFiatCurrencyBytes32,
  resolvePaymentMethodHash,
} from '@zkp2p/sdk';

const paymentMethodHash = resolvePaymentMethodHash('wise', { env: 'production' });
const currencyHash = resolveFiatCurrencyBytes32('USD');

await client.setCurrencyMinRate({
  depositId: 42n,
  paymentMethod: paymentMethodHash,
  fiatCurrency: currencyHash,
  minConversionRate: 1_020_000_000_000_000_000n,
});

await client.setOracleRateConfig({
  depositId: 42n,
  paymentMethodHash,
  currencyHash,
  config: {
    adapter: '0xOracleAdapter',
    adapterConfig: '0x',
    spreadBps: 75,
    maxStaleness: 180,
  },
});
```

Batch configuration is available through `setOracleRateConfigBatch` when you want to update several tuples in one transaction.

## Read model

Use the indexer `MethodCurrency` entity for the current resolved ARM state.

Fields to rely on:

- `minConversionRate`: depositor-set fixed floor
- `adapter`, `adapterConfig`, `feed`, `feedDecimals`, `spreadBps`, `maxStaleness`, `invert`
- `oracleRate`: raw oracle price before spread
- `effectiveOracleRate`: oracle price after spread
- `lastOracleUpdatedAt`
- `conversionRate`: final resolved gross rate
- `rateSource`

`QuoteCandidate` is a denormalized quoting surface. It is useful for order book views, but it is not the authoritative ARM state model.

## Interpreting `rateSource`

`MethodCurrency.rateSource` tells you why the final rate resolved the way it did:

- `ORACLE`: the oracle-backed spread floor beat the fixed floor
- `ESCROW_FLOOR`: the fixed floor won, or there was no stronger oracle floor
- `ORACLE_HALTED`: an oracle was configured, but the tuple resolved to zero
- `NO_FLOOR`: neither a usable fixed floor nor a usable oracle floor existed

If the deposit is delegated, you can also see `MANAGER` or `MANAGER_DISABLED`. Those are documented in [Delegated Rate Management](delegated-rate-management.md).

## Operational guidance

- Use `setCurrencyMinRate` even on oracle-backed tuples when you want an explicit minimum acceptable rate.
- Treat `ORACLE_HALTED` as a blocking state. The tuple is not merely "degraded"; it is disabled until the oracle is usable again or removed.
- Prefer `MethodCurrency` for UI state and alerting, because it already carries the resolved rate, source, and oracle metadata in one place.
