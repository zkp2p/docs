---
title: Troubleshooting
---

### No network events captured
- Ensure the provider config `metadata.urlRegex` matches the actual request and that `interceptConfig` allows XHR/fetch/HTML (SDK defaults do).
- Some providers require a UI action first; use `userInput` (provider config) or call `initiate()` with `initialAction`.

### Session appears expired
- Use `isSessionActive(platform, action)` before showing UI. If false, call `authenticate()` to refresh cookies.
- Call `clearSession({ iosAlsoClearWebKitStore: true })` to reset.

### Proof generation hangs or times out
- Increase `rpcTimeout` on `Zkp2pProvider`.
- Call `resetState()` to cancel native tasks and remount the RPC bridge.
- On very low‑memory devices, concurrency is reduced automatically; try again after closing background apps.

### Auth WebView gets stuck
- Use `closeAuthWebView()` and then `authenticate()` again.
- Verify `mobile.login` selectors still match the provider’s DOM; update your provider JSON if the site changed.

### Android circuits not found
- The SDK’s Gradle task copies circuits into library assets automatically. If customizing, ensure your app packages `gnark-circuits/pk.*` and `gnark-circuits/r1cs.*` in its assets.

### iOS pod errors
- Run `pod install` inside `ios/`. If building with new architecture, ensure CocoaPods + Xcode are up to date.

### Wrong chain or unsupported chainId
- The client validates `chainId`; use Base mainnet `8453` (and Base Sepolia for testing). Others must be added in the SDK.

### Missing API key or wallet client
- Full Mode methods throw if `apiKey`/`walletClient` are absent. Use Proof‑Only mode or provide both.

### Custom user agent or cookies
- Providers may specify `mobile.userAgent` and `mobile.includeAdditionalCookieDomains`; verify your chosen provider template.

### Debug logging
```ts
import { setLogLevel } from '@zkp2p/zkp2p-react-native-sdk';
setLogLevel('debug');
```
