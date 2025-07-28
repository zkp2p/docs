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

export default function AirbnbButForYourMoney() {
  const {siteConfig} = useDocusaurusContext();
  
  const post = {
    title: 'Airbnb, but for Your Money',
    date: '2024-05-20',
    excerpt: 'Airbnb transformed how we travel, we stopped staying in boring hotel rooms or paying for a late checkout. Suddenly, you could book homes, apartments or even castles, with a kitchen, garden or desk with a view.',
    content: `
Airbnb transformed how we travel, we stopped staying in boring hotel rooms or paying for a late checkout. Suddenly, you could book homes, apartments or even castles, with a kitchen, garden or desk with a view. Airbnb facilitated the trade between people who wanted a room and people who had a room. ZKP2P is doing the same for on chain money.

Stablecoins are becoming mainstream, adding over $110 billion to their market cap in the last 12 months. Everyone is trying to get a piece of the pie, but bringing them on and off chain fast, privately, and easily is still lacking. ZKP2P is becoming more than a marketplace, a "Capital as a Service" , a way that users can bring their idle money to earn better than TradFi yield, and bring their earned yield off-chain to meet their real world needs.

ZKP2P isn't building a bank, it's creating a permissionless protocol to match people who need capital with those who have capital; unreliant on institutions. Think of it as an order book of intents, every user becomes a market maker setting their own spread, payment method, and risk profile dependent on their own needs. Similar to how Airbnb lets users set price, dates, rules and availability, ZKP2P facilitates the interaction between capital s and seekers matching based on intents.

This order book of intents design unlocks fast, private, and borderless capital movement from day one. Unlike traditional fintechs like Wise, Revolut, or Moonpay who rely on banking integrations, regulations and licenses, ZKP2P doesn't suffer from the same slow, institutional bottlenecks.

These platforms charge significant (sometimes hidden) fees for the privilege of on-ramping or swapping your own money, that mean you receive a significantly worse deal. ZKP2P doesn't charge fees, but capital s earn the spread charged versus the market exchange rate and even at ~3% spread, buyers often receive more money on chain than via traditional onramps.

## Breaking Down the Cost to On-Ramp

![fees](/img/airbnb/fees.jpeg)

## Fees aren't the only cost

We've seen Coinbase suffer a data breach where ~1% of their users data was leaked; Name, Addresses, Phone Numbers, ID Photos, Bank Details, and Transaction History. These users are now on a literal wrench list with their most sensitive data available to anyone. This is an overlooked risk, when platforms require custody of your data and your money. They can freeze your funds. They can suffer a data breach. And you're left exposed with minimal protections.

ZKP2P leverages zero-knowledge proofs verifying data that matters; Date, Payment Amount, Hashed Recipient ID, and Currency, whilst protecting sensitive personal data. This results in a protocol that is open to anyone, anywhere, permissionlessly.

## Onramp the ZKP2P Way

Traditional remittance isn't any better, Banks, Moneygram and Western Union, are slower, expensive and have opaque rules. Whilst interviewing some of our users, they told us about getting cash to his foreign registered Coinbase account from the US. To even get to the on-ramp stage, he has to :

1. Convert USD to EUR
2. Wire EUR to his Foreign Bank
3. Wait for deposit to be credited
4. Send EUR to Coinbase
5. Wait for deposit to be credited
6. Buy Crypto
7. Withdraw on-chain

That's a seven step process, across multiple institutions with fees and delays - "sometimes it can take 2 weeks" - just to get their own money on-chain. They admit that they could solve these problems, but they are bureaucratic and time consuming and not what you want to waste your time on.

![fees](/img/airbnb/onboaridingflow.jpeg)

With ZKP2P, they can simply look at the liquidity page, decide which offer they want to take in which currency, send the counterparty the currency, prove the transaction (with zero knowledge), and receive USDC on-chain in an average of 2 minutes and 33 seconds. Western Union and Moneygram revolutionised send money across border, Wise and Revolut came next, and now it is ZKP2P time to do the same.

Liquidity s aren't chasing ponzi yields or points on new stablecoins, they're earning real yield on their stablecoins that would usually flow to large companies like Moonpay or Revolut. Buyers are the same, they aren't giving away sensitive information alongside the privilege to pay extortionate fees, they're settling with their peers instantly and on their own terms. It passes through traditional bottlenecks of waiting to receive your money, capital flows to where it is wanted, generating returns for those provide and liquidity for those who need it.

Airbnb reimagined hotels. Uber reimagined taxis. ZKP2P is reimagining capital as something you can share and earn from privately and without permission.
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