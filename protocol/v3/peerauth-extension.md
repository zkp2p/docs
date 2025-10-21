---
id: v3-peerauth-extension
slug: /protocol/v3/peerauth-extension
title: PeerAuth Extension (V3)
---

# PeerAuth Extension (V3)

PeerAuth usage remains the same in V3. The extension exposes a `window.zktls` API for authenticating with providers (e.g., Venmo, Revolut, Wise) and generating proof material that the Attestation Service consumes.

Quick start
```js
// Check availability
if (typeof window.zktls !== 'undefined') {
  await window.zktls.requestConnection();
}

// Authenticate into a provider (opens a new tab)
window.zktls.authenticate({ actionType: 'transfer_venmo', platform: 'venmo' });

// Generate a proof (note: V3 still expects the same PeerAuth proof shapes)
const { proofId } = await window.zktls.generateProof({
  intentHash: '1234',      // decimal form of on-chain intent hash
  originalIndex: 0,
  platform: 'venmo'
});

// Fetch proof JSON (pass to Attestation Service)
const { notaryRequest } = await window.zktls.fetchProofById(proofId);
```

Notes
- In V3, the Attestation Service passes the `intent.fiatCurrency` into transformers so providers with dual-currency views (e.g., Wise) can deterministically pick the side matching the intent.
- See developer docs for the full `window.zktls` API and provider list in `docs/developer/api/onramp-integration.md`.
