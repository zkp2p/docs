---
id: update-usdc-rates
title: How to Update USDC Conversion Rates
---

# How to Update USDC Conversion Rates

After creating your deposit on Peer, you may want to update how each payment pair is priced. This guide covers both direct rate modes you control yourself:

- **Fixed Rate**: you set the exact price.
- **Market Tracking**: you set a spread above live FX and can keep an optional floor.

If your deposit is **Delegated**, the active rate comes from the vault. You can still update your floor, but you cannot edit the vault-managed rate from the deposit itself.

### Step 1: Navigate to Your Deposit Details

- Go to [https://peer.xyz](https://peer.xyz)  
- Click on the **Sell** tab in the main navigation bar  
- Find your active deposit in the list and click to view details  

![CR Step 1](/img/provide-liquidity/ProvideStep17.png)  

### Step 2: Locate the Conversion Rates Section

Scroll to the **Conversion Rates** section. You'll see:

- Your configured **payment platforms** (e.g., Revolut)  
- The **currencies** you accept (e.g., GBP, SGD, EUR)  
- The **current conversion rate** for each currency \

![CR Step 2](/img/provide-liquidity/ProvideStep17a.png)  


### Step 3: Select the Rate to Update

- Find the currency you'd like to update  
- Click the **edit icon (pencil)** next to the current rate  
- The "Update Conversion Rate" screen will appear  

![CR Step 3](/img/conversion-rate/CRStep3.png)  


### Step 4: Enter Your New Rate

In the modal, you'll see:

- Platform (e.g., Revolut)  
- Currency (e.g., GBP)  
- A rate mode selector: **Fixed Rate** or **Market Tracking**
- Current rate state for the pair

If you choose **Fixed Rate**:

- Enter a new direct rate such as `0.795`

If you choose **Market Tracking**:

- Enter a spread percentage such as `1.00%`
- Optionally enter a floor if you want downside protection
- Peer resolves the active rate as the higher of your floor and the live market rate plus spread

:::info
For oracle-backed pairs, a stale or invalid oracle quote halts that pair until fresh market data is available. Your deposit remains intact, but that payment-method and currency pair stops quoting until the oracle recovers.
:::

![CR Step 4](/img/conversion-rate/CRStep4.png)  



### Step 5: Confirm Rate Update

- Click the Update Rate button  
- Your wallet will prompt you to sign the transaction  
- This updates your rate on-chain in the smart contract  

### Step 6: Wait for Confirmation

- Wait for the transaction to confirm on the Base Network
- Once confirmed, your updated rate will show in the Conversion Rates section  
- The new rate will apply to all future orders

![CR Step 6](/img/conversion-rate/CRStep6.png)



## Tips for Setting Optimal Rates

### Research Current Market Rates

- Check the Liquidity tab to see what other providers offer  
- Look at external exchanges for reference FX rates  

### Consider Spread and Competitiveness

- **Lower spreads** (0.5–1%) = faster sales, lower margin  
- **Higher spreads** (1–3%) = higher margin, slower sales  
- Balance depends on your strategy  
- Market Tracking is better when you want to stay close to live FX without constant manual edits.

### Monitor Performance

After updating rates:

- Monitor how quickly your orders are filled  
- If they're slow to fill → lower your spread  
- If they're filling instantly → raise your spread slightly  

### Currency-Specific Strategies

- Popular currencies like EUR may allow higher spreads  
- Rare currencies might require more competitive rates  
- Optimize for each currency independently  

➡️ _Next: [How to Delegate a Deposit to a Vault](delegate-to-a-vault.md)_
