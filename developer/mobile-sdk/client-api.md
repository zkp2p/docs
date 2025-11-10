---
id: mobile-sdk-client-api
title: Zkp2pClient (contracts & API)
---

Full Mode only
- Requires `walletClient` and `apiKey` in `Zkp2pProvider`.

Access
```ts
const { zkp2pClient } = useZkp2p(); // null in Proof‑Only mode
```

Transactions
- `signalIntent(params)` → posts to API v2 for signed intent and calls `Orchestrator.signalIntent`; returns API response plus `txHash`.
- `fulfillIntent(params)` → posts proof to attestation service and calls `Orchestrator.fulfillIntent`.
- `createDeposit(params)` → creates a deposit on‑chain and posts deposit details; returns `{ depositDetails, hash }`.
- `withdrawDeposit`, `cancelIntent`, `releaseFundsToPayer` → corresponding escrow/orchestrator calls.

Queries
- `getQuote(params)` → `/v1/quote/(exact-fiat|exact-token)`; if `apiKey` present, enriches quotes with payee data.
- `getPayeeDetails`, `validatePayeeDetails` → `/v1/makers/...` helpers.
- `getAccountDepositsHistory`, `getAccountIntentsHistory` → API history endpoints with optional status filters.
- `getAccountDeposits`, `getDepositsFromIds`, `getDepositById`, `getAccountIntents`, `getIntent` → on‑chain reads via `ProtocolViewer`.

Utilities
- `getUsdcAddress()` and `getDeployedAddresses()` (escrow, orchestrator, protocolViewer, unifiedPaymentVerifier).

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
- API adapters: `apiGetOwnerDeposits`, `apiGetIntentsByTaker` (prefer the client history helpers unless you need raw responses)

RPC configuration (without Provider)
```ts
import { Zkp2pClient } from '@zkp2p/zkp2p-react-native-sdk';
const client = new Zkp2pClient({ prover: 'reclaim_gnark', chainId: 8453, apiKey: '…', rpcUrl: 'https://…' });
```

Notes
`baseApiUrl` should be the versionless root; the SDK appends `/v1` and `/v2` paths.
Many write calls accept `onSuccess`, `onMined`, and `txOverrides` for flexibility.
