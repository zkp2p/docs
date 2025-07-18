---
id: risks
title: Risks
---

## Off-ramp Risks

-   **Governance-Controlled Public Key:** The protocol's governance can update the public key of the witness associated with payment verifiers. If the new key is under their control, they could potentially forge proofs, sign them, and access the USDC deposited in the protocol. Initially governance will consist of a multisig and will be decentralized in the future.

-   **Proxy or Notary collusion:** If there is collusion between the buyer and the Notary or Proxy then there is possibility of forging proofs to access seller liquidity

-   **Proxy MITM attack:** It is theoretically possible for the buyer to man in the middle attack a proxy-TLS solution by injecting spoofed ciphertext packets in between the proxy and the server / datacenter when the data is going to be signed by the proxy. This is highly unlikely as attacker must be near a data center and incentivized to pull off the attack when single transaction amounts are not high. We will be monitoring this in the future, and as we scale up limits and MPC TLS becomes more production ready, we will switch to this which cannot be attacked by a MITM

-   **Reversible Transactions:** Web2 transactions are potentially reversible. An on-ramper after claiming your USDC may be able to reverse your transaction. We have restricted the on-ramp amount and frequency to disincentivize this behavior. Also, you can block a malicious on-ramper to prevent them from opening an order against your deposit

## On-ramp Risks

-   **Privacy Concerns:** All proving is conducted locally, sensitive data is redacted prior to posting onchain, but you are leaking your username to the seller when onramping

-   **API Change:** If the payment platform alters its API format, the existing integrations may no longer be valid for proof generation, even if the off-chain payment has already been made. This could prevent the completion of the on-ramping process. If this happens, governance will try to update the smart contract processors to allow the continued functioning of the protocol.

## Banking Risks 

- **Flagged Transactions:** Some banks or payment platforms may flag or restrict accounts that appear to be involved in crypto-related activity. While ZKP2P never directly interacts with your fiat or bank account, using terms like "crypto", "USDC", or "zkp2p" in payment descriptions may raise suspicion with certain institutions. 

    To reduce risk, avoid referencing crypto in your payment notes and consider using banks or payment providers known to be neutral or supportive of digital asset activity.

## Fiat Custody Risk

- **Non-Custodial Design:** ZKP2P does not handle fiat directly. Users retain full control of their funds and initiate payments through external platforms. This minimizes platform risk and regulatory exposure, but means that users are solely responsible for managing their interactions with payment providers. 

**_The protocol cannot reverse payments, freeze funds, or mediate disputes related to off-platform fiat activity._**


### Audits
-   Reclaim circuits that are used in our zkTLS flows are [audited by ZKSecurity](https://www.zksecurity.xyz/blog/posts/reclaim/)
-   ZKP2P V2 Protocol has been audited by independent smart contract security engineers and Sherlock.