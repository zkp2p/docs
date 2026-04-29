---
id: error-handling
title: Error Handling & Retries
---

# Error Handling & Retries

## What this covers

How to branch on SDK error classes, surface actionable messages to users, and retry transient failures without hiding contract bugs.

## When to use this

Use this pattern in any app that sends real transactions or talks to the quote and indexer APIs in production.

## Handle the SDK error model

```ts
import {
  APIError,
  ContractError,
  ErrorCode,
  NetworkError,
  ValidationError,
  ZKP2PError,
} from '@zkp2p/sdk';

try {
  await client.createDeposit({
    token: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
    amount: 1_000_000000n,
    intentAmountRange: { min: 25_000000n, max: 250_000000n },
    processorNames: ['wise'],
    payeeData: [{ offchainId: 'maker@example.com' }],
    conversionRates: [[
      { currency: 'USD', conversionRate: '1015000000000000000' },
    ]],
  });
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('validation', error.field, error.message, error.details);
  } else if (error instanceof APIError) {
    console.error('api', error.status, error.message, error.details);
  } else if (error instanceof NetworkError) {
    console.error('network', error.message);
  } else if (error instanceof ContractError) {
    console.error('contract', error.message, error.details);
  } else if (error instanceof ZKP2PError) {
    console.error('sdk', error.code ?? ErrorCode.UNKNOWN, error.message);
  } else {
    console.error('unknown', error);
  }
}
```

## Retry only the transient failures

```ts
async function withNetworkRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (!(error instanceof NetworkError) || attempt === attempts) {
        throw error;
      }

      const delayMs = 250 * 2 ** (attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw lastError;
}

const quote = await withNetworkRetry(() =>
  client.getQuote({
    paymentPlatforms: ['wise'],
    fiatCurrency: 'USD',
    user: buyerAddress,
    recipient: buyerAddress,
    destinationChainId: 8453,
    destinationToken: usdc,
    amount: '50',
    isExactFiat: true,
  }),
);
```

## Contract errors need user action

Contract failures usually mean the inputs were valid but the on-chain state changed underneath you.

```ts
try {
  await client.addFunds({
    depositId: 42n,
    amount: 500_000000n,
  });
} catch (error) {
  if (error instanceof ContractError) {
    throw new Error(
      'The transaction simulated but failed on-chain. Check allowance, token balance, and whether the deposit still exists.',
    );
  }
  throw error;
}
```

## Turn on debug logging when you need it

```ts
import { setLogLevel } from '@zkp2p/sdk';

setLogLevel('debug');
```

Use `debug` in development or during incident response, then move back to `info` or `error`.

## Key points

- `ValidationError.field` is the quickest way to map an SDK failure back to a form field
- `APIError.status` is useful for quote and seller-credential flows
- Retry `NetworkError`, not `ValidationError` or `ContractError`
- Keep one user-facing message and one structured internal log; do not leak raw proof payloads into logs
