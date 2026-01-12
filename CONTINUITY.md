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

State:
- Onramp integration docs updated with SDK extension helper usage; changes not yet committed.

Done:
- Located onramp integration docs and SDK extension helpers in zkp2p-clients.
- Added Peer Extension SDK usage sections and updated Getting Started copy in the onramp integration docs.

Now:
- Create a docs branch, commit the changes, and push.

Next:
- Create branch, commit, and push changes.

Open questions (UNCONFIRMED if needed):
- Preferred branch name for docs update? UNCONFIRMED.

Working set (files/ids/commands):
- CONTINUITY.md
- developer/api/onramp-integration.md
- developer/api/v3/onramp-integration.md
- /home/ubuntu/zkp2p/zkp2p-clients/packages/sdk/src/extension.ts
