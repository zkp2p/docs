Goal (incl. success criteria):
- Update the onramp integration docs to use SDK extension helpers (peerExtensionSdk) instead of direct window peer APIs, then create and push a docs branch.

Constraints/Assumptions:
- Maintain this ledger each turn; begin replies with a Ledger Snapshot.
- Use rg for searches when possible.
- Keep edits ASCII unless needed.
- Full access now enabled (per user).

Key decisions:
- Update both v2 and v3 onramp integration pages.
- Keep the existing `window.zktls` proof API sections and add SDK usage above them.
- Use branch `docs/sdk-extension-onramp`.

State:
- Changes committed and pushed to `origin/docs/sdk-extension-onramp`.

Done:
- Located onramp integration docs and SDK extension helpers in zkp2p-clients.
- Added Peer Extension SDK usage sections and updated Getting Started copy in the onramp integration docs.
- Created branch `docs/sdk-extension-onramp`, committed, and pushed.

Now:
- Await further instructions or PR request.

Next:
- None.

Open questions (UNCONFIRMED if needed):
- None.

Working set (files/ids/commands):
- CONTINUITY.md
- developer/api/onramp-integration.md
- developer/api/v3/onramp-integration.md
- /home/ubuntu/zkp2p/zkp2p-clients/packages/sdk/src/extension.ts
