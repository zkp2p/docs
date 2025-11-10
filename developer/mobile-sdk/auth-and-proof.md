title: Authentication & Proof
---

Hook API
```ts
import { useZkp2p } from '@zkp2p/zkp2p-react-native-sdk';

const {
  flowState, provider, metadataList, interceptedPayload,
  initiate, authenticate, generateProof, closeAuthWebView,
  resetState, clearSession, proofData, proofError, proofStatus,
  isSessionActive, isInternalAction,
} = useZkp2p();
```

Typical flow
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

Session helpers
- `isSessionActive(platform, actionType)`: checks if captured cookies still authenticate (no UI side effects).
- `isInternalAction(platform, actionType)`: tells whether the initial action uses in‑app WebView vs external app.

State & UI
- `flowState`: `'idle' | 'authenticating' | 'authenticated' | 'actionStarted' | 'proofGenerating' | 'proofGeneratedSuccess' | 'proofGeneratedFailure'`.
- `proofStatus`: structured progress + message; used by the default progress sheet.
- `closeAuthWebView()`: closes the auth sheet if you show your own UI.

Reset vs clear
- `resetState()`: cancels proofs, aborts in‑flight RPC, unmounts RPC bridge, clears in‑memory state, closes UI.
- `clearSession({ clearInterceptedPayloads?: boolean; iosAlsoClearWebKitStore?: boolean; })`: clears cookies and (optionally) stored intercepted payloads.

Performance
- Circuits are lazily loaded per algorithm (`aes-256-ctr`, `aes-128-ctr`, `chacha20`).
- Concurrency is tuned using available device memory; emulators default to a high ceiling to speed testing.

Errors
- Errors are specialized (`NetworkError`, `APIError`, `ContractError`, `ValidationError`, `ProofGenerationError`), all extend `ZKP2PError` for consistent handling.
