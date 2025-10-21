module.exports = {
  defaultSidebar: [
    // 0. The ZKP2P Protocol (root)
    { type: 'doc', id: 'zkp2p-protocol', label: 'The ZKP2P Protocol' },

    // 1. Protocol V3
    {
      type: 'category',
      label: 'Protocol V3',
      collapsible: true,
      collapsed: false,
      items: [
        { type: 'doc', id: 'v3/v3-overview', label: 'Overview' },
        { type: 'doc', id: 'v3/v3-architecture', label: 'Architecture' },
        {
          type: 'category',
          label: 'Smart Contracts',
          link: { type: 'doc', id: 'v3/v3-smart-contracts' },
          items: [
            'v3/smart-contracts/escrow/index',
            'v3/smart-contracts/orchestrator',
            'v3/smart-contracts/unified-payment-verifier',
          ],
        },
        { type: 'doc', id: 'v3/v3-attestation-service', label: 'Attestation Service' },
        { type: 'doc', id: 'v3/v3-migration', label: 'Migration (V2 → V3)' },
      ],
    },

    // 2. PeerAuth Extension (root)
    {
      type: 'category',
      label: 'PeerAuth Extension',
      link: { type: 'doc', id: 'peerauth-extension/index' },
      items: ['peerauth-extension/zk-tls'],
    },

    // 3. Gating Service (root)
    { type: 'doc', id: 'gating-service', label: 'Gating Service' },

    // 4. Protocol V2
    {
      type: 'category',
      label: 'Protocol V2',
      collapsible: true,
      collapsed: true,
      items: [
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
      ],
    },
  ],
};
