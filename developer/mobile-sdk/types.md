title: Key Types
---

Hook & context
- `FlowState`: `'idle' | 'authenticating' | 'authenticated' | 'actionStarted' | 'proofGenerating' | 'proofGeneratedSuccess' | 'proofGeneratedFailure'`.
- `ProofStatus`: `{ phase: 'idle'|'running'|'success'|'failure'; progress: number; meta: string; error: Error|null }`.
- `ProviderSettings`: parsed provider JSON (auth link, metadata extractors, mobile overrides, etc.).
- `NetworkEvent`: intercepted request/response, including headers and body.
- `ExtractedMetadataList[]`: items parsed from the provider’s response body.
- `ProofData[]`: proof payload(s) returned by the prover path.

Options
- `InitiateOptions`: `{ authOverrides?, existingProviderConfig?, initialAction?, autoGenerateProof? }`.
- `AuthenticateOptions`: `{ authOverrides?, existingProviderConfig?, autoGenerateProof? }`.
- `AutoGenerateProofOptions`: `{ intentHash?, itemIndex?, onProofGenerated?, onProofError? }`.

Client params (selected)
- `SignalIntentParams`: `{ processorName, depositId, amount, payeeDetails, toAddress, currencyHash, conversionRate, referrer?, referrerFee?, … }`.
- `FulfillIntentParams`: `{ intentHash, zkTlsProof, platform, actionType, amount, timestampMs, fiatCurrency, conversionRate, payeeDetails, timestampBufferMs, verifyingContract?, … }`.
- `CreateDepositParams`: token, amount, intent range, conversion rates, processors, deposit data, and optional delegate/guardian/referrer fields.

Errors
- `ZKP2PError` base; specialized: `NetworkError`, `APIError`, `ContractError`, `ValidationError`, `ProofGenerationError`.
