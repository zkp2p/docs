---
id: environments
title: Multi-Environment Deployment
---

# Multi-Environment Deployment

## What this covers

How to switch the SDK between production, preproduction, and staging without rewriting your app code.

## When to use this

Use this when you want one codebase for local development, integration testing, and mainnet launch readiness.

## Environment selection

| `runtimeEnv` | Best use | Notes |
| --- | --- | --- |
| `production` | Real users and live liquidity | Default |
| `preproduction` | Integration testing with production-style services | Good pre-launch step |
| `staging` | Development and rehearsal environments | Useful for SDK and contract drills |

## Initialize from env vars

```ts
import { Zkp2pClient, getContracts } from '@zkp2p/sdk';
import { privateKeyToAccount } from 'viem/accounts';
import { createWalletClient, http } from 'viem';
import { base } from 'viem/chains';

const runtimeEnv =
  process.env.RUNTIME_ENV === 'staging'
    ? 'staging'
    : process.env.RUNTIME_ENV === 'preproduction'
      ? 'preproduction'
      : 'production';

const walletClient = createWalletClient({
  account: privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`),
  chain: base,
  transport: http(process.env.RPC_URL),
});

const client = new Zkp2pClient({
  walletClient,
  chainId: base.id,
  runtimeEnv,
  indexerUrl: process.env.INDEXER_URL,
  baseApiUrl: process.env.BASE_API_URL,
  indexerApiKey: process.env.INDEXER_API_KEY,
});

const { addresses } = getContracts(base.id, runtimeEnv);
console.log(addresses.escrow, addresses.orchestratorV2);
```

## Override service URLs

You only need overrides when you are pointing at a non-standard deployment or a proxy layer you control.

- `indexerUrl`: custom GraphQL endpoint
- `baseApiUrl`: custom curator or API host
- `indexerApiKey`: `x-api-key` header for indexer proxy auth
- `authorizationToken` / `getAuthorizationToken`: bearer auth for long-lived clients

## A practical rollout pattern

1. Develop locally against `staging`
2. Run pre-launch integration tests against `preproduction`
3. Flip the same app code to `production` once you are ready for real users

## Key points

- The SDK environment controls contract resolution and default service endpoints
- `getContracts(chainId, env)` is the safest way to verify the addresses you are about to use
- Keep overrides in env vars instead of hard-coding them inside app logic
- If your app has both backend and frontend clients, keep their `runtimeEnv` values aligned
