module.exports = {
  defaultSidebar: [
    { type: 'doc', id: 'quickstart', label: 'Quickstart' },
    { type: 'doc', id: 'architecture', label: 'Architecture' },
    { type: 'doc', id: 'use-cases', label: 'What Can You Build?' },
    {
      type: 'category',
      label: 'Integration Guides',
      collapsed: false,
      items: [
        {
          type: 'doc',
          id: 'integrate-zkp2p/integrate-redirect-onramp',
          label: 'Onramp Integration',
        },
        { type: 'doc', id: 'offramp-integration', label: 'Offramp Integration' },
        { type: 'doc', id: 'post-intent-hooks', label: 'Intent Hooks' },
        { type: 'doc', id: 'build-payment-integration', label: 'Build a Payment Integration' },
      ],
    },
    {
      type: 'category',
      label: 'Tutorials',
      collapsed: false,
      items: [
        { type: 'doc', id: 'tutorials/onramp-widget', label: 'Build an Onramp Widget' },
        { type: 'doc', id: 'tutorials/maker-bot', label: 'Build a Maker Bot' },
        { type: 'doc', id: 'tutorials/vault-dashboard', label: 'Build a Vault Dashboard' },
      ],
    },
    {
      type: 'category',
      label: 'Cookbook',
      collapsed: false,
      items: [
        { type: 'doc', id: 'cookbook/prepared-transactions', label: 'Prepared Transactions' },
        { type: 'doc', id: 'cookbook/referral-fees', label: 'Referral Fees & Attribution' },
        { type: 'doc', id: 'cookbook/oracle-rates', label: 'Oracle Rate Configuration' },
        { type: 'doc', id: 'cookbook/batch-operations', label: 'Batch Operations' },
        { type: 'doc', id: 'cookbook/error-handling', label: 'Error Handling & Retries' },
        { type: 'doc', id: 'cookbook/environments', label: 'Multi-Environment Deployment' },
        { type: 'doc', id: 'cookbook/indexer-queries', label: 'Indexer Pagination & Filtering' },
        { type: 'doc', id: 'cookbook/extension-deeplinks', label: 'Extension Deeplinks' },
        { type: 'doc', id: 'cookbook/taker-tiers', label: 'Taker Tiers' },
        { type: 'doc', id: 'cookbook/delegation', label: 'Delegation State Machine' },
      ],
    },
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
