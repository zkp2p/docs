---
id: arm-spread-advanced
title: Set Your Price Edge - Advanced Flow
---

# Set Your Price Edge: Advanced Flow

The advanced flow gives you the full orderbook, a price-edge slider, floor rate controls, and support for multiple currencies on a single deposit.

1. **Enable Advanced Mode**

   On the **Sell USDC** screen, toggle **Advanced** on in the top right corner.

2. **Enter Your Deposit Amount**

   Type how much USDC you want to deposit, or click **Max** to use your full balance.

3. **Choose Your Platform**

   Select your payment platform from the **Platform** dropdown and enter your account details (e.g. your Revtag for Revolut).

4. **Add Your Currencies**

   On the right side, you'll see currency tabs. Click **+ Add** to accept additional currencies on this deposit. Each currency gets its own premium or discount versus market.

5. **Set Your Price Edge**

   For each currency, use the percentage slider (ranges from -5% to +5%) or the **+/- buttons** to set your rate.

   The right panel shows:

   - **Selected Rate** vs **Market Rate** at the top
   - An **orderbook chart** showing where your rate sits relative to other sellers
   - A yellow **"You"** line marking your position on the orderbook

   Drag the slider or tap the buttons. The orderbook updates in real time so you can see exactly where you land.

   ![Advanced flow - setting price edge](/img/arm/arm-advanced-default.png)

6. **Set a Floor Rate (Optional)**

   At the bottom of the rate panel, toggle **Floor** on to set a minimum rate. See [How to Set a Floor Rate](arm-floor-rates.md) for details.

7. **Review Your Configured Rates**

   On the left side, under **Configured Rates**, you'll see a summary for each currency:

   - The currency flag and code (e.g. USD)
   - Your price versus market (e.g. "+1.25% vs market")
   - Your floor rate if set (e.g. "Floor: 1.01 USD / USDC")

   When a floor is active, a red **"Min"** line appears on the orderbook showing your minimum rate.

   ![Advanced flow - price edge and floor configured](/img/arm/arm-advanced-spread-floor.png)

8. **Review Deposit**

   Click **Review Deposit** to confirm everything looks right, then approve the transaction in your wallet.

## Updating Your Price Later

To change your price edge after creating a deposit:

1. Go to [peer.xyz](https://peer.xyz) and click the **Sell** tab
2. Click on your deposit to view details
3. Edit the currency/provider you want to change (this takes you back to the deposit screen)
4. Adjust the percentage versus market using the slider or +/- buttons
5. Confirm the update

Your new price takes effect immediately for all future orders.

➡️ _Next: [How to Set a Floor Rate](arm-floor-rates.md)_
