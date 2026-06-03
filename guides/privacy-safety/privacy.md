---
id: privacy
title: Privacy
---

ZKP2P keeps your transactions private and your personal data off-chain.

> **How does buyer payment verification work now?**

For supported payment methods, Peer uses Buyer TEE verification instead of the older Reclaim/PeerAuth proof-generation flow. The app verifies a secure enclave before payment verification material is encrypted and sent for checking. The enclave verifies that the payment matches your order and returns the attestation used to release funds.

> **I'm concerned that I'm giving PeerAuth OAuth access to all of my data when I'm on a website.**

PeerAuth/Reclaim is the older proof-generation flow and is not the default buyer verification path for supported payment methods. In the current Buyer TEE flow, verification material is encrypted to the verified enclave. Only data needed to confirm the payment should be used for the order verification.

Peer does not put your personal payment data on-chain. The on-chain settlement uses an attestation that the payment matched the order.

> **Who sees my personal data (like Revtag or Venmo username)?**

Your account information from your chosen payment provider(s) is only exposed to the counterparty who is sending you funds or who you are receiving funds from. This data is not available to anyone else onchain.
