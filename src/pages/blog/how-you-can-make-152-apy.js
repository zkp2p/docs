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

export default function HowYouCanMake152APY() {
  const post = {
    title: 'How You Can Make 152% APY on Stablecoins',
    date: '2026-01-22',
    excerpt: 'Off the back of my last article, I had a lot of questions about providing liquidity on ZKP2P. So I pulled six weeks of data to find the best providers, optimal spreads, and times to deposit to maximise your yield.',
    content: `
Off the back of my last article, I had a lot of questions about providing liquidity on ZKP2P. So I pulled six weeks of data to find the best providers, optimal spreads, and times to deposit to maximise your yield.

### TL;DR

If you don't want to read the full article, here's what the data says:

![Top 4 Providers by volume](/img/how-you-can-make-152-apy/1.jpeg)

The most interesting insight, LPs who redeposit fill 12 hours faster, and earn higher spreads than first-time depositors.

### The Dataset

Between December 1st, 2025 and January 15th, 2026, ZKP2P v3 processed:

- $3.91 million in volume
- 5,661 transactions

From:

- 318 liquidity providers
- 943 buyers

That's ~$100k per day flowing through peer-to-peer rails. For this analysis, I tracked every order from (re)deposit to fill, measuring by time, spread, and provider. This let me calculate the actual time it takes to get the fiat into your account.

### The Provider Landscape

Not all payment rails are created equal, here is how the last six weeks of volume breaks down:

![Provider Volume Breakdown](/img/how-you-can-make-152-apy/2.jpeg)

Revolut dominates the volume, capturing 67% of the flows, helped by the fact it is multicurrency. This, however, doesn't tell the full story. Liquidity providers care about two things:

1. How fast will my order be filled?
2. How much yield will I earn?

### Volume-Weighted Metrics by Provider

It's important to calculate volume weighted averages because a $5,000 order carries more significance than a $5 order.

![Volume-Weighted Metrics](/img/how-you-can-make-152-apy/3.jpeg)

Revolut is optimised for turnover, especially as EU banking doesn't have wait [up to] 5 days for a wire to be received. Cashapp and Venmo are optimised for yield per transactions. If you want to maximise your annual returns, you need to work out how many times you can cycle your capital.

![Yield vs Turnover](/img/how-you-can-make-152-apy/4.jpeg)

Revolut requires more work to generate more returns, whereas Cashapp and Venmo require more patience.

### Finding the Sweet Spot

Everyone wants to know the optimal spread, so I've bucketed the transactions by spread range and calculated the volume-weighted fill times:

**Revolut**

![Revolut Spread Analysis](/img/how-you-can-make-152-apy/5.jpeg)

For Revolut 0.5-1% is the sweet spot. You're capturing the most volume with a fast turnover. If you go above 2% you'll be waiting days with idle capital.

**Venmo**

![Venmo Spread Analysis](/img/how-you-can-make-152-apy/6.jpeg)

Venmo is very interesting. Looking to offramp quickly to your Venmo? Put your spread between 0-0.5%, filling in around ~8 hours. However, the majority of the volume trades between 2-3%, and your capital may be idle longer than Revolut but you earn huge returns. Who wouldn't want to wait a day to sell 1 USDC for 1.03 USD?

**Cash App**

![Cash App Spread Analysis](/img/how-you-can-make-152-apy/7.jpeg)

CashApp is weird, with 2-3% spread filling the fastest versus lower spreads. The majority of the volume is between 1-3%, so putting your deposit in between those bands leads to money in your account in ~8-16 hours.

**Wise**

![Wise Spread Analysis](/img/how-you-can-make-152-apy/8.jpeg)

Wise takes time. A lot of waiting around, even at low spreads. Only use Wise if you need the capital there, and don't have access to any alternatives.

There's no universal "best spread". Each provider has its own market microstructure:

![Provider Microstructure](/img/how-you-can-make-152-apy/9.jpeg)

### The Redeposit Advantage

I would say this is the most actionable finding in the entire analysis, and is my own experience. LPs who redeposit consistently outperform first-time depositors on every metric.

![Redeposit Performance](/img/how-you-can-make-152-apy/10.png)

On average, re-depositors can charge more, and their orders fill faster. How? Why? Reputation.

Many traditional peer-to-peer platforms liquidity providers rely on building their reputation by being online 24/7 and ensuring funds are released promptly. LPs on ZKP2P don't have to worry about this, but they can still build their reputation.

LPs who redeposit build trust, and buyers know they can trust them in case anything goes wrong. It even leads to buyers paying extra for known LPs.

This, and I hate myself for saying this, creates a flywheel (of sorts).

![Reputation Flywheel](/img/how-you-can-make-152-apy/11.jpeg)

Don't provide liquidity and disappear, if you can do it on a regular basis, you'll be able to reap the rewards of your reputation.

![Support email](/img/how-you-can-make-152-apy/12.jpeg)

I suppose a fair rebuttal would be; are redepositors earning more because buyers trust them, or because the LPs who stick around are simply better at this? Probably both. The higher spreads suggest buyers pay a premium for known names. Redepositors have also survived the learning curve, learning which providers work for them, pricing, and depositing. The causation runs in both directions: show up consistently, learn as you go, and both effects compound in your favour.

### Is it time for you to start euromaxxing?

ZKP2P is USDC-native, so you'd expect USD to dominate. It does, but the fill times tell a different story:

![EUR vs USD Fill Times](/img/how-you-can-make-152-apy/13.jpeg)

EUR fills 2x faster than USD.

Why? Revolut. It handles the most volume, and it's the biggest Neobank in Europe.

### The Provider x Currency Matrix

Here's where volume actually flows:

![Provider Currency Matrix](/img/how-you-can-make-152-apy/14.jpeg)

If you can access Revolut or Wise, you'll face (a little) less competition and potentially faster fills. At current rates, the EUR market is underserved relative to demand.

### Timing The Market

Not all hours are created equally, specific hours had better fill times.

![Hourly Fill Times](/img/how-you-can-make-152-apy/15.jpeg)

Peak hours are 10am to 5pm EST, tracking with the domination of USD. Can't believe there are so many Americans not busy providing shareholder value and onramping via ZKP2P.

![Day of Week Analysis](/img/how-you-can-make-152-apy/16.jpeg)

Saturday is the best day of week, fastest fills with strong volume. If you're looking to optimise capital efficiency it looks like you should prepare on Friday for a weekend rush, and rebalance at the start of the week.

### Yield

Over the past 45 days, LPs collectively earning ~$48K in yield on $3.91M. That's an average spread of 1.23%. You can outperform lending platforms by doing 5 cycles per year, or once every 2.5 months. A lot of LPs are doing that in a week.

![Yield Analysis](/img/how-you-can-make-152-apy/17.jpeg)

You don't need to provide liquidity intensively to earn outsized returns on your stables. It also depends on the strategy you've deployed, based on yield our top 5 earners in the last 45 days:

![Top 5 Earners](/img/how-you-can-make-152-apy/18.jpeg)

Where else can you get a 9% return on your capital in 45 days without leverage?

### Order Size

Bigger isn't always better, especially if you're focussed on turnover. $1-$5k orders are slowest, but where the majority of the volume happens. If you're starting out, look to focus on $100-$1K range, where you'll get faster fills and fairly good volume.

![Order Size Analysis](/img/how-you-can-make-152-apy/19.jpeg)

Transactions above $5K are filled within 6 hours, helped by white glove support for larger transactions. wen zkOTC?

### The Ultimate Playbook

Based on 5,661 transactions and 6 weeks of data, here's the optimal strategy for each provider:

![Ultimate Playbook](/img/how-you-can-make-152-apy/20.jpeg)

**Things to Remember**

1. Reputation beats price

LPs who redeposit are consistently earning higher spreads AND filling faster. The market is rewarding trust and consistency over rock-bottom pricing.

2. Know your market

Each provider has different dynamics and nuances. Cash App's sweet spot is between 2-3%, the same spreads would be toxic on Revolut.

3. Compounding

You know all the memes about compounding interest? Yeah, compounding your returns back into an LP works and grows your stack exponentially.

### Final Thoughts

ZKP2P is processing ~$100K/day of peer-to-peer, privacy-preserving volume. No middlemen, no additional verification, no custody.

The market is still young, and there are still edges to find. Europooors are still underserved, timing windows matter, and reputation is undervalued.

I've been providing liquidity for almost a year now, and the data is quite clear, consistent, fairly priced liquidity beats opportunistic deposits every time.

Now go provide some liquidity.

*Analysis based on ZKP2P v3 data from December 1, 2025 to January 15, 2026. An important note is that historical data does not guarantee future performance, and this is not financial advice.*
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
