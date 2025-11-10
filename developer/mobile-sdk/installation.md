title: Install & Setup
---

Dependencies
- React Native (Autolinking supported)
- Packages: `@zkp2p/zkp2p-react-native-sdk` `@react-native-async-storage/async-storage` `@react-native-cookies/cookies` `react-native-webview` `@zkp2p/webview-intercept` `viem` `react-native-svg` `react-native-device-info`

Install
```sh
yarn add @zkp2p/zkp2p-react-native-sdk @react-native-async-storage/async-storage @react-native-cookies/cookies react-native-webview @zkp2p/webview-intercept viem react-native-svg react-native-device-info
```

iOS
- From your app: `cd ios && pod install`
- The SDK bundles `libgnarkprover.xcframework` and circuit resources; CocoaPods wires these automatically via the Podspec.
- Minimum iOS version follows your React Native project’s `min_ios_version_supported` value.

Android
- minSdkVersion: 24; targetSdkVersion: 34; compileSdkVersion: 35.
- Circuits are auto‑packaged into the library’s `src/main/assets/gnark-circuits` via a Gradle task; no app changes required.
- NDK is handled by the library build; consumers do not configure NDK directly.

Project setup notes
- Autolinking registers the native `Zkp2pGnarkModule` used for gnark proofs.
- `react-native-webview` is required for the RPC bridge and provider authentication.
- `react-native-device-info` enables dynamic memory‑based concurrency for proof generation.
- `react-native-svg` powers the default proof status UI.

Verifying native link
- iOS: open the workspace in Xcode and confirm `Zkp2pReactNativeSdk` pod is present; build once.
- Android: a clean Gradle sync/build will show the circuit copy step in logs.
