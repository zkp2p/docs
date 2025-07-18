// @ts-check
// `@type` JSDoc annotations allow editor autocompletion and type checking
// (when paired with `@ts-check`).

import {themes as prismThemes} from 'prism-react-renderer';

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'ZKP2P Docs',
  tagline: 'The permissionless fiat ↔ crypto ramp',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
  },

  url: 'https://zkp2p.xyz',
  baseUrl: '/',

  organizationName: 'zkp2p', // GitHub org/user
  projectName: 'docs', // GitHub repo name

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          id: 'guides',
          path: 'guides',
          routeBasePath: 'guides',
          sidebarPath: require.resolve('./guides-sidebars.js'),
          editUrl: 'https://github.com/zkp2p/docs/edit/main/',
        },
        blog: false,
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'protocol',
        path: 'protocol',
        routeBasePath: 'protocol',
        sidebarPath: require.resolve('./protocol-sidebars.js'),
        editUrl: 'https://github.com/zkp2p/docs/edit/main/',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'developer',
        path: 'developer',
        routeBasePath: 'developer',
        sidebarPath: require.resolve('./developer-sidebars.js'),
        editUrl: 'https://github.com/zkp2p/docs/edit/main/',
      },
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'brand-kit',
        path: 'brand-kit',
        routeBasePath: 'brand-kit',
        sidebarPath: require.resolve('./brand-kit-sidebars.js'),
        editUrl: 'https://github.com/zkp2p/docs/edit/main/',
      },
    ],


  ],

  themeConfig:
    /** @type {import('@docusaurus/types').ThemeConfig} */
    ({
      colorMode: {
        defaultMode: 'dark',
        disableSwitch: true,
        respectPrefersColorScheme: false,
      },
      navbar: {
        title: 'ZKP2P',
        logo: {
          alt: 'ZKP2P Logo',
          src: 'img/logo.svg',
        },
        items: [
                    {
            type: 'docSidebar',
            sidebarId: 'defaultSidebar',
            docsPluginId: 'guides',
            position: 'left',
            label: 'User',
          },
          {
            type: 'docSidebar',
            sidebarId: 'defaultSidebar',
            docsPluginId: 'protocol',
            position: 'left',
            label: 'Protocol',
          },
          {
            type: 'docSidebar',
            sidebarId: 'defaultSidebar',
            docsPluginId: 'developer',
            position: 'left',
            label: 'Developer',
          },
          {
            to: '/team',
            label: 'Team',
            position: 'right',
          },
          {
            type: 'docSidebar',
            sidebarId: 'defaultSidebar',
            docsPluginId: 'brand-kit',
            position: 'right',
            label: 'Brand Kit',
          },
          {
            to: '/blogs',
            label: 'Blogs',
            position: 'right',
          },
          {
            href: 'https://github.com/zkp2p',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Documentation',
            items: [
              {
                label: 'User',
                to: '/guides/for-buyers/complete-guide-to-onboarding',
              },
              {
                label: 'Protocol',
                to: '/protocol/developer-v2-protocol',
              },
              {
                label: 'Developer',
                to: '/developer/integrate-zkp2p/integrate-redirect-onramp',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Telegram',
                href: 'https://t.me/zk_p2p',
              },
              {
                label: 'Twitter/X',
                href: 'https://twitter.com/zkp2p',
              },
            ],
          },
          {
            title: 'More',
            items: [
              {
                label: 'ZKP2P',
                href: 'https://zkp2p.xyz',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/zkp2p',
              },
              {
                label: 'Support',
                href: 'https://support.zkp2p.xyz',
              },
              {
                label: 'Brand Kit',
                to: '/brand-kit',
              },
              {
                label: 'Blogs',
                to: '/blogs',
              },
            ],
          },
        ],
        copyright: `© ${new Date().getFullYear()} P2P Labs Inc.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
      algolia: false,
    }),
};

export default config;
