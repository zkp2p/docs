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

export default function MaxAccountAbstraction() {
  const {siteConfig} = useDocusaurusContext();
  
  const post = {
    title: 'Max Account Abstraction',
    date: '2024-07-24',
    excerpt: 'From $WLD to $USDC to Real World Value, all in one tap. Many users of World receive their Universal Basic Income (UBI) denominated in World token ($WLD).',
    content: `
## From $WLD to $USDC to Real World Value, all in one tap.

Many users of World receive their Universal Basic Income (UBI) denominated in World token ($WLD). For most, there is no native way to receive the UBI into their local bank account, and bridging, swapping, and offramping can be a long, slow, confusing process. Users give their funds and trust to third party custodians, and hope they can match them with a reputable seller and resolve disputes effectively.

Having to jump between the World App, Binance P2P and ensure you are depositing to the right address can be time consuming and stressful. Combine this with high fees and bad rates, and they are paying to spend their UBI on goods they need to survive.

Using Daimo's Mobile SDK, ZKP2P eliminates all the friction making it possible to:

- Swap your $WLD to $USDC
- Bridge $USDC to Base
- Deposit it in a ZKP2P vault ready to be sold for pesos

All in one tap.

The Mini App users list their USDC at a discount range between 3-5% based on size, incentivising takers to send pesos. This creates a two sided benefit; Argentinians looking to onramp gain access to discounted USDC and those offramping enjoy faster settlement. We expect users to go from $WLD to Pesos in ~15 minutes or less.

Comparing the two flows, Binance P2P has eight offramping steps, additional verification, and waiting for a buyer to come and take their offer. ZKP2P has 3 steps, with the most difficult condensed into a single tap. We then utilise our Telegram bot to alert our buyers to take the order. All of this happens in the World Mini App, users never have to leave the app they're comfortable using.

![argentina](/img/accountabstraction/Argentina.jpeg)

#### Ecosystem Maturity

Chain abstraction is no longer a nice to have, it is foundational to onboard new users. Chain agnostic payments, SDKs, and real time webhooks are making this easier and easier; here is how we achieved our Max Account Abstraction:

#### Unified Payment Intent Layer

Much like a Customer Data Platform in traditional business, all of our user actions are mapped to a single intent that unifies the on and off chain world. This allows us to coordinate complex and multi step processes atomically and invisibly to the user.

#### Abstracted Cross Chain Conversion

Users don't have to choose or know what chain they are on, worry about getting the URLs and wallet address correct. Our backend logic handles the asset movement and validation across networks. Much like TradFi transactions, they tap once and wait for the funds to arrive.

#### Webhook-Driven Settlement

Most dApps expose confirmation latency to users through the frontend, we rely on backend events to drive state changes. Shifting from polling to push based architecture, we've created a payment experience that feels instant even when it is not.

#### Chain-Agnostic Identity

Users are no longer tied or constrained to specific chains or wallets. We've fully decoupled their normal onchain identity from network context, they're simply recognized as users with a verified intent.

#### Caching & Resilience

To ensure a fast and smooth experience, even on low spec devices and in low bandwidth environments, we cache data briefly, use ephemeral logic to prevent duplicate processing, and handle repeated requests efficiently without impacting the user.

Much like the orchestra below the stage, all the hard work and complexity happens behind the scenes, our user just sees the performance.

## What does this mean for the future?

World's Universal Basic Income were just speculative token grants, but now they become spendable income that make a real difference in peoples lives. ZKP2P transforms crypto from something you hold (and speculate on) into something you can use.

By abstracting away the complexity of chains, swaps, bridges, and confirmations, we're pioneering the way to making crypto accessible for the next generation of users (aka we suffered so you don't have to!).

This World Mini App model isn't limited to Argentina, and can be seamlessly rolled out to other markets. It also isn't limited to World, it's the blueprint for chain-agnostic offramps anywhere that people need them. With one tap, someone can go from onchain assets to real world assets, non-custodially, permissionlessly, and fast.

Max Account Abstraction makes crypto disappear, leaving global, instant, permissionless value transfer.
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