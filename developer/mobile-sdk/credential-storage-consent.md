---
title: Credential Storage & Consent
---

### Overview
- The SDK can capture and persist provider credentials only with user consent.
- You supply a `storage` implementation and (optionally) a `renderConsentSheet` UI.

### Selectors in provider config
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

### Consent flow
1) After a successful visible login, if consent is unset, the SDK calls your `renderConsentSheet`.
2) Your component should call `onAccept`, `onSkip`, or `onDeny`.
3) On accept, credentials are stored under a computed key; consent is recorded and you won’t be prompted again.

### Storage surface
```ts
export interface Storage {
  get(key: string): unknown | Promise<unknown>;
  put(key: string, value: unknown): void | Promise<void>;
  del(key: string): void | Promise<void>;
  getKeys?: () => string[] | Promise<string[]>;
}
```

### Helpers (via hook or direct exports)
```ts
const { clearAllCredentials, clearAllConsents, clearProviderCredentials, clearProviderConsent, getProviderConsent } = useZkp2p();
// or import named helpers from the package
```

### Key formats (FYI)
- Credentials: `zkp2p_cred_{keccak256(platform:actionType:url)}`
- Consent: `zkp2p_consent_{keccak256(platform:actionType:url)}`

### Notes
- You don’t need to manage keys manually; use helpers.
- If you pass `hideDefaultProofUI`, you can still use consent helpers and drive your own UI.

### Example: AsyncStorage-backed Storage
```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Storage } from '@zkp2p/zkp2p-react-native-sdk';

export const secureStorage: Storage = {
  async get(key) {
    const v = await AsyncStorage.getItem(String(key));
    try { return v ? JSON.parse(v) : null; } catch { return v; }
  },
  async put(key, value) {
    const s = typeof value === 'string' ? value : JSON.stringify(value);
    await AsyncStorage.setItem(String(key), s);
  },
  async del(key) {
    await AsyncStorage.removeItem(String(key));
  },
};
```

### Example: Consent bottom sheet
```tsx
function ConsentSheet({ visible, platform, actionType, onAccept, onSkip, onDeny }) {
  if (!visible) return null;
  return (
    <BottomSheet>
      <Text>Save your {platform}:{actionType} credentials for next time?</Text>
      <Button title="Save" onPress={onAccept} />
      <Button title="Not now" onPress={onSkip} />
      <Button title="Never" onPress={onDeny} />
    </BottomSheet>
  );
}
```
