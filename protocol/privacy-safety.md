---
id: privacy-safety
title: Privacy and Safety
---

### zkTLS OAuth

I'm concerned that I'm giving PeerAuth OAuth access to all of my data when I'm on a website.

When PeerAuth views data after an OAuth (e.g. Sign In With Venmo), only select data is revealed to the webpage by the extension. All data not required for a successful on-chain transaction is blinded. As part of the extension logic we redact all data except the required fields which prevents any additional account details being leaked other than data related to a transaction.

All data remains local in your browser and nothing is stored across sessions. Our client is fully [open source](https://github.com/zkp2p/zkp2p-v2-client). Additionally to verify client build is correct, you can inspect the Networks tab in your browser Developer Tools to ensure no data is leaked from your browser