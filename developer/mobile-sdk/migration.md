---
id: mobile-sdk-migration
title: Migration Notes (0.1.x)
---

Highlights
- Proof generation returns a stringified JSON proof (single or array) to simplify piping into fulfillment.
- `SignalIntentParams` now use `amount` (fiat) and typed fields (`toAddress`, `currencyHash`, etc.).
- `FulfillIntentParams` expect the attestation‑service proof string and typed EVM fields.
- Base API URL is versionless; the SDK appends `/v1` and `/v2` internally.

Types (after)
```ts
type AutoGenerateProofOptions = {
  intentHash?: string;
  itemIndex?: number;
  onProofGenerated?: (proof: string) => void;
  onProofError?: (error: Error) => void;
};

type SignalIntentParams = { /* … see API page … */ };
type FulfillIntentParams = { /* … see API page … */ };
```

Client helpers added
- On‑chain reads through `ProtocolViewer` helpers (deposits, intents, getById).
- Quote enrichment with payee details when `apiKey` is available.

What to check after upgrade
- Provider config source (ensure `configBaseUrl` points at the correct branch/root).
- Any custom RPC endpoint and timeout settings.
- Consent and credential storage (keys are normalized and indexed).

