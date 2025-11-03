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
    excerpt: 'Since launching V2 in February, we\'ve grown from $30k to $300k weekly volume and hit $1M+ monthly. V3 scales the protocol with modular smart contracts, flexible verification, and better UX for buyers, liquidity providers, and developers.',
    content: `
Since launching V2 in February, we've had exponential growth, going from $30k to $300k weekly volume, and hitting $1M+ monthly volume. Since then, we've been working on improving our products for buyers, liquidity providers, and developers.

![V2 Monthly and Weekly Volume](/img/v3/v2-volume.png)
*Figure 1: ZKP2P V2 weekly and monthly volume growth as of 3rd Nov 2025*

We'd made onramping and offramping via web2 payment providers easier, faster, and cheaper than CEXs and traditional ramps, but there is still work to be done to improve the user and developer experience. Over the past 4 months, we've received a lot of feedback about wrong currency payment errors. Liquidity Providers need to check rates constantly against rate fluctuations. Every new payment provider integration required a custom smart contract.

V2 solved the first and last mile for stablecoin payments, V3 scales it. We've increased the flexibility of our verification allowing for partial release of payments, eliminating the need for manual intervention. Liquidity providers will soon be able to set spreads, not prices. New providers do not need a custom smart contract, speeding up the process and removing the reliance on our team. Protocols who integrate ZKP2P can finally monetise and earn through affiliate fees, and include post-settlement hooks.

We've kept the same product you love, and made it better.

V3 is live at [zkp2p.xyz](https://zkp2p.xyz).

### Modular Smart Contracts

Our V2 upgrade kept our V1 smart contract architecture; with deposit configuration, verification, and intent lifecycle in one contract. This made upgrading challenging and limited flexibility for liquidity providers. V3 separates responsibilities into two contracts, Escrow and Orchestrator. Escrow handles deposit configuration and locking, whilst Orchestrator manages intent lifecycle, gating, fee distribution, and post-intent hooks.

Liquidity providers can partially top up and withdraw, update payment providers, add or remove currencies, and change limits without creating a new vault.

This results in contracts that are safer to upgrade, have fewer operational steps, and easier to monetise and integrate without bespoke contracts.

![V3 Verification Flow](/img/v3/contracts_architecture.png)
*Figure 2: Modular smart contract architecture in V3*

### Flexible & Reliable Verification

In V2 we parsed JSON zkTLS proofs and verified each provider onchain in a separate contract per payment method, which was costly, brittle, and made new integrations cumbersome. V3 moves the verification to a TEE attestation service that validates the proofs, and emits a standardised EIP-712 payment attestation. Onchain, our new Unified Payment Verifier checks signatures, amounts, and prevents replay.

The above results in:

- A flexible, modular system with no complex JSON parsing onchain
- Fewer support tickets as partial release resolves cross-currency mistakes and incorrect payment amounts
- Faster payment provider integrations without bespoke smart contracts
- zkTLS verification vendor agnostic

![V3 Protocol Diagram](/img/v3/v3_protocol_diagram.png)
*Figure 3: V3 Verification Flow*

### What does V3 mean for me?

V3 is an exciting upgrade that has changes for buyers, liquidity providers, and developers.

**For Buyers:**

- Buyers who pay cross currency now benefit from automatic, partial release instead of having to create a support ticket
- Faster proving for buyers due to zkTLS agnostic allowing us to migrate to faster zkTLS proving engines
- Mobile support coming soon

**For Liquidity Providers:**

- We've made V2 and V3 compatible, all new deposits are routed to V3 contracts, and V2 deposits are still available to be taken or withdrawn
- Deposit Management becomes a lot easier:
    - Partially deposit and withdraw from your vault
    - Update rates, currencies, payment methods, and limits without creating a new vault
    - Save a deposit configuration from getting deleted
- We will roll out Automatic Rate Management (A.R.M.) for our liquidity providers in the next few weeks

One vault, with total flexibility.

**For Developers:**

- We've ensured backwards compatibility with V2 in V3, but we recommend upgrade your integration as soon as possible
- We've enabled builder fees so protocols can directly monetise their integrations and post-settlement hooks, allowing protocols to add arbitrary call data once a user has onramped
- New providers can be integrated without the need for bespoke smart contracts.
- Improved APIs and upgraded indexer, making it simpler and easier to read our data

### Progressive Decentralization

In V2, we relied on a single, centralized notary, concentrating trust and making decentralization increasingly important as our volume scaled.

The new attestation service is vendor-agnostic and supports any zkTLS proof provider, including TLSNotary, Primus, and Reclaim Protocol. It accommodates a range of attestation transformation techniques, such as TEEs, EigenLayer, or validators. This design enables ZKP2P to flexibly transition to decentralized notary networks as they mature.


### What's next?

Beyond attestation, our new Unified Payment Verifiers lets us support more payment providers while reducing development time. We can unlock global liquidity pools that were previously out of reach and support regions, like China through Alipay, where onramping and offramping is still a challenge.

This roadmap preserves the trust guarantees our users expect whilst scaling to meet demand. ZKP2P V3 takes the first and last mile stablecoin foundation set by V2, and lets it scale.

Buyers get automatic unlocks and need to create fewer support tickets.

Liquidity Providers manage one vault and set spreads instead of fixed rates.

Developers integrate faster and earn fees.

If you're building and want to integrate ZKP2P, reach out on [Twitter](https://www.x.com/zkp2p) or [Telegram](https://www.t.me/zk_p2p).

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

