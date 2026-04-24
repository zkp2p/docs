---
title: PeerAuth Extension
---

ZKP2P uses a cryptographic technology called zkTLS. zkTLS allows users to securely and privately export data similar to [OAuth](https://oauth.net/2/) but for any website even if there are no public APIs. This is powerful because users can now free their data from monopolies held by the largest providers such as Google or Facebook.

The flow uses Zero Knowledge Proofs (ZKP) and Multi-Party Computation (MPC) to let users selectively share their data in a verifiable, privacy-preserving way.


## PeerAuth: Authenticate and use credentials across websites

The PeerAuth extension is a browser companion that provides a simple interface for users to generate zkTLS proofs for protocols that require verified credentials such as ZKP2P. The extension is headless meaning no popups or extra clicks from the user, and all data is stored locally thus preserving privacy for users.

#### Functions

PeerAuth plays a key role in helping buyers authenticate their payment transactions for the fastest and cheapest fiat to crypto onramp experience. Its primary functions include:

-   Assisting with Data Flow: The extension fetches and displays the required data from the web2 page you're on, guiding you through the process.

-   Returns metadata: It returns metadata from the website that require your input, prompting you to generate a proof for the right payment transaction

-   Fetching Necessary Cookies: The extension retrieves the relevant cookies from sites you're logged into. These cookies are used to generate proof of web2 data, such as previous 10 Venmo transactions.

***Note*:** All data stays on the user's device — only zero-knowledge proofs leave. Private data not relevant to proving validity is redacted before sharing with our deployed verifier.

Currently, PeerAuth only supports ZKP2P as its first integration, but the extension is generalized to support OAuth into any website.

![PeerAuth](/img/developer/PeerAuth1.avif)  


#### Install

You can install the [**ZKP2P PeerAuth Extension**](https://chromewebstore.google.com/detail/zkp2p-extension/ijpgccednehjpeclfcllnjjcmiohdjih?hl=en&authuser=3&pli=1) from the Chrome web store.
