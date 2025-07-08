---
id: manual-releases
title: Handling Manual Releases as a Seller
---

# Handling Manual Releases as a Seller

### When to Manually Release Funds

As a seller, you may receive Telegram messages from buyers who couldn't complete automatic verification. 99% of the time, you do not need to interact with the buyer.

Manual release may be relevant if:

- The buyer sent the **wrong amount**
- The buyer sent the **wrong currency** (e.g., USD instead of EUR)
- The buyer sent the correct amount and currency but **couldn't generate the proof** (ZKP2P team may also investigate)

You should **only consider manual release** if:

- The buyer provides **proof of payment** matching an active order
- The **amount, currency, and timing** align with your ZKP2P order
- You can **verify** the payment in your own payment platform

Alternatively, you can refund the buyer and ask them to re-initiate the order properly.

### How to Verify Buyer Payments

#### Check Your Payment Platform

- Log in to your chosen payment platform  
- Verify the payment matches the buyer's claim  
- Check **amount**, **currency**, and **timestamp**  
- If using Revolut or similar, refresh your transactions list  

#### Cross-Reference with ZKP2P

- In ZKP2P, go to your **deposit details**  
- Find the specific order in question  
- Check that the **amount**, **currency**, and **buyer address** match  
- Confirm the **"Locked" amount** corresponds to the payment  

#### Request Appropriate Verification

- Ask the buyer for a **screenshot** of their payment confirmation  
- For security, request details only the real payer would know  
- Verify the **payment timestamp** matches the order creation time  

### How to Manually Release Funds

#### Navigate to the Specific Order

- Open your **deposit details** in ZKP2P  
- Find the relevant order (match amount + buyer address)  
- Click the **"Release"** button  

#### Confirm the Release

- A **"Release Funds"** screen will appear  
- Review the warning about bypassing verification  
- Confirm you're releasing the **correct amount** to the **correct buyer**  

#### Sign the Transaction

- Click **"Submit Transaction"**  
- Approve the transaction in your wallet  
- Wait for confirmation on the **Base Network**  

#### Communicate with the Buyer

- Let them know the funds were released  
- Provide the **transaction hash** if available  
- USDC should appear in their wallet shortly  

## Best Practices for Manual Releases

- **Keep detailed records** of each manual release  
- Only release funds when you're **100% certain** the payment is legit  
- Let buyers know your **expected response time**  
- Create a **consistent verification checklist**  
- Regularly monitor your deposits for **locked funds**  

## Warning Signs of Fraudulent Requests

Watch out for:

- Buyer can't provide proper **confirmation screenshots**  
- **Payment amount** doesn't match locked funds in ZKP2P  
- Buyer is overly **pushy** or demands urgency  
- Multiple people claim the **same transaction**  
- Timing or context seems **suspicious**
