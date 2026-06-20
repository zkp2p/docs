---
id: sdk-react-native
title: React Native SDK
slug: /sdk/react-native
---

# React Native SDK

## What this does

`@zkp2p/zkp2p-react-native-sdk` is the mobile SDK for building Peer onramp, proof, taker registration, and Seller Autopilot flows in React Native. The current npm release is `0.4.2` and it wraps `@zkp2p/sdk@0.5.2` plus `@zkp2p/zkp2p-attestation@1.5.1` for shared contract, API, quote, fulfillment, and Nitro attestation logic.

Use this package when your app needs to:

- Authenticate users inside mobile WebViews for supported payment platforms.
- Prepare Buyer TEE payment proofs from encrypted session material.
- Fulfill V3 intents through the current attestation service endpoints.
- Register takers with identity attestations.
- Register makers for Seller Autopilot.

## Who is this for?

Use the React Native SDK when your mobile app owns the app shell and wallet experience but wants Peer to handle payment-provider authentication, metadata capture, TEE proof preparation, and V3 escrow interactions.

The `0.4.2` package is a hard cutover release. The mobile WebView intercept layer is built into `@zkp2p/zkp2p-react-native-sdk`; do not install or import the old `@zkp2p/react-native-webview-intercept` package.

## Installation

Install the SDK and its React Native peer dependencies. The published `0.4.2` package expects this peer surface:

```bash
bun add @zkp2p/zkp2p-react-native-sdk@0.4.2 @react-native-async-storage/async-storage@3.1.1 @react-native-cookies/cookies@6.2.1 react-native-webview@13.16.1 viem@2.52.2
```

```bash
npm install @zkp2p/zkp2p-react-native-sdk@0.4.2 @react-native-async-storage/async-storage@3.1.1 @react-native-cookies/cookies@6.2.1 react-native-webview@13.16.1 viem@2.52.2
```

```bash
yarn add @zkp2p/zkp2p-react-native-sdk@0.4.2 @react-native-async-storage/async-storage@3.1.1 @react-native-cookies/cookies@6.2.1 react-native-webview@13.16.1 viem@2.52.2
```

```bash
pnpm add @zkp2p/zkp2p-react-native-sdk@0.4.2 @react-native-async-storage/async-storage@3.1.1 @react-native-cookies/cookies@6.2.1 react-native-webview@13.16.1 viem@2.52.2
```

Your app must run `react@19.2.7` and `react-native@0.86.0`. If you use Expo OAuth surfaces, such as PayPal Seller Autopilot Gmail OAuth, also install `expo-crypto` and `expo-web-browser`.

For iOS:

```bash
cd ios && pod install
```

The SDK depends internally on `@zkp2p/zkp2p-attestation`, `@zkp2p/contracts-v2`, and `@zkp2p/sdk`; host apps do not need to import those packages directly for normal flows. Remove direct pins or overrides to older attestation packages when upgrading to `0.4.2`.

## Getting started

Start in proof-only mode if you only need mobile authentication and proof preparation. Add a `walletClient` when the app also sends V3 escrow transactions.

## Provider setup

Wrap the app with `Zkp2pProvider`. Keep `apiKey` omitted for the default public quote, intent-signing, proof, and fulfillment flows. Pass `authorizationToken` or `getAuthorizationToken` only for app-specific authenticated flows such as taker registration.

```tsx
import { Zkp2pProvider } from '@zkp2p/zkp2p-react-native-sdk';
import type { WalletClient } from 'viem';

declare const walletClient: WalletClient;
declare const secureStorage: {
  get: (key: string) => Promise<string | null>;
  put: (key: string, value: unknown) => Promise<void>;
  del: (key: string) => Promise<void>;
  getKeys?: () => Promise<string[]>;
};

export function App() {
  return (
    <Zkp2pProvider
      walletClient={walletClient}
      chainId={8453}
      rpcUrl="https://base-mainnet.g.alchemy.com/v2/your-key"
      storage={secureStorage}
    >
      <YourScreens />
    </Zkp2pProvider>
  );
}
```

For proof-only mode, omit `walletClient`. In that mode `useZkp2p().zkp2pClient` is `null`, but WebView auth and proof preparation can still run:

```tsx
import { Zkp2pProvider, useZkp2p } from '@zkp2p/zkp2p-react-native-sdk';

export function App() {
  return (
    <Zkp2pProvider chainId={8453}>
      <PaymentFlow />
    </Zkp2pProvider>
  );
}

function PaymentFlow() {
  const {
    initiate,
    authenticate,
    prepareBuyerTeeProof,
    provider,
    interceptedPayload,
    metadataList,
    proofStatus,
    zkp2pClient,
  } = useZkp2p();

  const isProofOnly = !zkp2pClient;
  const isProofRunning = proofStatus.phase === 'running';

  // Call initiate() or authenticate(), then pass the selected metadata row
  // into prepareBuyerTeeProof().
}
```

## Endpoint cutover

Pass service roots only. Do not append `/v1`, `/v2`, or `/v3` to `baseApiUrl`; the SDK appends versioned paths internally.

| Option | Production default | Staging override | Used for |
| --- | --- | --- | --- |
| `baseApiUrl` | `https://api.zkp2p.xyz` | `https://api-staging.zkp2p.xyz` | Curator API, quotes, intent signing, maker/taker registration |
| `attestationServiceUrl` | `https://attestation-service.zkp2p.xyz` | `https://attestation-service-staging.zkp2p.xyz` | Buyer TEE and legacy buyer proof verification |
| `sarAttestationServiceUrl` | `https://attestation-service-preprod.zkp2p.xyz` | `https://attestation-service-staging.zkp2p.xyz` | Seller Autopilot credential bundle signing and upload |
| `identityAttestationServiceUrl` | `https://attestation-service-preprod.zkp2p.xyz` | `https://attestation-service-staging.zkp2p.xyz` | Taker identity registration attestations |

`environment="staging"` selects staging contracts and staging attestation defaults, but it does not rewrite `baseApiUrl`. Pass `baseApiUrl="https://api-staging.zkp2p.xyz"` explicitly when testing against staging API services.

Current service paths used by the SDK:

| Flow | Method and path |
| --- | --- |
| Intent gating signature | `POST /v3/intent/sign` |
| Exact fiat quote | `POST /v2/quote/exact-fiat` |
| Exact token quote | `POST /v2/quote/exact-token` |
| Taker registration status | `GET /v2/taker/registration/{processorName}/status` |
| Taker registration | `POST /v2/taker/registration/{processorName}/register` |
| Maker registration | `POST /v2/makers/create` |
| Buyer TEE verification | `POST /buyer/verify/{platform}/{actionType}` |
| Legacy buyer proof verification | `POST /verify/{platform}/{actionType}` |

The current mobile SDK targets the upgraded V2 escrow/orchestrator contracts only. Remove app overrides that point at legacy escrow hosts, versioned curator roots, or old mobile gnark prover assets.

## Buyer TEE fulfillment

Buyer TEE is the default buyer verification path for supported platforms. The SDK verifies the running enclave, encrypts payment-platform session material to the enclave upload key, sends the encrypted payload to `/buyer/verify/{platform}/{actionType}`, and then passes the returned V3 attestation into `fulfillIntent`.

```tsx
import { useZkp2p } from '@zkp2p/zkp2p-react-native-sdk';

function BuyerFlow({ intentHash }: { intentHash: `0x${string}` }) {
  const {
    initiate,
    prepareBuyerTeeProof,
    zkp2pClient,
    provider,
    interceptedPayload,
    metadataList,
    proofStatus,
  } = useZkp2p();

  const buy = async () => {
    if (!zkp2pClient) throw new Error('Wallet client required to fulfill');

    await initiate('venmo', 'transfer_venmo', {
      initialAction: {
        enabled: true,
        paymentDetails: {
          RECIPIENT_ID: 'seller-venmo-id',
          AMOUNT: '100.00',
        },
      },
    });

    if (!provider || !interceptedPayload || !metadataList[0]) {
      throw new Error('Payment metadata unavailable');
    }

    const proof = await prepareBuyerTeeProof(
      provider,
      interceptedPayload,
      metadataList[0]
    );

    await zkp2pClient.fulfillIntent({
      intentHash,
      proof,
      platform: 'venmo',
      actionType: 'transfer_venmo',
      amount: '100000000',
      timestampMs: String(Date.now()),
      fiatCurrency: '0xFiatCurrencyHash',
      conversionRate: '1000000000000000000',
      payeeDetails: '0xPayeeDetailsHash',
      timestampBufferMs: '300000',
    });
  };

  return (
    <Button
      title={proofStatus.phase === 'running' ? 'Verifying' : 'Buy'}
      onPress={buy}
    />
  );
}
```

Buyer TEE is the mobile proof path exposed by the provider. New buyer integrations should call `prepareBuyerTeeProof()` and pass the returned proof into `fulfillIntent()`.

## Quotes and intents

Create a client through the provider or directly:

```ts
import { Zkp2pClient } from '@zkp2p/zkp2p-react-native-sdk';

const client = new Zkp2pClient({
  chainId: 8453,
  walletClient,
  rpcUrl: 'https://base-mainnet.g.alchemy.com/v2/your-key',
});
```

Fetch quotes from the V2 quote endpoints:

```ts
const quote = await client.getQuote({
  paymentPlatforms: ['venmo', 'wise'],
  fiatCurrency: 'USD',
  user: '0xTakerAddress',
  recipient: '0xRecipientAddress',
  destinationChainId: 8453,
  destinationToken: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
  amount: '100',
  isExactFiat: true,
});
```

Signal and fulfill intents through the wrapped `@zkp2p/sdk` client:

```ts
const { txHash } = await client.signalIntent({
  processorName: 'venmo',
  depositId: '123',
  amount: '100000000',
  payeeDetails: '0x...',
  toAddress: '0xRecipientAddress',
  currencyHash: '0xUsdCurrencyHash',
  conversionRate: '1000000000000000000',
});

await client.fulfillIntent({
  intentHash: '0xIntentHash',
  proof,
  platform: 'venmo',
  actionType: 'transfer_venmo',
  amount: '100000000',
  timestampMs: String(Date.now()),
  fiatCurrency: '0xUsdCurrencyHash',
  conversionRate: '1000000000000000000',
  payeeDetails: '0xPayeeDetailsHash',
  timestampBufferMs: '300000',
});
```

`walletClient` is required for transaction-sending methods such as `signalIntent()`, `fulfillIntent()`, `createDeposit()`, `withdrawDeposit()`, `cancelIntent()`, and `releaseFundsToPayer()`.

## Taker registration

Some payment processors require taker identity registration. The mobile flow produces an identity attestation through the identity attestation service and posts that attestation to curator. It does not post legacy proof JSON.

```tsx
import {
  apiGetTakerRegistrationStatus,
  apiRegisterTaker,
  useZkp2p,
} from '@zkp2p/zkp2p-react-native-sdk';

const baseApiUrl = 'https://api.zkp2p.xyz';

function RegisterTakerButton() {
  const {
    authenticate,
    prepareIdentityAttestation,
    provider,
    interceptedPayload,
    metadataList,
  } = useZkp2p();

  const register = async () => {
    const authToken = await getPrivyAccessToken();

    const status = await apiGetTakerRegistrationStatus(
      'venmo',
      authToken,
      baseApiUrl
    );

    if (!status.responseObject?.registrationRequired) return;

    await authenticate('venmo', 'register_venmo');

    if (!provider || !interceptedPayload || !metadataList[0]) {
      throw new Error('Identity metadata unavailable');
    }

    const identity = await prepareIdentityAttestation(
      provider,
      interceptedPayload,
      metadataList[0]
    );

    await apiRegisterTaker(
      'venmo',
      identity.attestation,
      authToken,
      baseApiUrl
    );
  };

  return <Button title="Register taker" onPress={register} />;
}
```

Supported identity registration platforms are `venmo`, `paypal`, and `wise`.

:::info Venmo identity registration in `0.4.2`
`@zkp2p/zkp2p-react-native-sdk@0.4.2` pins `@zkp2p/zkp2p-attestation@1.5.1`. Venmo `register_venmo` sends public `params.SENDER_ID` and encrypted session material containing only a replayable `Cookie`; it must not include `sessionMaterial.url`. Remove lockfile overrides that force `@zkp2p/zkp2p-attestation@1.5.0` or older.
:::

## Seller Autopilot

Seller Autopilot lets a maker register encrypted seller session material so matching buyer payments can be verified from the seller side. The mobile SDK exposes this through `useZkp2p().sar`.

```tsx
import { useZkp2p } from '@zkp2p/zkp2p-react-native-sdk';

function RegisterMakerButton() {
  const { sar } = useZkp2p();

  const register = async () => {
    if (!sar.isSupported('wise')) return;

    const result = await sar.registerMaker({
      platform: 'wise',
      payeeHandle: 'your-wisetag',
      currency: 'USD',
    });

    console.log(result.payeeIdHash, result.status);
  };

  return <Button title="Register maker" onPress={register} />;
}
```

Supported Seller Autopilot platforms are `wise`, `venmo`, `cashapp`, and `paypal`. PayPal registration also requires `payeeEmail`; `googleOAuthEmail` is optional when receipts are forwarded through a different Gmail inbox.

Use `sar.getStatus()`, `sar.revoke()`, `sar.onExpired()`, and `sar.clearAllSessions()` to keep local session state in sync with curator and user sign-out flows.

## Storage and consent

Pass a `storage` adapter when using credential persistence, consent prompts, or Seller Autopilot. The SDK stores provider consent and credentials under hashed keys and stores Seller Autopilot seller sessions under platform-specific keys. Use the context helpers to clear data:

```ts
const {
  clearAllCredentials,
  clearAllConsents,
  clearProviderCredentials,
  clearProviderConsent,
  sar,
} = useZkp2p();

await clearAllCredentials();
await clearAllConsents();
await sar.clearAllSessions();
```

The provider is headless by default for proof progress. Pass `renderProofStatus` when you want the SDK to render your progress component, or read `proofStatus` from `useZkp2p()` and render your own UI. Call `cancelProof()` to stop the active proof.

```tsx
<Zkp2pProvider
  renderProofStatus={({ visible, proofStatus, onCancel }) =>
    visible ? (
      <ProofSheet
        progress={proofStatus.progress}
        message={proofStatus.meta}
        status={proofStatus.phase}
        error={proofStatus.error}
        onCancel={onCancel}
      />
    ) : null
  }
>
  <YourScreens />
</Zkp2pProvider>
```

## Troubleshooting

| Problem | Check |
| --- | --- |
| API calls include duplicated versions such as `/v2/v2/...` | Pass `baseApiUrl` as a root host only, for example `https://api.zkp2p.xyz`. |
| Staging contracts work but API calls hit production | `environment="staging"` does not rewrite `baseApiUrl`; pass `https://api-staging.zkp2p.xyz`. |
| `zkp2pClient` is `null` | The provider is running proof-only mode. Pass a viem `walletClient` for on-chain actions. |
| Buyer TEE proof fails before upload | Ensure `attestationServiceUrl` points at the root attestation host and that the platform/action pair is supported. |
| Attestation requests hit `/?nonce=...` or fail with `GET /attestation` 404 after upgrading React Native | Install `@zkp2p/zkp2p-react-native-sdk@0.4.2` and remove lockfile overrides to older attestation packages. Do not append `/attestation`; pass the root host. |
| Nitro certificate verification fails only in React Native | Use `0.4.2` or newer. The release includes the RN P-384 verification fixes needed for the AWS Nitro certificate chain. |
| Seller Autopilot cannot persist session material | Pass a `storage` adapter to `Zkp2pProvider`. |
| Taker registration is rejected | Use `prepareIdentityAttestation()` and submit `identity.attestation`; do not submit legacy proof JSON. |

## Help?

If you run into issues, join our [Discord](https://discord.gg/4hNVTv2MbH).
