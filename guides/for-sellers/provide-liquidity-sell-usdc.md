---
id: provide-liquidity-sell-usdc
title: How to Provide Liquidity and Sell USDC
---

# How to Provide Liquidity and Sell USDC

This guide walks through creating a seller deposit on ZKP2P.

### Step 1: Navigate to ZKP2P

Visit [https://peer.xyz](https://peer.xyz) in your browser.

![Provide Step 1](/img/onramping/OnrampStep1.png)

### Step 2: Check Current Market Rates

- Click the **Liquidity** tab in the main navigation.
- Review current spreads and rates for currencies you want to support.
- Check available liquidity and order limits.

![Provide Step 2](/img/provide-liquidity/ProvideStep2.png)

### Step 3: Add Liquidity

- Click the add-liquidity button at the top-right of the order book.

![Provide Step 3](/img/provide-liquidity/ProvideStep2.png)

You can also click **Sell** in the main toolbar.

![Provide Step 3](/img/provide-liquidity/ProvideStep3a.png)

### Step 4: Connect

- Connect your wallet (Rabby, MetaMask, etc.) or sign in with social login.
- Approve the connection request.

### Step 5: Fund Account with USDC on Base

- Confirm you have enough **USDC on Base** in the top-right wallet area.

![Provide Step 5](/img/provide-liquidity/ProvideStep5.png)

If you need to bridge first, use the cross-chain liquidity guide.

### Step 6: Create New Deposit

- Click **New Deposit**.

![Provide Step 6](/img/provide-liquidity/ProvideStep3a.png)

### Step 7: Deposit USDC to Sell

- Click **Max** or enter a custom amount.

![Provide Step 7](/img/provide-liquidity/ProvideStep7.png)

### Step 8: Add Telegram Username (Optional)

- Enter your Telegram username for buyer support.

![Provide Step 8](/img/provide-liquidity/ProvideStep7.png)

### Step 9: Select Primary Payment Platform

Choose the platform you want to accept:

- Venmo (USD only)
- Cash App (USD only)
- Zelle (USD only)
- Revolut (multi-currency)
- Wise (multi-currency)
- Mercado Pago (ARS only)
- PayPal (multi-currency)
- Monzo (GBP only)

![Provide Step 9](/img/provide-liquidity/ProvideStep9a.png)

### Step 10: Enter Payee Details

Enter your account details for the selected platform.

- Venmo username
- Cash App cashtag
- Revolut revtag
- Wise email/tag
- Mercado Pago CVU

Double-check these values before continuing.

![Provide Step 10](/img/provide-liquidity/ProvideStep9.png)

### Step 11: Choose a Rate Mode and Set Rates

For each payment/currency pair, choose one of two modes:

1. **Fixed Rate**: manually set your conversion rate.
2. **Market Tracking**: track market pricing automatically and set a spread.

For **Fixed Rate**:

- Enter the rate you want to offer for each currency.
- Use the spread indicator to gauge competitiveness.
  - Green: above market
  - Gray: near market
  - Red: below market

For **Market Tracking**:

- Select **Market Tracking**.
- Set your spread percentage.
- Optionally set a floor rate.

:::info
Market Tracking uses oracle-backed pricing to follow live FX rates. You set strategy (spread and floor), and rates update automatically.
:::

![Provide Step 11](/img/provide-liquidity/ProvideStep11.png)

### Step 12: Add Secondary Payment Platform (Optional)

- Click **Add Payment** in the top-right.
- Repeat Steps 9-11 for each additional platform.

![Provide Step 12](/img/provide-liquidity/ProvideStep12.png)

### Step 13: Configure Order Limits (Optional)

- Expand **Order Limits**.
- Set minimum and maximum order size.

![Provide Step 13](/img/provide-liquidity/ProvideStep13.png)

### Step 14: Review Your Details

Before submitting, check:

- Payment tags/details
- Rate strategy and spreads
- Expected proceeds

![Provide Step 14](/img/provide-liquidity/ProvideStep14.png)

### Step 15: Approve and Deposit

- Click **Approve**.
- Confirm the deposit transaction.
- Gas may be sponsored for social-login accounts.
- Wait for confirmation.

![Provide Step 15](/img/provide-liquidity/ProvideStep15.png)

### Step 16: Monitor Your Deposit

Go to the **Sell** tab and open your deposit.

You can track:

- Total and remaining amount
- Enabled platforms/currencies
- Current status
- Selected rate mode (Fixed Rate or Market Tracking)

![Provide Step 17](/img/provide-liquidity/ProvideStep17.png)
![Provide Step 17a](/img/provide-liquidity/ProvideStep17a.png)

## Important tips

### Setting rates

- Lower spreads (0.5-1%) usually fill faster with lower margin.
- Higher spreads (1-3%) usually fill slower with higher margin.
- Market Tracking can reduce manual updates; tune spread over time.

### Security best practices

- Start with a small deposit.
- Never share your wallet seed phrase.
- Double-check transaction details.
- Use separate payment accounts for cleaner reconciliation.

### Troubleshooting

- Pending too long: confirm you have ETH on Base for gas (if gas is not sponsored).
- Deposit not visible: refresh and reconnect wallet.
- Need help: join [Peer Telegram](https://t.me/+XDj9FNnW-xs5ODNl).

➡️ _Next: [Market Tracking (Automated Rates)](market-tracking-arm.md)_
