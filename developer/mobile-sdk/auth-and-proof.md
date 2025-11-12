---
title: Authentication & Proof
---

### Hook API
```ts
import { useZkp2p } from '@zkp2p/zkp2p-react-native-sdk';

const {
  flowState, provider, metadataList, interceptedPayload,
  initiate, authenticate, generateProof, closeAuthWebView,
  resetState, clearSession, proofData, proofError, proofStatus,
  isSessionActive, isInternalAction,
} = useZkp2p();
```

### Typical flow
1) Start the provider flow
```ts
await initiate('venmo', 'transfer_venmo', {
  initialAction: { enabled: true, paymentDetails: { RECIPIENT_ID: 'john', AMOUNT: '100' } },
  autoGenerateProof: { intentHash: '0x…', itemIndex: 0 }, // optional
});
```
2) Or open auth directly
```ts
await authenticate('venmo', 'transfer_venmo', {
  autoGenerateProof: {
    intentHash: '0x…', itemIndex: 0,
    onProofGenerated: (zkTlsProof) => {/* use proof string */},
    onProofError: (e) => console.error(e),
  },
});
```
3) Generate proof (manual)
```ts
const proof = await generateProof!(provider!, interceptedPayload!, '0xINTENT', 0);
// returns a stringified JSON (single object or array of proofs)
```

### Session helpers
- `isSessionActive(platform, actionType)`: checks if captured cookies still authenticate (no UI side effects).
- `isInternalAction(platform, actionType)`: tells whether the initial action uses in‑app WebView vs external app.

### State & UI
- `flowState`: `'idle' | 'authenticating' | 'authenticated' | 'actionStarted' | 'proofGenerating' | 'proofGeneratedSuccess' | 'proofGeneratedFailure'`.
- `proofStatus`: structured progress + message; used by the default progress sheet.
- `closeAuthWebView()`: closes the auth sheet if you show your own UI.

### Reset vs clear
- `resetState()`: cancels proofs, aborts in‑flight RPC, unmounts RPC bridge, clears in‑memory state, closes UI.
- `clearSession({ clearInterceptedPayloads?: boolean; iosAlsoClearWebKitStore?: boolean; })`: clears cookies and (optionally) stored intercepted payloads.

### Performance
- Circuits are lazily loaded per algorithm (`aes-256-ctr`, `aes-128-ctr`, `chacha20`).
- Concurrency is tuned using available device memory; emulators default to a high ceiling to speed testing.

### Errors
- Errors are specialized (`NetworkError`, `APIError`, `ContractError`, `ValidationError`, `ProofGenerationError`), all extend `ZKP2PError` for consistent handling.

### Reference: functions and options

#### `initiate(platform, actionType, options?) → Promise<ProviderSettings>`
```ts
type InitialActionOptions = {
  enabled?: boolean;
  paymentDetails?: Record<string, string>;
  useExternalActionOverride?: boolean;
};

type AutoGenerateProofOptions = {
  intentHash?: string;
  itemIndex?: number;
  onProofGenerated?: (zkTlsProof: string) => void;
  onProofError?: (error: Error) => void;
};

type InitiateOptions = {
  authOverrides?: AuthWVOverrides;                 // pass extra InterceptWebView props
  existingProviderConfig?: ProviderSettings;       // use a config you already fetched
  initialAction?: InitialActionOptions;            // fire an action link before auth
  autoGenerateProof?: AutoGenerateProofOptions;    // run proof after auth
};
```
Behavior
- Loads provider config (or uses `existingProviderConfig`).
- If the config defines any `mobile.internal.actionLink` or `mobile.external.actionLink`, the SDK performs the action step first. If none, it’s equivalent to `authenticate()` without UI.
- When `autoGenerateProof` is provided, proof starts after authentication succeeds.

#### `authenticate(platform, actionType, options?) → Promise<void>`
```ts
type AuthenticateOptions = {
  authOverrides?: AuthWVOverrides;
  existingProviderConfig?: ProviderSettings;
  autoGenerateProof?: AutoGenerateProofOptions;
};
```
Behavior
- Opens the in‑app auth WebView and captures network payloads that match the provider config `metadata.urlRegex` (or the in‑page fallback).
- When login selectors are present in config and credentials are available, the SDK autofills and submits the form and listens for submit to capture credentials for consent.
- On first success, the auth sheet closes automatically and `metadataList` and `interceptedPayload` populate.

#### `generateProof(providerCfg, payload, intentHash, itemIndex?) → Promise<string>`
Arguments
- `providerCfg`: `ProviderSettings` used for extraction.
- `payload`: `NetworkEvent` captured during authentication.
- `intentHash`: string passed into the proof context.
- `itemIndex`: index of the transaction item to prove (default 0).
Returns
- A stringified JSON zkTLS proof. Some providers/flows may return an array JSON; your code should accept either.

#### `isSessionActive(platform, actionType, { existingProviderConfig? }) → Promise<boolean>`
- Replays a read‑only request with stored cookies; returns true when the session is still valid.

#### `isInternalAction(platform, actionType, { existingProviderConfig?, initialAction? }) → Promise<boolean>`
- Mirrors internal decision logic to choose in‑app vs external action.

#### `closeAuthWebView() → void`
- Idempotently closes the auth sheet.

#### `clearSession(options?) → Promise<void>`
```ts
type ClearSessionOptions = {
  clearInterceptedPayloads?: boolean; // default: true
  iosAlsoClearWebKitStore?: boolean;  // default: true
};
```

#### `resetState() → Promise<void>`
- Teardown + in‑memory clear; safe to call before re‑running flows.

#### `cancelProof() → Promise<void>`
- Cancels any in‑flight native gnark proof and cleans up memory.

### Custom proof UI example
```tsx
const { flowState, proofStatus, resetState } = useZkp2p();

// In your own modal component:
if (flowState === 'proofGenerating') {
  return <MySpinner label={proofStatus.meta} progress={proofStatus.progress} onCancel={resetState} />;
}
```
