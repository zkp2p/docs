---
id: offramp-integration
title: Offramp Integration
slug: /offramp
---

# Offramp Integration

The ZKP2P Client SDK is a TypeScript SDK for liquidity providers who want to offer fiat off-ramp services on Base. Use it to create and manage USDC deposits, configure payment methods and currencies, and query on-chain state with RPC-first reads.

## Who is this for?

This SDK is designed for liquidity providers (peers) who want to:
- Create and manage USDC deposits that accept fiat payments
- Configure payment methods, currencies, and conversion rates
- Monitor deposit utilization and manage liquidity
- Earn fees by providing off-ramp services

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
import { OfframpClient } from '@zkp2p/sdk';
import { createWalletClient, custom } from 'viem';
import { base } from 'viem/chains';

const walletClient = createWalletClient({
  chain: base,
  transport: custom(window.ethereum),
});

const client = new OfframpClient({
  walletClient,
  chainId: base.id,
});
```

## Core operations

### Create a deposit

```ts
import { Currency } from '@zkp2p/sdk';

await client.createDeposit({
  token: '0xUSDC_ADDRESS',
  amount: 10000000000n, // 10,000 USDC (6 decimals)
  intentAmountRange: { min: 100000n, max: 1000000000n },
  processorNames: ['wise', 'revolut'],
  depositData: [
    { wisetag: 'maker' },           // Wise payee details
    { revolutUsername: 'maker' },   // Revolut payee details
  ],
  conversionRates: [
    [{ currency: Currency.USD, conversionRate: '1020000000000000000' }], // 1.02 (18 decimals)
    [{ currency: Currency.EUR, conversionRate: '950000000000000000' }],  // 0.95 (18 decimals)
  ],
  onSuccess: ({ hash }) => console.log('Deposit created:', hash),
});
```

### Manage deposit settings

```ts
await client.setAcceptingIntents({ depositId: 1n, accepting: true });

await client.setIntentRange({ depositId: 1n, min: 50000n, max: 5000000n });

await client.setCurrencyMinRate({
  depositId: 1n,
  paymentMethod: '0x...',
  fiatCurrency: '0x...',
  minConversionRate: 1020000n,
});
```

### Fund management

```ts
await client.addFunds({ depositId: 1n, amount: 5000000n });
await client.removeFunds({ depositId: 1n, amount: 1000000n });
await client.withdrawDeposit({ depositId: 1n });
```

## Querying on-chain data (RPC-first)

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

```ts
const deposits = await client.indexer.getDeposits(
  { status: 'ACTIVE', minLiquidity: '1000000', depositor: '0xYourAddress' },
  { limit: 50, orderBy: 'remainingDeposits', orderDirection: 'desc' }
);

const depositsWithRelations = await client.indexer.getDepositsWithRelations(
  { status: 'ACTIVE' },
  { limit: 50 },
  { includeIntents: true, intentStatuses: ['SIGNALED'] }
);

const fulfillments = await client.indexer.getFulfilledIntentEvents(['0x...']);
```

## Payment methods

Supported payment platforms and keys:

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
| Chime | `chime` |
| Luxon | `luxon` |
| N26 | `n26` |

Each item in `depositData` must line up by index with `processorNames`. If you pass `payeeDetailsHashes` to `createDeposit()`, the SDK uses those hashes directly and skips the curator call. Otherwise the SDK forwards each `depositData` object to curator's public `/v1/makers/create` endpoint to obtain the hashes, so the key names need to match the processor exactly. Either path works without an API key — you can also call `registerPayeeDetails()` standalone to get the hashes ahead of time.

The expected `depositData` shape for each platform is:

| Platform | Key | `depositData` shape | Notes |
|----------|-----|---------------------|-------|
| Wise | `wise` | `{ wisetag: 'your-wisetag' }` | Pass the Wisetag without `@`. Wise uses a manual approval flow in curator. |
| Venmo | `venmo` | `{ venmoUsername: 'YourVenmoUsername' }` | Do not include `@`. Curator validates the exact Venmo username casing. |
| Revolut | `revolut` | `{ revolutUsername: 'your-revtag' }` | Do not include `@`. |
| Cash App | `cashapp` | `{ cashtag: 'yourcashtag' }` | Do not include `$`. |
| PayPal | `paypal` | `{ paypalEmail: 'maker@example.com' }` | Use the payee's PayPal email address. |
| Zelle | `zelle` | `{ zelleEmail: 'maker@example.com' }` | Curator expects a lowercase email address. |
| Monzo | `monzo` | `{ monzoMeUsername: 'your-monzo-me-name' }` | Use the Monzo.me username only. |
| Mercado Pago | `mercadopago` | `{ cvu: '0000003100064367123868' }` | CVU must be a valid 22-digit Mercado Pago / bank CVU. |
| Chime | `chime` | `{ chimesign: '$yourchimesign' }` | Include the leading `$`. Curator expects the value in lowercase. |
| Luxon | `luxon` | `{ luxonUsername: 'maker@example.com' }` | Use a lowercase Luxon email address. |
| N26 | `n26` | `{ iban: 'DE89370400440532013000' }` | Pass a valid IBAN with spaces removed. |

```ts
import { getPaymentMethodsCatalog, PLATFORM_METADATA, PAYMENT_PLATFORMS } from '@zkp2p/sdk';

console.log(PAYMENT_PLATFORMS);

const methods = getPaymentMethodsCatalog(8453, 'production');
const wiseHash = methods['wise'].paymentMethodHash;

const wiseInfo = PLATFORM_METADATA['wise'];
console.log(wiseInfo.displayName);
```

## Currency utilities

```ts
import {
  Currency,
  currencyInfo,
  getCurrencyInfoFromHash,
  resolveFiatCurrencyBytes32,
} from '@zkp2p/sdk';

const usd = Currency.USD;
const info = currencyInfo[Currency.USD];
const usdBytes = resolveFiatCurrencyBytes32('USD');
```

## Contract helpers

```ts
import { getContracts, getPaymentMethodsCatalog } from '@zkp2p/sdk';

const { addresses, abis } = getContracts(8453, 'production');
const catalog = getPaymentMethodsCatalog(8453, 'production');
```

## Supported networks

| Network | Chain ID | Environment |
|---------|----------|-------------|
| Base Mainnet | 8453 | `production` |
| Base Mainnet | 8453 | `preproduction` |
| Base Mainnet | 8453 | `staging` |

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

## Logging

```ts
import { setLogLevel } from '@zkp2p/sdk';

setLogLevel('debug'); // 'debug' | 'info' | 'error'
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
