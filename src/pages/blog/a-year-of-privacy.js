import React, { useEffect } from 'react';
import Layout from '@theme/Layout';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Tweet embed component
const TweetEmbed = ({ tweetUrl }) => {
  useEffect(() => {
    // Load Twitter widget script
    if (window.twttr) {
      window.twttr.widgets.load();
    } else {
      const script = document.createElement('script');
      script.src = 'https://platform.twitter.com/widgets.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <blockquote className="twitter-tweet" data-theme="dark">
      <a href={tweetUrl}>Loading tweet...</a>
    </blockquote>
  );
};

const calculateReadTime = (content) => {
  if (!content) return '1 min read';
  const wordsPerMinute = 225;
  const wordCount = content.trim().split(/\s+/).length;
  const readTime = Math.ceil(wordCount / wordsPerMinute);
  return `${readTime} min read`;
};

const formatDate = (dateString) => {
  const date = new Date(`${dateString}T00:00:00Z`);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  });
};

export default function AYearOfPrivacy() {
  const post = {
    title: 'A Year of Privacy',
    date: '2026-01-30',
    excerpt: 'Over the last three years, I\'ve purchased a house and got married, all using proceeds from crypto. This is the privacy stack I use. The one I wish existed in 2023.',
  };

  const contentPart1 = `
Over the last three years, I've purchased a house and got married, all using proceeds from crypto. Both times I had to cash out through Coinbase. ZKP2P didn't exist yet. I had to:

- Prove my source of funds to the bank
- Hand over my address
- Hand over my identity
- Hand over my transaction history
- Explain how I made the money
- Get flagged
- Explain it all again
- Wait
- Finally get approved

Every institution I touched received a full map of my financial life. All for wanting to buy a house and pay for a wedding.

By early 2025, I started looking for better solutions. I was hunting for stablecoin yields and found ZKP2P, which sent me down a privacy rabbit hole. This is the privacy stack I use. The one I wish existed in 2023.

### Privacy ≠ Secrecy

There is a distinct difference between privacy and secrecy. Secrecy is hiding something wrong. Privacy is controlling who knows what about you. You don't publish your salary on the internet. You don't give strangers your home address. That doesn't mean you're doing anything illegal.

Financial privacy is the same. I don't want my bank deciding I'm a risk because I interact with DeFi. I don't want a data breach at Coinbase putting me on a wrench attack list. I don't want a tax agent leaking my details to kidnappers.

The money I cashed out for my house and wedding was already fully taxed. Where I reside, we have a wealth tax, not capital gains, so there is no incentive to hide transactions. I just don't want every institution I touch to have a complete map of my financial life forever.

Privacy is normal.

### The Problem with "Privacy" Today

Onchain privacy is mostly solved. Privacy Pools, Zcash, Aztec. The tech exists to move value without broadcasting your history, but the problem is still where fiat meets crypto.

Tornado Cash is tainted. CEX to fresh wallet doesn't help; the CEX already linked your identity to that deposit. Multiple wallets get connected through timing, amounts, gas funding. Buying Monero on Kraken defeats the purpose; they have your KYC.

Every privacy solution breaks at the same point: the onramp and offramp. You can be perfect onchain and still have your entire history exposed because Coinbase knows which wallet you deposited to.

The stack I use solves for this, privacy at the edges, not just the middle.

### The First Mile

The first problem is getting from fiat into crypto without a CEX or bank linking your identity to your wallet. ZKP2P is a peer-to-peer, non-custodial, permissionless bulletin board that lets you find users with a coincidence of wants.

It's an easy process:

1. Choose your payment provider, amount, and start your order
2. Send money to a peer on your chosen platform
3. Prove the payment
4. USDC is released atomically

No details about the payment are exposed, no verification beyond what your payment provider has. No data saved on you.

Every user on ZKP2P has been verified by platforms who are worth billions of dollars, with huge compliance teams. You're not sending money to anonymous users, you're receiving payments from verified accounts on regulated payment rails. These platforms are built to send and receive payments.

ZKP2P doesn't add to the surveillance layer of your financial transactions. I use it to fund fresh wallets, with no history, no connection to my doxxed addresses, and no CEX deposit linking it to my identity.

### The Middle Miles

**Privacy Pools**

I've successfully onramped via ZKP2P, and have a freshly funded wallet. Now it's time to break the link before I do anything else.

Privacy Pools lets you deposit ETH or stablecoins from one wallet and withdraw to another. The connection between them is broken onchain.

Here's how it works:

1. Deposit from your funding wallet
2. The Association Set Provider (ASP) vets your deposit (most are reviewed within an hour)
3. Once approved, withdraw to a fresh wallet (with some opsec)
4. ZK proofs verify you have a valid deposit without revealing which one

If your deposit gets rejected, you can ragequit and publicly reclaim your funds. On mainnet, you can include some ETH for gas with your withdrawal. The key difference between Privacy Pools and Tornado Cash is the ASP. It maintains a list of approved deposits, keeping potentially illicit funds out of the pool. Privacy Pools lets you prove you're not associated with sanctioned funds.

Similar to Tornado, it is probably prudent to not withdraw instantly, don't withdraw the exact amount, and use a fresh, non ENS tied wallet.

TVL is at ~$3.2M and I expect it to grow as more people realise compliant privacy is possible.

![Privacy Pools TVL](/img/a-year-of-privacy/yofpp.jpeg)

**Hyperliquid**

Now I have a fresh wallet with no history, and no connection to me, I can lose money privately on Hyperliquid.

Hyperliquid is, in case you've been living under a rock, (the best) decentralised perps exchange. No KYC, no account sign up, just the ability to trade on leverage. For a europoooor like myself, finding an exchange to trade on is impossible due to ESMA rulings, so Hyperliquid is the perfect home.

No one knows my positions, no CEX freezing my account due to a VPN, no data breach exposing my trading history alongside my home address.
`;

  const contentPart2 = `
**HoudiniSwap**

Instead of losing money privately, I also want to buy spot tokens and become an investoooor. HoudiniSwap is a non-custodial aggregator with a private mode, over 61% of the $2.4bn volume was routed privately. It routes transactions through multiple non-custodial exchanges with a randomly selected L1 in between, breaking onchain links between sender and receiver. The exchanges used use single-use wallet addresses, and neither see the full picture. HoudiniSwap is also compliant. They never touch your funds, their exchange partners are curated and require industry standard AML systems, and your transaction data is deleted after 72 hours.

It's also my favourite way to purchase Monero. I could use MEXC, but they're a CEX which means you could be tracked. Monero is the privacy coin that actually works; with private transactions by default and no wallet tracking. It continues to be the best coin to hold if you believe in privacy.

![Houdini Analytics](/img/a-year-of-privacy/yofhs.jpeg)

### The Last Mile

After longing $ETH or purchasing some pre-pump $XMR, I need some fiat to purchase things for my soon-to-be-born child. It's time to swap back to USDC, and deposit into ZKP2P.

Providing liquidity is incredibly easy, you just deposit USDC, choose where you want the fiat (Cash App, Revolut, Venmo, etc.), set your rates, and wait for a buyer. They send the fiat, prove the payment, and unlock the USDC. There is no CEX knowing what wallets I control, no questions about source of funds, no information to be leaked for a wrench attack list.

The offramp isn't instantaneous, but the average wait time is between ~8-24 hours depending on the spread. If you don't want to manage the rates and stay competitive, you can use Delegate by USDCtoFiat, which uses an algo to adjust your rates based on market conditions. Your funds stay in the non-custodial ZKP2P smart contract, the bot can only adjust rates. Set it and forget it.

The same method that kept me private onramping, keeps me private offramping.

Privacy is normal. The tools exist. Use them.
`;

  const fullContent = contentPart1 + contentPart2;

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
              <span className="blog-read-time">{calculateReadTime(fullContent)}</span>
            </div>
          </div>

          <div className="blog-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{contentPart1}</ReactMarkdown>
            <TweetEmbed tweetUrl="https://x.com/unhappyben/status/2014188701073477896" />
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{contentPart2}</ReactMarkdown>
          </div>
        </div>
      </main>
    </Layout>
  );
}
