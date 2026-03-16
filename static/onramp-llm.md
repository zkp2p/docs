Add an onramp button to this site's payment flow using `@zkp2p/sdk`. When a user clicks it:

This prompt targets Peer extension manifest version `0.4.9+`. Do not use `callbackUrl` or `onProofComplete()`. Use `onIntentFulfilled()` instead.

## 1. Initialize the SDK

Use a scoped instance — **not** the default singleton:

```ts
import { createPeerExtensionSdk } from '@zkp2p/sdk';

const peerSdk = createPeerExtensionSdk({ window });
```

## 2. Check extension state and handle each case

```ts
const state = await peerSdk.getState();
// Returns: 'needs_install' | 'needs_connection' | 'ready'
```

- **`needs_install`** — Show a modal prompting the user to install the Peer extension. The modal should explain: *"A funding wallet that lets you go from fiat to crypto in seconds, without additional verification."* Include a button that calls `peerSdk.openInstallPage()`. **Do not** silently redirect to the Chrome Web Store.
- **`needs_connection`** — Call `peerSdk.requestConnection()`. If the user declines, show a message explaining the extension must be connected.
- **`ready`** — Proceed to open the onramp.

## 3. Register the fulfillment callback before opening the flow

```ts
const unsubscribe = peerSdk.onIntentFulfilled((result) => {
  if (result.bridge.status === 'not_required') {
    console.log('Peer onramp complete:', result.intentHash);
    return;
  }

  console.log('Peer fulfill complete, bridge pending:', result.bridge.trackingUrl);
});
```

- Register the listener before calling `peerSdk.onramp(...)`.
- Non-bridge flows emit once with `bridge.status = 'not_required'`.
- Bridge flows emit once with `bridge.status = 'pending'`.
- There is no second bridge-complete callback today. Use `trackingUrl` or `txHashes` to keep tracking.

## 4. Open the onramp side panel

```ts
peerSdk.onramp({
  toToken: '<chainId>:<tokenAddress>',       // Token needed for this flow (zero address for native tokens)
  recipientAddress: '<connectedWalletAddr>',  // Omit if no wallet connected — button should work either way
  referrer: '<this-site-name>',               // Your application name
  referrerLogo: '<https://your-site/logo>',   // Must be http/https URL, not a data URI
  inputCurrency: 'USD',                       // Optional fiat currency
  inputAmount: '25',                          // Optional fiat amount, up to 6 decimals
});
```

### Parameter reference

| Parameter | Required | Description |
|-----------|----------|-------------|
| `referrer` | Recommended | Your application name |
| `referrerLogo` | Recommended | URL to your logo (must be `http`/`https`, not a data URI) |
| `toToken` | Optional | Destination token in `chainId:tokenAddress` format |
| `recipientAddress` | Optional | User's connected wallet address. Omit if no wallet is connected |
| `inputCurrency` | Optional | Fiat currency code (e.g. `USD`, `EUR`). Defaults to user's locale |
| `inputAmount` | Optional | Fiat amount to convert (up to 6 decimal places) |
| `paymentPlatform` | Optional | Preferred payment method (e.g. `venmo`, `revolut`) — not enforced |
| `amountUsdc` | Optional | Exact USDC output amount in base units (e.g. `1000000` = 1 USDC). Overrides `toToken` and `inputAmount`. Requires `recipientAddress` |
| `intentHash` | Optional | Existing `0x`-prefixed 32-byte intent hash to reopen directly in the send-payment step |

### Supported chains for `toToken`

| Chain | chainId | Native token example |
|-------|---------|---------------------|
| Base | `8453` | `8453:0x0000000000000000000000000000000000000000` |
| Solana | `792703809` | `792703809:11111111111111111111111111111111` |
| Ethereum | `1` | `1:0x0000000000000000000000000000000000000000` |
| Polygon | `137` | `137:0x0000000000000000000000000000000000000000` |
| Arbitrum | `42161` | `42161:0x0000000000000000000000000000000000000000` |
| BNB | `56` | `56:0x0000000000000000000000000000000000000000` |
| Avalanche | `43114` | `43114:0x0000000000000000000000000000000000000000` |
| HyperEVM | `999` | `999:0x0000000000000000000000000000000000000000` |
| Hyperliquid | `1337` | `1337:0x0000000000000000000000000000000000000000` |
| Scroll | `534352` | `534352:0x0000000000000000000000000000000000000000` |
| FlowEVM | `747` | `747:0x0000000000000000000000000000000000000000` |

For EVM chains, use the zero address (`0x0000…0000`) for native currency. For non-EVM chains (e.g. Solana), use the native token's base-58 address.

## 5. Button placement rules

- Place the onramp button **next to any action that requires a token balance** (swap, stake, mint, bridge, etc.).
- If the user's balance is too low (or no wallet is connected), **highlight the onramp button over the action button** — make the onramp the primary CTA and the action button secondary/disabled.
- Add the onramp button to any **insufficient balance error states** (e.g. "Not enough ETH" banners, failed transaction modals).

## 6. Full integration example

```tsx
import { createPeerExtensionSdk } from '@zkp2p/sdk';
import { useEffect, useState } from 'react';

const peerSdk = createPeerExtensionSdk({ window });

function OnrampButton({
  toToken,
  recipientAddress,
  siteName,
  siteLogo,
}: {
  toToken: string;
  recipientAddress?: string;
  siteName: string;
  siteLogo: string;
}) {
  const [showInstallModal, setShowInstallModal] = useState(false);

  useEffect(() => {
    const unsubscribe = peerSdk.onIntentFulfilled((result) => {
      if (result.bridge.status === 'pending') {
        console.log('Bridge pending:', result.bridge.trackingUrl);
        return;
      }

      console.log('Peer onramp complete:', result.intentHash);
    });

    return unsubscribe;
  }, []);

  const handleOnramp = async () => {
    const state = await peerSdk.getState();

    if (state === 'needs_install') {
      setShowInstallModal(true);
      return;
    }

    if (state === 'needs_connection') {
      const approved = await peerSdk.requestConnection();
      if (!approved) return;
    }

    peerSdk.onramp({
      toToken,
      ...(recipientAddress && { recipientAddress }),
      referrer: siteName,
      referrerLogo: siteLogo,
    });
  };

  return (
    <>
      <button onClick={handleOnramp}>Fund with Peer</button>

      {showInstallModal && (
        <div className="modal">
          <h3>Install Peer</h3>
          <p>
            A funding wallet that lets you go from fiat to crypto in seconds,
            without additional verification.
          </p>
          <button onClick={() => peerSdk.openInstallPage()}>
            Install Extension
          </button>
          <button onClick={() => setShowInstallModal(false)}>Close</button>
        </div>
      )}
    </>
  );
}
```

## Key rules

- Use `createPeerExtensionSdk({ window })` — **not** the default `peerExtensionSdk` singleton.
- Register `onIntentFulfilled()` before calling `onramp()`.
- Never silently redirect to the Chrome Web Store. Always show a modal first.
- The button must work with **or without** a connected wallet — just omit `recipientAddress` if none.
- `referrerLogo` must be an `http`/`https` URL, never a `data:` URI.
- Do not pass `callbackUrl`; it was removed in Peer extension `0.4.9`.
- Keep the integration minimal. No extra wrappers or abstractions.
