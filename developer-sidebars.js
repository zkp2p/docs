module.exports = {
  defaultSidebar: [
    'integrate-zkp2p/integrate-redirect-onramp',
    {
      type: 'category',
      label: 'API (V3)',
      items: [
        'api/v3/onramp-integration',
        'api/v3/offramp-integration',
      ],
    },
    {
      type: 'category',
      label: 'API (V2)',
      items: [
        'api/onramp-integration',
        'api/offramp-integration',
      ],
    },
    'build-new-provider',
  ],
};
