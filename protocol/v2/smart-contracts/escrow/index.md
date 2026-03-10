---
title: Escrow
---

# EscrowV2

EscrowV2 is the liquidity and pricing core for V2 off-ramping.

It is responsible for:

- holding maker funds
- storing supported payment methods and fiat currencies
- enforcing tuple-level rate controls
- locking and unlocking liquidity for intents
- exposing delegated rate manager assignments

EscrowV2 is also where automated rate management lives. There is no separate ARM contract.

## Deposit model

Each deposit stores:

- `depositor`: the owner of the funds
- `delegate`: an optional config delegate that can manage the deposit on the owner's behalf
- `intentAmountRange`: min and max intent size
- `acceptingIntents`
- `remainingDeposits`
- `outstandingIntentAmount`
- `intentGuardian`
- `retainOnEmpty`

Each supported payment-method and currency tuple stores:

- a fixed `minConversionRate`
- an optional `OracleRateConfig`
- an optional delegated manager assignment at the deposit level

:::note
`delegate` and delegated rate management are different concepts. `delegate` is a deposit admin role. Delegated rate management is a pricing relationship to an external `IRateManager`.
:::

## Key write functions

### Deposit lifecycle

- `createDeposit`
- `depositTo`
- `addFunds`
- `removeFunds`
- `withdrawDeposit`
- `setAcceptingIntents`
- `setIntentRange`
- `setRetainOnEmpty`
- `setDelegate`
- `removeDelegate`

### Payment-method and currency config

- `addPaymentMethods`
- `setPaymentMethodActive`
- `addCurrencies`
- `deactivateCurrency`

### ARM and delegated pricing

- `setCurrencyMinRate`
- `setOracleRateConfig`
- `setOracleRateConfigBatch`
- `removeOracleRateConfig`
- `setRateManager`
- `clearRateManager`

The detailed rate-resolution rules are documented in [Escrow Rate Management](rate-management.md).

## Intent liquidity flow

EscrowV2 itself does not verify offchain payment proofs. The Orchestrator and payment verifiers do that.

EscrowV2 handles the liquidity side:

- `lockFunds`: reserves deposit liquidity for a signaled intent
- `unlockFunds`: releases liquidity back to the deposit on cancel or prune
- `unlockAndTransferFunds`: releases fulfilled liquidity to the orchestrator for payout
- `extendIntentExpiry`: extends a lock via the configured guardian flow

## Rate resolution summary

For any tuple, EscrowV2 computes the effective rate in this order:

1. Resolve the escrow floor from fixed floor and optional oracle-backed spread.
2. If that floor is zero, the tuple is halted.
3. If no rate manager is assigned, return the escrow floor.
4. If delegated, ask the manager for a tuple rate.
5. Return `max(managerRate, escrowFloor)`, subject to the manager-disabled and manager-revert rules.

## Read helpers

Useful view methods:

- `getDeposit`
- `getDepositPaymentMethods`
- `getDepositCurrencies`
- `getDepositCurrencyMinRate`
- `getDepositOracleRateConfig`
- `getDepositRateManager`
- `getEffectiveRate`
- `getManagerFee`
- `getExpiredIntents`

For interface details, see [IEscrow and IEscrowV2](iescrow.md).

## Fees

EscrowV2 participates in three distinct fee surfaces:

- protocol sustainability fee
- payment verifier fee share
- delegated manager fee, exposed via `getManagerFee`

Manager fees are applied by the orchestrator on release. The manager fee is not baked into the gross `getEffectiveRate` result.

## Related pages

- [Escrow Rate Management](rate-management.md)
- [RateManagerV1](../rate-manager-v1.md)
- [IEscrow and IEscrowV2](iescrow.md)
