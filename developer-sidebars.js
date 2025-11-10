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
    'build-new-provider',
    {
      type: 'category',
      label: 'Mobile SDK Integration (Beta)',
      collapsible: true,
      collapsed: false,
      items: [
        { type: 'doc', id: 'mobile-sdk-overview', label: 'Overview' },
        { type: 'doc', id: 'mobile-sdk-installation', label: 'Install & Setup' },
        { type: 'doc', id: 'mobile-sdk-configuration', label: 'Configure the SDK' },
        { type: 'doc', id: 'mobile-sdk-auth-and-proof', label: 'Auth & Proof' },
        { type: 'doc', id: 'mobile-sdk-credential-storage', label: 'Credential Storage' },
        { type: 'doc', id: 'mobile-sdk-client-api', label: 'Client API' },
        { type: 'doc', id: 'mobile-sdk-types', label: 'Types' },
        { type: 'doc', id: 'mobile-sdk-examples', label: 'Examples' },
        { type: 'doc', id: 'mobile-sdk-troubleshooting', label: 'Troubleshooting' },
      ],
    },
  ],
};
