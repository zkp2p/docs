---
id: offramp-integration
title: Offramp Integration
slug: /developer/offramp
---

# Offramp Integration

Use `@zkp2p/sdk` to create and manage seller deposits, configure automated rate management, delegate pricing to vaults, and read deposit state from RPC or the indexer.

The current public client is `Zkp2pClient`.

## What you can build

- Seller dashboards that create and manage deposits
- Backends that rebalance rates or toggle deposit state
- Vault tooling for delegated rate management
- Analytics surfaces that read deposit, intent, and manager state from `client.indexer.*`

## Installation

```bash
npm install @zkp2p/sdk viem
# or
yarn add @zkp2p/sdk viem
# or
pnpm add @zkp2p/sdk viem
```

## Quick start

### Initialize the client

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
  runtimeEnv: 'production',
  apiKey: 'YOUR_CURATOR_API_KEY',
  indexerApiKey: 'YOUR_INDEXER_API_KEY',
});
```

## Rate modes

Each deposit pair can run in one of three pricing modes:

- `Fixed`: you set `minConversionRate` directly on the deposit.
- `Automated Rate Management`: EscrowV2 applies an oracle-backed spread and enforces the higher of your fixed floor and the oracle-backed floor.
- `Delegated`: a vault manager sets the active rate, but EscrowV2 still enforces the deposit floor.

See [Automated Rate Management](automated-rate-management.md) and [Delegated Rate Management](delegated-rate-management.md) for the full behavior and edge cases.

## Create a deposit

`createDeposit` accepts product-friendly payment method names plus deposit metadata. It resolves the onchain payment method hashes for you.

```ts
import { Currency } from '@zkp2p/sdk';

await client.createDeposit({
  token: '0xUSDC_ADDRESS',
  amount: 10_000_000n,
  intentAmountRange: { min: 100000n, max: 1000000000n },
  processorNames: ['wise', 'revolut'],
  depositData: [
    { email: 'maker@example.com' },
    { tag: '@maker' },
  ],
  conversionRates: [
    [{ currency: Currency.USD, conversionRate: '1020000000000000000' }],
    [{ currency: Currency.EUR, conversionRate: '950000000000000000' }],
  ],
  retainOnEmpty: true,
});
```

`createDeposit` requires either:

- `apiKey` or `authorizationToken`, so the SDK can register payee details through the curator API, or
- `payeeDetailsHashes`, if your app already registered payee details separately.

## Manage deposit settings

```ts
await client.setAcceptingIntents({ depositId: 1n, accepting: true });

await client.setIntentRange({ depositId: 1n, min: 50000n, max: 5000000n });
await client.setRetainOnEmpty({ depositId: 1n, retain: true });
await client.setDelegate({ depositId: 1n, delegate: '0xDelegateAddress' });
```

### Fund management

```ts
await client.addFunds({ depositId: 1n, amount: 5000000n });
await client.removeFunds({ depositId: 1n, amount: 1000000n });
await client.withdrawDeposit({ depositId: 1n });
```

## Direct rate updates

For fixed-rate or floor updates, resolve the payment method and currency keys and call EscrowV2 helpers directly:

```ts
import {
  resolveFiatCurrencyBytes32,
  resolvePaymentMethodHash,
} from '@zkp2p/sdk';

const paymentMethod = resolvePaymentMethodHash('wise', { env: 'production' });
const fiatCurrency = resolveFiatCurrencyBytes32('USD');

await client.setCurrencyMinRate({
  depositId: 42n,
  paymentMethod,
  fiatCurrency,
  minConversionRate: 1_020_000_000_000_000_000n,
});
```

For oracle-backed pricing, configure the tuple on EscrowV2:

```ts
await client.setOracleRateConfig({
  depositId: 42n,
  paymentMethodHash: paymentMethod,
  currencyHash: fiatCurrency,
  config: {
    adapter: '0xOracleAdapter',
    adapterConfig: '0x',
    spreadBps: 75,
    maxStaleness: 180,
  },
});
```

If you want to stop using the oracle for a pair, call `removeOracleRateConfig`. That restores pricing to the fixed floor only.

## Vault / delegated pricing

The SDK exposes both deposit-side delegation and manager-side vault administration.

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

await client.setRateManager({
  depositId: 42n,
  rateManagerAddress: '0xRateManagerRegistry',
  rateManagerId: '0xRateManagerId',
});

await client.setVaultMinRate({
  rateManagerId: '0xRateManagerId',
  paymentMethodHash: paymentMethod,
  currencyHash: fiatCurrency,
  rate: 1_035_000_000_000_000_000n,
});

await client.setVaultFee({
  rateManagerId: '0xRateManagerId',
  newFee: 20_000_000_000_000_000n,
});
```

If your environment routes delegation through a controller contract, the SDK also exposes `setDepositRateManager` and `clearDepositRateManager`.

## Query on-chain state (RPC-first)

```ts
const deposits = await client.getDeposits();
const ownerDeposits = await client.getAccountDeposits('0xOwnerAddress');
const deposit = await client.getDeposit(42n);
const batch = await client.getDepositsById([1n, 2n, 3n]);

const intents = await client.getIntents();
const ownerIntents = await client.getAccountIntents('0xOwnerAddress');
const intent = await client.getIntent('0xIntentHash...');
```

## Indexer queries

Use RPC for immediate contract reads and `client.indexer` for richer ARM/DRM state.

```ts
const deposits = await client.indexer.getDeposits(
  { status: 'ACTIVE', depositor: '0xYourAddress' },
  { limit: 50, orderBy: 'remainingDeposits', orderDirection: 'desc' },
);

const depositsWithRelations = await client.indexer.getDepositsWithRelations(
  { status: 'ACTIVE' },
  { limit: 50 },
  { includeIntents: true, intentStatuses: ['SIGNALED'] },
);

const vaults = await client.indexer.getRateManagers({ limit: 25 });
const vaultDetail = await client.indexer.getRateManagerDetail('0xRateManagerId');
const delegation = await client.indexer.getDelegationForDeposit('42', {
  escrowAddress: '0xEscrowAddress',
});
```

For ARM and DRM, the most useful indexer entity is `MethodCurrency`. It includes:

- `minConversionRate`: the depositor-set fixed floor
- `managerRate`: the delegated manager quote before floor enforcement
- `conversionRate`: the final resolved gross rate
- `takerConversionRate`: the buyer-facing all-in rate after manager fee
- `rateSource`: `MANAGER`, `ORACLE`, `ESCROW_FLOOR`, `MANAGER_DISABLED`, `ORACLE_HALTED`, or `NO_FLOOR`

`Deposit` also carries `rateManagerId`, `rateManagerAddress`, and `delegatedAt`.

## Payment methods and contract helpers

The SDK exports helpers for payment method catalogs, bytes32 resolution, and deployments:

```ts
import {
  getContracts,
  getPaymentMethodsCatalog,
  resolveFiatCurrencyBytes32,
  resolvePaymentMethodHash,
} from '@zkp2p/sdk';

const { addresses } = getContracts(8453, 'production');
const catalog = getPaymentMethodsCatalog(8453, 'production');
const wiseHash = resolvePaymentMethodHash('wise', { env: 'production' });
const usdHash = resolveFiatCurrencyBytes32('USD');
```

Supported payment platforms include:

| Platform | Key |
|----------|-----|
| Wise | `wise` |
| Venmo | `venmo` |
| Revolut | `revolut` |
| CashApp | `cashapp` |
| PayPal | `paypal` |
| Zelle | `zelle` |
| Monzo | `monzo` |
| MercadoPago | `mercadopago` |

## Supported networks

| Network | Chain ID | Environment |
|---------|----------|-------------|
| Base Mainnet | 8453 | `production` |
| Base Sepolia | 84532 | `staging` |

## Token allowance management

```ts
import { getContracts } from '@zkp2p/sdk';

const { addresses } = getContracts(8453, 'production');

const result = await client.ensureAllowance({
  token: '0xUSDC_ADDRESS',
  amount: 10000000000n,
  spender: addresses.escrow,
  maxApprove: false,
});

if (result.hadAllowance) {
  console.log('Already had sufficient allowance');
} else {
  console.log('Approval transaction:', result.hash);
}
```

## Next pages

- [Automated Rate Management](automated-rate-management.md)
- [Delegated Rate Management](delegated-rate-management.md)
- [Post-Intent Hooks](post-intent-hooks.md)

## Error handling

```ts
import { ValidationError, NetworkError, ContractError } from '@zkp2p/sdk';

try {
  await client.createDeposit({ /* ... */ });
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Invalid parameters:', error.message);
  } else if (error instanceof NetworkError) {
    console.error('Network issue:', error.message);
  } else if (error instanceof ContractError) {
    console.error('Contract error:', error.message);
  }
}
```

:::note
`deposit.delegate` and delegated rate management solve different problems. A deposit delegate can update deposit config on behalf of the owner. A rate manager controls the active quote for delegated tuples.
:::
}
```

## Logging

```ts
import { setLogLevel } from '@zkp2p/sdk';

setLogLevel('debug'); // 'debug' | 'info' | 'warn' | 'error' | 'none'
```

## React hooks

```tsx
import {
  useCreateDeposit,
  useAddFunds,
  useRemoveFunds,
  useWithdrawDeposit,
  useSetAcceptingIntents,
  useSetIntentRange,
  useSetCurrencyMinRate,
} from '@zkp2p/sdk/react';

function DepositManager({ client }) {
  const { createDeposit, isLoading, error } = useCreateDeposit({ client });

  const handleCreate = async () => {
    const result = await createDeposit({
      token: '0xUSDC_ADDRESS',
      amount: 10000000000n,
      intentAmountRange: { min: 100000n, max: 1000000000n },
      processorNames: ['wise'],
      depositData: [{ email: 'maker@example.com' }],
      conversionRates: [[{ currency: 'USD', conversionRate: '1020000000000000000' }]],
    });
    console.log('Created deposit:', result.hash);
  };

  return (
    <div>
      <button disabled={isLoading} onClick={handleCreate}>
        {isLoading ? 'Creating...' : 'Create Deposit'}
      </button>
      {error && <p>Error: {error.message}</p>}
    </div>
  );
}
```
