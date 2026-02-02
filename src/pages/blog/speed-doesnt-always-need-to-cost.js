import React from 'react';
import Layout from '@theme/Layout';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
  const date = new Date(`${dateString}T00:00:00Z`);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC'
  });
};

export default function SpeedDoesntAlwaysNeedToCost() {
  const post = {
    title: "Speed Doesn't Always Need To Cost?",
    date: '2025-08-06', 
    excerpt: 'After analysing 4,000+ trades: faster trades dont necessarily comes with high costs. Quick trades can be cheap and slow trades aren\'t always profitable.',
    content: `
### TL;DR

In case you don't want to read all 1,500 words, faster trades dont necessarily comes with high costs, and after analysing 4,000+ trades: 

- There is a weak correlation between speed and spread (r = 0.14). Quick trades can be cheap and slow trades aren't always profitable.
- A patience premium exists, sellers who wait can win, but only if they avoid common behavioral traps.
- Bigger trades get better deals, whilst trades of $500 or lower face higher spreads due to perceived effort vs reward.
- Timing matters. You'll have to read further to find out when the best spreads are for on and offramping.
- Pricing decisions of liquidity providers is driven by classic behavioural biases.

If you can play the game right, being fast will be cheaper for onrampers and having patience will net liquidity providers more profit. 

---

In Traditional Finance, Web2, and *normal* life speed usually will cost more. You can get your Uber Eats quicker, skip the queues at the airport, and use "quick" bank transfers all by paying a small fee. Users are used to paying a fee for increased convenience, and businesses are more than happy to receive the extra revenue, but do the same behavioural economics work on ZKP2P? Are liquidity providers charging more for convenience or are buyers getting deals from desperate LPs? We've analysed 4,000+ trades in USD, EUR, GBP, and AUD currencies from our v2 launch across all our payment platforms to deep dive into this. 

### Spread vs Speed

Checking the correlation between the speed, how many hours since the vault was open, and the spread, the difference between market rate and zkp2p rate, is positive but weak (r = 0.14). This means there is not much linear dependence between the two. 

![Spread vs Speed Correlation](/img/spreadvspread/spread1.png)

Fast trades often have much lower spreads than slow ones, especially when the wait time is over 7 days. 

![Fast vs Slow Trade Spreads](/img/spreadvspread/spread2.png)

Liquidity Providers are receiving a "patience premium", where desperate liquidity providers post their deposits at close or below 1:1 which are snapped up by waiting buyers, and liquidity providers with no immediate need to offramp are waiting for when there are not desperate LPs left. For buyers, it doesn't always need to be costly to get onchain, and for sellers they can benefit if they have patience. 

### Behavioural Liquidity Provider Patterns.

There are a plethora of strategies liquidity providers can use, especially as ZKP2P now supports 7 different payment platforms, there is a lot of choice. Many of our current strategies look experimental, with users trying to find out what works best for them, and there is lots of undercutting going on, dropping 0.01 below the next best price. 

Much of the behaviour of liquidity providers can be bundled into Behavioural Economic Concepts. 

**Anchoring & Loss Aversion**

LPs fixate on their initial spread and fail to adjust even as market conditions shift. Changing the spread can feel like "losing" money. 

![Anchoring Behavior](/img/spreadvspread/spread3.png)

**Sunk Cost Fallacy**

LPs who have waited 3 or 4 days already resist lowering their spread because they've "already waited this long". They believe the opportunity cost of changing strategy is too great vs leaving their money in a lending protocol. 

**Status Quo Bias**

A passive way of providing liquidity, just set and forget, they are biased towards inaction and sticking with the current market default. 

**Action Bias**

The complete opposite of Status Quo, aggressively listing their deposits at low spreads to stay in the game and get a hit of dopamine when someone sends them money. 

**Overconfidence Bias**

LPs assume that someone will eventually always take it, regardless of how high the spread is, because of the benefits of ZKP2P; speed, no additional verification, and permissionless. 

**Affect & Availability Heuristics**

LPs price emotionally because they've seen someone made $200 from one trade on X, or that they receive 3% spread on their last trade so the next one will be the same. 

**Illusion of Control**

Some LPs believe that waiting longer and ignoring market signals, gives them control over getting a *better* spread. 

**Ambiguity Aversion**

Buyers want to avoid ambiguity, and may choose to onramp versus addresses they recognise, as opposed to the lowest price, giving LPs room to set spreads how they like. 

The shape of the flow of liquidity isn't like a TradFi or DeFi platform, but can be explained using their biases. As ZKP2P continues to mature, LPs will intentionally lean into these strategies, becoming a high spread backstop, whilst others will continue to price their deposits emotionally. LPs and buyers who can recognise these signals and patterns will be able to take advantage and trade smarter. 

### Small Size, Big Cost?

When we group trades by size, sub $500 onramps face higher than average spreads. Small traders are less price sensitive, ZKP2P is still quicker and cheaper than going through another platform or CEX, and don't want to wait for optimal pricing. 

![Trade Size vs Spread](/img/spreadvspread/spread4.png)

LPs are also not incentivised to support small onramps at lower spreads due to the increased effort of dealing with smaller size. Competition in this section is low. 

Bigger trades, on the other hand, get better spreads. LPs want to fill large orders because the absolute profit will be more, and the effort to recycle the liquidity is much easier. You could even describe it as a whale discount. 

| Trx Amount | Trx Count | Profit | Effort |
| --- | --- | --- | --- |
| $2,500 | 1 | $25 | Low |
| $250 | 10 | $25 | Medium |
| $25 | 100 | $25 | High |

Unlike AMMs, there is no price curve, just users selecting their onramps based on what's available. Both small and big orders pay for convenience, just in different ways.

![Order Size Distribution](/img/spreadvspread/spread5.jpeg)

### Do Buyers Have a Favourite Time?

The volatility fluctuates by hour, with significant intraday differences depending on where in the world is asleep and awake. 06:00 UTC is where spreads have historically peaked; tired Americans onramping after a long day at work and maybe Europeans are not as europooor as we believe. 15:00 UTC is the sweet spot for spreads, where buyers can get the most optimal trades, both Americans and Europeans are awake and LPs are fighting for business. There is also a Weekend Convenience Fee, where spreads increase during these times as buyers have more free time and there is more demand to onramp. 

![Hourly Spread Patterns](/img/spreadvspread/spread6.png)

### Currency and Platform Matters

Surprise to no one, not all fiat currencies behave equally. The majority of our volume and platform is centred around the USA, making USD liquidity fairly deep, cheap, and for LPs quick to offramp. EUR and GBP fall into the middle ground, with less liquidity, slightly slower offramp speeds, and middle spreads. AUD is a longer term play for LPs, with higher spreads and slower fulfillment time, where buyers have no choice but to pay these *convenience fees*. 

![Currency Spread Comparison](/img/spreadvspread/spread7.jpeg)

There is also platform specific behaviour; CashApp and Revolut have the highest average spreads, Wise and Venmo is 50bps lower, but a similar speed for offramping. Zelle has a comparable spread to Venmo but takes triple the time for deposits to be taken. 

Revolut and Wise are often secondary banks, and Cashapp is less important than Venmo to American users. These accounts are more "expendable", buyers are willing to pay a premium to use them, and LPs are more than happy to charge for this. If something goes wrong, regulations or user agreements change, losing these accounts is less disastrous than other accounts. 

![Platform Spread Analysis](/img/spreadvspread/spread8.png)

### Market Structure and Risk

Volume is distributed across a range of liquidity providers, with no single entity dominating, signaling a healthy and dynamic liquidity landscape. Smaller LPs are still getting filled, but the game is significantly tighter and the wait time can be longer. This also means that profit margins are all over the place, single trades making between -13% and 15% in profit, the majority of LPs fall into the 1-2% range. Long tail profits exist, but LPs strategy needs to be able to take advantage of them. 

![LP Profit Distribution](/img/spreadvspread/spread9.png)

Unlike passive yield farming in a lending protocol, to become ultra profitable providing liquidity in ZKP2P you need to be active and attentive to the market. LPs who avoid behavioral traps like status quo bias or anchoring, and monitor vault dynamics, are better positioned to capture long-tail profits.

### What Does It All Mean?

If you got this far, thanks for reading, and if you just want the tldr; fast trades don't cost more, waiting doesn't guarantee more profit, and being a ZKP2P LP is becoming more complex. 

![Market Overview](/img/spreadvspread/spread10.png)

To become a successful LP, you need to know who you are selling to, what each platform means to its users, what are the optimal offramp sizes and spreads. The increased complexity and competition puts an onus on ZKP2P to improve the tools our LPs have. Our v2.1 upgrade brings lots of the quality of life upgrades to abstract away these complexities, auto spread tracking, top up existing vaults, new providers, more currencies, and liquidity alerts. This goes alongside our Dune dashboard suite; [Your Liquidity Provider Profile](https://dune.com/zkp2p/zkp2p-liquidity-provider-profile), [ZKP2P Latest Transactions](https://dune.com/zkp2p/zkp2p-latest-transactions), [ZKP2P Latest Spreads](https://dune.com/zkp2p/zkp2p-spreads), and [ZKP2P Liquidity Histograms](https://dune.com/zkp2p/zkp2p-liquidity). 

![ZKP2P Dashboard](/img/spreadvspread/spread11.png)

We're combining data and automation to support our users and create the ultimate permissionless, non custodial peer-to-peer marketplace.
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
