Add Peer extension `0.6.0` headless Buyer TEE capture to this site's onramp or intent fulfillment flow using `@zkp2p/sdk`.

The app owns order UI, payment-row selection, and `fulfillIntent()`. The extension opens the provider auth tab, captures provider-template metadata, encrypts Buyer TEE session material, and returns metadata rows to the page.

## 1. Initialize the SDK

Use a scoped extension instance and an app-owned `Zkp2pClient`.

```ts
import {
  createPeerExtensionSdk,
  Zkp2pClient,
  type BuyerTeePaymentProofInput,
  type PeerBuyerTeePaymentCapture,
  type PeerMetadataMessage,
  type PeerMetadataRow,
} from '@zkp2p/sdk';

const peerSdk = createPeerExtensionSdk({ window });
```

## 2. Configure Buyer TEE routing

Use the payment method's verify config. The important fields are:

```ts
type BuyerTeePlatformConfig = {
  actionPlatform: string;
  actionType: string;
  attestationActionType?: string;
  includeMetadataIndex?: boolean;
  platform: string;
};

const config: BuyerTeePlatformConfig = {
  actionPlatform: 'venmo',
  actionType: 'transfer_venmo',
  includeMetadataIndex: true,
  platform: 'venmo',
};

const attestationServiceUrl = 'https://attestation-service.zkp2p.xyz';
```

Set `includeMetadataIndex: true` only for Venmo, Cash App, Revolut, and Zelle providers. Do not add `index` for PayPal, Wise, Monzo, or Chime.

## 3. Check extension state and version

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

## 4. Select the correct metadata row

The selected row's `params` are the attestation params. Do not join against `buyerTeeCapture.params`. Do not use a filtered UI array index as the provider index; use `row.originalIndex`.

```ts
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
```

## 5. Build Buyer TEE proof params

```ts
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
```

## 6. Register metadata listener and fulfill

Register the listener before calling `authenticate()`.

```ts
function registerBuyerTeeHandler({
  client,
  config,
  expectedPayment,
  intentHash,
}: {
  client: Zkp2pClient;
  config: BuyerTeePlatformConfig;
  expectedPayment: {
    amount?: string;
    currency?: string;
    paymentId?: string;
    recipient?: string;
  };
  intentHash: `0x${string}`;
}) {
  const unsubscribe = peerSdk.onMetadataMessage(async (message: PeerMetadataMessage) => {
    try {
      if (message.errorMessage) {
        throw new Error(message.errorMessage);
      }

      const selectedRow = selectPaymentRow(message.metadata, expectedPayment);
      if (!selectedRow) {
        throw new Error('No returned payment row matched the expected payment');
      }

      const proof = buildBuyerTeeProof(selectedRow, message.buyerTeeCapture, config);

      await client.fulfillIntent({
        intentHash,
        proof,
        attestationServiceUrl,
      });
    } catch (error) {
      console.error('Buyer TEE onramp fulfillment failed:', error);
    } finally {
      unsubscribe();
    }
  });

  return unsubscribe;
}
```

`client.fulfillIntent()` posts to:

```txt
POST {attestationServiceUrl}/buyer/verify/{actionPlatform}/{actionType}
```

with `{ encryptedSessionMaterial, params, chainId, intent }`, then encodes the returned attestation and fulfills the intent on-chain.

## 7. Start headless Buyer TEE capture

```ts
await ensurePeerReady();

registerBuyerTeeHandler({
  client,
  config,
  expectedPayment: {
    amount: '10.00',
    currency: 'USD',
    recipient: 'alice',
  },
  intentHash,
});

peerSdk.authenticate({
  actionType: config.actionType,
  attestationActionType: config.attestationActionType ?? config.actionType,
  attestationServiceUrl,
  captureMode: 'buyerTee',
  platform: config.platform,
});
```

## 8. Direct Buyer TEE endpoint preflight

Most apps should use `client.fulfillIntent()`. If you need to preflight the attestation service for a custom transaction builder, call the Buyer TEE endpoint with the same selected-row params.

```ts
async function verifyBuyerTeePaymentDirectly({
  chainId,
  client,
  encryptedSessionMaterial,
  intentHash,
  params,
}: {
  chainId: number;
  client: Zkp2pClient;
  encryptedSessionMaterial: string;
  intentHash: `0x${string}`;
  params: Record<string, string | number | boolean>;
}) {
  const intentInputs = await client.getFulfillIntentInputs(intentHash);

  const response = await fetch(
    `${attestationServiceUrl}/buyer/verify/${encodeURIComponent(
      config.actionPlatform,
    )}/${encodeURIComponent(config.attestationActionType ?? config.actionType)}`,
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

## Key rules

- Target Peer extension manifest `0.6.0` or newer.
- Never use `onramp()`, `openSidebar()`, `onIntentFulfilled()`, `onProofComplete()`, or `callbackUrl` — the pre-`0.6.0` deeplink/side-panel API was removed.
- Use `createPeerExtensionSdk({ window })`.
- Register `onMetadataMessage()` before `authenticate()`.
- Pass `captureMode: 'buyerTee'` and `attestationServiceUrl`.
- Select the actual payment row the user made.
- Build params from the selected row's `params`.
- Add `index: row.originalIndex` only for platforms that require metadata index params.
- Use `client.fulfillIntent()` to hit the Buyer TEE endpoint and fulfill on-chain.
- Keep UI, order state, row selection, and error handling in the page.
