module.exports = {
  defaultSidebar: [
    'integrate-zkp2p/integrate-redirect-onramp',
    {
      type: 'category',
      label: 'API (V3)',
      collapsible: true,
      collapsed: false,
      items: [
        { type: 'doc', id: 'api/v3/onramp-integration', label: 'Onramp Integration' },
        { type: 'doc', id: 'api/v3/offramp-integration', label: 'Offramp Integration' },
      ],
    },
    {
      type: 'category',
      label: 'API (V2)',
      collapsible: true,
      collapsed: true,
      items: [
        { type: 'doc', id: 'api/onramp-integration', label: 'Onramp Integration' },
        { type: 'doc', id: 'api/offramp-integration', label: 'Offramp Integration' },
      ],
    },
    { type: 'doc', id: 'post-intent-hooks', label: 'Post‑Intent Hooks' },
    'build-new-provider',
  ],
};
