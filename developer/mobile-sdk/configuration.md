---
title: Configure the SDK
---

### Wrap your app
```tsx
import { Zkp2pProvider } from '@zkp2p/zkp2p-react-native-sdk';

<Zkp2pProvider
  walletClient={walletClient}        // Full Mode only
  apiKey={process.env.ZKP2P_API_KEY} // Full Mode only
  chainId={8453}
  prover="reclaim_gnark"            // or "reclaim_snarkjs"
  rpcUrl="https://base-mainnet.g.alchemy.com/v2/KEY" // optional explicit RPC
  rpcTimeout={60000}
  witnessUrl="https://attestor.zkp2p.xyz"
  baseApiUrl="https://api.zkp2p.xyz"
  environment="production"          // or "staging"
  storage={secureStorage}
  hideDefaultProofUI={false}
  renderConsentSheet={({visible, platform, actionType, onAccept, onDeny, onSkip}) => (
    <YourConsentSheet visible={visible} onAccept={onAccept} onDeny={onDeny} onSkip={onSkip} />
  )}
  configBaseUrl="https://raw.githubusercontent.com/zkp2p/providers/main/"
/>
```

### Provider props: types, defaults, notes
```ts
type Prover = 'reclaim_gnark' | 'reclaim_snarkjs';

interface Zkp2pProviderProps {
  // Core
  children: React.ReactNode;
  chainId?: number;                    // default: 8453 (Base)
  prover?: Prover;                     // default: 'reclaim_gnark'
  walletClient?: WalletClient;         // required for Full Mode
  apiKey?: string;                     // required for Full Mode

  // Services
  witnessUrl?: string;                 // default: 'https://attestor.zkp2p.xyz'
  baseApiUrl?: string;                 // default: 'https://api.zkp2p.xyz'
  environment?: 'production' | 'staging'; // default: 'production'
  rpcUrl?: string;                     // optional explicit HTTP RPC
  rpcTimeout?: number;                 // default: 60_000 ms

  // UX & Logs
  logLevel?: 'error' | 'info' | 'debug';
  hideDefaultProofUI?: boolean;        // default: false
  renderConsentSheet?: (p: {
    visible: boolean;
    platform: string;
    actionType: string;
    onAccept: () => void;
    onDeny: () => void;
    onSkip: () => void;
  }) => React.ReactNode;

  // Persistence
  storage?: Storage;                   // credential/consent storage
  configBaseUrl?: string;              // default: providers/main
}
```

### Provider props (most‑used)
- `walletClient` (Full Mode): a viem `WalletClient` for contract calls.
- `apiKey` (Full Mode): enables quotes, payee data, and API‑backed flows.
- `chainId`: e.g., Base mainnet `8453`.
- `prover`: `'reclaim_gnark'` (native, recommended) or `'reclaim_snarkjs'`.
- `rpcUrl`/`rpcTimeout`: HTTP RPC endpoint + timeout (ms) for viem.
- `baseApiUrl`/`witnessUrl`: service roots; do not append `/v1` or `/v2`.
- `storage`: secure storage implementation to persist credentials/consent.
- `hideDefaultProofUI`/`renderConsentSheet`: customize UI/consent behavior.
- `configBaseUrl`: base URL for provider JSON templates.

### Headless vs default proof UI
- Default: the SDK renders an animated bottom sheet during proof gen.
- Headless: set `hideDefaultProofUI` to true and drive your own progress.

Custom user agent and cookie domains
- Providers may specify per‑platform user agents and extra cookie domains in their JSON configs; the SDK respects these at runtime.

### Logging
```ts
import { setLogLevel } from '@zkp2p/zkp2p-react-native-sdk';
setLogLevel('debug'); // 'error' | 'info' | 'debug'
```

### Provider JSON (SDK‑relevant fields)
- Top‑level: `actionType`, `authLink`, `url`, `method`, `skipRequestHeaders`, `body`.
- `metadata`: `platform`, `urlRegex`, `method`, `fallbackUrlRegex`, `fallbackMethod`, `preprocessRegex`, `transactionsExtraction` (JSONPath/XPath selectors), `proofMetadataSelectors`, and optional `metadataUrl*` fields for in‑page fallback replay.
- `mobile`:
  - `includeAdditionalCookieDomains: string[]`
  - `userAgent: { ios: string; android: string }`
  - `internal.actionLink` / `external.actionLink` (+ optional `appStoreLink`/`playStoreLink`)
  - `internal.actionCompletedUrlRegex`
  - `login`: `usernameSelector`, `passwordSelector`, `submitSelector`, `nextSelector`, `revealTimeoutMs`

### Network and environment tips
- Use explicit `rpcUrl` in production to avoid public‑RPC quirks (batching is disabled in the client for compatibility).
- Keep `baseApiUrl` versionless; the SDK appends `/v1` and `/v2` routes internally.
- For staging, set `environment="staging"`, `baseApiUrl="https://api-staging.zkp2p.xyz"`, and `witnessUrl` accordingly.
