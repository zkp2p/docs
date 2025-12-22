---
id: v3-deployments
title: V3 Deployments
---

Note: We do not have a Sepolia deployment for V3.

## Base (Mainnet)

- Chain: Base mainnet
- Chain ID: 8453
- Source of truth: `zkp2p-v2-contracts/deployments/outputs/baseContracts.ts` and `zkp2p-v2-contracts/deployments/outputs/platforms/base.json` (snapshots under `.../platforms/snapshots/base/*`).

### Contracts

| Contract | Address |
| --- | --- |
| Escrow | `0x2f121CDDCA6d652f35e8B3E560f9760898888888` |
| Orchestrator | `0x88888883Ed048FF0a415271B28b2F52d431810D0` |
| EscrowRegistry | `0xeD0e847B101abc96E796260AC358e12BAa2f5B21` |
| NullifierRegistry | `0x8d8e1A0e5345a5cc9AA206c3ca76D6d28c514608` |
| PaymentVerifierRegistry | `0x2b82D24437ff66Fb173eabDfD67ee2ACeb8bEb1e` |
| PostIntentHookRegistry | `0x9B128EBAD4d874199A2Dc57E93186796c5EcAdE9` |
| ProtocolViewer | `0x30B03De22328074Fbe8447C425ae988797146606` |
| RelayerRegistry | `0xEbA979889a9c97382A92472fF3703786fF180083` |
| SimpleAttestationVerifier | `0xED6C0C34c3964D239e7a315C55E620fafE5Ae3AC` |
| UnifiedPaymentVerifier | `0x16b3e4a3CA36D3A4bCA281767f15C7ADeF4ab163` |

### Payment Methods

All payment methods resolve to the same verifier contract on Base: `UnifiedPaymentVerifier` at `0x16b3e4a3CA36D3A4bCA281767f15C7ADeF4ab163`.

| Payment Method | Payment Method ID (bytes32) | Supported Currencies |
| --- | --- | --- |
| venmo | `0x90262a3db0edd0be2369c6b28f9e8511ec0bac7136cefbada0880602f87e7268` | USD |
| revolut | `0x617f88ab82b5c1b014c539f7e75121427f0bb50a4c58b187a238531e7d58605d` | USD, EUR, GBP, SGD, NZD, AUD, CAD, JPY, HKD, MXN, SAR, AED, THB, TRY, PLN, CHF, ZAR, CNY, CZK, DKK, HUF, NOK, RON, SEK |
| cashapp | `0x10940ee67cfb3c6c064569ec92c0ee934cd7afa18dd2ca2d6a2254fcb009c17d` | USD |
| wise | `0x554a007c2217df766b977723b276671aee5ebb4adaea0edb6433c88b3e61dac5` | USD, CNY, EUR, GBP, AUD, NZD, CAD, AED, CHF, ZAR, SGD, ILS, HKD, JPY, PLN, TRY, IDR, KES, MYR, MXN, THB, VND, UGX, CZK, DKK, HUF, INR, NOK, PHP, RON, SEK |
| mercadopago | `0xa5418819c024239299ea32e09defae8ec412c03e58f5c75f1b2fe84c857f5483` | ARS |
| zelle-citi | `0x817260692b75e93c7fbc51c71637d4075a975e221e1ebc1abeddfabd731fd90d` | USD |
| zelle-chase | `0x6aa1d1401e79ad0549dced8b1b96fb72c41cd02b32a7d9ea1fed54ba9e17152e` | USD |
| zelle-bofa | `0x4bc42b322a3ad413b91b2fde30549ca70d6ee900eded1681de91aaf32ffd7ab5` | USD |
| paypal | `0x3ccc3d4d5e769b1f82dc4988485551dc0cd3c7a3926d7d8a4dde91507199490f` | USD, EUR, GBP, SGD, NZD, AUD, CAD |
| monzo | `0x62c7ed738ad3e7618111348af32691b5767777fbaf46a2d8943237625552645c` | GBP |
| n26 | `0xd9ff4fd6b39a3e3dd43c41d05662a5547de4a878bc97a65bcb352ade493cdc6b` | EUR |


### All Supported Currencies

Currency codes are ISO 4217 (uppercase). The on-chain representation is the bytes32 hash `keccak256(utf8(code))`.

| Currency | Bytes32 Hash |
| --- | --- |
| AED | `0x4dab77a640748de8588de6834d814a344372b205265984b969f3e97060955bfa` |
| ARS | `0x8fd50654b7dd2dc839f7cab32800ba0c6f7f66e1ccf89b21c09405469c2175ec` |
| AUD | `0xcb83cbb58eaa5007af6cad99939e4581c1e1b50d65609c30f303983301524ef3` |
| CAD | `0x221012e06ebf59a20b82e3003cf5d6ee973d9008bdb6e2f604faa89a27235522` |
| CHF | `0xc9d84274fd58aa177cabff54611546051b74ad658b939babaad6282500300d36` |
| CNY | `0xfaaa9c7b2f09d6a1b0971574d43ca62c3e40723167c09830ec33f06cec921381` |
| CZK | `0xd783b199124f01e5d0dde2b7fc01b925e699caea84eae3ca92ed17377f498e97` |
| DKK | `0x5ce3aa5f4510edaea40373cbe83c091980b5c92179243fe926cb280ff07d403e` |
| EUR | `0xfff16d60be267153303bbfa66e593fb8d06e24ea5ef24b6acca5224c2ca6b907` |
| GBP | `0x90832e2dc3221e4d56977c1aa8f6a6706b9ad6542fbbdaac13097d0fa5e42e67` |
| HKD | `0xa156dad863111eeb529c4b3a2a30ad40e6dcff3b27d8f282f82996e58eee7e7d` |
| HUF | `0x7766ee347dd7c4a6d5a55342d89e8848774567bcf7a5f59c3e82025dbde3babb` |
| IDR | `0xc681c4652bae8bd4b59bec1cdb90f868d93cc9896af9862b196843f54bf254b3` |
| ILS | `0x313eda7ae1b79890307d32a78ed869290aeb24cc0e8605157d7e7f5a69fea425` |
| INR | `0xaad766fbc07fb357bed9fd8b03b935f2f71fe29fc48f08274bc2a01d7f642afc` |
| JPY | `0xfe13aafd831cb225dfce3f6431b34b5b17426b6bff4fccabe4bbe0fe4adc0452` |
| KES | `0x589be49821419c9c2fbb26087748bf3420a5c13b45349828f5cac24c58bbaa7b` |
| MXN | `0xa94b0702860cb929d0ee0c60504dd565775a058bf1d2a2df074c1db0a66ad582` |
| MYR | `0xf20379023279e1d79243d2c491be8632c07cfb116be9d8194013fb4739461b84` |
| NOK | `0x8fb505ed75d9d38475c70bac2c3ea62d45335173a71b2e4936bd9f05bf0ddfea` |
| NZD | `0xdbd9d34f382e9f6ae078447a655e0816927c7c3edec70bd107de1d34cb15172e` |
| PHP | `0xe6c11ead4ee5ff5174861adb55f3e8fb2841cca69bf2612a222d3e8317b6ae06` |
| PLN | `0x9a788fb083188ba1dfb938605bc4ce3579d2e085989490aca8f73b23214b7c1d` |
| RON | `0x2dd272ddce846149d92496b4c3e677504aec8d5e6aab5908b25c9fe0a797e25f` |
| SAR | `0xf998cbeba8b7a7e91d4c469e5fb370cdfa16bd50aea760435dc346008d78ed1f` |
| SEK | `0x8895743a31faedaa74150e89d06d281990a1909688b82906f0eb858b37f82190` |
| SGD | `0xc241cc1f9752d2d53d1ab67189223a3f330e48b75f73ebf86f50b2c78fe8df88` |
| THB | `0x326a6608c2a353275bd8d64db53a9d772c1d9a5bc8bfd19dfc8242274d1e9dd4` |
| TRY | `0x128d6c262d1afe2351c6e93ceea68e00992708cfcbc0688408b9a23c0c543db2` |
| UGX | `0x1fad9f8ddef06bf1b8e0e28c11b97ca0df51b03c268797e056b7c52e9048cfd1` |
| USD | `0xc4ae21aac0c6549d71dd96035b7e0bdb6c79ebdba8891b666115bc976d16a29e` |
| VND | `0xe85548baf0a6732cfcc7fc016ce4fd35ce0a1877057cfec6e166af4f106a3728` |
| ZAR | `0x53611f0b3535a2cfc4b8deb57fa961ca36c7b2c272dfe4cb239a29c48e549361` |

### Notes

- All payment methods are registered in `PaymentVerifierRegistry` and resolve to the same `UnifiedPaymentVerifier` address on Base.
- Currencies per method are derived from the latest snapshots under `deployments/outputs/platforms/snapshots/base`. If these change, update this document by re-reading those files.
- Last refresh: 2025-10-27 (UTC)
