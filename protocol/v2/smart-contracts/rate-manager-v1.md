---
title: RateManagerV1
---

# RateManagerV1

`RateManagerV1` is the reference delegated rate management contract on `main`.

It is intentionally narrow:

- it stores manager-owned tuple rates
- it stores manager fee and metadata
- it validates opt-in rules like `minLiquidity`
- it does not custody deposits
- it does not enforce depositor floors

EscrowV2 remains the final authority on the effective quote.

## Core config

Each manager id stores:

```solidity
struct RateManagerConfig {
    address manager;
    address feeRecipient;
    uint256 maxFee;
    uint256 fee;
    uint256 minLiquidity;
    string name;
    string uri;
}
```

Rates are stored per manager id, payment method, and fiat currency.

## Fee limits

`RateManagerV1` enforces:

```solidity
uint256 public constant GLOBAL_MAX_MANAGER_FEE = 5e16; // 5%
```

At creation time:

- `maxFee` must be `<= 5%`
- `fee` must be `<= maxFee`
- nonzero `fee` requires a nonzero `feeRecipient`

Later, `setFee` enforces the same `fee <= maxFee` rule.

## Creation and admin

Manager-side writes:

- `createRateManager`
- `setRateManagerConfig`
- `setFee`
- `setMinLiquidity`
- `setRate`
- `setRateBatch`

The `manager` address is the only address allowed to mutate that manager id.

`maxFee` is immutable after creation.

## Opt-in callback

EscrowV2 calls `onDepositOptIn` when a deposit delegates to a manager.

`RateManagerV1` rejects opt-in when:

- the calling escrow is not whitelisted in the escrow registry
- the manager id does not exist
- the deposit liquidity is below `minLiquidity`

Liquidity is measured as:

```text
remainingDeposits + outstandingIntentAmount
```

This makes `minLiquidity` a deposit-entry requirement, not a runtime pricing formula.

## View interface

`RateManagerV1` implements `IRateManager`:

- `getRate`
- `getFee`
- `isRateManager`
- `onDepositOptIn`

Additional convenience views:

- `getRateManager`
- `getManagerRate`

## Escrow interaction

`getRate` returns the manager-set tuple rate only.

EscrowV2 decides how that rate is used:

- if the manager rate is `0`, the delegated tuple is disabled
- if the manager rate is below the deposit floor, the floor wins
- if the manager call reverts, EscrowV2 falls back to the escrow floor

That means `RateManagerV1` should be understood as a registry, not as a full quoting engine.

## Product terminology

Peer UI surfaces call these managers `vaults`.

That is a product concept, not a distinct onchain contract type. Onchain, a vault is simply:

- a `RateManagerV1` manager id, plus
- one or more deposits delegated to it in EscrowV2
