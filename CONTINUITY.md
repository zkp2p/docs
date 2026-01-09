Goal (incl. success criteria):
- Update Onramp Integration quickstart to start with extension install step and note redirect behavior.

Constraints/Assumptions:
- Must consult `../zkp2p-clients` for extension deeplink flow details.
- Follow workspace instructions for doc updates; keep ASCII unless existing file uses Unicode.

Key decisions:
- Use `window.peer.requestConnection()` then `window.peer.onramp(queryString)` where `queryString` is the deeplink params (supports leading `?`).
- Remove onramp integration docs from sidebar and delete the onramp integration doc files.

State:
- Ready to update Onramp Integration quickstart steps.

Done:
- Created continuity ledger.
- Reviewed `../zkp2p-clients` extension API (`injectScript.ts`, onramp deeplink e2e).
- Updated redirect integration docs to use `window.peer` deeplink flow.
- Removed onramp integration docs and sidebar entries; updated protocol references.
- Updated sidebar: top-level Onramp/Offramp integrations; removed Mobile SDK and API V2/V3 sections.
- Removed Mobile SDK docs from disk.
- Updated Offramp Integration slug to drop `/api/v3` and rewrote content from SDK docs.
- Moved Offramp Integration doc to top-level and updated sidebar id.
- Renamed Build a New Provider section to Build a Payment Integration and refreshed quickstart/package usage from `../providers`.
- Added Claude/Codex skill setup section and imported troubleshooting tips from `../zkills`.
- Added extension install step and redirect note to Onramp Integration quickstart.

Now:
- None.

Next:
- None.

Open questions (UNCONFIRMED if needed):
- None.

Working set (files/ids/commands):
- CONTINUITY.md
- developer/integrate-zkp2p/integrate-redirect-onramp.md
