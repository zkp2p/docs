module.exports = {
  defaultSidebar: [
    {
      type: 'doc',
      id: 'integrate-zkp2p/integrate-redirect-onramp',
      label: 'Onramp Integration',
    },
    { type: 'doc', id: 'offramp-integration', label: 'Offramp Integration' },
    { type: 'doc', id: 'post-intent-hooks', label: 'Intent Hooks' },
    { type: 'doc', id: 'build-payment-integration', label: 'Build a Payment Integration' },
    {
      type: 'category',
      label: 'SDK Reference',
      link: { type: 'doc', id: 'sdk/sdk-overview' },
      items: [
        { type: 'doc', id: 'sdk/sdk-client-reference', label: 'Client Reference' },
        { type: 'doc', id: 'sdk/sdk-react-hooks', label: 'React Hooks' },
      ],
    },
  ],
};
