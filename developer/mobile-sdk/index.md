---
id: mobile-sdk-overview
title: Mobile SDK Integration (Beta)
description: React Native SDK for ZKP2P — overview, modes, and quick start
---

This section documents the ZKP2P React Native SDK (`@zkp2p/zkp2p-react-native-sdk`) for building peer‑to‑peer, fiat↔crypto on/off‑ramp experiences on mobile. The SDK drives payment‑provider authentication, captures notarized network payloads, and generates zero‑knowledge proofs suitable for on‑chain verification.

Beta status
- The SDK is actively evolving. APIs may change in minor versions. Please pin an exact version in production.

What you can build
- On‑ramp flows that verify a fiat payment via zkTLS proofs.
- Off‑ramp flows that verify receipt of funds via supported providers.
- “Proof‑only” clients that perform authentication + proof without a wallet.

Two modes
- Full Mode: requires a `WalletClient` and ZKP2P `apiKey`; exposes `Zkp2pClient` for quotes, intents and contract calls.
- Proof‑Only Mode: no wallet or API key; you can authenticate and generate proofs; contract/API helpers are not available.

Quick start
```tsx
import { Zkp2pProvider } from '@zkp2p/zkp2p-react-native-sdk';

function App() {
  return (
    <Zkp2pProvider
      chainId={8453}
      prover="reclaim_gnark"
      // Optional: apiKey + walletClient enable Full Mode
    >
      <YourApp />
    </Zkp2pProvider>
  );
}
```

Next steps
- [Install & Setup](./installation)
- [Configure the SDK](./configuration)
- [Auth & Proof](./auth-and-proof)
- [Credential Storage](./credential-storage-consent)
- [Client API](./client-api)
- [Types](./types)
- [Examples](./examples)
- [Troubleshooting](./troubleshooting)
