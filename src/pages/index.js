import React from 'react';
import clsx from 'clsx';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Head from '@docusaurus/Head';
import styles from './index.module.css';

function HomepageHero() {
  return (
    <div className={styles.heroContainer}>
      <h1 className={styles.heroTitle}>
        Welcome to ZKP2P Docs
      </h1>
      <p className={styles.heroSubtitle}>
        Fast, permissionless fiat ↔ crypto on/offramp protocol powered by ZK
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
      link: '/developer/integrate-zkp2p/integrate-redirect-onramp',
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
      link: '/protocol/developer-v2-protocol',
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

function CommunitySection() {
  const communityLinks = [
    { 
      label: 'Twitter', 
      description: 'Follow us for updates and announcements',
      href: 'https://twitter.com/zkp2p',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
        </svg>
      )
    },
    { 
      label: 'Telegram', 
      description: 'Join our community discussions',
      href: 'https://t.me/zk_p2p',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="90 90 330 330"
          fill="currentColor"
        >
          <path d="M109.5 250.5l283.4-117.7c11.2-4.7 21.7 2.7 18.1 19.7l-48.2 226.7c-2.9 13.5-11.2 16.8-22.7 10.5l-63-46.6-30.4 29.3c-3.4 3.4-6.2 6.2-12.7 6.2l4.5-63.3 115-104.1c5-4.5-1.1-7-7.8-2.5l-142 89.2-61.2-19.1c-13.3-4.1-13.5-13.3 2.8-19.7z" />
        </svg>
      )
      
      
    },
    { 
      label: 'GitHub', 
      description: 'View all ZKP2P repositories',
      href: 'https://github.com/zkp2p',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
        </svg>
      )
    },
  ];

  return (
    <section className={styles.community}>
      <div className={styles.container}>
        <div className={styles.communityGrid}>
          {communityLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              className={styles.communityCard}
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className={styles.communityIconWrapper}>
                {link.icon}
              </div>
              <div className={styles.communityContent}>
                <span className={styles.communityLabel}>{link.label}</span>
                <span className={styles.communityDescription}>{link.description}</span>
              </div>
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
      <Head>
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://docs.zkp2p.xyz" />
        <meta property="og:title" content="ZKP2P Documentation" />
        <meta property="og:description" content="The permissionless fiat ↔ crypto ramp" />
        <meta property="og:image" content="https://docs.zkp2p.xyz/img/brand-kit/logo.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="ZKP2P Docs" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://docs.zkp2p.xyz" />
        <meta name="twitter:title" content="ZKP2P Documentation" />
        <meta name="twitter:description" content="The permissionless fiat ↔ crypto ramp" />
        <meta name="twitter:image" content="https://docs.zkp2p.xyz/img/brand-kit/logo.png" />
        <meta name="twitter:site" content="@zkp2p" />
        <meta name="twitter:creator" content="@zkp2p" />
      </Head>
      <main>
        <section className={styles.hero}>
          <HomepageHero />
          <HomepageFeatures />
        </section>
        <CommunitySection />
      </main>
    </Layout>
  );
}