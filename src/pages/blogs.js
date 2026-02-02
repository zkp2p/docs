import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';

// Simple date formatting
const formatDate = (dateString) => {
  const date = new Date(`${dateString}T00:00:00Z`);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  });
};

export default function Blogs() {
  const blogPosts = [
    {
      title: 'Introducing ZKP2P V3',
      excerpt: 'Since launching V2 in February, we\'ve grown from $30k to $300k weekly volume and hit $1M+ monthly. V3 scales the protocol with modular smart contracts, flexible verification, and better UX for buyers, liquidity providers, and developers.',
      date: '2025-11-03',
      readTime: 5,
      image: '/img/v3/v3-header.png',
      link: '/blog/intro-zkp2p-v3'
    },
    {
      title: "Speed Doesn't Always Need To Cost?",
      excerpt: 'After analysing 4,000+ trades: faster trades dont necessarily comes with high costs. Quick trades can be cheap and slow trades aren\'t always profitable.',
      date: '2025-08-06',
      readTime: 8,
      image: '/img/spreadvspread/speedheader.jpeg',
      link: '/blog/speed-doesnt-always-need-to-cost'
    },
    {
      title: 'Max Account Abstraction',
      excerpt: 'From $WLD to $USDC to Real World Value, all in one tap. Many users of World receive their Universal Basic Income (UBI) denominated in World token ($WLD).',
      date: '2024-07-24',
      readTime: 4,
      image: '/img/accountabstraction/MAAHeader.jpeg',
      link: '/blog/max-account-abstraction'
    },
    {
      title: 'ZKP2P x Hyperliquid',
      excerpt: 'Historically, Binance has been the default gateway for users entering crypto; to purchase tokens, either via a CEX or peer-to-peer, and then staying to trade on their perpetual exchange. The stack is integrated and easy to use, but it is centralised, permissioned, and opaque.',
      date: '2024-07-15',
      readTime: 4,
      image: '/img/zkp2pxhl/zkp2phlheading.jpeg',
      link: '/blog/zkp2p-x-hyperliquid'
    },
    {
      title: 'ZKP2P and Banking',
      excerpt: 'In a world where crypto users get de-banked, we\'ve heard a lot of questions like "Will Wise close my account if I use ZKP2P?" The short answer is they shouldn\'t, ',
      date: '2024-06-05',
      readTime: 4,
      image: '/img/banking/bankingheader.jpeg',
      link: '/blog/zkp2p-and-banking'
    },
    {
      title: 'Airbnb, but for Your Money',
      excerpt: 'Airbnb transformed how we travel, we stopped staying in boring hotel rooms or paying for a late checkout. Suddenly, you could book homes, apartments or even castles, with a kitchen, garden or desk with a view. ',
      date: '2024-05-20',
      readTime: 4,
      image: '/img/airbnb/airbnbforyourmoney.jpeg',
      link: '/blog/airbnb-but-for-your-money'
    },
    {
      title: 'Introducing ZKP2P V2',
      excerpt: 'Today, we\'re launching ZKP2P V2, the next version of our decentralized on/offramp protocol. Swap to ETH, USDC, Solana, memecoins and more using Venmo, Cashapp, Wise or Revolut–with no fees, no intrusive identity verification and near-instant settlement.',
      date: '2024-02-05',
      readTime: 6,
      image: '/img/backgrounds/background.png',
      link: '/blog/intro-zkp2p-v2'
    }
  ];

  return (
    <Layout
      title="Blogs"
      description="Latest insights, updates, and stories from the Peer team building the permissionless fiat ↔ crypto exchange.">
      <main className="blogs-page">
        <div className="container">
          <div className="hero-section">
            <h1>Peer Blog</h1>
            <p className="hero-description">
              Stay updated with insights, technical deep dives, and community stories 
              from the team building Peer.
            </p>
          </div>

          <div className="blogs-grid">
            {blogPosts.map((post) => (
              <Link key={post.link} to={post.link} className="blog-post-card">
                <div className="post-header">
                  {post.image && (
                    <img 
                      src={post.image} 
                      alt={`${post.title} header image`}
                      className="post-image"
                      loading="lazy"
                      decoding="async"
                      width="1200"
                      height="630"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  )}
                  <div className={`image-placeholder ${post.image ? 'fallback' : ''}`}>
                    <svg aria-hidden="true" focusable="false" width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
                    </svg>
                  </div>
                </div>
                <div className="post-content">
                  <div className="post-meta">
                    <span className="post-date">{formatDate(post.date)}</span>
                    <span className="post-read-time">{post.readTime} min read</span>
                  </div>
                  <h3 className="post-title">{post.title}</h3>
                  <p className="post-excerpt">{post.excerpt}</p>
                  <div className="post-link">
                    <span>Read more</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
