---
slug: intro-zkp2p-v2
title: Introducing ZKP2P V2
tags: [announcement, protocol]
---

*Today, we're launching ZKP2P V2, the next version of our decentralized on/offramp protocol. Swap to ETH, USDC, Solana, memecoins and more using Venmo, Cashapp, Wise or Revolut–with no fees, no intrusive identity verification and near-instant settlement.*

Get started at [zkp2p.xyz](https://www.zkp2p.xyz)

ZKP2P V1 was launched in November 2023 as a proof of concept demonstrating the first-ever onchain, trust-minimized and peer-to-peer on/off-ramp. Sellers could provide USDC liquidity to an escrow smart contract, while buyers used ZKEmail to prove they had sent Venmo payments to the seller to instantly unlock funds—no centralized intermediaries required for settlement or dispute resolution.

Since then, our team has spent 2024 exploring applications using additional primitives such as zkEmail, zkTLS, TLSNotary to facilitate the creation of novel markets to trade digital goods onchain. These include:

- Global on/off-ramps for INR, TRY, EUR, and GBP, powered by zkEmail and TLSNotary
- A P2P aftermarket exchange for Web2 domains
- A secondary ticketing marketplace for Ticketmaster tickets with 90% lower fees

### Revisiting the Onboarding Problem
As our tech stack matured the past year, we're now doubling down on the most impactful market that we believe zkTLS enables–seamless and permissionless flow between fiat and crypto.

Despite the promise of Bitcoin as P2P electronic cash, payments on crypto rails have yet to be widely adopted globally and DeFi largely exists as a parallel financial system. This is because getting value across web2 and web3 is still the major bottleneck. Existing solutions fall short in crucial ways:

- Limited global availability (e.g., Coinbase not accessible in every jurisdiction)
- Lack of composability (can’t directly use USD to buy long-tail assets in a single step)
- High fees (some direct onramps charge up to 5%)
- Cumbersome KYC and multi-step processes

A frictionless and permissionless on/offboarding protocol means anyone can easily access the broader crypto ecosystem with no geographic or financial barrier.

## Introducing ZKP2P v2
V2 incorporates the latest in programmable cryptography systems, product and UX flows. Here’s what’s new:

1. Swap to any token on any chain. Previously, we were limited to onramping to USDC on Base. Now, we aggregate intent-based bridges (like Relay) to enable near-instant bridging and swaps across multiple chains (e.g., Ethereum, Solana).

2. Capital efficiency for liquidity providers (LPs). In V1, liquidity was siloed into separate pools. In V2, you can deploy liquidity once and provide it to any supported payment platforms you specify simultaneously. Each new platform integration adds another source of yield—without requiring more locked capital.

3. Permissionless integration. V2 is open source and deployed onchain, meaning applications can permissionlessly integrate and compose actions on top–unlike centralized solutions which for example require developers to KYC.

4. Streamlined workflow. We’ve rewritten our entire stack to significantly reduce the number of steps required for onramping. This includes usage of a headless extension flow and appclips on mobile for verifying payments–no more popups or app downloads. Onramping fiat to crypto end-to-end now takes around 60 seconds.

In V1, we supported 4 currencies (INR, USD, TRY, EUR). V2 now supports 23 currencies. In V1, we only supported Base and USDC as the only chain and asset. V2 initially supports 4 chains (Solana, Base, Ethereum, Polygon) and many more tokens including ETH, SOL, POL, TRUMP, AERO and more.


## Under the Hood

To recap, the ZKP2P V1 protocol was a simple construction:

- Seller locks onchain assets in an escrow smart contract
- Buyer pays seller offchain using any supported payment platform
- Buyer unlocks onchain assets atomically by submitting a proof of payment generated using ZK or MPC to the escrow

ZKP2P V2 supercharges this base V1 workflow with 2 new design considerations in mind: extensibility and separation of concerns.

### Extensibility:
V2 is designed to be maximally flexible, which means a generic escrow protocol that supports any ERC20 token and unlocking condition. These predicates can be defined using any programmable crypto primitive including zkEmail, zkTLS, MPCTLS, and TEEs (and anything in the future). For example, we can support:

1. If Venmo sends an email attesting to $X was transferred to Y person

2. If venmo.com returns an API response saying $X was transferred to Y person and is proven using zkTLS

3. If a TEE attests to that $X was transferred to Y person

4. If a decentralized verifier committee resolves an attestation that $X was transferred correctly

Our [PeerAuth extension](https://chromewebstore.google.com/detail/peerauth-authenticate-and/ijpgccednehjpeclfcllnjjcmiohdjih) is the interface to authenticating into and generating proofs for each of these primitives. Developers can integrate new payment platforms in days rather than months—no custom ZK circuits required.


At launch, we currently support the proxy-TLS protocol, but will be quickly rolling out support for MPC-TLS, TEEs and zkEmail.

### Separation of concerns
V2 is designed to optimize what each layer of our stack does best. Onchain for custody of funds and settlement of escrow transactions (the protocol will always remain non custodial). And offchain for any periphery logic. In particular, we introduce an offchain relayer role that relays payee details, gates liquidity based on seller requirements, and abstracts gas and wallet signing.

Today, anyone can run a relaying service fully customizable to how they want to serve their users, should they choose to not user ZKP2P's default relayer. For example, a relayer that:

- Collects additional KYC to serve high limit OTC trades

- Only serves a small community

- Users can also opt to not use a relayer and choose to use the blockchain directly as a database (similar to ZKP2P V1)


For more details on our tech stack, check out our [docs](https://docs.zkp2p.xyz).

### Whats next
Launch is just the beginning. We’re committed to:

- Expanding currency and token support (more local payment methods, more crypto assets)

- Further reducing proof generation times—or removing the need for onramper proofs altogether while preserving privacy

- Increasing transaction limits and exploring new transaction types (e.g., subscription flows, large trades)

- Improving support for integrations, such as APIs, SDKs and importable UI components

- Decentralizing the stack over time and making ZKP2P unstoppable and autonomous

## Reach out
DMs are open! Email us at team@zkp2p.xyz or ping us on Telegram @zk_p2p.

Liquidity Providers: We’re looking for LPs to power on/off-ramps across the globe. If you post liquidity / ads on existing P2P platforms like Binance P2P, we would love to chat about how ZKP2P plugs into your existing workflow.

Integration Partners: If you're building an app or wallet and want to enable a fast, cheap and no unnecessary KYC onramping solution for your users, we would love to see how we can help.

Developers: Want to integrate a new payment platform (or your local bank) into ZKP2P V2? We’ll help you get started.

To get involved and stay up to date:

- Email: team@zkp2p.xyz

- Telegram: @zk_p2p

- Twitter/X: @zkp2p

- Documentation: docs.zkp2p.xyz

- Analytics: [Dune](https://dune.com/zkp2p)