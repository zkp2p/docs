---
id: calculating-apr
title: Calculating APR
---

# How APR is Calculated

Our protocol calculates APR (Annual Percentage Rate) using a few key inputs:

## Key Inputs

- **Deposit Amount** – How much you deposit, in USDC.  
- **Conversion Rate (Ask Price per USDC)** – The price a user sets for their fiat currency in terms of USDC.  
- **Currency Price (USD)** – The actual market price of the fiat currency.  
- **Platform’s Average Daily Volume** – How much trading volume (in USD) the platform processes per day.  
- **Platform’s Current Liquidity** – The total amount of liquidity (in USD) locked in the protocol.  

---

## Calculation Steps

### Days per cycle  
```  
daysPerCycle = (Platform Current Liquidity / Platform Average Daily Volume)  
```

### Number of cycles per year  
```  
numberOfCycles = (365 / daysPerCycle)  
```

### Spread  
```  
spread = (Conversion Rate - Currency Price) / Currency Price  
```

### Fees made per cycle  
```  
feesPerCycle = (Deposit Amount * spread)  
```

### Total fees per year  
```  
totalFeesPerYear = (feesPerCycle * numberOfCycles)  
```

### APR  
```  
APR = (totalFeesPerYear / Deposit Amount) * 100%  
```

> **Note**: If the spread is negative (meaning the user’s ask price is lower than the fiat currency’s market price), the result is effectively a losing scenario, so the APR is not applicable.

---

## Example Calculation

### Assume:

- **Deposit Amount** = 10,000 USDC  
- **Conversion Rate (Ask Price per USDC)** = 1.55 USD  
- **Currency Price (Market Price in USD)** = 1.50 USD  
- **Platform Average Daily Volume** = 100,000 USD  
- **Platform Current Liquidity** = 1,000,000 USD  

---

### Step-by-step:

#### daysPerCycle  
```  
1,000,000 / 100,000 = 10 days  
```

#### numberOfCycles  
```  
365 / 10 = 36.5  
```

#### spread  
```  
(1.55 - 1.50) / 1.50 ≈ 0.0333 (3.33%)  
```

#### feesPerCycle  
```  
10,000 * 0.0333 ≈ 333.33 USDC  
```

#### totalFeesPerYear  
```  
333.33 * 36.5 ≈ 12,166 USDC  
```

#### APR  
```  
(12,166 / 10,000) * 100% ≈ 121.66%  
```

In this simplified scenario, if the user sets an ask price slightly above the fiat’s actual market price, and if the trading volume and liquidity are favorable, the annual percentage rate can be quite high.

---

## Key Takeaways

- **Spread**: Even a small positive difference between ask price and market price can lead to significant returns once multiplied across multiple cycles.

- **Volume and Liquidity**: These dictate how many cycles happen in a year. Higher volume relative to liquidity yields more cycles, boosting potential APR.

- **Deposit Amount**: Directly scales how many fees you earn each cycle.

- **APR**: Reflects your total annual fees as a percentage of your deposit, simplifying comparisons between potential earnings.
