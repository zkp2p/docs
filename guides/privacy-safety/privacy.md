---
id: privacy
title: Privacy
---

ZKP2P is committed to making sure that your transactions are as private as possible, and that your personal data is not exposed in anyway.


> **I'm concerned that I'm giving PeerAuth OAuth access to all of my data when I'm on a website.**

When PeerAuth views data after an OAuth (e.g. Sign In With Venmo), only select data is revealed to the webpage by the extension. All data not required for a successful on-chain transaction is blinded. As part of the extension logic we redact all data except the required fields which prevents any additional account details being leaked other than data related to a transaction.

All data remains local in your browser and nothing is stored across sessions. Additionally to verify client build is correct, you can inspect the Networks tab in your browser Developer Tools to ensure no data is leaked from your browser. 

> **Who sees my personal data (like Revtag or Venmo username)?**

Your account information from your chosen payment provider(s) is only exposed to the counterparty who is sending you funds or who you are receiving funds from. This data is not available to anyone else onchain.