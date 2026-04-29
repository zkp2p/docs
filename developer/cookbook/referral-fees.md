---
id: referral-fees
title: Referral Fees & Attribution
---

# Referral Fees & Attribution

## What this covers

How to add partner fees to quotes and intents, and how to append ERC-8021 attribution data to transactions.

## When to use this

Use this when you are embedding Peer inside another app and need revenue sharing, campaign codes, or Base builder attribution.

## Configure a referrer fee

```ts
import {
  assertValidReferrerFeeConfig,
  parseReferrerFeeConfig,
} from '@zkp2p/sdk';
import { parseUnits } from 'viem';

const referrerFeeConfig = assertValidReferrerFeeConfig(
  parseReferrerFeeConfig('0x0000000000000000000000000000000000000001', 50),
  'getQuote',
);

const quoteResponse = await client.getQuote({
  paymentPlatforms: ['wise'],
  fiatCurrency: 'USD',
  user: buyerAddress,
  recipient: buyerAddress,
  destinationChainId: 8453,
  destinationToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  amount: '100',
  isExactFiat: true,
  referrerFeeConfig,
});
```

Useful helpers:

- `assertValidReferrerFeeConfig(config, context)`
- `isValidReferrerFeeBps(value)`
- `parseReferrerFeeConfig(recipient, feeBpsValue)`
- `referrerFeeConfigToPreciseUnits(config)`

## Carry the same fee into `signalIntent()`

When a fee is present, use the quote's `signalIntentAmount` if it is available.

```ts
const quote = quoteResponse.responseObject?.quotes?.[0];
if (!quote) {
  throw new Error('No quote found');
}

await client.signalIntent({
  depositId: BigInt(quote.intent.depositId),
  amount: BigInt(quote.signalIntentAmount ?? quote.intent.amount),
  toAddress: buyerAddress,
  processorName: quote.intent.processorName,
  payeeDetails: quote.intent.payeeDetails,
  fiatCurrencyCode: quote.intent.fiatCurrencyCode,
  conversionRate: parseUnits(quote.conversionRate, 18),
  referrerFeeConfig,
  escrowAddress: quote.intent.escrowAddress as `0x${string}` | undefined,
  orchestratorAddress: quote.intent.orchestratorAddress as `0x${string}` | undefined,
});
```

## Add ERC-8021 attribution

The SDK always appends `BASE_BUILDER_CODE` last. Your referrer codes go in front of it.

```ts
import {
  BASE_BUILDER_CODE,
  ZKP2P_IOS_REFERRER,
  appendAttributionToCalldata,
  encodeWithAttribution,
  getAttributionDataSuffix,
} from '@zkp2p/sdk';

const suffix = getAttributionDataSuffix([ZKP2P_IOS_REFERRER, 'acme-wallet']);
console.log(BASE_BUILDER_CODE, suffix);

const attributedCalldata = encodeWithAttribution(
  {
    abi: escrowAbi,
    functionName: 'addFunds',
    args: [42n, 100_000000n],
  },
  ['acme-wallet'],
);

const existingCalldata = '0x1234' as const;
const campaignCalldata = appendAttributionToCalldata(existingCalldata, 'partner-campaign');
```

If you are not using SDK write helpers, send the transaction manually:

```ts
import { sendTransactionWithAttribution } from '@zkp2p/sdk';

await sendTransactionWithAttribution(
  walletClient,
  {
    address: escrowAddress,
    abi: escrowAbi,
    functionName: 'addFunds',
    args: [42n, 100_000000n],
  },
  ['acme-wallet', 'campaign-q2'],
);
```

## Key points

- `referrerFeeConfig` is for app-level fee sharing; `txOverrides.referrer` is for ERC-8021 attribution
- `signalIntentAmount` is the safest gross amount to pass into `signalIntent()` when a fee is applied
- `BASE_BUILDER_CODE` is always appended automatically and cannot be overridden
- Mobile apps commonly reuse `ZKP2P_IOS_REFERRER` or `ZKP2P_ANDROID_REFERRER` as one of the attribution codes
