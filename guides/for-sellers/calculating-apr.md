---
id: calculating-apr
title: Calculating Maker PnL and APR
---

# How Maker PnL and APR are Calculated

Peer shows maker performance from actual fills. PnL comes from the price edge on filled orders: the difference between the fiat you received and the fiat value implied by the market rate at the time of the fill. APR is an annualized view of realized performance; it is not a guaranteed return.

## Key Inputs

- **Fill amount** - How much USDC a buyer filled.
- **Your quoted rate** - The fiat per USDC rate on that fill.
- **Market rate** - The market fiat per USDC rate used for comparison.
- **Realized PnL** - The price edge on the fill, after converting the rate difference into fiat/USDC terms.
- **Time and capital used** - APR annualizes realized PnL relative to deposited capital and elapsed time.

---

## Calculation Steps

### Price edge
```
priceEdge = (yourQuotedRate - marketRate) / marketRate
```

### Realized PnL on a fill
```
realizedPnl = fillAmount * priceEdge
```

### Annualized APR
```
apr = (realizedPnl / depositedCapital) * (365 / daysElapsed) * 100%
```

If you price below market, the price edge is negative. That may help you fill faster, but it can reduce realized PnL.

---

## Example Calculation

### Assume:

- **Fill Amount** = 1,000 USDC
- **Your Quoted Rate** = 1.02 USD per USDC
- **Market Rate** = 1.00 USD per USDC
- **Deposited Capital** = 10,000 USDC
- **Days Elapsed** = 30

---

### Step-by-step:

#### priceEdge
```
(1.02 - 1.00) / 1.00 = 0.02 (2%)
```

#### realizedPnl
```
1,000 * 0.02 = 20 USDC equivalent
```

#### apr
```
(20 / 10,000) * (365 / 30) * 100% ≈ 2.43%
```

In this simplified scenario, a 2% premium on a 1,000 USDC fill creates 20 USDC equivalent of realized PnL. APR depends on how much capital was deployed and how long it took to generate that PnL.

---

## Key Takeaways

- **Price edge**: A positive premium can create realized PnL on a fill. A discount can fill faster but may reduce realized PnL.

- **Volume and Liquidity**: Fill frequency matters. Idle liquidity earns nothing until buyers choose your quotes.

- **Deposit Amount**: Larger deposits can support larger fills, but unused capital lowers annualized APR.

- **APR**: Annualizes realized performance for comparison. It should not be read as a promise about future fills.
