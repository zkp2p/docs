import React from 'react';
import Layout from '@theme/Layout';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const VideoEmbed = ({ src, caption }) => (
  <div className="video-container" style={{ margin: '2rem 0' }}>
    <video
      controls
      autoPlay
      muted
      loop
      playsInline
      style={{
        width: '100%',
        maxWidth: '800px',
        borderRadius: '12px',
        display: 'block',
        margin: '0 auto'
      }}
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
    {caption && (
      <p style={{ textAlign: 'center', color: 'var(--peer-ash-gray)', marginTop: '0.5rem', fontSize: '0.875rem' }}>
        {caption}
      </p>
    )}
  </div>
);

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

export default function ZKP2PIsNowPeer() {
  const post = {
    title: 'ZKP2P is now Peer: Finance for Humans',
    date: '2026-02-05',
    excerpt: 'ZKP2P started as a proof of concept during ZKHack in 2023. As zero-knowledge technology has matured, our focus has expanded from the technology to the people using it. Today, we become Peer.',
  };

  const contentPart1 = `
ZKP2P started as a proof of concept during ZKHack in 2023. In 2024, we were pushing the boundaries of zero-knowledge technology with [TLSNotary](https://tlsnotary.org/), [zkemail](https://zk.email/), and [PSE](https://pse.dev/). The name reflected our technical roots. As zero-knowledge technology has matured, our focus has expanded from the technology to the people using it.

**Today, we become Peer.**

Peer expresses exactly who we are and what we stand for: technology made simple, finance made fair. While the systems we build are complex, our mission is simple: making money move directly between people.
`;

  const contentPart2 = `
## Built for freedom, fairness, and simplicity

**Freedom, always.**

Peer is non-custodial and permissionless. We never hold your funds or see your identity. There are no middlemen or institutions deciding if you're allowed to participate.

You're sending payments to verified accounts on regulated payment rails. You receive crypto directly from a smart contract.

Your money. Your keys. Your choice.

**Fair, Efficient & Simple**

Crypto shouldn't feel complex or corporate. Peer is clear, human, and even a little delightful. No middlemen means tight spreads and low fees. No extra verification. No waiting days for your money to clear.

We don't harvest your data, we connect peers.

## Security without friction

This rebrand doesn't change our underlying cryptographic technology. Peer remains decentralized and non-custodial. Our system uses advanced cryptography to keep you safe, but we've designed the experience so you never have to think about it.

Your data stays private, no ID is stored, and your money moves with quiet certainty. We're building without adding friction or taking away control from users.
`;

  const contentPart3 = `
## Any Currency. Any Coin. Anywhere.

Wherever you are, whatever you trade, Peer makes it simple. Borderless, peer-to-peer, open to everyone.

We aren't just changing a name. We're building a new standard for freedom and fairness in finance.

Choose peers, not platforms.

Welcome to Peer.

[Explore our brand kit](/brand-kit/)
`;

  const fullContent = contentPart1 + contentPart2 + contentPart3;

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
            <img
              src="/img/zkp2p-is-now-peer/header.png"
              alt="Peer logo"
              style={{
                width: '100%',
                maxWidth: '800px',
                borderRadius: '12px',
                margin: '0 auto 2rem',
                display: 'block'
              }}
            />

            <ReactMarkdown remarkPlugins={[remarkGfm]}>{contentPart1}</ReactMarkdown>

            <VideoEmbed src="/videos/zkp2p-is-now-peer/brand-launch.mp4" />

            <ReactMarkdown remarkPlugins={[remarkGfm]}>{contentPart2}</ReactMarkdown>

            <VideoEmbed src="/videos/zkp2p-is-now-peer/coin-exchange.mp4" />

            <ReactMarkdown remarkPlugins={[remarkGfm]}>{contentPart3}</ReactMarkdown>
          </div>
        </div>
      </main>
    </Layout>
  );
}
