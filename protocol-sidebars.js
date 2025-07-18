module.exports = {
  defaultSidebar: [
    {
      type: 'doc',
      id: 'developer-v2-protocol',
      label: 'The ZKP2P V2 Protocol',
    },
    {
      type: 'category',
      label: 'Smart Contracts',
      link: { type: 'doc', id: 'smart-contracts/index' },
      items: [
        {
          type: 'category',
          label: 'Escrow',
          link: { type: 'doc', id: 'smart-contracts/escrow/index' },
          items: ['smart-contracts/escrow/iescrow'],
        },
        'smart-contracts/ipaymentverifier',
        'smart-contracts/deployments',
      ],
    },
    {
      type: 'category',
      label: 'PeerAuth Extension',
      link: { type: 'doc', id: 'peerauth-extension/index' },
      items: [
        'peerauth-extension/zk-tls',
      ],
    },
    'gating-service'
  ],
};