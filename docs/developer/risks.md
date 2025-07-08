---
id: risks
title: Risks
---

## Off-ramp Risks

-   Governance-Controlled Public Key: The protocol's governance can update the public key of the witness associated with payment verifiers. If the new key is under their control, they could potentially forge proofs, sign them, and access the USDC deposited in the protocol. Initially governance will consist of a multisig and will be decentralized in the future.

-   Proxy or Notary colllusion: If there is collusion between the buyer and the Notary or Proxy then there is possibility of forging proofs to access seller liquidity

-   Proxy MITM attack: It is theoretically possible for the buyer to man in the middle attack a proxy-TLS solution by injecting spoofed ciphertext packets in between the proxy and the server / datacenter when the data is going to be signed by the proxy. This is highly unlikely as attacker must be near a data center and incentivized to pull off the attack when single transaction amounts are not high. We will be monitoring this in the future, and as we scale up limits and MPC TLS becomes more production ready, we will switch to this which cannot be attacked by a MITM

-   Reversible Transactions: Web2 transactions are potentially reversible. An on-ramper after claiming your USDC may be able to reverse your transaction. We have restricted the on-ramp amount and frequency to disincentivize this behavior. Also, you can block a malicious on-ramper to prevent them from opening an order against your deposit

## On-ramp Risks

-   Privacy Concerns: All proving is conducted locally, sensitive data is redacted prior to posting onchain, but you are leaking your username to the seller when onramping

-   API Change: If the payment platform alters its API format, the existing integrations may no longer be valid for proof generation, even if the off-chain payment has already been made. This could prevent the completion of the on-ramping process. If this happens, governance will try to update the smart contract processors to allow the continued functioning of the protocol.