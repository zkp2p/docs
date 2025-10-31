module.exports = {
  defaultSidebar: [
    {
      type: 'category',
      label: 'Introduction',
      link: { type: 'doc', id: 'introduction/zkp2p' },
      items: [],
    },
    {
      type: 'category',
      label: 'For Buyers',
      link: { type: 'doc', id: 'for-buyers/index' },
      items: [
        'for-buyers/complete-guide-to-onboarding',
        'for-buyers/handling-verification-issues',
        'for-buyers/guide-to-partial-release'
        ],
    },
    {
      type: 'category',
      label: 'For Sellers',
      link: { type: 'doc', id: 'for-sellers/index' },
      items: [
        'for-sellers/provide-liquidity-sell-usdc',
        'for-sellers/provide-liquidity-diff-chain',
        'for-sellers/update-usdc-rates',
        'for-sellers/calculating-apr',
        'for-sellers/manual-releases'

      ],
    },
    {
      type: 'category',
      label: 'Privacy & Safety',
      link: { type: 'doc', id: 'privacy-safety/index' },
      items: [
        'privacy-safety/privacy',
        'privacy-safety/risks',
      ],
    },
  ],
};
