Goal (incl. success criteria):
- Fix Docusaurus build error by resolving invalid sidebar doc id and keep docs aligned with SDK wrapper usage.

Constraints/Assumptions:
- Follow workspace instructions; keep ASCII unless existing files require Unicode.

Key decisions:
- None.

State:
- Fixed sidebar reference for missing doc id `build-new-provider`.

Done:
- Read and refreshed continuity ledger.
- Updated `developer/integrate-zkp2p/integrate-redirect-onramp.md` to use `peerExtensionSdk`.
- Verified no other docs reference `window.peer`.
- Updated `developer-sidebars.js` to use `build-payment-integration`.

Now:
- Ready for user to rerun Docusaurus build.

Next:
- Address any remaining build errors if they appear.

Open questions (UNCONFIRMED if needed):
- None.

Working set (files/ids/commands):
- CONTINUITY.md
- developer-sidebars.js
