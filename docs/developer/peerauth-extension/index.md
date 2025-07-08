---
title: PeerAuth Extension
---

At the heart of ZKP2P, we use a cryptographic technology called zkTLS. zkTLS allows users to securely and privately export data similar to [OAuth](https://oauth.net/2/) but for any website even if there are no public APIs. This is powerful as users can now free their data from monopolies held by the the largest providers such as Google or Facebook.

The entire flow is powered by advanced cryptographic techniques like Zero Knowledge Proofs (ZKP) and Multi-Party Computation (MPC), to enable users to selectively share their data in a verifiable yet privacy-preserving manner.


## PeerAuth: Authenticate and use credentials across websites

The PeerAuth extension is a browser companion that provides a simple interface for users to generate zkTLS proofs for protocols that require verified credentials such as ZKP2P. The extension is headless meaning no popups or extra clicks from the user, and all data is stored locally thus preserving privacy for users.

#### Functions

PeerAuth plays a key role in helping buyers authenticate their payment transactions for the fastest and cheapest fiat to crypto onramp experience. Its primary functions include:

-   Assisting with Data Flow: The extension fetches and displays the required data from the web2 page you're on, guiding you through the process.

-   Returns metadata: It returns metadata from the website that require your input, prompting you to generate a proof for the right payment transaction

-   Fetching Necessary Cookies: The extension retrieves the relevant cookies from sites you're logged into. These cookies are used to generate proof of web2 data, such as previous 10 Venmo transactions.

***Note*:** All data collected strictly stays on the user's device and only zero-knowledge proofs of their data leave their devices. All private data that isn't relevant to proving the validity of a ticket or a ticket transfer, is redacted before sharing with our deployed verifier.

Currently, PeerAuth only supports ZKP2P as its first integration, but the extension is generalized to support OAuth into any website.

![](https://docs.zkp2p.xyz/~gitbook/image?url=https%3A%2F%2F3629680097-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252F6e2L3XxfmJSq8oZRw1gA%252Fuploads%252Fjhh6aWqabuBuTgu7wpa0%252Fextension_diagram.png%3Falt%3Dmedia%26token%3Dcd72adcd-2427-4889-9c3f-4eae8d7fde3a&width=768&dpr=4&quality=100&sign=52091610&sv=2)

#### Install

You can install the [ZKP2P PeerAuth](https://chromewebstore.google.com/detail/zkp2p-extension/ijpgccednehjpeclfcllnjjcmiohdjih?hl=en&authuser=3&pli=1) from the Chrome web store.