---
id: indexer-queries
title: Indexer Pagination & Filtering
---

# Indexer Pagination & Filtering

## What this covers

How to use `client.indexer.*` for paginated deposit discovery, intent history, expired-intent cleanup, raw GraphQL, and conversion helpers.

## When to use this

Use the indexer when you need history, filtering, search, or vault analytics. Use RPC-first reads when you need the live on-chain source of truth right before a transaction.

## Query deposits with filters

```ts
const deposits = await client.indexer.getDeposits(
  {
    status: 'ACTIVE',
    depositor: '0xMakerAddress',
    acceptingIntents: true,
    minLiquidity: '1000000',
  },
  {
    limit: 50,
    offset: 0,
    orderBy: 'remainingDeposits',
    orderDirection: 'desc',
  },
);
```

Available deposit filters:

- `status`
- `depositor`
- `delegate`
- `delegateIsSet`
- `chainId`
- `escrowAddress`
- `escrowAddresses`
- `minLiquidity`
- `acceptingIntents`

## Include payment methods, currencies, and intents

```ts
const depositsWithRelations = await client.indexer.getDepositsWithRelations(
  { status: 'ACTIVE' },
  { limit: 20, orderBy: 'updatedAt', orderDirection: 'desc' },
  {
    includeIntents: true,
    intentStatuses: ['SIGNALED', 'FULFILLED'],
  },
);
```

## Pull intent history

```ts
const ownerIntents = await client.indexer.getOwnerIntents(buyerAddress, [
  'SIGNALED',
  'FULFILLED',
  'MANUAL_RELEASED',
]);

const expired = await client.indexer.getExpiredIntents({
  now: Math.floor(Date.now() / 1000).toString(),
  depositIds: ['0xescrow_12', '0xescrow_18'],
  limit: 100,
});
```

Composite deposit IDs are formatted as `escrowAddress_depositId`.

## Run a raw GraphQL query

When the flat helper namespace does not cover your exact shape yet, use `query()`:

```ts
const data = await client.indexer.query<{
  Deposit: Array<{ id: string; remainingDeposits: string }>;
}>({
  query: `
    query DepositsByLiquidity($min: numeric!) {
      Deposit(where: { remainingDeposits: { _gte: $min } }, limit: 5) {
        id
        remainingDeposits
      }
    }
  `,
  variables: { min: '1000000' },
});
```

## Convert indexer payloads into RPC-like views

```ts
import {
  convertDepositsForLiquidity,
  convertIndexerDepositToEscrowView,
  convertIndexerIntentsToEscrowViews,
} from '@zkp2p/sdk';

const deposits = await client.indexer.getDepositsWithRelations(
  { status: 'ACTIVE' },
  { limit: 10 },
);

const liquidityViews = convertDepositsForLiquidity(deposits, 8453, '0xescrowAddress');
const firstDepositView = convertIndexerDepositToEscrowView(
  deposits[0],
  8453,
  '0xescrowAddress',
);
const intentViews = convertIndexerIntentsToEscrowViews(
  deposits.flatMap((deposit) => deposit.intents ?? []),
);
```

## Key points

- Pagination is `limit` plus `offset`; there is no cursor helper in the public SDK today
- `getDepositsWithRelations()` is the best default for dashboards because it avoids N extra round trips
- `getExpiredIntents()` expects a current timestamp in seconds
- Use `query()` when you need a custom aggregate or schema-specific field that is not wrapped yet
