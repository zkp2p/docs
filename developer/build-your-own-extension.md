---
id: build-your-own-extension
title: Build Your Own Extension
---

# Build Your Own Extension

## Overview

As of Peer extension `0.6.0`, the extension is a thin, stateless headless metadata bridge: it opens the payment platform in a tab, intercepts requests that match a provider template, extracts payment metadata, encrypts anything sensitive, and posts the result back to the page. Everything else — quotes, intents, attestation, settlement, seller registration — runs in your app through `@zkp2p/sdk`.

That makes the extension fully replaceable. This guide covers how to build your own extension under your own brand for both flows:

- **Buyer flow** — capture a buyer's payment confirmation for [onramp fulfillment](/developer/integrate-zkp2p/integrate-redirect-onramp)
- **Seller Autopilot flow** — capture a seller's platform credentials so their payments verify and release automatically

It also documents **provider templates** and the **inline `providerConfig`** launch option, which is how you develop and test capture behavior for new platforms.

The fastest starting point is the open-source branded extension template:
[github.com/zkp2p/peer-examples/tree/main/branded-extension](https://github.com/zkp2p/peer-examples/tree/main/branded-extension). Fork it, edit `brand.config.json`, run `npm run rebrand`, and keep the security invariants intact.

:::warning This replaces the "Build a Payment Integration" guide
The previous guide documented authoring zkTLS provider templates for the legacy proof flow, which is deprecated. Templates are now *capture instructions* consumed by the extension — payment verification happens in the ZKP2P attestation service TEE, not in the browser. To get a new platform template published to the default API path, reach out on [Telegram](https://t.me/+XDj9FNnW-xs5ODNl).
:::

## Who is this for?

Integrators who want a fully whitelabeled experience: your own name and icon in the Chrome toolbar, your own Web Store listing, your own consent UX, no Peer branding anywhere. If the Peer extension works for you as-is, you don't need any of this — the [Onramp Integration](/developer/integrate-zkp2p/integrate-redirect-onramp) guide is enough.

## Architecture

| Component | Responsibility |
|-----------|----------------|
| Your extension | Open the platform tab, intercept template-matched requests, extract metadata, encrypt session material, post results to the page. Nothing else. |
| Your web app + `@zkp2p/sdk` | Everything onchain and API-side: quotes, `signalIntent()`, `fulfillIntent()`, seller registration, curator uploads |
| ZKP2P attestation service | Decrypts captured session material inside a TEE, re-verifies the payment or credential against the platform, signs attestations and credential bundles |

The security model depends on one invariant: **plaintext session material (cookies, auth headers, request bodies) never leaves the extension.** The extension encrypts it against the attestation service TEE and forwards only the encrypted blob plus non-sensitive metadata rows.

## The page contract

The Peer extension injects a `window.peer` API and communicates over `window.postMessage`. If your extension implements the same contract, integrator page code — including `createPeerExtensionSdk()` from `@zkp2p/sdk` — works unchanged:

```ts
interface Peer {
  getVersion(): Promise<string>;
  requestConnection(): Promise<boolean>;
  checkConnectionStatus(): Promise<'connected' | 'disconnected' | 'pending'>;
  authenticate(params: PeerAuthenticateParams): void;
  onMetadataMessage(callback: (message: PeerMetadataMessage) => void): () => void;
}
```

`authenticate()` starts a capture:

| Parameter | Description |
|-----------|-------------|
| `actionType` | Provider template action, e.g. `transfer_venmo`. Production Seller Autopilot launches use the same `transfer_{platform}` templates as the buyer flow |
| `platform` | Payment platform the template belongs to, e.g. `venmo` |
| `captureMode` | `buyerTee` for buyer payment captures, `sellerCredential` for Seller Autopilot |
| `attestationServiceUrl` | Required for `buyerTee`. Optional for `sellerCredential` (defaults to the production attestation service) |
| `attestationActionType` | Optional override when the attestation action differs from the template `actionType` |
| `providerConfig` | Optional inline template — see [Inline provider config](#inline-provider-config) |

The capture result is posted back as a `PeerMetadataMessage` containing the extracted `metadata` rows plus exactly one of:

- `buyerTeeCapture: { encryptedSessionMaterial, params? }` — buyer flow
- `sarCredentialCapture: { credentialBundle, offchainId }` — Seller Autopilot flow

See [Metadata Row Selection](/developer/integrate-zkp2p/integrate-redirect-onramp#metadata-row-selection) for the full row shape and selection guidance.

## Provider templates

Templates tell the extension what to intercept and how to extract data from it. Default templates are served from:

```text
https://api.zkp2p.xyz/providers/{platform}/{actionType}.json
```

For example `https://api.zkp2p.xyz/providers/venmo/transfer_venmo.json` for buyer payment capture or `https://api.zkp2p.xyz/providers/venmo/register_venmo.json` for Venmo identity registration capture. When `authenticate()` is called without `providerConfig`, the Peer extension fetches the default template for the requested `platform`/`actionType`; your extension should do the same.

### Template shape

```json
{
  "authLink": "https://provider.example/login",
  "url": "https://provider.example/api/replay",
  "method": "GET",
  "body": "",
  "metadata": {
    "platform": "provider",
    "method": "GET",
    "urlRegex": "https://provider.example/api/transactions.*",
    "bodyRegex": "",
    "fallbackMethod": "GET",
    "fallbackUrlRegex": "",
    "fallbackBodyRegex": "",
    "metadataUrl": "",
    "metadataUrlMethod": "GET",
    "metadataUrlBody": "",
    "preprocessRegex": "",
    "transactionsExtraction": {
      "transactionJsonPathListSelector": "$.transactions",
      "transactionJsonPathSelectors": {
        "paymentId": "$.id",
        "amount": "$.amount.value",
        "currency": "$.amount.currency",
        "date": "$.created_at",
        "recipient": "$.recipient.name"
      }
    }
  },
  "paramNames": [],
  "paramSelectors": []
}
```

The fields your extension must honor:

| Field | Purpose |
|-------|---------|
| `authLink` | Provider URL to open in the capture tab |
| `metadata.platform` | Platform name returned in the capture result |
| `metadata.method` / `urlRegex` / `bodyRegex` | Primary request match for interception |
| `metadata.fallbackMethod` / `fallbackUrlRegex` / `fallbackBodyRegex` | Fallback request match |
| `metadata.metadataUrl` / `metadataUrlMethod` / `metadataUrlBody` | Optional replay request issued after a context request is captured — must be `https` and same-host with the captured request. Use this when the response body is needed (MV3 `webRequest` does not expose response bodies) |
| `metadata.preprocessRegex` | Optional regex whose capture group `1` is parsed before JSONPath extraction |
| `metadata.shouldReplayRequestInPage` | Run the replay inside the provider tab instead of the extension |
| `metadata.shouldSkipCloseTab` | Keep the provider tab open after a successful capture |
| `metadata.transactionsExtraction` | JSONPath or XPath selectors that produce metadata rows |
| `paramNames` / `paramSelectors` | Buyer TEE public param extraction — see below |

### Metadata extraction

For JSON responses, use a list selector plus field selectors relative to each row:

```json
{
  "metadata": {
    "transactionsExtraction": {
      "transactionJsonPathListSelector": "$.activity_rows",
      "transactionJsonPathSelectors": {
        "paymentId": "$.id",
        "amount": "$.amount.value",
        "currency": "$.amount.currency",
        "date": "$.created_at"
      }
    }
  }
}
```

Omit `transactionJsonPathListSelector` to run the selectors against the root object and return a single row. For HTML responses, use `transactionXPathListSelector` / `transactionXPathSelectors` with XPath expressions instead. Each extracted row carries the selected fields plus `originalIndex` and `hidden`.

If extraction requires the user to click an element in the provider tab first (for example opening a transaction detail view), the template can include `metadata.userInput`:

```json
{
  "metadata": {
    "userInput": {
      "promptText": "Select the transaction to share.",
      "transactionXpath": "//button[contains(., 'Details')]",
      "waitForXpathMs": 8000,
      "pollIntervalMs": 250
    }
  }
}
```

### Buyer TEE params

For buyer captures, `paramNames` and `paramSelectors` define the public parameters extracted alongside the encrypted session material:

```json
{
  "paramNames": ["PAYMENT_ID", "ACCOUNT_ID"],
  "paramSelectors": [
    { "type": "jsonPath", "value": "$[{{INDEX}}].id" },
    { "type": "regex", "source": "url", "value": "account/([^/?]+)" }
  ]
}
```

- `type`: `jsonPath`, `regex`, or `xPath`
- `source`: `responseBody` (default), `requestBody`, `requestHeaders`, `responseHeaders`, or `url`
- `{{INDEX}}` is replaced with the metadata row's `originalIndex`

Selectors with `source: "requestBody"` are private session-material selectors — their values must never be copied into the metadata rows returned to the page.

### Identity registration templates

Identity registration templates use the same template shape, but they feed the Attestation Service identity endpoint instead of `fulfillIntent()`. Current identity actions are `register_venmo`, `register_paypal`, and `register_wise`.

For Venmo, the published `register_venmo` template captures the stories request:

```text
https://account.venmo.com/api/stories?feedType=me&externalId={SENDER_ID}
```

The public identity params are `{ SENDER_ID }`, extracted from the request URL with `externalId=([0-9]+)`. The only Venmo identity session material that should be encrypted is a replayable `Cookie` header. Do not include the captured stories URL in `sessionMaterial`; `@zkp2p/zkp2p-attestation@1.5.1` and `@zkp2p/sdk@0.5.2` changed the flow so the service derives that URL from `params.SENDER_ID` and verifies the authenticated account id before replay.

The identity API request sent by the page or mobile client is:

```ts
{
  platform: 'venmo',
  actionType: 'register_venmo',
  callerAddress: '0x0000000000000000000000000000000000000002',
  encryptedSessionMaterial,
  params: { SENDER_ID: '123456789' },
}
```

`callerAddress` is part of the signed `IdentityAttestation`. Bind it to the wallet that will complete registration.

## Inline provider config

Custom templates are passed inline through the `providerConfig` launch parameter. This is the only custom-template mechanism — there is no `providerConfigUrl`, `providersBaseUrl`, or environment override for template sources, by design.

Two behaviors to replicate in your own extension:

1. **Inline launches require explicit user approval.** The Peer extension always shows a post-extraction approval popup for inline templates: the user sees the extracted metadata fields before anything is posted back to the requesting page. Without this, a malicious page could craft a template that exfiltrates arbitrary browsing data.
2. **Connection gating.** Pages must be approved (`requestConnection()`) before they can launch captures.

Inline config is also the fastest way to develop a template. Run this from a page console where the extension is connected:

```js
const providerConfig = {
  authLink: 'https://provider.example/login',
  url: 'https://provider.example/api/transactions',
  method: 'GET',
  body: '',
  metadata: {
    platform: 'provider',
    method: 'GET',
    urlRegex: 'https://provider.example/api/transactions.*',
    bodyRegex: '',
    fallbackMethod: 'GET',
    fallbackUrlRegex: '',
    fallbackBodyRegex: '',
    metadataUrl: '',
    metadataUrlMethod: 'GET',
    metadataUrlBody: '',
    preprocessRegex: '',
    transactionsExtraction: {
      transactionJsonPathListSelector: '$.transactions',
      transactionJsonPathSelectors: {
        paymentId: '$.id',
        amount: '$.amount',
        currency: '$.currency',
        date: '$.date',
        recipient: '$.recipient',
      },
    },
  },
  paramNames: [],
  paramSelectors: [],
};

const unsubscribe = window.peer.onMetadataMessage((message) => {
  console.log('metadata response:', message);
  unsubscribe();
});

if ((await window.peer.checkConnectionStatus()) !== 'connected') {
  await window.peer.requestConnection();
}

window.peer.authenticate({
  actionType: 'custom_test',
  platform: 'provider',
  providerConfig,
});
```

For a buyer TEE capture, add the capture mode and attestation service URL:

```js
window.peer.authenticate({
  actionType: 'transfer',
  platform: 'provider',
  captureMode: 'buyerTee',
  attestationServiceUrl: 'https://attestation-service.zkp2p.xyz',
  providerConfig,
});
```

:::note
The attestation service decides what a valid capture looks like per `platform`/`actionType` — inline templates are for developing and testing capture behavior. Captures only verify when they match what the attestation service expects, so reach out on [Telegram](https://t.me/+XDj9FNnW-xs5ODNl) before relying on a custom template in production.
:::

## Implementing the buyer flow

The buyer flow turns a payment the user already made into encrypted session material for [`fulfillIntent()`](/developer/sdk/client-reference#fulfillintent--fulfillintentprepare). It is fully template-driven — supporting a new buyer platform should not require extension code changes.

1. **Launch** — the page calls `authenticate({ actionType, platform, captureMode: 'buyerTee', attestationServiceUrl })`. Load the provider template (default API path or inline config) and open `authLink` in a new tab.
2. **Intercept** — register `chrome.webRequest` listeners (`onBeforeRequest`, `onSendHeaders`) for the template's `urlRegex` / `fallbackUrlRegex` / `metadataUrl` patterns. Cache the matched request's URL, method, headers, and body. Issue the `metadataUrl` replay when the template defines one.
3. **Extract** — run `transactionsExtraction` selectors over the response to build metadata rows, and `paramSelectors` to build each row's public `params`. The Peer extension uses [`jsonpath-plus`](https://www.npmjs.com/package/jsonpath-plus).
4. **Encrypt** — build the session material from the captured request (all request headers as key/value pairs, plus `body` when present) and encrypt it in your extension:

```ts
import { createEncryptedBuyerTeeSessionMaterial } from '@zkp2p/sdk';

const sessionMaterial: Record<string, string> = {
  ...capturedRequestHeaders, // header name -> value
  body: capturedRequestBody, // include when the request had a body
};

const encryptedSessionMaterial = await createEncryptedBuyerTeeSessionMaterial({
  platform: 'venmo',
  actionType: 'transfer_venmo',
  attestationServiceUrl, // from the launch payload
  sessionMaterial,
});
```

5. **Return** — post `{ requestId, platform, metadata, expiresAt, buyerTeeCapture: { encryptedSessionMaterial, params } }` to the tab that launched the capture, then discard all capture state.

The page then builds `{ proofType: 'buyerTee', encryptedSessionMaterial, params }` and calls `fulfillIntent()` — exactly as documented in [Onramp Integration](/developer/integrate-zkp2p/integrate-redirect-onramp#buyer-tee-attestation-endpoint), including the per-platform `params.index` rules.

The Peer extension runs SDK calls in an MV3 [offscreen document](https://developer.chrome.com/docs/extensions/reference/api/offscreen): the SDK's browser build and XPath-based extraction both expect a window-like runtime that background service workers don't provide.

## Implementing the Seller Autopilot flow

Seller Autopilot lets sellers upload encrypted platform credentials once, so that incoming payments are verified and released automatically. Extension capture is how Venmo and Cash App sellers onboard — Wise uses a personal API token and PayPal uses Gmail forwarding, neither of which needs an extension. See [Seller Autopilot](/developer/sdk/client-reference#seller-autopilot) for the platform matrix and session-material shapes.

The privacy boundary is stricter than the buyer flow: the Seller Autopilot result must contain **only** the encrypted `credentialBundle` and the seller's `offchainId`. Captured request headers, cookies, payee IDs, and session material must never be posted to the page.

1. **Launch** — the page calls `authenticate({ actionType: 'transfer_venmo', platform: 'venmo', captureMode: 'sellerCredential' })`. `attestationServiceUrl` is optional here; default to the production service.
2. **Capture** — same template-driven interception as the buyer flow, against the same `transfer_{platform}` template.
3. **Parse** — extract the platform-specific plaintext session material from the captured request in memory. This is the one platform-specific part of the extension: each Seller Autopilot platform needs a parser that produces its session-material shape (for Venmo: `recipientUsername`, `accountId`, `sessionCookie`; for Cash App: `recipientCashtag`, `customerId`, `sessionCookie`, `requestPayload`) plus the seller's `payeeId` and stable `offchainId`.
4. **Bundle** — create the encrypted credential bundle through the attestation service, inside your extension:

```ts
import {
  apiCreateSellerCredentialBundle,
  type SellerCredentialAttestationRuntime,
} from '@zkp2p/sdk';

// Provide runtime primitives explicitly when running outside a normal window
const attestationRuntime: SellerCredentialAttestationRuntime = {
  fetch: globalThis.fetch.bind(globalThis),
  subtle: globalThis.crypto.subtle,
  getRandomValues: globalThis.crypto.getRandomValues.bind(globalThis.crypto),
};

const response = await apiCreateSellerCredentialBundle(
  { payeeId, sessionMaterial },        // platform-specific, parsed in step 3
  attestationServiceUrl,
  platform,
  undefined,                           // timeoutMs
  attestationRuntime,
);

const credentialBundle = response.responseObject; // encrypted SellerCredentialBundle
```

5. **Return** — post `{ requestId, platform, metadata: [], expiresAt, sarCredentialCapture: { credentialBundle, offchainId } }` to the page and discard everything else.

The page finishes the registration — your extension must not call curator or create makers:

```ts
// Page side: register the payee and store the encrypted bundle with curator
const upload = await client.uploadSellerCredentialBundle({
  platform: 'venmo',
  offchainId: capture.offchainId,
  bundle: capture.credentialBundle,
});

// Then poll status with client.getSellerCredentialStatus()
```

`uploadSellerCredentialBundle()` registers or recovers the payee through curator `POST /v2/makers/create`, verifies the returned `hashedOnchainId` equals `bundle.payeeIdHash`, and then stores the bundle at `POST /v2/makers/{platform}/{hashedOnchainId}/seller-credential`. Keep that hash check if you implement the curator calls yourself; it prevents a tampered capture from binding credentials to the wrong payee.

## SDK reference for extension builders

All buyer and Seller Autopilot bridge helpers ship in `@zkp2p/sdk` `0.5.0` or newer. Identity registration support requires `@zkp2p/sdk` `0.5.2` or newer for the current Venmo `register_venmo` session-material shape.

| Export | Flow | Use |
|--------|------|-----|
| `createEncryptedBuyerTeeSessionMaterial({ platform, actionType, attestationServiceUrl, sessionMaterial })` | Buyer | Encrypt captured session material against the attestation TEE; returns the `encryptedSessionMaterial` string |
| `createNitroAttestationClient({ environment, attestationServiceUrl })` | Identity | Request typed identity attestations such as Venmo `register_venmo` without manually assembling `/identity` calls |
| `apiRequestIdentityAttestation(payload, attestationServiceUrl, platform, actionType)` | Identity | Post already-encrypted identity session material to Attestation Service `POST /identity` |
| `apiCreateSellerCredentialBundle(payload, attestationServiceUrl, platform, timeoutMs?, runtime?)` | Seller Autopilot | Create the encrypted seller credential bundle |
| `apiUploadSellerCredentialBundle(params, baseApiUrl?, timeoutMs?)` | Seller Autopilot | Register/recover curator payee details, verify `bundle.payeeIdHash`, and store the credential bundle |
| `SellerCredentialAttestationRuntime` | Seller Autopilot | Inject `fetch` / `subtle` / `getRandomValues` for extension runtimes |
| `PeerAuthenticateParams`, `PeerMetadataMessage`, `PeerMetadataRow`, `SellerCredentialBundle` types | Both | Mirror the Peer extension's page contract so integrator code stays portable |

Everything page-side (quotes, intents, fulfillment, curator uploads) is covered by the [Client Reference](/developer/sdk/client-reference).

## Security requirements

:::danger Non-negotiables
- **Plaintext session material never reaches the page.** Encrypt in-extension, post only encrypted blobs and extracted metadata, and discard plaintext immediately.
- **Inline templates require user approval** of the extracted fields before posting back — an unreviewed inline template is an arbitrary-exfiltration primitive.
- **Seller Autopilot results contain only `credentialBundle` + `offchainId`.** No captured headers, cookies, payee IDs, or request bodies.
- **Venmo identity registration encrypts only `Cookie`.** Do not pass a captured stories URL or other request metadata to the page or to `sessionMaterial`.
:::

- **Gate captures behind per-origin connection approval**, like the Peer extension's `requestConnection()` flow.
- **Stay stateless.** Keep capture sessions in tab-scoped memory; clear them when the capture completes, fails, or the tab closes. The Peer extension ships without any storage permission.
- **Minimize host permissions.** Request interception access only for the payment platforms you support.
- **Keep curator and maker logic in the page.** The extension should never hold API keys or call curator.

## Help?

Building an extension or need a template published? Message us on [Telegram](https://t.me/+XDj9FNnW-xs5ODNl) — we can help with template details and attestation service expectations.
