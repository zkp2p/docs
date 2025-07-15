import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './index.module.css';

function HomepageHero() {
  return (
    <div className={styles.heroContainer}>
      <h1 className={styles.heroTitle}>
        ZKP2P Documentation
      </h1>
      <p className={styles.heroSubtitle}>
        A fast, permissionless fiat ↔ crypto on/offramp protocol powered by zero-knowledge proofs
      </p>
    </div>
  );
}

function FeatureCard({ title, description, link, icon }) {
  return (
    <Link to={link} className={styles.featureCard}>
      <div className={styles.featureIconWrapper}>
        <div className={styles.featureIcon}>{icon}</div>
      </div>
      <h3 className={styles.featureTitle}>{title}</h3>
      <p className={styles.featureDescription}>{description}</p>
    </Link>
  );
}

function HomepageFeatures() {
  const features = [
    {
      title: 'Use ZKP2P',
      description: 'Learn more about ZKP2P and get started as a buyer or seller on the platform.',
      link: '/guides/introduction/zkp2p',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <path d="M12 6v6l4 2"></path>
        </svg>
      ),
    },
    {
      title: 'Integrate ZKP2P',
      description: 'Guide for integrating ZKP2P on/offramp into your application.',
      link: '/developer/integrate-zkp2p',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
      ),
    },
    {
      title: 'The ZKP2P Protocol',
      description: 'Learn about the architecture of the ZKP2P Protocol.',
      link: '/protocol/smart-contracts',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
          <path d="M2 17l10 5 10-5"></path>
          <path d="M2 12l10 5 10-5"></path>
        </svg>
      ),
    },
  ];

  return (
    <div className={styles.features}>
      <div className={styles.container}>
        <div className={styles.featureGrid}>
          {features.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} />
          ))}
        </div>
      </div>
    </div>
  );
}

function QuickLinks() {
  const links = [
    {
      title: 'Quick Start',
      items: [
        { label: 'Complete Onboarding Guide', link: '/guides/for-buyers/complete-guide-to-onboarding' },
        { label: 'Provide Liquidity', link: '/guides/for-sellers/provide-liquidity-sell-usdc' },
        { label: 'Integration Guide', link: '/developer/integrate-zkp2p/integrate-onramp' },
      ],
    },
    {
      title: 'Key Concepts',
      items: [
        { label: 'What is ZKP2P?', link: '/guides/introduction/zkp2p' },
        { label: 'Smart Contracts', link: '/protocol/smart-contracts' },
        { label: 'Security & Privacy', link: '/protocol/security' },
      ],
    },
  ];

  return (
    <section className={styles.quickLinks}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Popular Resources</h2>
        <div className={styles.linksGrid}>
          {links.map((section, idx) => (
            <div key={idx} className={styles.linkSection}>
              <h3 className={styles.linkSectionTitle}>{section.title}</h3>
              <ul className={styles.linkList}>
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <Link to={item.link} className={styles.linkItem}>
                      {item.label} →
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CommunitySection() {
  const communityLinks = [
    { label: 'GitHub', href: 'https://github.com/zkp2p', icon: '🐙' },
    { label: 'Telegram', href: 'https://t.me/zkp2p', icon: '💬' },
    { label: 'Twitter', href: 'https://twitter.com/zkp2p', icon: '🐦' },
  ];

  return (
    <section className={styles.community}>
      <div className={styles.container}>
        <h2 className={styles.sectionTitle}>Join the Community</h2>
        <div className={styles.communityGrid}>
          {communityLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className={styles.communityCard}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className={styles.communityIcon}>{link.icon}</span>
              <span className={styles.communityLabel}>{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Documentation"
      description="ZKP2P - The permissionless fiat ↔ crypto ramp">
      <main>
        <section className={styles.hero}>
          <HomepageHero />
          <HomepageFeatures />
        </section>
        <QuickLinks />
        <CommunitySection />
      </main>
    </Layout>
  );
}