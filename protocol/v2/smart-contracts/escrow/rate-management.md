---
title: Escrow Rate Management
---

# Escrow Rate Management

EscrowV2 combines two pricing layers:

- tuple-level floor management inside EscrowV2
- optional deposit-level delegated pricing through `IRateManager`

This page documents how those layers compose.

## Tuple-level state

Every `(depositId, paymentMethod, currency)` tuple may have:

- a fixed floor in `depositCurrencyMinRate`
- an optional `OracleRateConfig`

The `OracleRateConfig` struct is:

```solidity
struct OracleRateConfig {
    address adapter;
    bytes adapterConfig;
    uint16 spreadBps;
    uint32 maxStaleness;
}
```

If `adapter == address(0)`, oracle-backed pricing is disabled for that tuple.

## Fixed floor writes

`setCurrencyMinRate` updates the depositor floor for a listed tuple.

Important behavior:

- zero is allowed
- zero disables the fixed floor
- zero does not remove an oracle config

## Oracle-backed ARM writes

EscrowV2 exposes:

- `setOracleRateConfig`
- `setOracleRateConfigBatch`
- `removeOracleRateConfig`

The adapter returns a market quote. EscrowV2 applies `spreadBps` on top of that quote and rounds up.

## Escrow floor resolution

Internally, EscrowV2 computes:

```text
spreadRate = oracleQuoteWithSpread
escrowFloor = max(fixedRate, spreadRate)
```

But there is one exception:

If an oracle is configured and `spreadRate == 0`, EscrowV2 returns `0` for the tuple instead of falling back to the fixed floor.

## Oracle halt conditions

An oracle-backed tuple halts when the adapter resolves an unusable quote, including:

- invalid quote flag
- zero market rate
- zero update timestamp
- future-dated update timestamp
- quote older than `maxStaleness`
- adapter call revert

When that happens:

- `_getDepositCurrencyMinRate` returns `0`
- `getEffectiveRate` returns `0`
- the tuple is disabled until the oracle recovers or the config is removed

## Delegated manager assignment

At the deposit level, EscrowV2 stores:

```solidity
struct RateManagerConfig {
    address rateManager;
    bytes32 rateManagerId;
}
```

The depositor can:

- opt in with `setRateManager`
- remove delegation with `clearRateManager`

Only the deposit owner can set or clear a rate manager. The deposit `delegate` role cannot do this.

When opting in, EscrowV2 immediately calls:

```solidity
IRateManager(_rateManager).onDepositOptIn(_depositId, _rateManagerId);
```

If that callback reverts, the delegation fails.

## `getEffectiveRate` precedence

`getEffectiveRate` resolves the final gross tuple rate with the following rules:

1. Compute `escrowFloor`.
2. If `escrowFloor == 0`, return `0`.
3. If there is no manager, return `escrowFloor`.
4. If there is a manager, call `IRateManager.getRate(...)`.
5. If the manager returns `0`, return `0`.
6. If the manager reverts, return `escrowFloor`.
7. Otherwise, return `max(delegatedRate, escrowFloor)`.

This gives EscrowV2 three important safety properties:

- manager quotes cannot undercut the deposit floor
- manager outages fail safe to the escrow floor
- oracle-halted tuples stay halted even when delegated

## Manager fees

EscrowV2 also exposes:

```solidity
function getManagerFee(uint256 _depositId)
    external
    view
    returns (address recipient, uint256 fee);
```

If the manager call reverts, EscrowV2 fails safe to `(address(0), 0)`.

This fee is used by the orchestrator during payout. It does not change the gross value returned by `getEffectiveRate`.

## Indexer alignment

The indexer mirrors these rules onto `MethodCurrency`:

- `minConversionRate`
- `managerRate`
- `managerFee`
- `conversionRate`
- `takerConversionRate`
- `rateSource`

`rateSource` can be:

- `MANAGER`
- `ORACLE`
- `ESCROW_FLOOR`
- `MANAGER_DISABLED`
- `ORACLE_HALTED`
- `NO_FLOOR`
