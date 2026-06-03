---
id: risks
title: Risks
---

## Off-ramp Risks

-   **Proxy or Notary centralization:** Currently, the proxy and notary is run by ZKP2P. This is similar to single sequencer L2s today. In the future this will become a network of notary operators.

-   **Proxy or Notary collusion:** If there is collusion between the buyer and the Notary or Proxy then there is possibility of forging proofs to access seller liquidity

-   **Proxy MITM attack:** It is theoretically possible for the buyer to man in the middle attack a proxy-TLS solution by injecting spoofed ciphertext packets in between the proxy and the server / datacenter when the data is going to be signed by the proxy. This is highly unlikely as attacker must be near a data center and incentivized to pull off the attack when single transaction amounts are not high. We will be monitoring this in the future, and as we scale up limits and MPC TLS becomes more production ready, we will switch to this which cannot be attacked by a MITM

-   **Reversible Transactions:** Web2 transactions are potentially reversible. An on-ramper after claiming your USDC may be able to reverse your transaction. We have restricted the on-ramp amount and frequency to disincentivize this behavior. Also, you can block a malicious on-ramper to prevent them from opening an order against your deposit

## On-ramp Risks

-   **Privacy Concerns:** Personal payment data is not posted on-chain. You may still reveal the payment identifier required for the seller to receive your payment.

-   **API Change:** If the payment platform changes how payment data is shown or accessed, Peer may not be able to verify a payment, even if the off-chain payment has already been made. This could prevent the completion of the on-ramping process until the integration is updated.

## Banking Risks 

- **Flagged Transactions:** Some banks or payment platforms may flag or restrict accounts that appear to be involved in crypto-related activity. While ZKP2P never directly interacts with your fiat or bank account, using terms like "crypto", "USDC", or "zkp2p" in payment descriptions may raise suspicion with certain institutions. 

    To reduce risk, avoid referencing crypto in your payment notes and consider using banks or payment providers known to be neutral or supportive of digital asset activity.

## Fiat Custody Risk

- **Non-Custodial Design:** ZKP2P does not handle fiat directly. Users retain full control of their funds and initiate payments through external platforms. This minimizes platform risk and regulatory exposure, but means that users are solely responsible for managing their interactions with payment providers. 

**_The protocol cannot reverse payments, freeze funds, or mediate disputes related to off-platform fiat activity._**


### Audits
-   ZKP2P V2 Protocol has been audited by independent smart contract security engineers and Sherlock.
-   ZKP2P V3 Protocol has been audited by independent smart contract security engineers, Sherlock, and Scroll.
