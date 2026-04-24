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

export default function DoNotFearPeerToPeer() {
  const post = {
    title: 'Do Not Fear, Peer to Peer: How P2P Money Always Finds a Way',
    date: '2025-12-31',
    excerpt: 'A ~1,200 year journey from trusting your friend to trusting the tech. From hawala to the Knights Templar to ZKP2P.',
    content: `
### The Trust Era

It's the 8th century, you're a Silk Road merchant standing in a bustling Grand Bazaar having just sold your wares for gold pieces. You need to pay your supplier in Canton, but the road is 4,000 miles, filled with bandits, and endless desert. Thankfully, a hawaladar approaches you, offering to take your gold pieces here, and their trusted partner will pay your supplier in Canton. Hawala is born. A peer to peer network born out of necessity, and built not on technology, but on trust.

Moving further into the future, the Knights Templar have the same problem during the Crusades. They can't carry gold and silver to Jerusalem, with many Crusaders being killed before they even reached the Holy Land. They deposited their gold and silver into Templar Preceptory, and received an encrypted letter of credit, which could be used to withdraw their wealth in Jerusalem. The encryption used was reportedly sophisticated for the 12th century, and the Crusaders managed to move value through a trusted network with ease. Unlike the merchant in Baghdad, in 1307, King Philip IV had borrowed too much money from the Templars, arrested, tortured and forced a confession of heresy, seizing their wealth and wiping his debts. Probably the first account of a rug pull, and why custody of your assets is so important.

### The Corporations are coming

The 19th and 20th century brings a new *corporate* Hawala. Western Union is born, monopolises remittances, and max value extracts from immigrants who are sending money home. SWIFT arrives in 1973 as the "official" international transfer network, but only if you're wealthy. You need to pay a bank fee, exchange rate markup, receiving fee, and significant delays in delivering the funds. The official centralised system becomes predatory, and hawala persists despite being illegal and frowned upon in many markets.

This *primitive* system didn't just survive, it thrived, providing a lifeline for millions locked out of the financial system. Every Western Union office had a hawaladar operating close by, offering better rates, faster service, and no questions asked.

Authorities aggresively targeted these *unregulated* lifelines as breeding grounds for money laundering. Whilst the hawaladar's were hunted, the official system was facilitating the same activity on a global scale. In 1974, Franklin National collapsed, a bank hijacked by a Mafia-linked financier to move illicit funds, and the rise of BCCI, operating a *hidden* $20 billion criminal enterprise disguised as bank, proved that a banking license was often just a shield. As long as you had the correct paperwork, the state was *fine* with criminals using the official system.

### The Digital Revolution

It's just before the turn of the millenium, David Chaum was building DigiCash. It was a promise of true anonymous electronic cash, governments couldn't freeze your funds and banks couldn't track your purchases. You would purchase the DigiCash from the bank, this would placed in a "box" and anonymised. You were then free to use the cash on everyday purchases. David Chaum was prophetic, but during the eCommerce boom, consumers didn't care for DigiCash and only two banks (The Mark Twain Bank in the US and Deutsche Bank in Germany) adopted it. He also rejected a $100 million from Microsoft because he felt the sum was too low. DigiCash was cryptographically sound, but the banks didn't want to enable their obsolence. Your data is still their most valuable asset.

Digital gold is starting to become popular now, but e-gold was the first to do it. Your account was backed by physical gold in vaults, and was freely transferable to anyone globally. By the mid noughties it was processing $2 billion dollars annually, unfortunately it was working too well. Anyone could use the service, including those the US government didn't like, the feds raided them, and that was the end of e-gold.

### The Corporations Come (again)

Confinity was the company behind PayPal, and their original vision was to do with PalmPilots and cryptography. Imagine a world where you could beam money to your friends on your PalmPilot using infrared, and no banks needed. An incredible innovation in mobile payments, except for the fact PalmPilots were not popular enough. For a brief period of time in 1999, the future had arrived, PayPal. A frictionless, borderless, peer to peer money system, where you could email money to anyone. They needed banking and regulation partnerships, which added more and more restrictions, and by 2002, PayPal wasn't a disruptor but another bank.

Liberty Reserve tried to follow in e-golds footsteps, and their mistakes. It was based in Costa Rica, and served millions of users, allowing them to send money with a name, email address, and date of birth. Liberty reserve took your funds, swapped them into Liberty Dollars or Euros (the first stablecoins?) which were pegged to the dollar, euro, or gold. These could then be redeemed by merchants or receipients for the underlying. Like the others, this was also killed my the US government.

### Enter Bitcoin

Bitcoin solved the trust problem, but not the onramp problem. You could trustlessly send bitcoin across the world, but you still needed to buy it from someone. In 2012, LocalBitcoins (RIP) was launched, you could meet strangers from the internet and trade cash for bitcoin. This cash for crypto was revolutionary, but dangerous. Stories of robbery, kidnapping, and stings arose, and the physical meeting became a point of failure. No one wants to get mugged in a Walmart parking lot.

Bisq, Paxful, and HodlHodl all launched and built peer to peer exchanges. Bisq and HodlHodl went the non-custodial route, and Paxful is one of the biggest custodial P2P exchanges in the world. One of the main issues at this time was liquidity, without market makers, spreads were huge and decentralised P2P exchanges looked impossible.

It's now 2019, and Binance P2P was created. Massive liquidity, tight spreads, and near instant trades. Too good to be true? Unfortunately, yes. You needed to KYC, Binance held the funds in escrow, controlled disputes, freeze accounts, and track your trades. Crypto's peer to peer ecosystem had gone from something different and exciting from a bank to a system that replicated them. We'd spent the last 20 years trying to create a better system than our traditional banks, only to recreate them under a different name.

### The Answer

Between 2019 and now, zero knowledge proofs had matured and become production ready technology. Combined with the boom in payment platforms like Wise, Revolut, and Venmo, someone just needed to put the pieces together.

ZKP2P is what comes after hawala, which needed a trusted middleman. ZKP2P is an infrastructure layer, similar to how Uber doesn't own cars or Airbnb doesn't own homes. Users with a coincidence of wants settle directly with each other through payment rails that already handle compliance. ZKP2P is fully non-custodial, leveraging existing compliance frameworks rather than operating outside of them, something that legacy platforms like LocalBitcoins or Paxful simply cannot do. No custody, no permissions, no middlemen.

ZKP2P has grown from $100k to $2M+ monthly onramp volume in just 10 months, with over 13K transactions. A ~1,200 year journey from trusting your friend to trusting the tech.

Allowing peer to peer trades isn't an anarchist dream, it's simply connecting users with a coincidence of wants. Every generation has had their own peer to peer system, built mostly on trust networks. ZKP2P uses cryptographic proofs instead, bridging Web2 and Web3 and letting users seamlessly on and offramp. We've started to scale this trust, introducing Taker Tiers allowing buyers to access higher transactions amounts, without cooldown. The current method uses completely onchain data to combat griefing and chargeback risk. In the future, we can tie your onchain identity to other privacy-preserving methods like zkPassport to verify your reputations without ever needing to hold your sensitive data. We want to keep the marketplace safe, prevent bad actors, and ensure your personal data remains your own.

[The next chapter is already being written, and it fits in your pocket.](https://discord.com/invite/YPWd2nBMQS)

Do not fear, peer to peer.
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
