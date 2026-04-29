---
id: prepared-transactions
title: Prepared Transactions
---

# Prepared Transactions

## What this covers

How to use the SDK's `.prepare()` pattern for relayers, smart accounts, gas estimation, and user-operation batching.

## When to use this

Use prepared transactions whenever your app should not call `walletClient.sendTransaction()` directly.

## The common pattern

Most write methods in `@zkp2p/sdk` expose a `.prepare()` variant that returns:

```ts
type PreparedTransaction = {
  to: `0x${string}`;
  data: `0x${string}`;
  value: bigint;
  chainId: number;
};
```

The main exception is `createDeposit()`, which uses `prepareCreateDeposit()`.

## Prepare a taker transaction

```ts
const prepared = await client.signalIntent.prepare({
  depositId: 42n,
  amount: 250_000000n,
  toAddress: '0x0000000000000000000000000000000000000001',
  processorName: 'wise',
  payeeDetails: '0x0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
  fiatCurrencyCode: 'USD',
  conversionRate: 1_020000000000000000n,
});

await smartAccount.sendUserOperation({
  calls: [
    {
      to: prepared.to,
      data: prepared.data,
      value: prepared.value,
    },
  ],
});
```

The same pattern works for:

- `signalIntent.prepare()`
- `fulfillIntent.prepare()`
- `cancelIntent.prepare()`
- `releaseFundsToPayer.prepare()`
- `addFunds.prepare()`
- `removeFunds.prepare()`
- `withdrawDeposit.prepare()`
- `setVaultFee.prepare()`
- `setVaultMinRate.prepare()`
- `setVaultConfig.prepare()`

## Prepare a deposit creation

`createDeposit()` may also register payee details, so its prepared form returns both the payee payload and the calldata:

```ts
const { depositDetails, prepared } = await client.prepareCreateDeposit({
  token: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  amount: 1_000_000000n,
  intentAmountRange: {
    min: 25_000000n,
    max: 250_000000n,
  },
  processorNames: ['wise'],
  payeeData: [{ offchainId: 'maker@example.com' }],
  conversionRates: [[
    { currency: 'USD', conversionRate: '1015000000000000000' },
  ]],
});

console.log(depositDetails);
console.log(prepared.to, prepared.chainId);
```

## Smart-wallet pattern in React

Hooks such as `useCreateVault()` and `useVaultDelegation()` let you inject your own sender:

```tsx
import { useCreateVault } from '@zkp2p/sdk/react';

const { createVault, prepareCreateVault, txHash } = useCreateVault({
  client,
  sendTransaction: async ({ to, data, value }) => {
    return smartWallet.sendTransaction({ to, data, value });
  },
  referrer: ['acme-wallet'],
});

const manager = '0x0000000000000000000000000000000000000001' as const;
const feeRecipient = '0x0000000000000000000000000000000000000002' as const;

await createVault({
  config: {
    manager,
    feeRecipient,
    maxFee: 50_000000000000000n,
    fee: 10_000000000000000n,
    name: 'Acme Vault',
    uri: 'ipfs://vault-metadata',
  },
});
```

For delegation switches, `useVaultDelegation({ sendBatch })` can batch the clear-plus-set sequence into one user operation.

## Key points

- Prepared transactions are the right interface for EIP-4337, relayers, simulations, and hardware wallet review screens
- `txOverrides.referrer` is already encoded into the prepared calldata through ERC-8021 attribution
- `prepareCreateDeposit()` is the only deposit-creation path that keeps payee registration and calldata preparation together
- If you need the direct wallet path again, call the method itself instead of `.prepare()`
