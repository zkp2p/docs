title: Credential Storage & Consent
---

Overview
- The SDK can capture and persist provider credentials only with user consent.
- You supply a `storage` implementation and (optionally) a `renderConsentSheet` UI.

Selectors in provider config
```jsonc
{
  "mobile": {
    "login": {
      "usernameSelector": "#email, input[name=\"email\"]",
      "passwordSelector": "#password, input[type=\"password\"]",
      "submitSelector": "button[type=\"submit\"]",
      "revealTimeoutMs": 3000
    }
  }
}
```

Consent flow
1) After a successful visible login, if consent is unset, the SDK calls your `renderConsentSheet`.
2) Your component should call `onAccept`, `onSkip`, or `onDeny`.
3) On accept, credentials are stored under a computed key; consent is recorded and you won’t be prompted again.

Storage surface
```ts
export interface Storage {
  get(key: string): unknown | Promise<unknown>;
  put(key: string, value: unknown): void | Promise<void>;
  del(key: string): void | Promise<void>;
  getKeys?: () => string[] | Promise<string[]>;
}
```

Helpers (via hook or direct exports)
```ts
const { clearAllCredentials, clearAllConsents, clearProviderCredentials, clearProviderConsent, getProviderConsent } = useZkp2p();
// or import named helpers from the package
```

Key formats (FYI)
- Credentials: `zkp2p_cred_{keccak256(platform:actionType:url)}`
- Consent: `zkp2p_consent_{keccak256(platform:actionType:url)}`

Notes
- You don’t need to manage keys manually; use helpers.
- If you pass `hideDefaultProofUI`, you can still use consent helpers and drive your own UI.
