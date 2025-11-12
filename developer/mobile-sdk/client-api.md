---
title: Zkp2pClient (contracts & API)
---

### Full Mode only
- Requires `walletClient` and `apiKey` in `Zkp2pProvider`.

### Access
```ts
const { zkp2pClient } = useZkp2p(); // null in Proof‑Only mode
```

### Transactions
- `signalIntent(params)` → posts to API v2 for signed intent and calls `Orchestrator.signalIntent`; returns API response plus `txHash`.
- `fulfillIntent(params)` → posts proof to attestation service and calls `Orchestrator.fulfillIntent`.
- `createDeposit(params)` → creates a deposit on‑chain and posts deposit details; returns `{ depositDetails, hash }`.
- `withdrawDeposit`, `cancelIntent`, `releaseFundsToPayer` → corresponding escrow/orchestrator calls.

### Queries
- `getQuote(params)` → `/v1/quote/(exact-fiat|exact-token)`; if `apiKey` present, enriches quotes with payee data.
- `getPayeeDetails`, `validatePayeeDetails` → `/v1/makers/...` helpers.
- `getAccountDepositsHistory`, `getAccountIntentsHistory` → API history endpoints with optional status filters.
- `getAccountDeposits`, `getDepositsFromIds`, `getDepositById`, `getAccountIntents`, `getIntent` → on‑chain reads via `ProtocolViewer`.

### Utilities
- `getUsdcAddress()` and `getDeployedAddresses()` (escrow, orchestrator, protocolViewer, unifiedPaymentVerifier).

### Native prover utilities (optional)
```ts
import { gnarkGetStatus, gnarkPreWarm, gnarkResetStatus } from '@zkp2p/zkp2p-react-native-sdk';
await gnarkGetStatus();            // availability + algorithms
await gnarkPreWarm(['aes-256-ctr']);
await gnarkResetStatus();
```

### Additional low‑level exports
- `clearSession(options)`
- `currencyInfo` map
- API adapters: `apiGetOwnerDeposits`, `apiGetIntentsByTaker` (prefer the client history helpers unless you need raw responses)

### RPC configuration (without Provider)
```ts
import { Zkp2pClient } from '@zkp2p/zkp2p-react-native-sdk';
const client = new Zkp2pClient({ prover: 'reclaim_gnark', chainId: 8453, apiKey: '…', rpcUrl: 'https://…' });
```

### Notes
`baseApiUrl` should be the versionless root; the SDK appends `/v1` and `/v2` paths.
Many write calls accept `onSuccess`, `onMined`, and `txOverrides` for flexibility.

### API reference

### Initialize
```ts
const { zkp2pClient } = useZkp2p(); // null in Proof‑Only mode
```

#### `signalIntent(params) → Promise<SignalIntentResponse & { txHash?: Hash }>`
Required
- `processorName`, `depositId`, `amount`, `payeeDetails`, `toAddress`, `currencyHash`, `conversionRate`
Optional
- `referrer`, `referrerFee`, `txOverrides`, callbacks (`onSuccess`, `onError`, `onMined`)
Example
```ts
await zkp2pClient!.signalIntent({
  processorName: 'venmo',
  depositId: '1910',
  amount: '1000000',
  payeeDetails: '0x…',
  toAddress: walletAddress as any,
  currencyHash: currencyInfo.USD.currencyCodeHash as any,
  conversionRate: '1000000000000000000',
});
```

#### `fulfillIntent(params) → Promise<Hash>`
Required
- `intentHash`, `zkTlsProof` (stringified), `platform`, `actionType`, `amount`, `timestampMs`, `fiatCurrency`, `conversionRate`, `payeeDetails`, `timestampBufferMs`
Optional
- `verifyingContract`, `txOverrides`, callbacks

#### `createDeposit(params) → Promise<{ depositDetails: PostDepositDetailsRequest[]; hash: Hash }>`
Key fields
- `token`, `amount`, `intentAmountRange`, `conversionRates` (per payment method), `processorNames`, `depositData[]`
Optional
- `delegate`, `intentGuardian`, `referrer`, `referrerFee`, `txOverrides`, callbacks

#### `withdrawDeposit(params)`
#### `cancelIntent(params)`
#### `releaseFundsToPayer(params)`
- Convenience wrappers around the corresponding contract calls; each accepts `txOverrides` and optional callbacks.
Examples
```ts
await zkp2pClient!.withdrawDeposit({ depositId: '1910' });
await zkp2pClient!.cancelIntent({ intentHash: '0x…' as any });
await zkp2pClient!.releaseFundsToPayer({ intentHash: '0x…' as any });
```

Maintenance and settings
- `addFunds`, `removeFunds`, `setAcceptingIntents`, `setIntentRange`, `setRetainOnEmpty`, `setDelegate`, `removeDelegate`, `addPaymentMethods`, `addCurrencies`, `setPaymentMethodActive`, `deactivateCurrency`, `setCurrencyMinRate`, `pruneExpiredIntents`, `removePaymentMethod`, `removeCurrency`.

### Quotes and makers API
#### `getQuote(params)`
Returns `{ success, message, responseObject }` with `fiat`, `token`, and `quotes[]`. If `apiKey` is set, each quote is enriched with `payeeData` when possible.

#### `getPayeeDetails({ hashedOnchainId, platform })`

#### `validatePayeeDetails({ platform, accountId })`
Example
```ts
const q = await zkp2pClient!.getQuote({
  paymentPlatforms: ['venmo'],
  fiatCurrency: 'USD',
  user: walletAddress,
  recipient: walletAddress,
  destinationChainId: 8453,
  destinationToken: zkp2pClient!.getUsdcAddress(),
  amount: '1000000',
  isExactFiat: true,
});
console.log(q.responseObject?.quotes?.[0]);
```

### History (API)
#### `getAccountDepositsHistory({ ownerAddress, status? })`
#### `getAccountIntentsHistory({ takerAddress, status? | status[] })`
#### `getDepositsOrderStats({ depositIds: string[] })`

### On‑chain reads (ProtocolViewer)
#### `getAccountDeposits(owner)`
Returns parsed deposit views.

#### `getDepositById(depositId)`

#### `getDepositsFromIds(ids[])`

#### `getAccountIntents(owner)`
Returns parsed intent views.

#### `getIntent(intentHash)`
Example
```ts
const deposits = await zkp2pClient!.getAccountDeposits(walletAddress as any);
const intents = await zkp2pClient!.getAccountIntents(walletAddress as any);
```

Utilities
- `getUsdcAddress()` and `getDeployedAddresses()` for the active chain
```ts
const { escrow, orchestrator, protocolViewer, unifiedPaymentVerifier } = zkp2pClient!.getDeployedAddresses();
```

Native prover utilities (optional)
```ts
import { gnarkGetStatus, gnarkPreWarm, gnarkResetStatus } from '@zkp2p/zkp2p-react-native-sdk';
await gnarkGetStatus();            // availability + algorithms
await gnarkPreWarm(['aes-256-ctr']);
await gnarkResetStatus();
```

Additional low‑level exports
- `clearSession(options)`
- `currencyInfo` map
- API adapters: `apiGetOwnerDeposits`, `apiGetIntentsByTaker` (prefer client history helpers unless you need raw responses)
