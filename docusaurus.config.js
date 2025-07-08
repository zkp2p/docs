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
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/zkp2p/docs/edit/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          editUrl: 'https://github.com/zkp2p/docs/edit/main/',
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: 'img/social-preview.png', // Customize this
      navbar: {
        title: 'ZKP2P',
        logo: {
          alt: 'ZKP2P Logo',
          src: 'img/logo.svg',
        },
        items: [
          {
            type: 'docSidebar',
            sidebarId: 'docsSidebar', // ✅ Matches sidebars.js
            position: 'left',
            label: 'Docs',
          },
          {to: '/blog', label: 'Blog', position: 'left'},
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
            title: 'Docs',
            items: [
              {
                label: 'User Guides',
                to: '/docs/user-guides/for-buyers/complete-guide-to-onboarding',
              },
              {
                label: 'Developer',
                to: '/docs/developer/v2-protocol',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Telegram',
                href: 'https://t.me/zkp2p',
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
                label: 'Main Site',
                href: 'https://zkp2p.xyz',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/zkp2p',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} ZKP2P. Built with Docusaurus.`,
      },
      prism: {
        theme: prismThemes.github,
        darkTheme: prismThemes.dracula,
      },
    }),
};

export default config;
