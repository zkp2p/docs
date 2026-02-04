import React from 'react';
import Layout from '@theme/Layout';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

export default function HowIMade152APY() {
  const post = {
    title: 'How I Made 152% APY on Stablecoins',
    date: '2026-01-08',
    excerpt: 'I generated $12.7K yield over 9 months, on an average deposit size of $6.3K; that\'s 152% APY on USDC. No ponzinomics, degen farming, leverage, or token farming. Just a loop.',
    content: `
I generated $12.7K yield over 9 months, on an average deposit size of $6.3K; that's 152% APY on USDC.

No ponzinomics, degen farming, leverage, or token farming. Just a loop.

### The Strategy

If you don't know, ZKP2P is a permissionless, non-custodial peer-to-peer protocol. It is a bulletin board for users with a coincidence of wants, those with fiat who want crypto, and those who want fiat and have crypto.

You deposit USDC into a vault, choose your payment platforms, set your rates, and wait patiently for someone to match your order. The rates set (EUR/USDC, for example) are higher than the actual market rate, and this is where the yield is generated. Once someone comes along who has fiat and wants crypto, you receive fiat in Revolut, Wise, or PayPal and they get the USDC. Unlike traditional peer-to-peer sites, ZKP2P is powered by zero-knowledge proofs, meaning that the buyer proves that they sent fiat and unlocks the USDC atomically, even if you're afk.

Once I have the fiat, I consolidate through Revolut, and then move the money back onchain via Monerium. This process is pretty instant in Europe, with all platforms using SEPA instant transfer. I swap EURe to USDC on Gnosis, Arbitrum, Mainnet, Polygon, or (even) Linea, depending on the rate. [I built a scriptable widget so that I can always see which chain has the best rates.](https://github.com/unhappyben/eur-usdc-widget)

Once I've swapped EURe to USDC, I bridge to Base and redeposit into ZKP2P. I did most of my liquidity providing on ZKP2P V2, so each time I had to open a new vault and reconfigure everything. ZKP2P V3 lets you redeposit into the same vaults each time, which makes looping *much* easier.

![Capital Loop Cycle](/img/how-i-made-152-apy/cycle.jpeg)

I did this loop 276 times over 9 months, and usually spent 10 minutes to an hour based on the volume I did and how much free time I had.

Across all of my wallets, with an average deposit size of ~$6.3k, the looping generated $1.57M in volume, $12.7K in yield, over 894 orders, leading to an APY of 152%.

![Performance Stats](/img/how-i-made-152-apy/stats.jpeg)

32% of my cycles were completed in under 6 hours, and this let me cycle capital twice or three times per day. When people want to onramp, liquidity providers who can meet the demand eat *very* well.

In March, you could charge 2-3% spread on EUR and 1.5% on USD quite easily; they have compressed to 0.5-1% as competition increases. That is not a problem; the market is maturing and there is still plenty of money to be made. More liquidity leads to tighter spreads. Tighter spreads lead to more users. More users lead to more volume. More volume leads to more yield for liquidity providers, even at lower margins. ZKP2P processed over $20M of volume in 2025, and the volume will only continue to increase in 2026.

### Risks

There is no such thing as a free lunch, and there are obviously risks involved, especially with losing access to accounts. I didn't really use PayPal or Wise outside of providing liquidity, and now I can't as both my accounts have been closed. Despite hiring a [digital assets product lead](https://www.linkedin.com/posts/matthew-salisbury-b6726a12_wanted-a-product-lead-in-the-digital-assets-activity-7382419731896647680-HBxe/), Wise are still *very* anti-crypto, but the landscape is shifting fast, and there's always a new payment method around the corner.

### Future

I started in March as a user of ZKP2P, and in July I joined the team. I believe that ZKP2P will be the default gateway to onramp and offramp. Privacy preserving, non-custodial, and permissionless. The infrastructure is there, the demand is growing, and liquidity is scaling.

The CEX-free stack is already live.

It's time to fully embrace peer-to-peer trading.

Do not fear, peer-to-peer.
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
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
          </div>
        </div>
      </main>
    </Layout>
  );
}
