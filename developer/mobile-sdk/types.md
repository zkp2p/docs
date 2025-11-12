---
title: Key Types
---

### Hook & context
- `FlowState`: `'idle' | 'authenticating' | 'authenticated' | 'actionStarted' | 'proofGenerating' | 'proofGeneratedSuccess' | 'proofGeneratedFailure'`.
- `ProofStatus`: `{ phase: 'idle'|'running'|'success'|'failure'; progress: number; meta: string; error: Error|null }`.
- `ProviderSettings`: parsed provider JSON (auth link, metadata extractors, mobile overrides, etc.).
- `NetworkEvent`: intercepted request/response, including headers and body.
- `ExtractedMetadataList[]`: items parsed from the provider’s response body.
- `ProofData[]`: proof payload(s) returned by the prover path.

### Options
- `InitiateOptions`: `{ authOverrides?, existingProviderConfig?, initialAction?, autoGenerateProof? }`.
- `AuthenticateOptions`: `{ authOverrides?, existingProviderConfig?, autoGenerateProof? }`.
- `AutoGenerateProofOptions`: `{ intentHash?, itemIndex?, onProofGenerated?, onProofError? }`.

### Client params (selected)
- `SignalIntentParams`: `{ processorName, depositId, amount, payeeDetails, toAddress, currencyHash, conversionRate, referrer?, referrerFee?, … }`.
- `FulfillIntentParams`: `{ intentHash, zkTlsProof, platform, actionType, amount, timestampMs, fiatCurrency, conversionRate, payeeDetails, timestampBufferMs, verifyingContract?, … }`.
- `CreateDepositParams`: token, amount, intent range, conversion rates, processors, deposit data, and optional delegate/guardian/referrer fields.

### Errors
- `ZKP2PError` base; specialized: `NetworkError`, `APIError`, `ContractError`, `ValidationError`, `ProofGenerationError`.

### Selected action param types (condensed)
```ts
type SignalIntentParams = {
  processorName: string;
  depositId: string;
  amount: string;
  payeeDetails: string;
  toAddress: Address;
  currencyHash: Hex;
  conversionRate: string | bigint;
  referrer?: Address; referrerFee?: string | bigint;
  onSuccess?: ActionCallback; onError?: (e: Error) => void; onMined?: ActionCallback;
  txOverrides?: SafeTxOverrides;
};

type FulfillIntentParams = {
  intentHash: Hash; zkTlsProof: string; platform: string; actionType: string;
  amount: string; timestampMs: string; fiatCurrency: Hex; conversionRate: string;
  payeeDetails: Hex; timestampBufferMs: string; verifyingContract?: Address;
  onSuccess?: ActionCallback; onError?: (e: Error) => void; onMined?: ActionCallback;
  txOverrides?: SafeTxOverrides;
};

type CreateDepositParams = {
  token: Address; amount: bigint;
  intentAmountRange: { min: bigint; max: bigint };
  conversionRates: { currency: CurrencyType; conversionRate: string; }[][];
  processorNames: string[]; depositData: Record<string, string>[];
  delegate?: Address; intentGuardian?: Address; referrer?: Address; referrerFee?: string | bigint;
  onSuccess?: ActionCallback; onError?: (e: Error) => void; onMined?: ActionCallback;
  txOverrides?: SafeTxOverrides;
};
```

### Quote types (high‑level)
```ts
type QuoteRequest = {
  paymentPlatforms: string[]; fiatCurrency: string; user: string; recipient: string;
  destinationChainId: number; destinationToken: string; amount: string;
  isExactFiat?: boolean; quotesToReturn?: number; referrer?: string; useMultihop?: boolean;
  escrowAddresses?: string[]; minDepositSuccessRateBps?: number;
};
```

### Native prover types
```ts
// Exposed for typing only
type GnarkProofResult = { proof: string; publicSignals: string };
type GnarkBridge = unknown; // instance managed internally by the SDK
```
