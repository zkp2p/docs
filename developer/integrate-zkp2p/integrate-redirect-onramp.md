---
id: integrate-redirect-onramp
title: Onramp Integration
---

# Onramp Integration

:::danger Peer extension below `0.6.0` is deprecated — effective immediately
Peer extension versions below `0.6.0`, and the deeplink/side-panel onramp flow they supported, are **deprecated effective immediately**.

Extension `0.6.0` removes the side panel and the entire deeplink onramp API: `peerExtensionSdk.onramp()`, `openSidebar()`, `onIntentFulfilled()`, and extension-side proof generation no longer exist. The extension is auto-updated by the Chrome Web Store, so integrations built on the pre-`0.6.0` flow **will stop working as your users receive the update**.

If you are live on the old flow:

- **Migrate to the flow below now.** Your app drives the onramp with `Zkp2pClient` on `@zkp2p/sdk@0.5.0+`, and the extension is only used as a headless payment capture bridge.
- **As a temporary stopgap**, ask your users to pause extension auto-updates so they remain on their installed pre-`0.6.0` version until your migration ships. Treat this strictly as a bridge — unmanaged Chrome installs cannot pin extension versions reliably.

See [Migrating from the pre-0.6.0 deeplink flow](#migrating-from-the-pre-060-deeplink-flow) for a mapping of the old API to the new surface.
:::

## What this does

Use the Peer extension as a headless metadata bridge for web onramps. Your app owns the order UI, intent lifecycle, payment-row selection, and `fulfillIntent()` call. The extension opens the payment provider auth tab, captures provider-template metadata, encrypts Buyer TEE session material, and returns the capture result to the originating page.

:::info Peer extension `0.6.0`
This guide targets Peer extension manifest version `0.6.0`. The extension is stateless and exposes the headless provider authentication and metadata callback surface described below.
:::

## Who is this for?

Use this guide if you are building a desktop web app that needs users to verify a fiat payment for a Peer onramp or intent fulfillment flow.

You need:

- `@zkp2p/sdk` `0.5.0` or newer installed in your web app — `0.5.0` is the first release that ships the headless `peerExtensionSdk`; `0.4.x` only exposes the removed deeplink wrapper
- The Peer extension installed and connected for the current origin
- A `Zkp2pClient` configured for the chain and runtime
- An intent your app already created or selected
- Provider routing config for the payment method being verified

## End-to-end flow

1. Register `peer.onMetadataMessage()` before opening the provider auth tab.
2. Ensure the extension is installed, connected, and version `0.6.0` or newer.
3. Call `peer.authenticate()` with `captureMode: 'buyerTee'`.
4. Show or otherwise inspect the returned metadata rows.
5. Select the exact payment row the user made.
6. Build Buyer TEE params from the selected row's `params`.
7. Add `index: selectedRow.originalIndex` only for platforms whose verifier requires it.
8. Pass the Buyer TEE proof input into `client.fulfillIntent()`.

`client.fulfillIntent()` resolves the intent data, posts to the Buyer TEE attestation endpoint, encodes the returned `PaymentAttestation`, and sends the on-chain fulfillment transaction.

## Getting the intent hash

The capture flow needs the `intentHash` of the intent your app signaled. Derive it from the `signalIntent()` transaction receipt by decoding the `IntentSignaled` event. Do not take the latest entry from `getIntents()` — an account can hold multiple open intents and read ordering is not guaranteed, so you can end up fulfilling the wrong reservation.

```ts
import { createPublicClient, http, parseAbi, parseEventLogs } from 'viem';
import { base } from 'viem/chains';

const publicClient = createPublicClient({ chain: base, transport: http() });

// signalIntent() returns the transaction hash; see the Client Reference for params
const txHash = await client.signalIntent({ /* ... */ });
const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash });

const [intentSignaled] = parseEventLogs({
  abi: parseAbi([
    'event IntentSignaled(bytes32 indexed intentHash, address indexed escrow, uint256 indexed depositId, bytes32 paymentMethod, address owner, address to, uint256 amount, bytes32 fiatCurrency, uint256 conversionRate, uint256 timestamp)',
  ]),
  logs: receipt.logs,
  eventName: 'IntentSignaled',
});

const intentHash = intentSignaled.args.intentHash;
```

Persist the hash with your order state — you also need it to resume an interrupted flow or to look the intent back up with `client.getIntent(intentHash)`.

## Quickstart

This example uses Venmo. Venmo requires the selected metadata row's `originalIndex` to be included as `params.index`.

```ts
import {
  createPeerExtensionSdk,
  Zkp2pClient,
  type BuyerTeePaymentProofInput,
  type PeerBuyerTeePaymentCapture,
  type PeerMetadataMessage,
  type PeerMetadataRow,
} from '@zkp2p/sdk';

type BuyerTeePlatformConfig = {
  actionPlatform: string;
  actionType: string;
  attestationActionType?: string;
  includeMetadataIndex?: boolean;
  platform: string;
};

const VENMO_BUYER_TEE_CONFIG: BuyerTeePlatformConfig = {
  actionPlatform: 'venmo',
  actionType: 'transfer_venmo',
  includeMetadataIndex: true,
  platform: 'venmo',
};

const ATTESTATION_SERVICE_URL = 'https://attestation-service.zkp2p.xyz';

const peer = createPeerExtensionSdk({ window });

function isPeerExtension060OrNewer(version: string): boolean {
  const [major = 0, minor = 0] = version.split('.').map(Number);
  return major > 0 || (major === 0 && minor >= 6);
}

function isBuyerTeeParams(
  value: unknown,
): value is Record<string, string | number | boolean> {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.values(value).every(
      (entry) =>
        typeof entry === 'string' ||
        typeof entry === 'number' ||
        typeof entry === 'boolean',
    )
  );
}

async function ensurePeerReady() {
  const state = await peer.getState();

  if (state === 'needs_install') {
    peer.openInstallPage();
    throw new Error('Peer extension 0.6.0 is required');
  }

  if (state === 'needs_connection') {
    const approved = await peer.requestConnection();
    if (!approved) {
      throw new Error('Peer extension connection was not approved');
    }
  }

  const version = await peer.getVersion();
  if (!isPeerExtension060OrNewer(version)) {
    throw new Error(`Peer extension 0.6.0 or newer is required; found ${version}`);
  }
}

function selectPaymentRow(
  rows: PeerMetadataRow[],
  expected: {
    amount?: string;
    currency?: string;
    paymentId?: string;
    recipient?: string;
  },
): PeerMetadataRow | null {
  const visibleRows = rows.filter((row) => !row.hidden && isBuyerTeeParams(row.params));

  if (expected.paymentId) {
    const byPaymentId = visibleRows.find((row) => row.paymentId === expected.paymentId);
    if (byPaymentId) return byPaymentId;
  }

  return (
    visibleRows.find(
      (row) =>
        (!expected.amount || row.amount === expected.amount) &&
        (!expected.currency || row.currency === expected.currency) &&
        (!expected.recipient || row.recipient === expected.recipient),
    ) ?? null
  );
}

function buildBuyerTeeProof(
  row: PeerMetadataRow,
  capture: PeerBuyerTeePaymentCapture | null | undefined,
  config: BuyerTeePlatformConfig,
): BuyerTeePaymentProofInput {
  if (!capture?.encryptedSessionMaterial || !isBuyerTeeParams(row.params)) {
    throw new Error('Selected payment row is missing Buyer TEE capture data');
  }

  if (config.includeMetadataIndex && !Number.isInteger(row.originalIndex)) {
    throw new Error('Selected payment row is missing its provider metadata index');
  }

  return {
    proofType: 'buyerTee',
    encryptedSessionMaterial: capture.encryptedSessionMaterial,
    params: {
      ...row.params,
      ...(config.includeMetadataIndex ? { index: row.originalIndex } : {}),
    },
    actionPlatform: config.actionPlatform,
    actionType: config.attestationActionType ?? config.actionType,
  };
}

export async function openHeadlessOnrampCapture({
  client,
  expectedPayment,
  intentHash,
}: {
  client: Zkp2pClient;
  expectedPayment: {
    amount?: string;
    currency?: string;
    paymentId?: string;
    recipient?: string;
  };
  intentHash: `0x${string}`;
}) {
  const unsubscribe = peer.onMetadataMessage(async (message: PeerMetadataMessage) => {
    try {
      if (message.errorMessage) {
        throw new Error(message.errorMessage);
      }

      const selectedRow = selectPaymentRow(message.metadata, expectedPayment);
      if (!selectedRow) {
        throw new Error('No returned payment row matched the expected payment');
      }

      const proof = buildBuyerTeeProof(
        selectedRow,
        message.buyerTeeCapture,
        VENMO_BUYER_TEE_CONFIG,
      );

      await client.fulfillIntent({
        intentHash,
        proof,
        attestationServiceUrl: ATTESTATION_SERVICE_URL,
      });
    } catch (error) {
      console.error('Buyer TEE onramp fulfillment failed:', error);
    } finally {
      unsubscribe();
    }
  });

  await ensurePeerReady();

  peer.authenticate({
    actionType: VENMO_BUYER_TEE_CONFIG.actionType,
    attestationActionType:
      VENMO_BUYER_TEE_CONFIG.attestationActionType ?? VENMO_BUYER_TEE_CONFIG.actionType,
    attestationServiceUrl: ATTESTATION_SERVICE_URL,
    captureMode: 'buyerTee',
    platform: VENMO_BUYER_TEE_CONFIG.platform,
  });
}
```

## Peer Extension SDK API

The SDK exports a default instance and a scoped factory. Use the scoped factory when testing, rendering in iframes, or avoiding module-level browser access.

```ts
import {
  peerExtensionSdk,
  createPeerExtensionSdk,
  isPeerExtensionAvailable,
  getPeerExtensionState,
  openPeerExtensionInstallPage,
  PEER_EXTENSION_CHROME_URL,
} from '@zkp2p/sdk';
```

### Methods on `PeerExtensionSdk`

| Method | Description |
| --- | --- |
| `isAvailable(): boolean` | Returns `true` when `window.peer` is injected. |
| `getState(): Promise<'needs_install' \| 'needs_connection' \| 'ready'>` | Checks install and origin connection state. |
| `requestConnection(): Promise<boolean>` | Prompts the user to approve the current origin. |
| `checkConnectionStatus(): Promise<'connected' \| 'disconnected' \| 'pending'>` | Reads current origin connection status. |
| `getVersion(): Promise<string>` | Returns the installed Peer extension version. Require `0.6.0` or newer for this flow. |
| `authenticate(params: PeerAuthenticateParams): void` | Opens the provider auth tab and starts headless metadata capture. |
| `onMetadataMessage(callback: PeerMetadataMessageCallback): () => void` | Subscribes to capture results and returns an unsubscribe function. |
| `openInstallPage(): void` | Opens the Chrome Web Store listing. |

## Authenticate Parameters

Pass these parameters to `peer.authenticate()`.

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `actionType` | Yes | `string` | Provider template action to load, such as `transfer_venmo`. The extension fetches the default template from `https://api.zkp2p.xyz/providers/{platform}/{actionType}.json` unless `providerConfig` is supplied. |
| `platform` | Yes | `string` | Provider platform used by the extension and attestation service, such as `venmo`, `paypal`, `wise`, or `cashapp`. |
| `captureMode` | Buyer TEE only | `'buyerTee'` | Use `buyerTee` for onramp payment verification. |
| `attestationServiceUrl` | Buyer TEE only | `string` | Required for `captureMode: 'buyerTee'`. The extension uses this URL to encrypt session material for the attestation service. |
| `attestationActionType` | No | `string \| null` | Attestation action when it differs from the provider template action. If omitted, `actionType` is used. |
| `providerConfig` | No | `Record<string, unknown>` | Inline provider template. Use only for custom or local template testing; inline templates trigger post-extraction user approval. |

## Metadata Row Selection

`onMetadataMessage()` returns provider metadata rows plus a single encrypted Buyer TEE capture:

```ts
type PeerMetadataMessage = {
  buyerTeeCapture?: {
    encryptedSessionMaterial: string;
    params?: Array<Record<string, string | number | boolean>>;
  } | null;
  errorMessage?: string;
  expiresAt: number;
  metadata: Array<{
    amount?: string;
    currency?: string;
    date?: string;
    hidden: boolean;
    originalIndex: number;
    params?: Record<string, string | number | boolean>;
    paymentId?: string;
    recipient?: string;
    [key: string]: unknown;
  }>;
  platform: string;
  requestId: string;
};
```

Use the selected metadata row as the source of truth:

- Select a row where `hidden === false` and `row.params` is a flat object of strings, numbers, or booleans.
- Prefer exact `paymentId` matching when the provider returns a payment ID.
- Otherwise match on the expected amount, currency, and recipient shown to the user.
- Use `row.originalIndex` for the provider metadata index. Do not use the row's UI index after filtering or sorting.
- Use `row.params`, not `buyerTeeCapture.params`, when building the attestation params.

## Metadata Index Params

Some Buyer TEE verifiers need the source metadata index so the attestation service can select the same row from the encrypted provider session. Other verifiers have strict schemas and should not receive an extra `index` field.

| Platform | Add `params.index`? |
| --- | --- |
| Venmo | Yes |
| Cash App | Yes |
| Revolut | Yes |
| Zelle - Bank of America, Chase, Citi | Yes |
| Wise | No |
| PayPal personal and business | No |
| Monzo | No |
| Chime | No |

Build params like this:

```ts
const params = {
  ...selectedRow.params,
  ...(includeMetadataIndex ? { index: selectedRow.originalIndex } : {}),
};
```

## Buyer TEE Attestation Endpoint

For normal integrations, call `client.fulfillIntent()` with a Buyer TEE proof input. The SDK posts to:

```text
POST {attestationServiceUrl}/buyer/verify/{actionPlatform}/{actionType}
```

The SDK sends:

```ts
{
  encryptedSessionMaterial: proof.encryptedSessionMaterial,
  params: proof.params,
  chainId,
  intent: {
    intentHash,
    amount,
    timestampMs,
    paymentMethod,
    fiatCurrency,
    conversionRate,
    payeeDetails,
    timestampBufferMs,
  },
}
```

Then it encodes the returned `PaymentAttestation` and fulfills the intent on-chain.

```ts
await client.fulfillIntent({
  intentHash,
  proof: {
    proofType: 'buyerTee',
    encryptedSessionMaterial: message.buyerTeeCapture!.encryptedSessionMaterial,
    params,
    actionPlatform,
    actionType,
  },
  attestationServiceUrl: 'https://attestation-service.zkp2p.xyz',
});
```

If you need to preflight the attestation service for a custom transaction builder, you can call the Buyer TEE endpoint directly. Most apps should skip this and let `fulfillIntent()` do it.

```ts
async function verifyBuyerTeePaymentDirectly({
  actionPlatform,
  actionType,
  attestationServiceUrl,
  chainId,
  client,
  encryptedSessionMaterial,
  intentHash,
  params,
}: {
  actionPlatform: string;
  actionType: string;
  attestationServiceUrl: string;
  chainId: number;
  client: Zkp2pClient;
  encryptedSessionMaterial: string;
  intentHash: `0x${string}`;
  params: Record<string, string | number | boolean>;
}) {
  const intentInputs = await client.getFulfillIntentInputs(intentHash);

  const response = await fetch(
    `${attestationServiceUrl}/buyer/verify/${encodeURIComponent(
      actionPlatform,
    )}/${encodeURIComponent(actionType)}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        encryptedSessionMaterial,
        params,
        chainId,
        intent: {
          intentHash,
          amount: intentInputs.amount,
          timestampMs: intentInputs.intentTimestampMs,
          paymentMethod: intentInputs.paymentMethodHash,
          fiatCurrency: intentInputs.fiatCurrency,
          conversionRate: intentInputs.conversionRate,
          payeeDetails: intentInputs.payeeDetails,
          timestampBufferMs: '300000',
        },
      }),
    },
  );

  if (!response.ok) {
    throw new Error(await response.text());
  }

  return response.json();
}
```

## Seller Credential Capture

The same headless bridge can capture seller credentials for Seller Autopilot. The extension returns only the encrypted credential bundle and `offchainId`; it does not create makers, call curator storage APIs, or return plaintext session material.

```ts
peer.authenticate({
  actionType: 'transfer_venmo',
  captureMode: 'sellerCredential',
  platform: 'venmo',
});
```

After receiving `message.sarCredentialCapture`, register the maker payee details and store the bundle through your app's curator flow.

## Full Customization: Build Your Own Extension

Because the `0.6.0` extension does only headless capture, everything else in this guide already runs in your app through `@zkp2p/sdk` — so the Peer extension itself is replaceable. If you want a fully whitelabeled experience (your own name and icon in the Chrome toolbar, your own Web Store listing, your own consent UX), you can ship your own extension and keep the rest of this integration unchanged. If your extension injects the same `window.peer` interface, everything on this page — including `peerExtensionSdk` — works against your extension with zero page-code changes.

See [Build Your Own Extension](/developer/build-your-own-extension) for the full guide: the page contract, the provider template schema, passing inline `providerConfig`, and step-by-step implementations of the buyer capture flow and the Seller Autopilot credential flow.

## Migrating from the pre-0.6.0 deeplink flow

The pre-`0.6.0` integration opened a Peer-branded side panel that ran the whole onramp. That UI no longer exists — your app now drives the flow and the extension only captures payment confirmation. Start by upgrading to `@zkp2p/sdk` `0.5.0` or newer: the `0.4.x` `peerExtensionSdk` only exposes the removed deeplink API. Then map the old surface to the new one:

| Pre-`0.6.0` | `0.6.0+` |
|-------------|----------|
| `peerExtensionSdk.onramp({...})` | Drive the flow yourself: [`getQuote()`](/developer/sdk/client-reference#quote-api) → [`signalIntent()`](/developer/sdk/client-reference#signalintent--signalintentprepare) → the capture and `fulfillIntent()` flow on this page |
| `onramp({ inputCurrency, inputAmount })` | `getQuote({ fiatCurrency, amount, isExactFiat: true })` |
| `onramp({ paymentPlatform })` | `getQuote({ paymentPlatforms: [...] })` |
| `onramp({ toToken: 'chainId:address' })` | `getQuote({ destinationChainId, destinationToken })` |
| `onramp({ recipientAddress })` | `getQuote({ recipient })` / `signalIntent({ toAddress })` |
| `onramp({ referrer, referrerLogo })` | Removed — your UI is the brand. Use `referrer` / `referrerFeeConfig` on `getQuote()` and `signalIntent()` for attribution and fees |
| `onramp({ intentHash })` to resume | Persist the intent hash in your app; resume by re-running the capture and `fulfillIntent()` |
| `onIntentFulfilled(callback)` | Your app submits the fulfill transaction — await `fulfillIntent()` or use its `callbacks` |
| `openSidebar(route)` | Removed — there is no side panel |
| Extension-managed wallet & gas | Your app supplies the `walletClient`; use `fulfillIntent.prepare()` with your own relayer for gasless UX |
| `onProofComplete()` / `callbackUrl` (pre-`0.4.9`) | Removed since `0.4.9`; covered by the same migration |

Unchanged: `isAvailable()`, `getState()`, `requestConnection()`, `checkConnectionStatus()`, `getVersion()`, and `openInstallPage()` work exactly as before.

## Common Issues

| Issue | Fix |
| --- | --- |
| `getState()` returns `needs_install` | Ask the user to install the Peer extension and retry after `getVersion()` reports `0.6.0` or newer. |
| `getState()` returns `needs_connection` | Call `requestConnection()` from a user action and stop if the user declines. |
| No callback arrives | Register `onMetadataMessage()` before `authenticate()`, then confirm the provider auth tab reached a request matched by the provider template. |
| `Session capture requires an attestation service URL.` | Pass `attestationServiceUrl` for every `captureMode: 'buyerTee'` launch. |
| The selected row cannot build a Buyer TEE proof | Make sure the selected row has `params`, the capture has `encryptedSessionMaterial`, and `originalIndex` exists when the platform requires `params.index`. |
| Buyer TEE verification fails with an unexpected params schema | Only add `index` for platforms that require it; do not send `index` to strict-schema platforms such as PayPal, Wise, Monzo, or Chime. |

## LLM Integration Prompt

Download a ready-to-paste prompt for AI coding assistants that adds Peer extension `0.6.0` headless capture to an onramp or intent fulfillment flow:

**<a href="/onramp-llm.md" download>Download onramp-llm.md</a>**

## Help?

For any issues or support, please join our [Discord](https://discord.gg/4hNVTv2MbH).
