---
id: integrate-redirect-onramp
title: Onramp Integration
---

# Onramp Integration

## What this does

Use the Peer extension as a headless metadata bridge for web onramps. Your app owns the order UI, intent lifecycle, and `fulfillIntent()` call. The extension opens the payment provider auth tab, captures provider-template metadata, encrypts Buyer TEE session material, and returns the capture result to the originating page.

:::info Peer extension `0.6.0`
This guide targets Peer extension manifest version `0.6.0`. The extension is stateless and exposes only the headless provider authentication and metadata callback surface described below.
:::

## Who is this for?

Use this guide if you are building a desktop web app that needs users to verify a fiat payment for a Peer onramp or intent fulfillment flow.

You need:

- `@zkp2p/sdk` installed in your web app
- The Peer extension installed and connected for the current origin
- An intent your app already created or selected
- A provider action type, platform, and attestation service URL for Buyer TEE capture

## Quickstart

Register the metadata listener before opening the provider auth tab. For third-party origins, request a connection before calling `authenticate()`.

```ts
import {
  createPeerExtensionSdk,
  type PeerBuyerTeePaymentCapture,
  type PeerMetadataRow,
} from '@zkp2p/sdk';

const peer = createPeerExtensionSdk({ window });

function isPeerExtension060OrNewer(version: string): boolean {
  const [major = 0, minor = 0] = version.split('.').map(Number);
  return major > 0 || (major === 0 && minor >= 6);
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

function buildBuyerTeeProof(row: PeerMetadataRow, capture?: PeerBuyerTeePaymentCapture | null) {
  if (!capture?.encryptedSessionMaterial || !row.params) {
    throw new Error('Selected payment row is missing Buyer TEE capture data');
  }

  return {
    proofType: 'buyerTee' as const,
    encryptedSessionMaterial: capture.encryptedSessionMaterial,
    params: {
      ...row.params,
      index: row.originalIndex,
    },
    actionType: 'transfer_venmo',
    actionPlatform: 'venmo',
  };
}

const unsubscribe = peer.onMetadataMessage(async (message) => {
  if (message.errorMessage) {
    console.error('Peer metadata capture failed:', message.errorMessage);
    return;
  }

  const selectedPayment = message.metadata.find((row) => !row.hidden && row.params);
  if (!selectedPayment) {
    console.error('No selectable payment metadata was returned');
    return;
  }

  const proof = buildBuyerTeeProof(selectedPayment, message.buyerTeeCapture);

  await client.fulfillIntent({
    intentHash,
    proof,
  });
});

await ensurePeerReady();

peer.authenticate({
  actionType: 'transfer_venmo',
  attestationActionType: 'transfer_venmo',
  attestationServiceUrl: 'https://attestation-service.zkp2p.xyz',
  captureMode: 'buyerTee',
  platform: 'venmo',
});

// Call unsubscribe() when your page no longer needs the listener.
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

### Instances

- `peerExtensionSdk`: Default SDK instance that uses the global `window`.
- `createPeerExtensionSdk(options?: PeerExtensionSdkOptions)`: Creates a scoped SDK instance. `options.window` lets tests or iframes provide a specific browser window.

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

### Helper functions and constants

- `isPeerExtensionAvailable(options?: PeerExtensionSdkOptions): boolean`
- `getPeerExtensionState(options?: PeerExtensionSdkOptions): Promise<PeerExtensionState>`
- `openPeerExtensionInstallPage(options?: PeerExtensionSdkOptions): void`
- `PEER_EXTENSION_CHROME_URL`

## Authenticate Parameters

Pass these parameters to `peer.authenticate()`.

| Parameter | Required | Type | Description |
| --- | --- | --- | --- |
| `actionType` | Yes | `string` | Provider template action to load, such as `transfer_venmo`. The extension fetches the default template from `https://api.zkp2p.xyz/providers/{platform}/{actionType}.json` unless `providerConfig` is supplied. |
| `platform` | Yes | `string` | Provider platform used by the extension and attestation service, such as `venmo`, `paypal`, `wise`, or `cashapp`. |
| `captureMode` | No | `'buyerTee' \| 'sellerCredential'` | Use `buyerTee` for onramp payment verification. Use `sellerCredential` for seller automated release credential bundle capture. Omit for metadata-only capture. |
| `attestationServiceUrl` | Buyer TEE only | `string` | Required for `captureMode: 'buyerTee'`. The extension trims trailing slashes before encrypting session material. |
| `attestationActionType` | No | `string \| null` | Attestation action when it differs from the provider template action. If omitted, `actionType` is used. |
| `providerConfig` | No | `Record<string, unknown>` | Inline provider template. Use only for custom or local template testing; inline templates trigger post-extraction user approval. |

## Metadata Callback

`onMetadataMessage()` receives one callback when capture finishes or fails.

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
  sarCredentialCapture?: {
    credentialBundle: SellerCredentialBundle;
    offchainId: string;
  } | null;
};
```

For Buyer TEE onramps, use a visible metadata row with `row.params` plus `buyerTeeCapture.encryptedSessionMaterial` to build the `proof` passed into `client.fulfillIntent()`.

```ts
const proof = {
  proofType: 'buyerTee' as const,
  encryptedSessionMaterial: message.buyerTeeCapture!.encryptedSessionMaterial,
  params: {
    ...selectedRow.params!,
    index: selectedRow.originalIndex,
  },
  actionType: 'transfer_venmo',
  actionPlatform: 'venmo',
};

await client.fulfillIntent({ intentHash, proof });
```

## Seller Credential Capture

The same headless bridge can capture seller credentials for seller automated release. The extension returns only the encrypted credential bundle and `offchainId`; it does not create makers, call curator storage APIs, or return plaintext session material.

```ts
peer.authenticate({
  actionType: 'transfer_venmo',
  captureMode: 'sellerCredential',
  platform: 'venmo',
});
```

After receiving `message.sarCredentialCapture`, register the maker payee details and store the bundle through your app's curator flow.

## Provider Templates

By default, the extension loads provider templates from:

```text
https://api.zkp2p.xyz/providers/{platform}/{actionType}.json
```

For custom provider testing, pass the template inline as `providerConfig`. A template must include an `authLink`, metadata request match rules, metadata extraction selectors, and any Buyer TEE `paramNames` / `paramSelectors` needed to produce `row.params`.

## Common Issues

| Issue | Fix |
| --- | --- |
| `getState()` returns `needs_install` | Ask the user to install the Peer extension and retry after `getVersion()` reports `0.6.0` or newer. |
| `getState()` returns `needs_connection` | Call `requestConnection()` from a user action and stop if the user declines. |
| No callback arrives | Register `onMetadataMessage()` before `authenticate()`, then confirm the provider auth tab reached a request matched by the provider template. |
| `Session capture requires an attestation service URL.` | Pass `attestationServiceUrl` for every `captureMode: 'buyerTee'` launch. |
| The selected row cannot build a Buyer TEE proof | Use a metadata row whose `params` were produced by the provider template's Buyer TEE selectors. |

## LLM Integration Prompt

Download a ready-to-paste prompt for AI coding assistants that adds Peer extension `0.6.0` headless capture to an onramp or intent fulfillment flow:

**<a href="/onramp-llm.md" download>Download onramp-llm.md</a>**

## Help?

For any issues or support, please join our [Discord](https://discord.gg/4hNVTv2MbH).
