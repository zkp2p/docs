---
id: zk-tls
title: zkTLS
---

# zkTLS

## Overview

At ZKP2P, we make heavy use of zkTLS techniques to prove authenticity of data while preserving user privacy. zkTLS enables us to port any data from the web served through TLS1.2 and TLS1.3 to smart contracts. In particular, there are 2 techniques: TLSNotary (MPC-TLS) and TLSProxy (proxy based approach e.g [Reclaim Protocol](https://reclaimprotocol.org/))


## TLSNotary

### Notary

The Notary runs the 2PC-TLS protocol with the Buyer and attests the transcript to make the data portable. The buyer submits that attestation as the proof of payment to the verifier contract on-chain. Currently, ZKP2P provides a hosted Notary to its users via the ZKP2P extension.

#### Generating proof of payment for ZKP2P using TLSN

 
![zkTLS 1](/img/developer/zkTLS1.webp)  




#### Simplified 2PC-TLS protocol between the Prover and the Verifier (Notary)

![zkTLS 2](/img/developer/zkTLS2.avif)  


### WebSocket Proxy

Since a web browser can't make TCP connection, we need to use a WebSocket proxy server. ZKP2P provides a hosted WebSocket proxy to all its users via the ZKP2P extension. The proxy only forwards encrypted data from the Prover to the server and returns the encrypted response returned from the server back to the Prover. If the proxy fails the user can always run their proxy to forward the request to the server.

### Decentralization of Notaries

Note that, the seller is trusting the Notary to not collude with the Buyer and generate fake proof of payment. The buyer is also trusting the Notary to not censor it. Currently ZKP2P runs both the Notary and websocket proxy. But we are commited to the decentralization roadmap and are coming up with solutions to solve both the collusion and censorship problem in a decentralized way. One solution that we are working on currently is the Optimistic Notarization flow.

#### Optimistic Notarization with a network of Notaries

![zkTLS 3](/img/developer/zkTLS3.webp)

#### Arbitration

-   Optimistic notarization works because seller is incentivized to initiate arbitration if they find a discrepancy

-   Arbitration involves getting majority stake to disagree with initial notarization

    -   For on/off-ramping, proving that seller didn't receive off-chain payment

-   If found guilty, the malicious notary is slashed

-   Slashed amount is used to compensate seller and the network

-   Arbitration is still inefficient

    -   But slashing deters the notary from acting maliciously

    -   Similar to optimistic rollups, don't expect arbitration to happen in 99% of the cases

-   Privacy of data is maintained from notaries due to 2PC-TLS protocol

### References

To understand why we are building with TLSN and the Optimistic Notarization flow please watch our ZK11 talk

To understand TLSNotary, please go through their docs

[![Logo](https://docs.zkp2p.xyz/~gitbook/image?url=https%3A%2F%2Fdocs.tlsnotary.org%2Ffavicon.svg&width=20&dpr=4&quality=100&sign=5161271d&sv=2)Introduction - tlsn-docs](https://docs.tlsnotary.org/)

[](https://docs.zkp2p.xyz/developer/peerauth-extension/zktls#tlsproxy-reclaim)

### TLSProxy (Reclaim)

Unlike TLSNotary, the proxy approach relies on the Notary being in between the Prover (buyer) and the Server. Privacy is still preserved as only encrypted ciphertext is sent from the Prover to the Notary (Witness Proxy), and the prover is the only party that holds the symmetric TLS keys. This approach is significantly more efficient as it removes the need to generate the TLS session keys using 2PC Garbled Circuits.

However, it is not as censorship resistant as the MPC-TLS approach due to the introduction of network topology assumptions. In particular, the server API call is from the Notary (Proxy), not from the prover's home computer, therefore, servers could censor the proxy if its hosted in a datacenter.

Additionally, there is a possibility of a Prover MITM (man-in-the-middle) attack to change packets enroute if they are able to gain access to the port in the datacenter where the Notary (Proxy) is hosted. This is because the Prover holds the TLS keys.

Despite this, we believe the proxy based approach is most production ready and can scale up to a certain dollar amount of value before we need to migrate to TLSNotary. Reclaim protocol has undergone multiple audits ([link](https://reclaimprotocol.org/blog/posts/chacha-circuit-audit)).

Additionally, ZKP2P is built to be generic so we can plug in any primitive as they become mature.

For more details, please check out the Reclaim docs:

[Reclaim Protocol Docs](https://docs.reclaimprotocol.org/)