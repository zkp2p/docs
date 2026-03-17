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
| `preferV2ByDefault` | No | Controls whether V2 contracts are preferred when both legacy and V2 are deployed |
| `indexerUrl` | No | Override for the indexer GraphQL endpoint |
| `baseApiUrl` | No | Override for ZKP2P service APIs |
| `apiKey` | No | Curator API key used by authenticated endpoints such as `registerPayeeDetails()` and auto-signing for `signalIntent()` |
| `authorizationToken` | No | Optional bearer token for hybrid authentication |
| `getAuthorizationToken` | No | Async token provider for long-lived clients |
| `indexerApiKey` | No | Optional `x-api-key` header for indexer proxy authentication |
| `timeouts.api` | No | API timeout in milliseconds |

```ts
import { Zkp2pClient } from '@zkp2p/sdk';

const client = new Zkp2pClient({
  walletClient,
  chainId: 8453,
  runtimeEnv: 'production',
  apiKey: 'YOUR_API_KEY',
  indexerApiKey: 'YOUR_INDEXER_API_KEY',
});
```

:::warning API-backed methods
`registerPayeeDetails()` requires curator API access. `signalIntent()` can auto-fetch its gating signature when you provide `apiKey` or `authorizationToken`; if you do not want the SDK to make that request, pass `gatingServiceSignature` and `signatureExpiration` yourself.
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
  payeeDetails: '0xPayeeHash',
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
  depositData: [{ email: 'maker@example.com' }],
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
| `depositData` | `Array<Record<string, string>>` | Processor-specific payment details in the same order as `processorNames` |

```ts
const { hashedOnchainIds } = await client.registerPayeeDetails({
  processorNames: ['wise', 'revolut'],
  depositData: [
    { email: 'maker@example.com' },
    { tag: '@maker' },
  ],
});

await client.createDeposit({
  token: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  amount: 1_000_000000n,
  intentAmountRange: { min: 10_000000n, max: 500_000000n },
  processorNames: ['wise', 'revolut'],
  depositData: [
    { email: 'maker@example.com' },
    { tag: '@maker' },
  ],
  conversionRates: [
    [{ currency: 'USD', conversionRate: '1020000000000000000' }],
    [{ currency: 'EUR', conversionRate: '950000000000000000' }],
  ],
  payeeDetailsHashes: hashedOnchainIds,
});
```

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
| `referrerFeeConfig` | No | Redirect/onramp-friendly referrer fee configuration |
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
| `proof` | Yes | Reclaim proof object or JSON string |
| `timestampBufferMs` | No | Allowed timestamp variance in milliseconds |
| `attestationServiceUrl` | No | Override for the attestation service |
| `orchestratorAddress` | No | Explicit orchestrator override |
| `postIntentHookData` | No | Hook payload passed to the orchestrator |
| `txOverrides` | No | viem transaction overrides |
| `callbacks` | No | UI lifecycle callbacks such as `onAttestationStart`, `onTxSent`, and `onTxMined` |
| `precomputedAttestation` | No | Pre-encoded attestation data for advanced flows |

### `releaseFundsToPayer()` / `releaseFundsToPayer.prepare()`

Manual release path for returning reserved funds to the deposit owner when an intent should not be fulfilled.

| Parameter | Required | Description |
| --- | --- | --- |
| `intentHash` | Yes | `0x`-prefixed 32-byte intent hash |
| `orchestratorAddress` | No | Explicit orchestrator override |
| `txOverrides` | No | viem transaction overrides |

## Vault and rate-manager operations

At the client layer, vaults are exposed as rate managers. These flows are most relevant when you are delegating deposits or managing shared pricing.

:::note
`staging` defaults to V2 routing. Several vault, delegation, and oracle-backed pricing features are V2-only, even though the SDK still supports legacy fallback for broader deposit and intent flows.
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

## Taker tiers

Use `getTakerTier(req, opts?)` to fetch tiering, cooldown, and platform-limit data for a taker address.

| Request field | Required | Description |
| --- | --- | --- |
| `owner` | Yes | Taker address |
| `chainId` | Yes | Chain ID for tier evaluation |

The response object includes:

- `tier`: one of `PEASANT`, `PEER`, `PLUS`, `PRO`, `PLATINUM`, or `PEER_PRESIDENT`
- `perIntentCapBaseUnits` and `perIntentCapDisplay`
- cooldown metadata such as `cooldownHours`, `cooldownActive`, and `nextIntentAvailableAt`
- `platformLimits`, including risk level and minimum required tier per payment platform

## Querying on-chain data

For common read flows, start with the RPC-first methods:

- `getDeposits()`
- `getAccountDeposits(owner)`
- `getDeposit(depositId)`
- `getDepositsById(ids)`
- `getIntents()`
- `getAccountIntents(owner)`
- `getIntent(intentHash)`
- `resolvePayeeHash(depositId, paymentMethodHash)`
- `getFulfillIntentInputs(intentHash)`
- `getDeployedAddresses()`
- `getUsdcAddress()`

For copy-paste examples around deposits and intents, see [Offramp Integration](/developer/offramp).

## Indexer

Use `client.indexer` when you need historical data, richer filtering, or pagination across all deposits and intents.

Common methods on `client.indexer`:

- `getDeposits(filter?, pagination?)`
- `getDepositsWithRelations(filter?, pagination?, options?)`
- `getDepositById(id, options?)`
- `getOwnerIntents(owner, statuses?)`
- `getIntentByHash(intentHash)`
- `getExpiredIntents({ now, depositIds, limit? })`
- `getFulfilledIntentEvents(intentHashes)`
- `getIntentFulfillmentAmounts(intentHash)`
- `getFulfillmentAndPayment(intentHash)`
- `getDepositsByPayeeHash(payeeHash, options?)`

For rate-manager analytics, the package also exports `IndexerRateManagerService`, which you can construct from `client.indexer.client`.

```ts
import { IndexerRateManagerService } from '@zkp2p/sdk';

const rateManagers = new IndexerRateManagerService(client.indexer.client);
const list = await rateManagers.fetchRateManagers({ limit: 20 });
```

The package also exports the standalone helper `fetchFulfillmentAndPayment(client.indexer.client, intentHash)`.

## Referrer fees

Use these helpers when you want to validate or normalize referrer fee settings before calling `getQuote()` or `signalIntent()`.

| Helper | Purpose |
| --- | --- |
| `assertValidReferrerFeeConfig(config, context)` | Throws if the config is invalid for `getQuote` or `signalIntent` |
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
| `HISTORICAL_ESCROW_ADDRESSES` | Historical escrow addresses keyed by runtime deployment |

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
