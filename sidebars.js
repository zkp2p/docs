module.exports = {
  docsSidebar: [
    {
      type: 'category',
      label: 'Introduction',
      link: { type: 'doc', id: 'introduction/zkp2p' },
      items: [],
    },
    {
      type: 'category',
      label: 'User Guides',
      items: [
        {
          type: 'category',
          label: 'For Buyers',
          link: { type: 'doc', id: 'user-guides/for-buyers/index' },
          items: [
            'user-guides/for-buyers/complete-guide-to-onboarding',
            'user-guides/for-buyers/handling-verification-issues',
          ],
        },
        {
          type: 'category',
          label: 'For Sellers',
          link: { type: 'doc', id: 'user-guides/for-sellers/index' },
          items: [
            'user-guides/for-sellers/provide-liquidity-sell-usdc',
            'user-guides/for-sellers/update-usdc-rates',
            'user-guides/for-sellers/tradingview-links',
            'user-guides/for-sellers/calculating-apr',
            'user-guides/for-sellers/manual-releases',
          ],
        },
      ],
    },
    {
      type: 'category',
      label: 'Developer',
      items: [
        // This is the top-level entry: "The ZKP2P V2 Protocol"
        {
          type: 'doc',
          id: 'developer/developer-v2-protocol',
          label: 'The ZKP2P V2 Protocol',
        },
        
        {
          type: 'category',
          label: 'Smart Contracts',
          items: [
            {
              type: 'category',
              label: 'Escrow',
              link: { type: 'doc', id: 'developer/smart-contracts/escrow/index' },
              items: ['developer/smart-contracts/escrow/iescrow'],
            },
            'developer/smart-contracts/ipaymentverifier',
            'developer/smart-contracts/deployments',
          ],
        },
        {
          type: 'category',
          label: 'PeerAuth Extension',
          link: { type: 'doc', id: 'developer/peerauth-extension/index' },
          items: [
            'developer/peerauth-extension/zk-tls',
          ],
        },
        
        'developer/gating-service',
        {
          type: 'category',
          label: 'Integrate ZKP2P',
          link: { type: 'doc', id: 'developer/integrate-zkp2p/index' },
          items: [
            'developer/integrate-zkp2p/integrate-onramp',
            'developer/integrate-zkp2p/integrate-offramp',
          ],
        },
        
        'developer/build-new-provider',
        'developer/security',
        'developer/risks',
        'developer/faq',
        'developer/privacy-safety',
      ],
    },
    {
      type: 'category',
      label: 'Resources',
      items: [
        'resources/team',
        'resources/twitter',
        'resources/github',
        'resources/telegram',
        'resources/website',
      ],
    },
    {
      type: 'doc',
      id: 'brand-kit',
    },
  ],
};
