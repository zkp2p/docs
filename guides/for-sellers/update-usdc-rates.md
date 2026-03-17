---
id: update-usdc-rates
title: How to Update USDC Conversion Rates
---

# How to Update USDC Conversion Rates

After creating a deposit, you can manage tuple pricing in two modes:

- **Fixed Rate**: update the rate manually.
- **Market Tracking**: set spread and floor while rates follow market data.

### Step 1: Navigate to your deposit details

- Go to [https://peer.xyz](https://peer.xyz)
- Open the **Sell** tab
- Select your deposit

![CR Step 1](/img/provide-liquidity/ProvideStep17.png)

### Step 2: Locate the Conversion Rates section

You will see:

- Payment platforms
- Enabled currencies
- Current rates and source

![CR Step 2](/img/provide-liquidity/ProvideStep17a.png)

### Step 3: Select the tuple to update

- Find the currency row
- Click the edit icon
- The update modal opens

![CR Step 3](/img/conversion-rate/CRStep3.png)

### Step 4: Choose mode and update settings

The modal includes a rate strategy selector.

For **Fixed Rate**:

- Enter a new direct conversion rate.

For **Market Tracking**:

- Switch to **Market Tracking**.
- Set your spread percentage.
- Set/update your floor rate.

![CR Step 4](/img/conversion-rate/CRStep4.png)

:::info
If an oracle feed becomes stale, that tuple halts instead of falling back automatically. This protects against outdated market pricing.
:::

### Step 5: Confirm the update

- Click **Save Rate Settings** (or equivalent update button)
- Sign the wallet transaction

### Step 6: Wait for confirmation

- Wait for Base confirmation
- Refresh deposit details if needed
- Verify updated settings in Conversion Rates

![CR Step 6](/img/conversion-rate/CRStep6.png)

## Tips for better rate management

### Stay competitive

- Check market and liquidity tab pricing regularly.
- Compare per-currency opportunities.

### Use the right mode

- Fixed Rate is best for strict manual control.
- Market Tracking is best when you want less manual maintenance.

### Tune spread over time

- Slow fills: reduce spread.
- Instant fills: consider widening spread slightly.

### Watch by currency

- Different currencies usually need different spread targets.

➡️ _Next: [Market Tracking (Automated Rates)](market-tracking-arm.md)_
