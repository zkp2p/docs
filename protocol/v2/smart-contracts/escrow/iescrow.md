---
id: v2-iescrow
title: IEscrow and IEscrowV2
---

`IEscrow` is the base escrow interface. `IEscrowV2` extends it with native oracle-backed ARM and delegated rate management.

If you are integrating V2 rate logic, use `IEscrowV2`.

## `IEscrow` base interface

The shared `IEscrow` surface includes:

- deposit structs and view helpers
- payment-method and currency listing
- lock / unlock hooks used by the orchestrator
- deposit admin functions such as delegates, retain-on-empty, and intent ranges

Important base structs:

```solidity
struct Range {
    uint256 min;
    uint256 max;
}

struct Deposit {
    address depositor;
    address delegate;
    IERC20 token;
    Range intentAmountRange;
    bool acceptingIntents;
    uint256 remainingDeposits;
    uint256 outstandingIntentAmount;
    address intentGuardian;
    bool retainOnEmpty;
}

struct Currency {
    bytes32 code;
    uint256 minConversionRate;
}
```

## `IEscrowV2` additions

V2 adds two new pricing concepts.

### Oracle-backed ARM

```solidity
struct OracleRateConfig {
    address adapter;
    bytes adapterConfig;
    uint16 spreadBps;
    uint32 maxStaleness;
}
```

The V2 `Currency` struct becomes:

```solidity
struct Currency {
    bytes32 code;
    uint256 minConversionRate;
    OracleRateConfig oracleRateConfig;
}
```

### Delegated rate management

```solidity
struct RateManagerConfig {
    address rateManager;
    bytes32 rateManagerId;
}
```

This is stored per deposit and points to the external `IRateManager` implementation that should supply delegated tuple rates.

## V2-only functions

`IEscrowV2` adds:

- `setOracleRateConfig`
- `setOracleRateConfigBatch`
- `removeOracleRateConfig`
- `setRateManager`
- `clearRateManager`
- `getDepositOracleRateConfig`
- `getDepositRateManager`
- `getEffectiveRate`
- `getManagerFee`

## V2-only events

`IEscrowV2` also adds:

- `DepositOracleRateConfigSet`
- `DepositOracleRateConfigRemoved`
- `DepositRateManagerSet`
- `DepositRateManagerCleared`

## When to use which interface

- Use `IEscrow` if you only need generic deposit custody and lock/unlock behavior.
- Use `IEscrowV2` if you need automated rate management, delegated rate management, or effective-rate resolution.

For resolution behavior, see [Escrow Rate Management](rate-management.md).
