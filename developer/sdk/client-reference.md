---
id: sdk-client-reference
title: Client Reference
slug: /sdk/client-reference
---

# Client Reference

## What this does

This page documents the published `Zkp2pClient` API surface for `@zkp2p/sdk`. Use it as the reference layer for custom integrations after you have read the higher-level walkthroughs:

- [Offramp Integration](/developer/offramp)
- [Onramp Integration](/developer/integrate-zkp2p/integrate-redirect-onramp)

## Constructor

Create a client with `new Zkp2pClient(opts)`.

| Field | Required | Description |
| --- | --- | --- |
| `walletClient` | Yes | viem `WalletClient` with an attached account for signing |
| `chainId` | Yes | Chain ID used for contract and API routing |
| `rpcUrl` | No | Optional RPC override; otherwise the SDK uses the wallet client's chain transport |
| `runtimeEnv` | No | Runtime environment: `production`, `preproduction`, or `staging`. Defaults to `production` |
| `indexerUrl` | No | Override for the indexer GraphQL endpoint |
| `baseApiUrl` | No | Override for ZKP2P service APIs |
| `apiKey` | No | Optional curator API key — not required to get started. When provided, it enables auto-fetching `signalIntent()` gating signatures and enriches authenticated quote responses with maker `payeeData` |
| `authorizationToken` | No | Optional bearer token for hybrid authentication |
| `getAuthorizationToken` | No | Async token provider for long-lived clients |
| `indexerApiKey` | No | Optional `x-api-key` header for indexer proxy authentication |
| `timeouts.api` | No | API timeout in milliseconds |

```ts
import { Zkp2pClient } from '@zkp2p/sdk';

const client = new Zkp2pClient({
  walletClient,
  chainId: 8453,
});
```

:::info No API key required
Most public SDK methods work without `apiKey` or `authorizationToken`. Auth credentials are optional for normal deposit, quote, and intent flows and mostly affect response richness. `signalIntent()` can auto-fetch its gating signature when you provide `apiKey` or `authorizationToken`; if you do not want the SDK to make that request, pass `gatingServiceSignature` and `signatureExpiration` yourself.
:::

:::note Service roots
Set `baseApiUrl` to the service root, for example `https://api.zkp2p.xyz`. Do not append `/v1`, `/v2`, or `/v3`; the SDK appends the current versioned paths internally.
:::

:::note Runtime requirements
The published `0.5.2` package declares `node >= 22` for Node runtimes and `viem ^2.37.3` as a peer dependency. `0.5.2` depends on `@zkp2p/zkp2p-attestation@1.5.1`, which is the first attestation package version that supports the current Venmo identity registration shape.
:::

## Prepared transactions

Most write methods are "prepareable":

- Calling the method directly sends the transaction and returns a hash
- Calling `.prepare()` on the same method returns a `PreparedTransaction` with `{ to, data, value, chainId }`

```ts
const prepared = await client.signalIntent.prepare({
  depositId: 42n,
  amount: 100_000000n,
  toAddress: '0xYourRecipientAddress',
  processorName: 'wise',
  payeeDetails: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  fiatCurrencyCode: 'USD',
  conversionRate: 1_020000000000000000n,
});

await relayer.submit({
  to: prepared.to,
  data: prepared.data,
  value: prepared.value,
});
```

`createDeposit()` is the main exception because it may also post curator data. Use `prepareCreateDeposit()` when you need calldata without sending:

```ts
const { depositDetails, prepared } = await client.prepareCreateDeposit({
  token: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  amount: 1_000_000000n,
  intentAmountRange: { min: 10_000000n, max: 500_000000n },
  processorNames: ['wise'],
  payeeData: [{ offchainId: 'maker@example.com' }],
  conversionRates: [[
    { currency: 'USD', conversionRate: '1020000000000000000' },
  ]],
});
```

## Payee registration

Use `registerPayeeDetails()` when you want to register payment details first and reuse the returned hashes in a later `createDeposit()` call.

| Parameter | Type | Description |
| --- | --- | --- |
| `processorNames` | `string[]` | Payment platforms such as `wise`, `revolut`, or `venmo` |
| `payeeData` | `Array<Record<string, string>>` | Processor-specific payment details in the same order as `processorNames` |
| `depositData` | `Array<Record<string, string>>` | Deprecated alias for `payeeData` |

`registerPayeeDetails()` posts each payee identity to curator `POST /v2/makers/create` with `{ processorName, offchainId, telegramUsername?, metadata? }`. Curator returns the `hashedOnchainId` used by deposits, quotes, intents, seller credential status, and seller credential uploads. This endpoint does not accept legacy proof JSON or encrypted session material; identity attestations are requested separately through the attestation helpers below.

```ts
const { hashedOnchainIds } = await client.registerPayeeDetails({
  processorNames: ['wise', 'revolut'],
  payeeData: [
    { offchainId: 'maker@example.com' },
    { offchainId: 'maker' },
  ],
});

await client.createDeposit({
  token: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  amount: 1_000_000000n,
  intentAmountRange: { min: 10_000000n, max: 500_000000n },
  processorNames: ['wise', 'revolut'],
  payeeData: [
    { offchainId: 'maker@example.com' },
    { offchainId: 'maker' },
  ],
  conversionRates: [
    [{ currency: 'USD', conversionRate: '1020000000000000000' }],
    [{ currency: 'EUR', conversionRate: '950000000000000000' }],
  ],
  payeeDetailsHashes: hashedOnchainIds,
});
```

## Identity attestation

Identity registration is a separate Attestation Service flow for platforms that need a live account identity before curator registration. The SDK exposes it through the Nitro attestation client re-export and through the lower-level `apiRequestIdentityAttestation()` helper.

Current identity platform/action pairs:

| Platform | Action type | Encrypted session material | Public params |
| --- | --- | --- | --- |
| `venmo` | `register_venmo` | `Cookie` | `{ SENDER_ID }` |
| `paypal` | `register_paypal` | `Cookie` | `{}` |
| `wise` | `register_wise` | `Cookie`, `X-Access-Token` | `{ PROFILE_ID }` |

:::warning Venmo identity registration changed in `@zkp2p/zkp2p-attestation@1.5.1`
Do not send a captured Venmo stories URL in encrypted session material. The current Venmo identity request sends only a replayable `Cookie` header plus public `params.SENDER_ID`. The Attestation Service derives `https://account.venmo.com/api/stories?feedType=me&externalId={SENDER_ID}`, verifies the authenticated account id, and requires Venmo to return a valid `stories` array. Upgrade to `@zkp2p/sdk@0.5.2` or newer if your code still references `sessionMaterial.url`.
:::

```ts
import { createNitroAttestationClient } from '@zkp2p/sdk';

const nitro = createNitroAttestationClient({
  environment: 'production',
  attestationServiceUrl: 'https://attestation-service.zkp2p.xyz',
});

const identity = await nitro.requestIdentityAttestation({
  platform: 'venmo',
  actionType: 'register_venmo',
  callerAddress: '0x0000000000000000000000000000000000000002',
  sessionMaterial: {
    Cookie: 'venmo-session-cookie-header',
  },
  params: {
    SENDER_ID: '123456789',
  },
});

console.log(identity.identity.payeeIdHash);
```

If you already encrypted session material outside the Nitro client, call the raw endpoint helper:

```ts
import { apiRequestIdentityAttestation } from '@zkp2p/sdk';

const response = await apiRequestIdentityAttestation(
  {
    callerAddress: '0x0000000000000000000000000000000000000002',
    encryptedSessionMaterial,
    params: { SENDER_ID: '123456789' },
  },
  'https://attestation-service.zkp2p.xyz',
  'venmo',
  'register_venmo',
);
```

`callerAddress` is required and is signed into the returned `IdentityAttestation`. Consumers that verify the response must bind it to the expected caller address, platform, action type, payee hash, canonical identity `dataHash`, and validity window.

## Intent operations

### `signalIntent()` / `signalIntent.prepare()`

Signals a taker-side intent and reserves liquidity from a deposit.

| Parameter | Required | Description |
| --- | --- | --- |
| `depositId` | Yes | Deposit ID to use |
| `amount` | Yes | Token amount in base units |
| `toAddress` | Yes | Recipient address for the on-chain asset |
| `processorName` | Yes | Payment platform name |
| `payeeDetails` | Yes | Hashed payee details for the deposit/payment method |
| `fiatCurrencyCode` | Yes | Fiat currency such as `USD` or `EUR` |
| `conversionRate` | Yes | Agreed conversion rate with 18 decimals |
| `referralFees` | No | Multi-recipient referral fee list |
| `referrer` / `referrerFee` | No | Deprecated legacy single-referrer fields |
| `referrerFeeConfig` | No | Onramp-friendly referrer fee configuration |
| `postIntentHook` | No | Post-intent hook contract address |
| `preIntentHookData` | No | Data for a pre-intent hook |
| `data` | No | Arbitrary bytes passed into hook-enabled flows |
| `escrowAddress` | No | Escrow override when you want explicit routing |
| `orchestratorAddress` | No | Orchestrator override |
| `gatingServiceSignature` | No | Pre-obtained signature if you do not want SDK auto-fetching |
| `signatureExpiration` | No | Signature expiration timestamp |
| `txOverrides` | No | viem transaction overrides plus optional referrer code(s) |

### `cancelIntent()` / `cancelIntent.prepare()`

Cancels a signaled intent before fulfillment.

| Parameter | Required | Description |
| --- | --- | --- |
| `intentHash` | Yes | `0x`-prefixed 32-byte intent hash |
| `orchestratorAddress` | No | Explicit orchestrator override |
| `txOverrides` | No | viem transaction overrides |

### `fulfillIntent()` / `fulfillIntent.prepare()`

Fulfills a signaled intent with a payment proof. The SDK handles attestation encoding for you.

| Parameter | Required | Description |
| --- | --- | --- |
| `intentHash` | Yes | `0x`-prefixed 32-byte intent hash |
| `proof` | Yes | zkTLS proof object/JSON string or a buyer TEE proof input |
| `timestampBufferMs` | No | Allowed timestamp variance in milliseconds |
| `attestationServiceUrl` | No | Override for the attestation service |
| `orchestratorAddress` | No | Explicit orchestrator override |
| `postIntentHookData` | No | Hook payload passed to the orchestrator |
| `txOverrides` | No | viem transaction overrides |
| `callbacks` | No | UI lifecycle callbacks such as `onAttestationStart`, `onAttestationComplete`, `onTxSent`, and `onTxMined` |
| `precomputedAttestation` | No | Pre-encoded attestation data for advanced flows |

### `releaseFundsToPayer()` / `releaseFundsToPayer.prepare()`

Manual release path for returning reserved funds to the deposit owner when an intent should not be fulfilled.

| Parameter | Required | Description |
| --- | --- | --- |
| `intentHash` | Yes | `0x`-prefixed 32-byte intent hash |
| `orchestratorAddress` | No | Explicit orchestrator override |
| `txOverrides` | No | viem transaction overrides |

### Deposit hook controls

The V2 orchestrator lets deposit owners configure hooks around intent signaling.

| Method | Description | Key parameters |
| --- | --- | --- |
| `setDepositPreIntentHook()` / `.prepare()` | Set the hook called before an intent is accepted | `depositId`, `preIntentHook`, `escrowAddress?`, `orchestratorAddress?` |
| `getDepositPreIntentHook()` | Read the configured pre-intent hook | `depositId`, `escrowAddress?`, `orchestratorAddress?` |
| `setDepositWhitelistHook()` / `.prepare()` | Set the whitelist hook for private orderbook or gated deposits | `depositId`, `whitelistHook`, `escrowAddress?`, `orchestratorAddress?` |
| `getDepositWhitelistHook()` | Read the configured whitelist hook | `depositId`, `escrowAddress?`, `orchestratorAddress?` |
| `cleanupOrphanedIntents()` / `.prepare()` | Permissionless cleanup for orphaned V2 intents | `intentHashes`, `escrowAddress?`, `orchestratorAddress?` |

## Vault and rate-manager operations

At the client layer, vaults are exposed as rate managers. These flows are most relevant when you are delegating deposits or managing shared pricing.

:::note
The `0.5.x` client routes against EscrowV2 and OrchestratorV2. Pass explicit `escrowAddress` or `orchestratorAddress` only when targeting a configured V2 deployment.
:::

### Create a vault

Use `createRateManager()` to create a new vault.

| Field | Required | Description |
| --- | --- | --- |
| `config.manager` | Yes | Manager address |
| `config.feeRecipient` | Yes | Address that receives manager fees |
| `config.maxFee` | Yes | Maximum allowed fee |
| `config.fee` | Yes | Current fee |
| `config.depositHook` | No | Optional deposit hook contract |
| `config.minLiquidity` | No | Minimum USDC liquidity required for delegation |
| `config.name` | Yes | Human-readable name |
| `config.uri` | Yes | Metadata URI |
| `txOverrides` | No | viem transaction overrides |

### Delegation methods

Use one of the delegation paths below depending on how the deposit is routed.

| Method | Use it when | Key parameters |
| --- | --- | --- |
| `setDepositRateManager()` | Delegating through the controller/registry path | `escrow`, `depositId`, `registry`, `rateManagerId` |
| `clearDepositRateManager()` | Clearing controller-based delegation | `escrow`, `depositId` |
| `setRateManager()` | Writing directly to EscrowV2 | `depositId`, `rateManagerAddress`, `rateManagerId`, `escrowAddress?` |
| `clearRateManager()` | Clearing direct EscrowV2 delegation | `depositId`, `escrowAddress?` |

### Vault configuration

| Method | Description | Key parameters |
| --- | --- | --- |
| `setVaultFee()` | Update vault manager fee | `rateManagerId`, `newFee` |
| `setVaultMinRate()` | Set floor rate for one payment method/currency pair | `rateManagerId`, `paymentMethodHash`, `currencyHash`, `rate` |
| `setVaultMinRatesBatch()` | Batch version of `setVaultMinRate()` | `rateManagerId`, `paymentMethods`, `currencies`, `rates` |
| `setVaultConfig()` | Update manager, fee recipient, hook, name, or URI | `rateManagerId`, `newManager`, `newFeeRecipient`, `newHook?`, `newName`, `newUri` |

### Payment method management

| Method | Description | Key parameters |
| --- | --- | --- |
| `addPaymentMethods()` | Add new payment platforms to an existing deposit | `depositId`, `paymentMethods`, `paymentMethodData`, `currencies` |
| `setPaymentMethodActive()` | Activate or deactivate a payment method | `depositId`, `paymentMethod`, `isActive` |
| `removePaymentMethod()` | Convenience alias for deactivating a payment method | `depositId`, `paymentMethod` |

### Currency management

| Method | Description | Key parameters |
| --- | --- | --- |
| `addCurrencies()` | Add currencies to an existing payment method | `depositId`, `paymentMethod`, `currencies` |
| `deactivateCurrency()` | Disable a currency for a payment method | `depositId`, `paymentMethod`, `currencyCode` |
| `removeCurrency()` | Alias for `deactivateCurrency()` | `depositId`, `paymentMethod`, `currencyCode` |

### Rate-manager reads

| Method | Returns | Notes |
| --- | --- | --- |
| `getDepositRateManager(escrow, depositId)` | `{ registry, rateManagerId }` | Reads current delegation state |
| `getManagerFee(escrow, depositId)` | `bigint` | Reads the effective manager fee |
| `getEffectiveRate({ escrow, depositId, paymentMethod, fiatCurrency })` | `bigint` | Reads effective EscrowV2 rate after manager logic |

For EscrowV2 pricing flows, the client also exposes `setOracleRateConfig()`, `removeOracleRateConfig()`, `setOracleRateConfigBatch()`, `updateCurrencyConfigBatch()`, and `deactivateCurrenciesBatch()`.

## Quote API

Use `getQuote(req, opts?)` to fetch available liquidity for a taker flow.

| Request field | Required | Description |
| --- | --- | --- |
| `paymentPlatforms` | Yes | Platforms to search, such as `['wise', 'revolut']` |
| `fiatCurrency` | Yes | Fiat currency code |
| `user` | Yes | Taker address |
| `recipient` | Yes | Asset recipient address |
| `destinationChainId` | Yes | Destination chain ID |
| `destinationToken` | Yes | Destination token address |
| `amount` | Yes | Amount as a string |
| `referrer` | No | Referrer code for quote attribution |
| `referrerFeeConfig` | No | Referrer fee recipient and BPS |
| `useMultihop` | No | Enable multihop routing |
| `quotesToReturn` | No | Limit quote count |
| `isExactFiat` | No | Treat `amount` as fiat instead of token amount |
| `escrowAddresses` | No | Limit search to specific escrows |
| `includeNearbyQuotes` | No | Include nearby suggestions when no exact quote is available |
| `nearbySearchRange` | No | Max percent deviation for nearby quote search |
| `nearbyQuotesCount` | No | Number of nearby suggestions above and below |
| `includePrivateOrderbooks` | No | Include whitelist-gated private orderbook deposits scoped to the requesting user |

The response includes:

- `responseObject.quotes`: matched quotes
- `responseObject.nearbySuggestions`: optional nearby matches when `includeNearbyQuotes` is enabled and no exact quote is available
- `signalIntentAmount`: gross amount you should pass into `signalIntent()` when a referrer fee is applied
- `referrerFeeAmount`: computed fee output for the supplied `referrerFeeConfig`

```ts
const quote = await client.getQuote({
  paymentPlatforms: ['wise'],
  fiatCurrency: 'USD',
  user: '0xYourAddress',
  recipient: '0xRecipientAddress',
  destinationChainId: 8453,
  destinationToken: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  amount: '100',
  isExactFiat: true,
  includeNearbyQuotes: true,
});
```

### `getQuotesBestByPlatform()`

Use `getQuotesBestByPlatform(req, opts?)` when you want the single best quote per supported payment platform instead of a flat list. The SDK calls `/v2/quote/best-by-platform` (or `/v2/quote/best-by-platform-exact-token` when `isExactFiat` is `false`) and returns one entry per platform with maker `payeeData` enriched into each `bestQuote`.

| Request field | Required | Description |
| --- | --- | --- |
| `fiatCurrency` | Yes | Fiat currency code |
| `user` | Yes | Taker address |
| `recipient` | Yes | Asset recipient address |
| `destinationChainId` | Yes | Destination chain ID |
| `destinationToken` | Yes | Destination token address |
| `amount` | Yes | Amount as a string |
| `isExactFiat` | No | Treat `amount` as fiat instead of token amount. Defaults to `true` |
| `referrer` | No | Referrer code for quote attribution |
| `referrerFeeConfig` | No | Referrer fee recipient and BPS |
| `escrowAddresses` | No | Limit search to specific escrows. Defaults to the client's configured escrows |
| `minDepositSuccessRateBps` | No | Minimum maker success rate in basis points (0-10000) |
| `supportBusinessAccounts` | No | Allow quotes from business accounts |
| `intentGatingService` | No | Filter by a specific intent gating service address |
| `includePrivateOrderbooks` | No | Include whitelist-gated private orderbook deposits. Defaults to `false` |

The response shape mirrors `getQuote` but is keyed by platform:

- `responseObject.platformQuotes`: array of `{ platform, bestQuote }` entries
- `responseObject.quoteExpiresAt`: quote expiration timestamp
- Each `bestQuote` carries the same `referrerFeeAmount` / display fields as `getQuote` when a `referrerFeeConfig` is supplied

```ts
const best = await client.getQuotesBestByPlatform({
  fiatCurrency: 'USD',
  user: '0xYourAddress',
  recipient: '0xRecipientAddress',
  destinationChainId: 8453,
  destinationToken: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  amount: '100',
  isExactFiat: true,
});

for (const { platform, bestQuote } of best.responseObject?.platformQuotes ?? []) {
  console.log(platform, bestQuote?.intent?.depositId, bestQuote?.payeeData);
}
```

## Taker tiers

Use `getTakerTier(req, opts?)` to fetch tiering, cooldown, and platform-limit data for a taker address.

| Request field | Required | Description |
| --- | --- | --- |
| `owner` | Yes | Taker address |
| `chainId` | Yes | Chain ID for tier evaluation |

The response object includes:

- `tier`: one of `PEASANT`, `PEER`, `PLUS`, `PRO`, `PLATINUM`, or `PEER_PRESIDENT`
- volume metadata such as `minVolumeForTier`, `nextTier`, and `volumeToNextTier`
- `volumeBreakdown`: an array describing how the weighted maker volume that set the tier was computed, with one entry per payment platform (`rawVolume`, `multiplierBps`, and the resulting `weightedVolume`)
- cooldown metadata such as `cooldownHours`, `cooldownActive`, and `nextIntentAvailableAt`
- `platformLimits`: per-order limits for each payment platform, including the effective cap (`effectiveCap` / `effectiveCapDisplay`), whether the platform is locked for the tier (`isLocked`), the minimum tier required to unlock it (`minTierRequired`), and whether the method is reversible (`reversible`)

:::note
Per-order caps are set per payment platform — there is no single global per-tier cap. Read each method's limit from `platformLimits[].effectiveCap`.
:::

## Seller Autopilot

Use these methods to upload seller credentials, inspect credential status, and verify seller payments for Seller Autopilot flows. Supported seller platforms are `venmo`, `cashapp`, `wise`, and `paypal`.

Seller credential upload and identity attestation are different flows. Identity attestation proves an account identity for registration. Seller Autopilot stores an encrypted credential bundle that lets the enclave verify future seller-side payments. Direct bundle upload supports `venmo`, `cashapp`, and `wise`; PayPal seller credentials use the Google OAuth helper. Curator status is keyed by `{ processorName, payeeDetails }`, not maker id.

### `uploadSellerCredential()`

Use `uploadSellerCredential(params, opts?)` to create a signed credential bundle through the attestation service and store the public credential status in curator. Returns `CuratorSellerCredentialUploadResponse`.

For registered payee platforms (`venmo` and `cashapp`), pass the seller identity plus platform-specific session material:

| Field | Required | Description |
| --- | --- | --- |
| `platform` | Yes | `venmo` or `cashapp` |
| `offchainId` | Yes | Stable seller identity used for payee registration |
| `payeeId` | Yes | Platform payee identifier |
| `telegramUsername` | No | Optional seller Telegram username |
| `metadata` | No | Optional curator metadata |
| `sessionMaterial` | Yes | Platform-specific session material |

For Wise, pass only the platform and Wise session material. The enclave derives the payee hash from the submitted token:

| Field | Required | Description |
| --- | --- | --- |
| `platform` | Yes | `wise` |
| `sessionMaterial.apiToken` | Yes | Wise Personal API Token |
| `sessionMaterial.profileId` | No | Wise profile identifier. If omitted and multiple profiles exist, handle the profile-selection response |

Optional `opts` fields:

| Field | Required | Description |
| --- | --- | --- |
| `baseApiUrl` | No | Override for the curator base API URL |
| `attestationServiceUrl` | No | Override for the attestation service used to sign the credential bundle |
| `timeoutMs` | No | Request timeout in milliseconds |
| `attestationRuntime` | No | Runtime overrides for `fetch`, `subtle`, or `getRandomValues` |

`VenmoSessionMaterial`

| Field | Required | Description |
| --- | --- | --- |
| `recipientUsername` | Yes | Venmo username that receives the seller payment |
| `accountId` | Yes | Venmo account identifier |
| `sessionCookie` | Yes | Authenticated Venmo session cookie |
| `requestHeaders` | No | Optional request headers captured from the authenticated session |

`CashAppSessionMaterial`

| Field | Required | Description |
| --- | --- | --- |
| `recipientCashtag` | Yes | Cash App cashtag that receives the seller payment |
| `customerId` | Yes | Cash App customer identifier |
| `sessionCookie` | Yes | Authenticated Cash App session cookie |
| `requestHeaders` | No | Optional request headers captured from the authenticated session |
| `requestPayload` | Yes | Captured Cash App request payload used during verification |

`WiseSessionMaterial`

| Field | Required | Description |
| --- | --- | --- |
| `apiToken` | Yes | Wise API token |
| `profileId` | No | Wise profile identifier |

```ts
import { Zkp2pClient } from '@zkp2p/sdk';

const client = new Zkp2pClient({
  walletClient,
  chainId: 8453,
});

const response = await client.uploadSellerCredential(
  {
    platform: 'venmo',
    offchainId: 'peer-seller',
    payeeId: '123456789',
    sessionMaterial: {
      recipientUsername: 'peer-seller',
      accountId: '123456789',
      sessionCookie: 'session_cookie',
      requestHeaders: {
        'user-agent': 'Mozilla/5.0',
      },
    },
  },
  { timeoutMs: 10_000 },
);
```

### `uploadSellerCredentialBundle()`

Use `uploadSellerCredentialBundle(params, opts?)` when the encrypted credential bundle was already created elsewhere — typically inside a capture extension via `apiCreateSellerCredentialBundle()` — and you only need to register the payee and store the bundle with curator. This is the page-side half of the [extension Seller Autopilot capture flow](/developer/build-your-own-extension#implementing-the-seller-autopilot-flow). Available from `0.5.0`.

For registered payee platforms (`venmo` and `cashapp`):

| Field | Required | Description |
| --- | --- | --- |
| `platform` | Yes | `venmo` or `cashapp` |
| `offchainId` | Yes | Stable seller identity used for payee registration |
| `bundle` | Yes | Encrypted `SellerCredentialBundle` returned by the capture |
| `telegramUsername` | No | Optional seller Telegram username |
| `metadata` | No | Optional curator metadata |

For Wise, pass only `platform: 'wise'` and the `bundle`. Optional `opts` fields are `baseApiUrl` and `timeoutMs`.

For registered payee platforms, this helper:

1. Calls curator `POST /v2/makers/create` with the supplied `offchainId`, optional `telegramUsername`, optional `metadata`, and `processorName`.
2. Verifies the returned `hashedOnchainId` equals `bundle.payeeIdHash`.
3. Stores the bundle with curator `POST /v2/makers/{platform}/{hashedOnchainId}/seller-credential`.

The hash check is required. It prevents a tampered capture from binding an encrypted credential bundle to different public payee details.

```ts
const response = await client.uploadSellerCredentialBundle({
  platform: 'venmo',
  offchainId: capture.offchainId,
  bundle: capture.credentialBundle,
});
```

### `uploadGoogleOAuthSellerCredential()`

Use `uploadGoogleOAuthSellerCredential(params, opts?)` when curator owns the Google OAuth encryption hop for PayPal or Venmo credentials.

| Field | Required | Description |
| --- | --- | --- |
| `platform` | Yes | `paypal` or `venmo` |
| `authorizationCode` | Yes | One-time Google OAuth code |
| `payeeDetails` | Yes | Hashed payee details |
| `redirectUri` | Yes | OAuth redirect URI used to obtain the code |
| `payeeEmail` | PayPal only | PayPal seller email |
| `accountId` | Venmo only | Venmo account identifier |

This helper posts to curator `POST /v2/makers/{processorName}/{payeeDetails}/seller-credential/google-oauth`. The `payeeDetails` value is still the hashed payee details bytes32; for Venmo, `accountId` is the Venmo account identifier used by the credential flow.

### `getSellerCredentialStatus()`

Use `getSellerCredentialStatus(params, opts?)` to fetch public seller credential status from curator. Returns `CuratorSellerCredentialStatusResponse`.

| Field | Required | Description |
| --- | --- | --- |
| `processorName` | Yes | Seller payment platform: `venmo`, `cashapp`, `wise`, or `paypal` |
| `payeeDetails` | Yes | Hashed payee details bytes32 |

Optional `opts` fields:

| Field | Required | Description |
| --- | --- | --- |
| `baseApiUrl` | No | Override for the curator base API URL |
| `timeoutMs` | No | Request timeout in milliseconds |

The SDK calls curator `GET /v2/makers/{processorName}/{payeeDetails}/seller-credential/status`. The public status DTO is `{ platform, payeeIdHash, status, credentialType }`; maker row ids are intentionally not returned.

```ts
import { Zkp2pClient } from '@zkp2p/sdk';

const client = new Zkp2pClient({
  walletClient,
  chainId: 8453,
});

const response = await client.getSellerCredentialStatus(
  {
    processorName: 'paypal',
    payeeDetails: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  },
  { timeoutMs: 10_000 },
);
```

### `verifySellerPayment()`

Use `verifySellerPayment(params, opts?)` to verify a seller payment through curator's seller-credential proxy. Returns `CuratorSellerVerifyResponse`.

:::warning Internal-only authentication
`verifySellerPayment()` requires curator's internal `x-api-key`, not standard SDK consumer keys. It returns `410 GONE` when the seller credential is inactive or fails a re-probe.
:::

| Field | Required | Description |
| --- | --- | --- |
| `platform` | Yes | Seller payment platform: `venmo`, `cashapp`, `wise`, or `paypal` |
| `txId` | Yes | Payment transaction identifier to verify |
| `chainId` | Yes | Chain ID associated with the verification request |
| `intent` | Yes | `SellerVerifyIntentDetails` payload for the seller payment verification |

Optional `opts` fields:

| Field | Required | Description |
| --- | --- | --- |
| `baseApiUrl` | No | Override for the curator base API URL |
| `timeoutMs` | No | Request timeout in milliseconds |

```ts
import {
  Zkp2pClient,
  type SellerVerifyIntentDetails,
} from '@zkp2p/sdk';

declare const sellerVerifyIntentDetails: SellerVerifyIntentDetails;

const client = new Zkp2pClient({
  walletClient,
  chainId: 8453,
});

const response = await client.verifySellerPayment(
  {
    platform: 'wise',
    txId: 'transfer_123',
    chainId: 8453,
    intent: sellerVerifyIntentDetails,
  },
  { timeoutMs: 10_000 },
);
```

## Standalone API and attestation helpers

The package also exports low-level helpers for integrations that call service APIs directly instead of going through `Zkp2pClient`.

| Helper | Purpose |
| --- | --- |
| `apiGetOrderbook(params, opts)` | Fetch orderbook entries for a fiat currency, optional platform, sort, limit, chain, and token |
| `apiGetDepositBundle(params, opts)` | Fetch one deposit with related intents, events, profit snapshots, fund activities, and daily snapshots |
| `apiValidatePayeeDetails(req, baseApiUrl, timeoutMs?)` | Validate a payee identity before registration |
| `apiGetPayeeDetails(req, apiKey, baseApiUrl, authToken?, timeoutMs?)` | Resolve curator payee details from a hashed on-chain ID |
| `apiGetOwnerDeposits(req, apiKey, baseApiUrl, authToken?, timeoutMs?)` | Fetch owner deposits from the service API |
| `createNitroAttestationClient(opts)` | Verify the Nitro enclave and request typed identity attestations, Buyer TEE attestations, or seller credential bundles through `@zkp2p/zkp2p-attestation` |
| `apiRequestIdentityAttestation(payload, attestationServiceUrl, platform, actionType)` | Request an identity attestation from `POST /identity` after session material has already been encrypted |
| `createEncryptedBuyerTeeSessionMaterial(input)` | Encrypt buyer TEE session material for a buyer-payment proof |
| `apiCreateSellerCredentialBundle(payload, attestationServiceUrl, platform, timeoutMs?, runtime?)` | Create a signed seller credential bundle directly through attestation service |
| `apiUploadSellerCredentialBundle(params, baseApiUrl?, timeoutMs?)` | Register payee details if needed, verify the bundle payee hash, and store an encrypted seller credential bundle with curator |

`apiGetOrderbook()` accepts `{ currency, paymentPlatform?, sortBy?, sortDirection?, limit?, chainId?, token? }`. `apiGetDepositBundle()` accepts `{ depositId, escrowAddress, dailySnapshotLimit? }`.

## Querying on-chain data

For common read flows, start with the RPC-first methods:

- `getDeposits()`
- `getAccountDeposits(owner)`
- `getDeposit(depositId)`
- `getDepositsById(ids)`
- `getIntents()`
- `getAccountIntents(owner)`
- `getIntent(intentHash)`
- `getPvDepositById(depositId)`
- `getPvDepositsFromIds(ids)`
- `getPvAccountDeposits(owner)`
- `getPvAccountIntents(owner)`
- `getPvIntent(intentHash)`
- `resolvePayeeHash(depositId, paymentMethodHash)`
- `getFulfillIntentInputs(intentHash)`
- `getDepositPreIntentHook(depositId, options?)`
- `getDepositWhitelistHook(depositId, options?)`
- `getDeployedAddresses()`
- `getUsdcAddress()`

For copy-paste examples around deposits and intents, see [Offramp Integration](/developer/offramp).

## Indexer

Use `client.indexer` when you need historical data, richer filtering, or pagination across all deposits and intents. All methods live on a flat namespace.

### Deposit queries

- `getDeposits(filter?, pagination?)`
- `getDepositsWithRelations(filter?, pagination?, options?)`
- `getDepositById(compositeId, options?)`
- `getDepositsByIds(ids)`
- `getDepositsByIdsWithRelations(ids, options?)`
- `getDepositsByPayeeHash(payeeHash, options?)`

### Intent queries

- `getIntentsForDeposits(depositIds, statuses?)`
- `getOwnerIntents(owner, statuses?)`
- `getIntentsByRateManager(rateManagerId, statuses?)`
- `getIntentByHash(intentHash)`
- `getExpiredIntents({ now, depositIds, limit? })`
- `getFulfilledIntentEvents(intentHashes)` — fulfillment events, including `takerAmountNetFees`
- `getIntentFulfillmentAmounts(intentHash)` — includes `takerAmountNetFees`, the net USDC the taker received after fees
- `getFulfillmentAndPayment(intentHash)`

### Fund activity and snapshots

- `getDepositFundActivities(depositId)`
- `getMakerFundActivities(depositor, limit?)`
- `getDepositDailySnapshots(depositId, limit?)`
- `getProfitSnapshotsByDeposits(depositIds)`

### Rate manager (vault) queries

- `getRateManagers(pagination?, filter?)`
- `getRateManagerDetail(managerId, options?)`
- `getRateManagerDelegations(managerId, pagination?)`
- `getDelegationForDeposit(depositId, options?)`
- `getManagerDailySnapshots(managerId, options?)`
- `getManualRateUpdates(managerId, options?)`
- `getOracleConfigUpdates(managerId, options?)`

### Raw access

- `query<T>({ query, variables? })` — raw GraphQL
- `client` — raw `IndexerClient` instance

The package also exports `IndexerRateManagerService` and the standalone helper `fetchIndexerFulfillmentAndPayment(client.indexer.client, intentHash)`.

### Indexer converters

The SDK exports converter helpers for turning indexer payloads into the same `EscrowDepositView` shape produced by RPC reads.

| Helper | Purpose |
| --- | --- |
| `convertIndexerDepositToEscrowView(deposit, chainId, escrowAddress)` | Converts a single indexer deposit (with relations) into an `EscrowDepositView` |
| `convertDepositsForLiquidity(deposits, chainId, escrowAddress, options?)` | Filters and converts indexer deposits into the active liquidity set used by takers. Pass `{ includePrivateOrderbooks: true }` to also include deposits gated by a non-zero whitelist hook (defaults to `false`, public orderbooks only) |
| `convertIndexerIntentsToEscrowViews(intents, depositViewsById)` | Converts indexer intents into `EscrowIntentView[]` |

## Oracle helpers

The SDK exports helper constants and encoders for oracle-backed ARM spread pricing.

| Helper | Purpose |
| --- | --- |
| `getSpreadOracleConfig(currency, adapters?)` | Resolve bundled Chainlink-first oracle config for a fiat currency |
| `encodeSpreadOracleAdapterConfig(config)` | Encode Chainlink adapter config |
| `encodePythAdapterConfig(config)` | Encode Pyth adapter config |
| `validateOracleFeedsOnChain(publicClient, pythContract?)` | Return currencies whose bundled feeds are available on-chain |
| `supportsInlineOracleRateConfig({ escrowAddress? })` | Client method that reports whether the target Escrow ABI accepts inline oracle configs |

Useful constants include `CHAINLINK_ORACLE_ADAPTER`, `PYTH_ORACLE_ADAPTER`, `DEFAULT_ORACLE_MAX_STALENESS_SECONDS`, `CHAINLINK_ORACLE_FEEDS`, `SPREAD_ORACLE_FEEDS`, and `PYTH_ORACLE_FEEDS`.

## Referrer fees

Use these helpers when you want to validate or normalize referrer fee settings before calling `getQuote()` or `signalIntent()`.

| Helper | Purpose |
| --- | --- |
| `assertValidReferrerFeeConfig(config, context)` | Throws if the config is invalid for `getQuote`, `getQuotesBestByPlatform`, or `signalIntent` |
| `isValidReferrerFeeRecipient(value)` | Checks whether a referrer fee recipient is a valid address |
| `isValidReferrerFeeBps(value)` | Checks whether a BPS value is allowed |
| `parseReferrerFeeConfig(recipient, feeBpsValue)` | Builds a `ReferrerFeeConfig` from loosely typed input |
| `referrerFeeConfigToPreciseUnits(config)` | Converts the fee config into precise units for on-chain use |

## Attribution

The SDK includes ERC-8021 helpers for Base builder attribution.

| Helper | Purpose |
| --- | --- |
| `getAttributionDataSuffix(referrer?)` | Builds the attribution suffix |
| `appendAttributionToCalldata(calldata, referrer?)` | Appends attribution to existing calldata |
| `encodeWithAttribution(request, referrer?)` | Encodes calldata and appends attribution in one step |
| `sendTransactionWithAttribution(walletClient, request, referrer?, overrides?)` | Sends a transaction with appended attribution |

Useful constants:

- `BASE_BUILDER_CODE`
- `ZKP2P_IOS_REFERRER`
- `ZKP2P_ANDROID_REFERRER`

## Contract helpers

| Helper | Description |
| --- | --- |
| `getContracts(chainId, env?)` | Returns deployed addresses and ABIs for escrow, orchestrator, verifier, ProtocolViewer, USDC, and related contracts |
| `getRateManagerContracts(chainId, env?)` | Returns rate-manager registry/controller addresses and ABIs |
| `getPaymentMethodsCatalog(chainId, env?)` | Returns the platform-to-hash catalog used for payment-method resolution |
| `getGatingServiceAddress(chainId, env?)` | Returns the signer used for intent gating |

Common companion helpers:

- `currencyInfo`
- `getCurrencyInfoFromHash()`
- `getCurrencyInfoFromCountryCode()`
- `resolveFiatCurrencyBytes32()`
- `resolvePaymentMethodHash()`
- `resolvePaymentMethodHashFromCatalog()`
- `resolvePaymentMethodNameFromHash()`

## Error handling

All SDK-specific errors extend `ZKP2PError`.

| Class | Code | Extra fields | Use it for |
| --- | --- | --- | --- |
| `ZKP2PError` | Any `ErrorCode` | `details?`, `field?` | Shared base class |
| `ValidationError` | `VALIDATION` | `field?`, `details?` | Invalid input |
| `NetworkError` | `NETWORK` | `details?` | RPC or network failures |
| `APIError` | `API` | `status?`, `details?` | Failed API requests |
| `ContractError` | `CONTRACT` | `details?` | Contract call or simulation failures |

Available error codes: `VALIDATION`, `NETWORK`, `API`, `CONTRACT`, `UNKNOWN`.

```ts
import {
  APIError,
  ContractError,
  ValidationError,
  ZKP2PError,
} from '@zkp2p/sdk';

try {
  await client.createDeposit({ /* ... */ });
} catch (error) {
  if (error instanceof ValidationError) {
    console.error(error.field, error.message);
  } else if (error instanceof APIError) {
    console.error(error.status, error.message);
  } else if (error instanceof ContractError) {
    console.error(error.details);
  } else if (error instanceof ZKP2PError) {
    console.error(error.code, error.message);
  }
}
```

## Logging

Use `setLogLevel()` to adjust SDK logging.

```ts
import { setLogLevel } from '@zkp2p/sdk';

setLogLevel('debug'); // 'debug' | 'info' | 'error'
```

## Help?

If you run into issues, join our [Discord](https://discord.gg/4hNVTv2MbH).
