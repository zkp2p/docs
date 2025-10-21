module.exports = {
  defaultSidebar: [
    {
      type: 'category',
      label: 'Protocol V3',
      items: [
        { type: 'doc', id: 'v3/v3-overview', label: 'Overview' },
        { type: 'doc', id: 'v3/v3-architecture', label: 'Architecture' },
        {
          type: 'category',
          label: 'Smart Contracts',
          link: { type: 'doc', id: 'v3/v3-smart-contracts' },
          items: [],
        },
        { type: 'doc', id: 'v3/v3-attestation-service', label: 'Attestation Service' },
        { type: 'doc', id: 'v3/v3-gating-service', label: 'Gating Service' },
        { type: 'doc', id: 'v3/v3-peerauth-extension', label: 'PeerAuth Extension' },
        { type: 'doc', id: 'v3/v3-migration', label: 'Migration (V2 → V3)' },
      ],
    },
    {
      type: 'category',
      label: 'Protocol V2 (Archived)',
      items: [
        { type: 'doc', id: 'developer-v2-protocol', label: 'The ZKP2P V2 Protocol' },
        {
          type: 'category',
          label: 'Smart Contracts',
          link: { type: 'doc', id: 'v2/smart-contracts/index' },
          items: [
            {
              type: 'category',
              label: 'Escrow',
              link: { type: 'doc', id: 'v2/smart-contracts/escrow/index' },
              items: ['v2/smart-contracts/escrow/v2-iescrow'],
            },
            'v2/smart-contracts/v2-ipaymentverifier',
            'v2/smart-contracts/v2-deployments',
          ],
        },
        {
          type: 'category',
          label: 'PeerAuth Extension',
          link: { type: 'doc', id: 'v2/peerauth-extension/index' },
          items: ['v2/peerauth-extension/zk-tls'],
        },
        'v2/gating-service',
      ],
    },
  ],
};
