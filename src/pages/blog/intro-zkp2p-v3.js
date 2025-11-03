import React from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import ReactMarkdown from 'react-markdown';

// Simple read time calculation
const calculateReadTime = (content) => {
  if (!content) return '1 min read';
  const wordsPerMinute = 225;
  const wordCount = content.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
};

// Simple date formatting
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export default function IntroZKP2PV3() {
  const { siteConfig } = useDocusaurusContext();

  const post = {
    title: 'Introducing ZKP2P V3',
    date: '2025-11-03',
    excerpt: 'V2 solved the first and last mile for stablecoin payments — V3 scales it with modular contracts, flexible verification, and better UX for buyers, LPs, and developers.',
    content: `
Since launching V2 in February, we've had exponential growth, going from $30k to $300k weekly volume, and hitting $1M+ monthly volume. Since then, we've been working on improving our products for buyers, liquidity providers, and developers. 

![ZKP2P V2 Volume](/img/v3/v2_volume.png)
*Figure 1: ZKP2P V2 weekly and monthly volume growth*

V2 made onramping and offramping with web2 payment providers dramatically easier, faster, and cheaper than CEXs or traditional ramps. But it still left some pain points for users and developers. Buyers often ran into issues with wrong currency payments. Liquidity providers needed to constantly monitor and update their rates to account for market fluctuations. And every time we wanted to support a new payment provider, it required engineering a new custom smart contract, which slowed down integrations and increased maintenance overhead.

V2 solved the first and last mile for stablecoin payments, V3 scales it. We’ve increased the flexibility of our verification allowing for partial release of payments, eliminating the need for manual intervention. Liquidity providers will soon be able to set spreads, not prices. New providers do not need a custom smart contract, speeding up the process and removing the reliance on our team. Protocols who integrate zkp2p can finally monetise and earn through affiliate fees, and include post-settlement hooks. 

We’ve kept the same product you love, and made it better. 

## Modular Smart Contracts
In V2, all core logic including deposit setup, verification, and managing intent lifecycles lived inside a single contract. This monolithic design made upgrades challenging and limited flexibility for liquidity providers. In V3, we have modularized the protocol with two main contracts: Escrow and Orchestrator.

The Escrow contracts are responsible for managing deposits: they lock funds, enforce deposit configurations, and allow liquidity providers to manage their balances more flexibly. With Escrow, LPs can partially top up or withdraw, update payment providers, add or remove supported currencies, and adjust deposit limits—all without the need to deploy a new vault every time.

The Orchestrator contracts oversee the full intent lifecycle. They handle gating mechanisms and whitelists, route payments to the correct verifiers, distribute protocol and affiliate fees, and support post-intent hooks for integration with external protocols. 

The modular design of V3 contracts makes them safer to upgrade, have fewer operational steps, and easier to monetise and integrate without bespoke contracts. 

![ZKP2P V3 Smart Contracts](/img/v3/contracts_architecture.png)
*Figure 2: Modular smart contract architecture in V3*

## Flexible Verification

In V2 we parsed JSON zkTLS proofs and verified each provider onchain in a separate contract per payment method, which was costly, brittle, and made new integrations cumbersome. V3 moves the verification to a TEE attestation service that validates the proofs and emits a standardized EIP-712 payment attestation. Onchain, our new extensible Unified Payment Verifier checks signatures, amounts, and prevents replay, supporting any current and future payment methods.

The above results in: 

- A flexible, modular, and extensible system with no complex JSON parsing onchain
- Fewer support tickets as partial release resolves cross-currency mistakes and incorrect payment amounts
- Faster payment provider integrations without bespoke smart contracts
- zkTLS verification vendor agnostic

![ZKP2P V3 Verification](/img/v3/v3_protocol_diagram.png)
*Figure 3: Flexible and extensible verification flow with TEE attestation service and Unified Payment Verifier*

In V2, we relied on a single, centralized notary, concentrating trust and making decentralization increasingly important as our volume scaled.

The new attestation service is vendor-agnostic and supports any zkTLS proof provider—including TLSNotary, Primus, and Reclaim Protocol. It accommodates a range of attestation transformation techniques, such as TEEs, EigenLayer, or validators. This extensible design enables ZKP2P to flexibly transition to decentralized notary networks as they mature.

Our extensible Unified Payment Verifier lets us support more payment providers and slashes development time. We're able to unlock global liquidity pools that were previously out of reach and support regions like China (via Alipay) where onramping and offramping remain a challenge.

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

## What's next?
This launch is just the beginning. We will be leveraging the ZKP2P V3 protocol and rolling out several major improvements in the upcoming months, that include, but are not limited to:
- Expanding payment platforms support including adding new asia and latin american payment methods
- Further reducing proof generation times
- Deeper integrations with external protocols and platforms
- Improving support for integrations, such as APIs, SDKs and importable UI components
- Decentralizing the stack over time and making ZKP2P unstoppable and autonomous

Reach out to us:
- If you're interested in any of the above, our DMs are open! Reach out on Telegram [@zk_p2p](https://t.me/zk_p2p).
- If you’re building an app and want a fast, zero fee, and reliable onramping solution, let’s talk.
- If you’re a dev wanting to integrate your local payment platform into V3, we’ll help you get started.

CEXs had their moment. Traditional ramps are legacy infrastructure. ZKP2P V3 is P2P rails at scale, automated, composable, onchain.
The future of on/offramps is permissionless, and it starts here.
Try V3 today at [zkp2p.xyz](https://zkp2p.xyz).

    `
  };

  return (
    <Layout
      title={post.title}
      description={post.excerpt}>
      <main className="blog-post-page">
        <div className="container">
          <div className="blog-header">
            <h1>{post.title}</h1>
            <div className="blog-meta">
              <span className="blog-date">{formatDate(post.date)}</span>
              <span className="blog-read-time">{calculateReadTime(post.content)}</span>
            </div>
          </div>

          <div className="blog-content">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>
        </div>
      </main>
    </Layout>
  );
}

