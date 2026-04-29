---
id: onramp-widget
title: Build an Onramp Widget
---

# Build an Onramp Widget

## What this does

This tutorial builds a React funding widget that checks Peer extension state, previews taker limits with `useGetTakerTier()`, and opens the Peer onramp with pre-filled params.

## Who is this for?

Use this if you want a "Fund with Peer" button inside an existing product flow instead of redirecting users to a separate page.

## What you will build

- An install / connect / ready state machine for the Peer extension
- A reusable `OnrampWidget` component
- A completion listener wired to `onIntentFulfilled()`
- Optional tier and cap UI powered by the SDK React hook layer

:::note Desktop-first
`peerExtensionSdk` requires a browser window and the Peer extension. For mobile handoff patterns, see [Extension Deeplinks](/developer/cookbook/extension-deeplinks).
:::

## Prerequisites

- React 18+
- `@zkp2p/sdk`, `viem`
- A Base wallet for testing
- Peer extension installed in a Chromium browser

## 1. Install dependencies

```bash
bun add @zkp2p/sdk viem
```

## 2. Create a browser client helper

Create `src/lib/peer.ts`:

```ts
import { createPeerExtensionSdk, Zkp2pClient } from '@zkp2p/sdk';
import { createWalletClient, custom } from 'viem';
import { base } from 'viem/chains';

declare global {
  interface Window {
    ethereum?: unknown;
  }
}

export const peerSdk = createPeerExtensionSdk({ window });

export async function createBrowserClient() {
  if (!window.ethereum) {
    return { client: null, address: null };
  }

  const transport = custom(window.ethereum as any);
  const bootstrap = createWalletClient({ chain: base, transport });
  const [address] = await bootstrap.requestAddresses();

  const walletClient = createWalletClient({
    account: address,
    chain: base,
    transport,
  });

  return {
    client: new Zkp2pClient({
      walletClient,
      chainId: base.id,
    }),
    address,
  };
}
```

## 3. Build the widget

Create `src/components/OnrampWidget.tsx`:

```tsx
import {
  createPeerExtensionSdk,
  getTierDisplayInfo,
  type PeerExtensionState,
  type PeerIntentFulfilledResult,
  type Zkp2pClient,
} from '@zkp2p/sdk';
import { useGetTakerTier } from '@zkp2p/sdk/react';
import { base } from 'viem/chains';
import { useEffect, useMemo, useState } from 'react';
import { createBrowserClient } from '../lib/peer';

const peerSdk = createPeerExtensionSdk({ window });

type OnrampWidgetProps = {
  toToken: string;
  referrer: string;
  referrerLogo: string;
  inputCurrency?: string;
  inputAmount?: string;
  paymentPlatform?: string;
  recipientAddress?: `0x${string}`;
  onFulfilled?: (result: PeerIntentFulfilledResult) => void;
};

export function OnrampWidget({
  toToken,
  referrer,
  referrerLogo,
  inputCurrency = 'USD',
  inputAmount = '25',
  paymentPlatform = 'wise',
  recipientAddress,
  onFulfilled,
}: OnrampWidgetProps) {
  const [client, setClient] = useState<Zkp2pClient | null>(null);
  const [connectedAddress, setConnectedAddress] = useState<`0x${string}` | null>(
    recipientAddress ?? null,
  );
  const [extensionState, setExtensionState] = useState<PeerExtensionState>('needs_install');
  const [lastResult, setLastResult] = useState<PeerIntentFulfilledResult | null>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const { takerTier, isLoading: isTierLoading } = useGetTakerTier({
    client,
    owner: connectedAddress,
    chainId: base.id,
    autoFetch: Boolean(client && connectedAddress),
  });

  const tierDisplay = useMemo(
    () => getTierDisplayInfo(takerTier ?? undefined),
    [takerTier],
  );

  useEffect(() => {
    async function init() {
      const { client, address } = await createBrowserClient();
      setClient(client);
      setConnectedAddress((recipientAddress ?? address ?? null) as `0x${string}` | null);
      setExtensionState(await peerSdk.getState());
    }

    void init();
  }, [recipientAddress]);

  useEffect(() => {
    const unsubscribe = peerSdk.onIntentFulfilled((result) => {
      setLastResult(result);
      setMessage(
        result.bridge.status === 'pending'
          ? 'Intent fulfilled. Bridge delivery is still pending.'
          : 'Intent fulfilled. Funds were delivered to the destination wallet.',
      );
      onFulfilled?.(result);
    });

    return unsubscribe;
  }, [onFulfilled]);

  async function openOnramp() {
    setIsOpening(true);
    setMessage(null);

    try {
      const state = await peerSdk.getState();
      setExtensionState(state);

      if (state === 'needs_install') {
        setMessage('Install the Peer extension before opening the onramp.');
        return;
      }

      if (state === 'needs_connection') {
        const approved = await peerSdk.requestConnection();
        if (!approved) {
          setMessage('The extension must be connected before the onramp can open.');
          return;
        }
      }

      peerSdk.onramp({
        referrer,
        referrerLogo,
        inputCurrency,
        inputAmount,
        paymentPlatform,
        toToken,
        recipientAddress: connectedAddress ?? undefined,
      });
    } finally {
      setIsOpening(false);
      setExtensionState(await peerSdk.getState());
    }
  }

  return (
    <section>
      <p>Extension state: {extensionState}</p>
      {connectedAddress ? <p>Recipient: {connectedAddress}</p> : null}

      {connectedAddress && !isTierLoading ? (
        <p>
          Tier: {tierDisplay.tierLabel} | Cap: {tierDisplay.capDisplay}
        </p>
      ) : null}

      {extensionState === 'needs_install' ? (
        <button onClick={() => peerSdk.openInstallPage()}>Install Peer</button>
      ) : (
        <button onClick={openOnramp} disabled={isOpening}>
          {isOpening ? 'Opening...' : 'Fund with Peer'}
        </button>
      )}

      {message ? <p>{message}</p> : null}
      {lastResult ? <p>Last fulfilled intent: {lastResult.intentHash}</p> : null}
    </section>
  );
}
```

## 4. Mount the widget

Use it anywhere you already know the destination token and recipient:

```tsx
import { OnrampWidget } from './components/OnrampWidget';

export default function App() {
  return (
    <OnrampWidget
      referrer="Acme Wallet"
      referrerLogo="https://acme.xyz/logo.png"
      inputCurrency="USD"
      inputAmount="50"
      paymentPlatform="wise"
      toToken="8453:0x0000000000000000000000000000000000000000"
    />
  );
}
```

## 5. What each piece is doing

- `createPeerExtensionSdk({ window })` gives you a scoped extension client. That is the preferred pattern for app integrations
- `peerSdk.getState()` reduces the extension UX to three states: `needs_install`, `needs_connection`, and `ready`
- `useGetTakerTier()` gives you a fast way to show a cap before the user opens the flow
- `peerSdk.onIntentFulfilled()` is your callback for success and bridge-pending status
- `peerSdk.onramp()` opens the side panel with the params your app already knows

## 6. Production hardening

- Keep `referrer` and `referrerLogo` stable so users recognize your brand inside the flow
- Precompute `toToken` from your product state instead of string-building it inline across the app
- Register `onIntentFulfilled()` once near the page root if several buttons can open the onramp
- If your app already has a connected wallet, always pass `recipientAddress` so users land in a one-click flow

## Troubleshooting

- Button always shows install: the page is not running in a browser where the Peer extension is available
- User can connect a wallet but not the extension: that is normal. Wallet connection and extension connection are separate
- Callback never fires: make sure the same tab that called `onramp()` is still open and the listener was registered first
- Need to resume an active intent: pass `intentHash` into `peerSdk.onramp()` or see [Extension Deeplinks](/developer/cookbook/extension-deeplinks)

## Next steps

- Read [Onramp Integration](/developer/integrate-zkp2p/integrate-redirect-onramp) for the full parameter reference
- Read [Extension Deeplinks](/developer/cookbook/extension-deeplinks) for route and resume patterns
- Read [Taker Tiers](/developer/cookbook/taker-tiers) if you want to turn tiering into UI copy and guardrails
