---
id: maker-bot
title: Build a Maker Bot
---

# Build a Maker Bot

## What this does

This tutorial shows how to run a Node.js bot that creates deposits, monitors signaled intents, prunes expired reservations, and manages liquidity over time.

## Who is this for?

Use this if you are supplying fiat-liquidity inventory and want operations code around deposits instead of a browser UI.

## Important note

A maker bot manages the supply side. It typically does **not** call `fulfillIntent()` itself because the taker owns the payment proof. The bot watches signaled intents, watches for fulfillment, and decides when to top up, pause, reject, or prune.

If you operate both sides of the flow, you can still call `client.fulfillIntent()` from a separate taker service once the proof is available.

## Prerequisites

- Node.js 20+ or Bun
- A Base RPC URL
- A maker wallet with ETH for gas and USDC for liquidity
- Off-chain logic that watches incoming fiat payments

## 1. Create the project

```bash
mkdir peer-maker-bot
cd peer-maker-bot
bun init -y
bun add @zkp2p/sdk viem dotenv
```

Create `.env`:

```bash
PRIVATE_KEY=0x...
RPC_URL=https://base-mainnet.g.alchemy.com/v2/your-key
RUNTIME_ENV=production
```

## 2. Bootstrap the client

Create `src/bot.ts`:

```ts
import 'dotenv/config';
import { Zkp2pClient, setLogLevel } from '@zkp2p/sdk';
import { privateKeyToAccount } from 'viem/accounts';
import { createWalletClient, http } from 'viem';
import { base } from 'viem/chains';

const USDC = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const;

const runtimeEnv =
  process.env.RUNTIME_ENV === 'staging'
    ? 'staging'
    : process.env.RUNTIME_ENV === 'preproduction'
      ? 'preproduction'
      : 'production';

const account = privateKeyToAccount(process.env.PRIVATE_KEY as `0x${string}`);
const walletClient = createWalletClient({
  account,
  chain: base,
  transport: http(process.env.RPC_URL),
});

setLogLevel('debug');

const client = new Zkp2pClient({
  walletClient,
  chainId: base.id,
  runtimeEnv,
});
```

## 3. Ensure allowance and create a deposit

Use `registerPayeeDetails()` if you want reusable hashes, then pass those hashes into `createDeposit()`.

```ts
async function ensureMakerDeposit() {
  await client.ensureAllowance({
    token: USDC,
    amount: 5_000_000000n,
    maxApprove: true,
  });

  const payeeData = [
    { offchainId: 'maker@example.com' },
    { offchainId: '@maker-revolut' },
  ];

  const { hashedOnchainIds } = await client.registerPayeeDetails({
    processorNames: ['wise', 'revolut'],
    payeeData,
  });

  const { hash } = await client.createDeposit({
    token: USDC,
    amount: 5_000_000000n,
    intentAmountRange: {
      min: 25_000000n,
      max: 500_000000n,
    },
    processorNames: ['wise', 'revolut'],
    payeeData,
    payeeDetailsHashes: hashedOnchainIds,
    conversionRates: [
      [{ currency: 'USD', conversionRate: '1015000000000000000' }],
      [{ currency: 'EUR', conversionRate: '940000000000000000' }],
    ],
    retainOnEmpty: true,
  });

  console.log('createDeposit tx:', hash);
}
```

## 4. Read your active deposits

The indexer gives you stable composite IDs for monitoring and analytics.

```ts
async function getActiveDepositIds() {
  const deposits = await client.indexer.getDeposits(
    { depositor: account.address, status: 'ACTIVE' },
    { limit: 50, orderBy: 'updatedAt', orderDirection: 'desc' },
  );

  return deposits.map((deposit) => deposit.id);
}
```

## 5. Poll for signaled intents

This loop watches new intents on your deposits and prints the ones that need operator or automation attention.

```ts
const seenIntents = new Set<string>();

async function watchSignaledIntents() {
  const depositIds = await getActiveDepositIds();
  if (!depositIds.length) {
    console.log('No active deposits yet.');
    return;
  }

  const signaled = await client.indexer.getIntentsForDeposits(depositIds, ['SIGNALED']);

  for (const intent of signaled) {
    const key = intent.intentHash.toLowerCase();
    if (seenIntents.has(key)) continue;

    seenIntents.add(key);
    console.log('new intent', {
      intentHash: intent.intentHash,
      owner: intent.owner,
      amount: intent.amount,
      paymentMethodHash: intent.paymentMethodHash,
      depositId: intent.depositId,
    });

    // Hand off to your bank / payment watcher here.
    // Example: enqueueForFiatMonitoring(intent)
  }
}
```

## 6. Prune expired intents and reject bad ones

Use `getExpiredIntents()` plus `pruneExpiredIntents()` for cleanup. Use `releaseFundsToPayer()` when you explicitly want to reject an intent after checking the fiat side.

```ts
async function pruneExpired() {
  const depositIds = await getActiveDepositIds();
  if (!depositIds.length) return;

  const expired = await client.indexer.getExpiredIntents({
    now: Math.floor(Date.now() / 1000).toString(),
    depositIds,
    limit: 100,
  });

  for (const intent of expired) {
    const [escrowAddress, rawDepositId] = intent.depositId.split('_');
    if (!escrowAddress || !rawDepositId) continue;

    console.log('pruning expired intent', intent.intentHash);
    await client.pruneExpiredIntents({
      escrowAddress: escrowAddress as `0x${string}`,
      depositId: BigInt(rawDepositId),
    });
  }
}

async function rejectIntent(intentHash: `0x${string}`) {
  const txHash = await client.releaseFundsToPayer({ intentHash });
  console.log('manual release tx:', txHash);
}
```

## 7. Track fulfillments

The taker or extension submits the proof. Your bot can still track completion and fee outcomes.

```ts
async function logFulfillments(intentHashes: string[]) {
  const fulfilled = await client.indexer.getFulfilledIntentEvents(intentHashes);

  for (const item of fulfilled) {
    const amounts = await client.indexer.getIntentFulfillmentAmounts(item.intentHash);
    console.log('fulfilled intent', {
      intentHash: item.intentHash,
      isManualRelease: item.isManualRelease,
      releasedAmount: amounts?.releasedAmount,
      takerAmountNetFees: amounts?.takerAmountNetFees,
    });
  }
}
```

## 8. Manage the deposit lifecycle

Once the bot is running, these are the main supply-side actions it performs:

```ts
async function topUpDeposit(depositId: bigint) {
  await client.addFunds({
    depositId,
    amount: 500_000000n,
  });
}

async function pauseDeposit(depositId: bigint) {
  await client.setAcceptingIntents({
    depositId,
    accepting: false,
  });
}

async function exitDeposit(depositId: bigint) {
  await client.withdrawDeposit({ depositId });
}
```

## 9. Run the loop

```ts
async function main() {
  await ensureMakerDeposit();

  for (;;) {
    await watchSignaledIntents();
    await pruneExpired();
    await new Promise((resolve) => setTimeout(resolve, 15_000));
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
```

## 10. If you also operate the taker side

When your system receives a valid proof, call `fulfillIntent()` from the taker workflow, not from the maker-monitoring loop:

```ts
await client.fulfillIntent({
  intentHash: '0x...',
  proof: proofFromPeerAuthOrReclaim,
});
```

## Troubleshooting

- `getDeposits()` stays empty after creation: the transaction may not be mined yet. Poll the indexer with `depositor: account.address` until the new deposit appears
- `signal` intents show up but never fulfill: that usually means the taker never finished the fiat leg or never submitted a proof
- `pruneExpiredIntents()` reverts: make sure you parsed the composite deposit ID into `escrowAddress` and raw `depositId` correctly
- Repeated approval prompts: use `maxApprove: true` in `ensureAllowance()` if that matches your risk model

## Next steps

- Read [Prepared Transactions](/developer/cookbook/prepared-transactions) if your bot submits through a relayer or smart account
- Read [Error Handling & Retries](/developer/cookbook/error-handling) before you put the loop in production
- Read [Indexer Pagination & Filtering](/developer/cookbook/indexer-queries) for higher-volume monitoring
