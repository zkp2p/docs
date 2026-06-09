Add Peer extension `0.6.0` headless Buyer TEE capture to this site's onramp or intent fulfillment flow using `@zkp2p/sdk`.

The extension is a stateless metadata bridge. The app owns order UI, intent selection, and `fulfillIntent()`. The extension only opens the provider auth tab, captures provider-template metadata, encrypts Buyer TEE session material, and returns the result to the page.

## 1. Initialize the SDK

Use a scoped instance:

```ts
import {
  createPeerExtensionSdk,
  type PeerBuyerTeePaymentCapture,
  type PeerMetadataRow,
} from '@zkp2p/sdk';

const peerSdk = createPeerExtensionSdk({ window });
```

## 2. Check extension state and version

```ts
function isPeerExtension060OrNewer(version: string): boolean {
  const [major = 0, minor = 0] = version.split('.').map(Number);
  return major > 0 || (major === 0 && minor >= 6);
}

async function ensurePeerReady() {
  const state = await peerSdk.getState();

  if (state === 'needs_install') {
    peerSdk.openInstallPage();
    throw new Error('Peer extension 0.6.0 is required');
  }

  if (state === 'needs_connection') {
    const approved = await peerSdk.requestConnection();
    if (!approved) {
      throw new Error('Peer extension connection was not approved');
    }
  }

  const version = await peerSdk.getVersion();
  if (!isPeerExtension060OrNewer(version)) {
    throw new Error(`Peer extension 0.6.0 or newer is required; found ${version}`);
  }
}
```

## 3. Register the metadata listener

Register the listener before calling `authenticate()`.

```ts
function buildBuyerTeeProof(
  row: PeerMetadataRow,
  capture: PeerBuyerTeePaymentCapture | null | undefined,
) {
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

const unsubscribe = peerSdk.onMetadataMessage(async (message) => {
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
```

## 4. Start headless Buyer TEE capture

```ts
await ensurePeerReady();

peerSdk.authenticate({
  actionType: 'transfer_venmo',
  attestationActionType: 'transfer_venmo',
  attestationServiceUrl: 'https://attestation-service.zkp2p.xyz',
  captureMode: 'buyerTee',
  platform: 'venmo',
});
```

### Launch parameters

| Parameter | Required | Description |
| --- | --- | --- |
| `actionType` | Yes | Provider template action, such as `transfer_venmo`. |
| `platform` | Yes | Provider platform, such as `venmo`, `paypal`, `wise`, or `cashapp`. |
| `captureMode` | Yes | Use `buyerTee` for onramp payment verification. |
| `attestationServiceUrl` | Yes | Attestation service root, for example `https://attestation-service.zkp2p.xyz`. |
| `attestationActionType` | No | Use when the attestation action differs from the provider template action. |
| `providerConfig` | No | Inline provider template for custom/local testing. Omit to use the API default template. |

## 5. Button placement rules

- Place the verification button where the user needs to prove fiat payment for an existing order or intent.
- Request extension connection from a user action.
- Keep the order UI in the page while the extension opens the provider auth tab.
- Show returned metadata rows and let the user select the payment row if the flow is not fully automatic.
- Disable fulfillment until a selected row has `params` and the callback has `buyerTeeCapture.encryptedSessionMaterial`.

## 6. Full React example

```tsx
import {
  createPeerExtensionSdk,
  type PeerBuyerTeePaymentCapture,
  type PeerMetadataRow,
} from '@zkp2p/sdk';
import { useEffect, useMemo, useState } from 'react';

function isPeerExtension060OrNewer(version: string): boolean {
  const [major = 0, minor = 0] = version.split('.').map(Number);
  return major > 0 || (major === 0 && minor >= 6);
}

function buildBuyerTeeProof(
  row: PeerMetadataRow,
  capture: PeerBuyerTeePaymentCapture | null | undefined,
) {
  if (!capture?.encryptedSessionMaterial || !row.params) {
    throw new Error('Selected payment row is missing Buyer TEE capture data');
  }

  return {
    proofType: 'buyerTee' as const,
    encryptedSessionMaterial: capture.encryptedSessionMaterial,
    params: { ...row.params, index: row.originalIndex },
    actionType: 'transfer_venmo',
    actionPlatform: 'venmo',
  };
}

export function PeerPaymentVerificationButton({
  client,
  intentHash,
}: {
  client: { fulfillIntent(args: { intentHash: `0x${string}`; proof: unknown }): Promise<unknown> };
  intentHash: `0x${string}`;
}) {
  const peerSdk = useMemo(() => createPeerExtensionSdk({ window }), []);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = peerSdk.onMetadataMessage(async (message) => {
      if (message.errorMessage) {
        setError(message.errorMessage);
        return;
      }

      const selectedPayment = message.metadata.find((row) => !row.hidden && row.params);
      if (!selectedPayment) {
        setError('No selectable payment metadata was returned');
        return;
      }

      try {
        const proof = buildBuyerTeeProof(selectedPayment, message.buyerTeeCapture);
        await client.fulfillIntent({ intentHash, proof });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to fulfill intent');
      }
    });

    return unsubscribe;
  }, [client, intentHash, peerSdk]);

  const handleVerify = async () => {
    setError(null);

    const state = await peerSdk.getState();
    if (state === 'needs_install') {
      peerSdk.openInstallPage();
      return;
    }

    if (state === 'needs_connection') {
      const approved = await peerSdk.requestConnection();
      if (!approved) return;
    }

    const version = await peerSdk.getVersion();
    if (!isPeerExtension060OrNewer(version)) {
      setError(`Peer extension 0.6.0 or newer is required; found ${version}`);
      return;
    }

    peerSdk.authenticate({
      actionType: 'transfer_venmo',
      attestationActionType: 'transfer_venmo',
      attestationServiceUrl: 'https://attestation-service.zkp2p.xyz',
      captureMode: 'buyerTee',
      platform: 'venmo',
    });
  };

  return (
    <>
      <button onClick={handleVerify}>Verify payment with Peer</button>
      {error ? <p role="alert">{error}</p> : null}
    </>
  );
}
```

## Key rules

- Target Peer extension manifest `0.6.0` or newer.
- Use `createPeerExtensionSdk({ window })`.
- Use `authenticate()` and `onMetadataMessage()` for the headless flow.
- Pass `captureMode: 'buyerTee'` and `attestationServiceUrl`.
- Build `fulfillIntent()` proof from `buyerTeeCapture.encryptedSessionMaterial` and the selected metadata row's `params`.
- Keep UI, order state, and intent fulfillment in the page.
- Do not add extra wrappers or compatibility branches.
