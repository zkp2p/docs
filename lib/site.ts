export const siteConfig = {
  name: 'Peer Docs',
  title: 'Peer Documentation',
  description: 'Any currency. Any coin. Anywhere.',
  siteUrl: 'https://docs.peer.xyz',
  ogImage: '/img/link-preview.png',
  githubUrl: 'https://github.com/zkp2p',
  xUrl: 'https://x.com/peerxyz',
  telegramUrl: 'https://t.me/+XDj9FNnW-xs5ODNl',
  discordUrl: 'https://discord.gg/4hNVTv2MbH',
} as const;

export const footerSections = [
  {
    title: 'Documentation',
    items: [
      { label: 'User', href: '/guides/for-buyers/complete-guide-to-onboarding' },
      { label: 'Protocol', href: '/protocol/zkp2p-protocol' },
      { label: 'Developer', href: '/developer/integrate-zkp2p/integrate-redirect-onramp' },
    ],
  },
  {
    title: 'Community',
    items: [
      { label: 'Discord', href: siteConfig.discordUrl },
      { label: 'Twitter/X', href: siteConfig.xUrl },
      { label: 'Telegram', href: siteConfig.telegramUrl },
    ],
  },
  {
    title: 'More',
    items: [
      { label: 'Peer', href: 'https://peer.xyz' },
      { label: 'GitHub', href: siteConfig.githubUrl },
      { label: 'Contact', href: 'mailto:team@peer.xyz' },
      { label: 'Brand Kit', href: '/brand-kit' },
      { label: 'Blog', href: '/blog' },
      { label: 'Ecosystem', href: '/ecosystem' },
    ],
  },
] as const;

export const ecosystemProjects = [
  {
    name: 'USDCtoFiat',
    description:
      'Convert USDC to fiat currencies through non-custodial smart contracts on Base. Supports USD, EUR, and GBP via Venmo, PayPal, Revolut, Wise, Zelle, and CashApp.',
    href: 'https://usdctofiat.xyz',
    logo: '/img/ecosystem/usdctofiat.png',
    category: 'Integration',
  },
  {
    name: 'Peerlytics',
    description:
      'Analytics dashboard and explorer for the ZKP2P protocol. Search addresses, transactions, and deposit IDs. Track volume, active traders, liquidity depth, and currency breakdowns.',
    href: 'https://peerlytics.xyz',
    logo: '/img/ecosystem/peerlytics.svg',
    category: 'Analytics',
  },
  {
    name: 'Peer Domains',
    description:
      'Register .peer domain names on Ethereum. Mint Peer Cards, customizable NFT identity cards with transaction history, social links, and Peerlytics integration.',
    href: 'https://peer.domains',
    logo: '/img/ecosystem/peerdomains.svg',
    category: 'Domains',
  },
  {
    name: 'Bread',
    description:
      'A worker-owned cooperative building financial solidarity tools. Bake $BREAD, a stablecoin pegged 1:1 to USD, to fund community projects, group savings, and mutual aid.',
    href: 'https://bread.coop',
    logo: '/img/ecosystem/bread.svg',
    category: 'Integration',
  },
  {
    name: 'Zagnu',
    description:
      'Airbnb, but for your Venmo account. Provide liquidity and earn yield from verified buyers, built on Peer contracts.',
    href: 'https://zagnu.com',
    logo: '/img/ecosystem/zagnu.png',
    category: 'Integration',
  },
] as const;
