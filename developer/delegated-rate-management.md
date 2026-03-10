---
title: Delegated Rate Management
slug: /developer/delegated-rate-management
---

# Delegated Rate Management

Delegated rate management (DRM) lets a third-party manager control the active quote for a deposit without taking custody of the deposit funds.

Peer's product surfaces call these managers `vaults`.

:::note
There is no separate onchain `Vault` entity on `main`. Protocol-side delegation is a `RateManager` contract plus a deposit-level assignment in EscrowV2.
:::

## Contract model

Delegation has two layers:

1. A manager contract implements `IRateManager`.
2. A deposit opts into that manager through `EscrowV2.setRateManager`.

Relevant EscrowV2 calls:

- `setRateManager`
- `clearRateManager`
- `getDepositRateManager`
- `getEffectiveRate`
- `getManagerFee`

Relevant manager calls in the reference `RateManagerV1` implementation:

- `createRateManager`
- `setRateManagerConfig`
- `setFee`
- `setMinLiquidity`
- `setRate`
- `setRateBatch`

## Effective rate precedence

DRM never bypasses the deposit floor.

EscrowV2 resolves the active tuple rate in this order:

1. Compute `escrowFloor` from fixed floor and/or oracle spread.
2. If `escrowFloor == 0`, return `0`.
3. If the deposit is not delegated, return `escrowFloor`.
4. If delegated, ask the manager for a rate.
5. If the manager returns `0`, the delegated tuple is disabled and the result is `0`.
6. If the manager call reverts, EscrowV2 fails safe to `escrowFloor`.
7. Otherwise, return `max(managerRate, escrowFloor)`.

Implications:

- a manager cannot undercut the depositor floor
- a manager cannot revive a tuple that is halted by an invalid oracle
- a manager can disable a tuple by returning `0`

## SDK write examples

Create a vault:

```ts
await client.createRateManager({
  config: {
    manager: '0xManager',
    feeRecipient: '0xFeeRecipient',
    maxFee: 50_000_000_000_000_000n,
    fee: 10_000_000_000_000_000n,
    minLiquidity: 1_000_000n,
    name: 'USD Vault',
    uri: 'ipfs://vault-metadata',
  },
});
```

Delegate a deposit directly through EscrowV2:

```ts
await client.setRateManager({
  depositId: 42n,
  rateManagerAddress: '0xRateManagerRegistry',
  rateManagerId: '0xRateManagerId',
});
```

Update manager-side rates and fees:

```ts
await client.setVaultMinRate({
  rateManagerId: '0xRateManagerId',
  paymentMethodHash: '0xPaymentMethodHash',
  currencyHash: '0xCurrencyHash',
  rate: 1_035_000_000_000_000_000n,
});

await client.setVaultFee({
  rateManagerId: '0xRateManagerId',
  newFee: 20_000_000_000_000_000n,
});
```

Remove delegation:

```ts
await client.clearRateManager({ depositId: 42n });
```

If your app routes through the controller contract, the SDK also exposes `setDepositRateManager` and `clearDepositRateManager`.

## Manager fees

Manager fees are separate from the resolved gross rate.

At the indexer layer:

- `conversionRate` is the resolved gross rate before fee
- `takerConversionRate` is the all-in rate after manager fee

At the intent layer, the indexer snapshots:

- `rateManagerId`
- `managerFee`
- `managerFeeRecipient`
- `managerFeeAmount`
- `realizedManagerFeeAmount`

Use those fields for historical reporting. Do not recompute realized manager fees from today's vault settings.

## Read model

For vault discovery and analytics, use:

```ts
const managers = await client.indexer.getRateManagers({ limit: 25 });
const detail = await client.indexer.getRateManagerDetail('0xRateManagerId');
const delegations = await client.indexer.getRateManagerDelegations('0xRateManagerId');
const delegation = await client.indexer.getDelegationForDeposit('42', {
  escrowAddress: '0xEscrowAddress',
});
const history = await client.indexer.getManagerDailySnapshots('0xRateManagerId');
const manualUpdates = await client.indexer.getManualRateUpdates('0xRateManagerId');
const oracleUpdates = await client.indexer.getOracleConfigUpdates('0xRateManagerId');
```

For deposit-side rendering, rely on `Deposit` and `MethodCurrency`:

- `Deposit.rateManagerId`
- `Deposit.rateManagerAddress`
- `Deposit.delegatedAt`
- `MethodCurrency.managerRate`
- `MethodCurrency.managerFee`
- `MethodCurrency.rateManagerId`
- `MethodCurrency.rateSource`

## `rateSource` values during delegation

- `MANAGER`: manager rate beat the escrow floor
- `ESCROW_FLOOR`: the deposit floor won even though the tuple is delegated
- `MANAGER_DISABLED`: the manager returned `0` for that tuple
- `ORACLE_HALTED`: the deposit floor was halted before manager logic could apply

## React hooks

The React package exposes higher-level vault helpers:

- `useCreateVault`
- `useVaultDelegation`
- `useSetVaultFee`
- `useSetVaultMinRate`
- `useSetVaultConfig`

`useVaultDelegation` handles preflight simulation and supports batched clear-and-set flows when your wallet stack supports atomic batching.

## Common mistakes

- Do not treat `deposit.delegate` as vault delegation. It is a separate deposit admin role.
- Do not assume vaults override depositor risk controls. The deposit floor still binds the final quote.
- Do not use `QuoteCandidate` as your source of truth for delegated state. Use `Deposit`, `MethodCurrency`, `RateManager`, and intent snapshots instead.
