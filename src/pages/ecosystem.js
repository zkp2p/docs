import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';

const projects = [
  {
    name: 'USDCtoFiat',
    description: 'Convert USDC to fiat currencies through non-custodial smart contracts on Base. Supports USD, EUR, and GBP via Venmo, PayPal, Revolut, Wise, Zelle, and CashApp.',
    href: 'https://usdctofiat.xyz',
    logo: '/img/ecosystem/usdctofiat.png',
  },
  {
    name: 'Peerlytics',
    description: 'Analytics dashboard and explorer for the ZKP2P protocol. Search addresses, transactions, and deposit IDs. Track volume, active traders, liquidity depth, and currency breakdowns.',
    href: 'https://peerlytics.xyz',
    logo: '/img/ecosystem/peerlytics.svg',
  },
  {
    name: 'Peer Domains',
    description: 'Register .peer domain names on Ethereum. Mint Peer Cards, customizable NFT identity cards with transaction history, social links, and Peerlytics integration.',
    href: 'https://peer.domains',
    logo: '/img/ecosystem/peerdomains.svg',
  },
  {
    name: 'Bread',
    description: 'A worker-owned cooperative building financial solidarity tools. Bake $BREAD, a stablecoin pegged 1:1 to USD, to fund community projects, group savings, and mutual aid.',
    href: 'https://bread.coop',
    logo: '/img/ecosystem/bread.svg',
  },
  {
    name: 'Zagnu',
    description: 'Airbnb, but for your Venmo account. Provide liquidity and earn yield from verified buyers, built on Peer contracts.',
    href: 'https://zagnu.com',
    logo: '/img/ecosystem/zagnu.png',
  },
];

function EcosystemCard({ name, description, href, logo }) {
  return (
    <a
      href={href}
      className="ecosystem-card"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="ecosystem-card__logo-wrapper">
        <img
          src={logo}
          alt={`${name} logo`}
          className="ecosystem-card__logo"
          width="40"
          height="40"
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="ecosystem-card__content">
        <h3 className="ecosystem-card__name">{name}</h3>
        <p className="ecosystem-card__description">{description}</p>
      </div>
      <div className="ecosystem-card__link">
        <span>{new URL(href).hostname}</span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="7" y1="17" x2="17" y2="7"></line>
          <polyline points="7 7 17 7 17 17"></polyline>
        </svg>
      </div>
    </a>
  );
}

export default function Ecosystem() {
  return (
    <Layout
      title="Ecosystem"
      description="Projects and tools built on and around the Peer protocol.">
      <Head>
        <meta property="og:title" content="Peer Ecosystem" />
        <meta property="og:description" content="Projects and tools built on and around the Peer protocol." />
        <meta property="og:image" content="https://docs.peer.xyz/img/link-preview.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Peer Ecosystem" />
        <meta name="twitter:description" content="Projects and tools built on and around the Peer protocol." />
        <meta name="twitter:image" content="https://docs.peer.xyz/img/link-preview.png" />
      </Head>
      <main className="ecosystem-page">
        <div className="container">
          <div className="hero-section">
            <h1>Ecosystem</h1>
            <p className="hero-description">
              Projects and tools built on and around the Peer protocol.
            </p>
          </div>

          <div className="ecosystem-grid">
            {projects.map((project) => (
              <EcosystemCard key={project.name} {...project} />
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
