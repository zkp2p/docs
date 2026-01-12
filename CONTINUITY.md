Goal (incl. success criteria):
- Update the onramp integration docs to reflect the latest extension interface changes and push an updated PR branch.

Constraints/Assumptions:
- Maintain this ledger each turn; begin replies with a Ledger Snapshot.
- Use rg for searches when possible.
- Keep edits ASCII unless needed.
- Full access now enabled (per user).

Key decisions:
- Update both v2 and v3 onramp integration pages.
- Keep the existing `window.zktls` proof API sections and add SDK usage above them.
- Update onramp SDK usage to pass a params object instead of a query string.
- Use branch `docs/sdk-extension-onramp` unless user requests another. UNCONFIRMED.

State:
- Onramp SDK snippets updated for the new params-based API; changes not yet committed.

Done:
- Located onramp integration docs and SDK extension helpers in zkp2p-clients.
- Added Peer Extension SDK usage sections and updated Getting Started copy in the onramp integration docs.
- Created branch `docs/sdk-extension-onramp`, committed, and pushed.
- Reviewed updated extension interface in `/home/ubuntu/zkp2p/zkp2p-clients/packages/sdk/src/extension.ts`.
- Updated onramp integration docs to use params object for `peerExtensionSdk.onramp`.

Now:
- Commit, push, and open a PR with the latest doc updates.

Next:
- Commit, push, and open a PR.

Open questions (UNCONFIRMED if needed):
- None.

Working set (files/ids/commands):
- CONTINUITY.md
- developer/api/onramp-integration.md
- developer/api/v3/onramp-integration.md
- /home/ubuntu/zkp2p/zkp2p-clients/packages/sdk/src/extension.ts
