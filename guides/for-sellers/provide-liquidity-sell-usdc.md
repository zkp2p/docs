---
id: provide-liquidity-sell-usdc
title: How to Provide Liquidity and Sell USDC
---

# How to Provide Liquidity and Sell USDC

This guide walks through creating a seller deposit on Peer. It also shows where rate management fits in: you can run your deposit with a fixed rate, turn on market tracking, or later delegate pricing to a vault.

### Step 1: Navigate to ZKP2P

Visit [https://peer.xyz](https://peer.xyz) in your browser.

![Provide Step 1](/img/onramping/OnrampStep1.png)


### Step 2: Check Current Market Rates

- Click on the **Liquidity** tab in the main navigation bar  
- Review current spreads and rates for the currencies you're interested in  
- Pay attention to available liquidity and limits for each option  

![Provide Step 2](/img/provide-liquidity/ProvideStep2.png)


### Step 3: Add Liquidity

- Click the add liquidity button on the top right hand side of the Order Book

![Provide Step 3](/img/provide-liquidity/ProvideStep2.png)


You can also click the **Sell** button on the toolbar 

![Provide Step 3](/img/provide-liquidity/ProvideStep3a.png)


### Step 4: Connect

- The platform will prompt you to connect your wallet  
- Select your preferred wallet (Rabby, MetaMask, etc.) or log in via email, Twitter, or Google  
- Approve the connection request in your wallet

### Step 5: Fund Account with USDC on Base

- Ensure you have sufficient **USDC tokens on the Base Network** by checking in the top right hand corner. 

![Provide Step 5](/img/provide-liquidity/ProvideStep5.png)

**- If you dont have enough USDC, check out the guide to depositing from any chain here!**

### Step 6: Create New Deposit

- Click the **New Deposit** button

![Provide Step 6](/img/provide-liquidity/ProvideStep3a.png)


### Step 7: Deposit USDC to Sell

- Click **Max** to deposit your full USDC balance or type a custom amount  

![Provide Step 7](/img/provide-liquidity/ProvideStep7.png)


### Step 8: Add Telegram Username (Optional)

- Enter your Telegram username so buyers can contact you if any issues arise  

![Provide Step 8](/img/provide-liquidity/ProvideStep7.png)

### Step 9: Select Primary Payment Platform

Choose your preferred platform from the dropdown:

- Venmo (USD Only)  
- Cash App (USD Only)  
- Zelle (USD Only)
- Revolut (Multi Currency)  
- Wise (Multi Currency)  
- Mercado Pago (ARS Only)
- PayPal (Multi Currency)
- Monzo (GBP Only)

![Provide Step 9](/img/provide-liquidity/ProvideStep9a.png)


### Step 10: Enter Payee Details

Enter your username/account details for the selected platform:

- Venmo Username  
- Cash App Cashtag  
- Revolut Revtag  
- Wise Wisetag  
- Mercado Pago CVU  

> 🔍 **Double-check accuracy** — these details are how buyers send you money.

![Provide Step 10](/img/provide-liquidity/ProvideStep9.png)


### Step 11: Choose a Rate Mode and Set Rates

- Choose **Fixed Rate** if you want to enter an exact price for each currency yourself.
- Choose **Market Tracking** if you want Peer to follow live FX and apply your spread automatically.
- If you use market tracking, you can also set an optional **floor** to protect your minimum payout.
- You can see your spread in the middle column:
  - Green is above market rate
  - Grey is close to market rate
  - Red is below market rate

💡 **Consider**:
- Market demand  
- Competitive rates  
- Desired profit margin

:::info
Market Tracking is the user-facing name for automated rate management.
:::

For a deeper walkthrough, see [Automated Rate Management (Market Tracking)](market-tracking-arm.md).

![Provide Step 11](/img/provide-liquidity/ProvideStep11.png)


### Step 12: Add Secondary Payment Platform (Optional)

- Click **Add Payment** in the top right hand corner, if you want to accept multiple payment methods  
- Repeat Steps 9–11 for the new platform  

![Provide Step 12](/img/provide-liquidity/ProvideStep12.png)


### Step 13: Configure Order Limits (Optional)

- Click **Order Limits** to expand options  
- Set **minimum** and **maximum** order sizes (e.g. 5 USDC → max: your total deposit) 

![Provide Step 13](/img/provide-liquidity/ProvideStep13.png)

### Step 14: Review your details

- Are my tags correct?
- Are my spreads what I expected?
- How what proceeds can I expect from providing liquidity? 

If all details are correct you can continue with your transaction! 

![Provide Step 14](/img/provide-liquidity/ProvideStep14.png)


### Step 15: Approve & Deposit into Vault

- Click **Approve**  
- After approval, confirm the **deposit transaction**
- Gas is sponsored if you sign in with Socials
- Wait for confirmation (10–20 seconds)  


![Provide Step 15](/img/provide-liquidity/ProvideStep15.png)


### Step 16: Monitor Your Deposit

- Go to the **Sell** tab  
- You’ll see your active deposit showing:
  - Total amount
  - Remaining balance
  - Accepted currencies/platforms
  - Current status
  - Whether the deposit is using **Fixed**, **Market Tracking**, or **Delegated** rate management

![Provide Step 17](/img/provide-liquidity/ProvideStep17.png)
![Provide Step 17a](/img/provide-liquidity/ProvideStep17a.png)


---

## 💡 Important Tips

### Setting Optimal Rates

- Check the **Spread** column in the Liquidity tab  
- Lower spreads (0.5–1%) = faster fills, less profit  
- Higher spreads (1–3%) = slower fills, more profit  
- In Market Tracking mode, the spread is applied on top of the live market rate.
- In Delegated mode, the vault sets the active rate but your floor still protects you.

### Security Best Practices

- Start with a **small deposit**  
- Never share your wallet seed phrase  
- Always double-check transaction details  
- Use separate payment accounts for ZKP2P for clean tracking  

### Troubleshooting

- Long pending? Check gas — you need ETH on Base  
- Deposit not appearing? Refresh or reconnect wallet  
- Still stuck? Join [Peer Telegram](https://t.me/+XDj9FNnW-xs5ODNl) for help  

➡️ _Next: [Automated Rate Management (Market Tracking)](market-tracking-arm.md)_
