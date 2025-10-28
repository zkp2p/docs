# Introducing ZKP2P V3

Since launching V2 in February, we’ve had exponential growth, going from $30k to $300k weekly volume, and hitting $1M+ monthly volume. Since then, we’ve been working on improving our products for buyers, liquidity providers, and developers. 

![ZKP2P V2 Volume](/img/zkp2p-v3/volume.png)

We’d made onramping and offramping via web2 payment providers easier, faster, and cheaper than CEXs and traditional ramps, but there is still work to be done to improve the user and developer experience. Over the past 4 months, 1 in ~4 support tickets were from wrong currency payment errors. Liquidity Providers need to check rates constantly against rate fluctuations. Every new payment provider integration required a custom smart contract. 

V2 solved the first and last mile for stablecoin payments, V3 scales it. We’ve increased the flexibility of our verification allowing for partial release of payments, eliminating the need for manual intervention. Liquidity providers will soon be able to set spreads, not prices. New providers do not need a custom smart contract, speeding up the process and removing the reliance on our team. Protocols who integrate zkp2p can finally monetise and earn through affiliate fees, and include post-settlement hooks. 

We’ve kept the same product you love, and made it better. 

V3 is live at [zkp2p.xyz](https://zkp2p.xyz).

## Modular Smart Contracts

Our V2 upgrade kept our V1 smart contract architecture; with deposit configuration, verification, and intent lifecycle in one contract. This made upgrading risky and limited deposit management for liquidity providers. V3 separates responsibilities into two contracts, Escrow and Orchestrator. Escrow handles deposit configuration and locking, whilst Orchestrator manages intent lifecycle, gating, fee distribution, and post-intent hooks. 

Liquidity providers can partially top up and withdraw, update payment providers, add or remove currencies, and change limits without creating a new vault. 

This results in contracts that are safer to upgrade, have fewer operational steps, and easier to monetise and integrate without bespoke contracts. 

## Flexible & Reliable Verification

In V2 we parsed JSON zkTLS proofs and verified each provider onchain in a separate contract per payment method, which was costly, brittle, and made new integrations cumbersome. V3 moves the verification to a TEE attestation service that validates the proofs, and emits a standardised EIP-712 payment attestation. Onchain, our new Unified Payment Verifier checks signatures, amounts, and prevents replay. 

The above results in: 

- A flexible, modular system with no complex JSON parsing onchain
- Fewer support tickets as partial release resolves cross-currency mistakes and incorrect payment amounts
- Faster payment provider integrations without bespoke smart contracts
- zkTLS verification vendor agnostic

![ZKP2P V3 Verification](/img/zkp2p-v3/verification.png)

## What does V3 mean for me?

V3 is an exciting upgrade that has changes for buyers, liquidity providers, and developers. 

**For Buyers:**

- Buyers who pay cross currency now benefit from automatic, partial release instead of having to create a support ticket
- Faster proving for buyers due to zkTLS agnostic allowing us to migrate to faster zkTLS proving engines

**For Liquidity Providers:**

- We’ve made V2 and V3 compatible, all new deposits are routed to V3 contracts, and V2 deposits are still available to be taken or withdrawn
- Deposit Management becomes a lot easier:
    - Partially deposit and withdraw from your vault
    - Update rates, currencies, payment methods, and limits without creating a new vault
    - Save a deposit configuration from getting deleted
- We will roll out Automatic Rate Management (A.R.M.) for our liquidity providers in the next few weeks

**For Developers:**

- We’ve ensured backwards compatibility with V2 in V3, but we recommend upgrade your integration as soon as possible
- We’ve enabled affiliate fees so protocols can directly monetise their integrations and post-settlement hooks, allowing protocols to add arbitrary call data once a user has onramped
- New providers can be integrated without the need for bespoke smart contracts.
- Improved APIs and upgraded indexer, making it simpler and easier to read our data

## Progressive Decentralization

In V2, we relied on a single, centralised notary, which concentrated trust and made decentralisation more important as volume grew. V3's vendor-agnostic design sets the groundwork for what comes next.

We’re building zkp2p to be pluggable into any attestor network, from Primus and TLSNotary, to TEE based solutions like Phala, and even traditional ZK approaches like ZKEmail. Rotating attestors and onchain membership checks reduce reliance on any single operator whilst keeping proving fast. Over the coming months, we’re going to progressively decentralise verification and distribute trust over these networks. 

Beyond attestation, our new Unified Payment Verifiers lets us support 100x our payment providers and expand what zkp2p can support. We can unlock global liquidity pools that were previously out of reach and support regions, like China through Alipay, where onramping and offramping is still a challenge. As well as this, we can 10x our integrations, enabling platforms to plug in faster and use our stack to serve their users. 

This roadmap preserves the trust guarantees our users expect whilst scaling to meet demand. zkp2p V3 takes the first and last mile stablecoin foundation set by V2, and lets it scale. 

Buyers get automatic unlocks and need to create fewer support tickets. 

Liquidity Providers manage one vault and set spreads instead of fixed rates. 

Developers integrate faster and earn fees. 

Try V3 today at zkp2p.xyz.

[Twitter](http://www.x.com/zkp2p)

[Telegram](http://T.ME/zk_p2p)

[Discord](https://discord.gg/rzwe8jRpZJ)