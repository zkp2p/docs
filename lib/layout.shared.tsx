import Image from 'next/image';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      url: '/',
      transparentMode: 'top',
      title: (
        <span className="site-brand">
          <Image
            src="/img/brand-kit/logos/peer-logo-white.svg"
            alt="Peer"
            width={88}
            height={24}
            priority
          />
          <span className="site-brand-copy">Docs</span>
        </span>
      ),
    },
    themeSwitch: {
      enabled: false,
    },
    searchToggle: {
      enabled: false,
    },
    links: [
      {
        text: 'User',
        url: '/guides',
        active: 'nested-url',
      },
      {
        text: 'Protocol',
        url: '/protocol',
        active: 'nested-url',
      },
      {
        text: 'Developer',
        url: '/developer',
        active: 'nested-url',
      },
      {
        text: 'Brand Kit',
        url: '/brand-kit',
        active: 'nested-url',
      },
      {
        text: 'Blog',
        url: '/blog',
        active: 'nested-url',
      },
      {
        text: 'Ecosystem',
        url: '/ecosystem',
        active: 'nested-url',
      },
      {
        text: 'GitHub',
        url: 'https://github.com/zkp2p',
        external: true,
        active: 'none',
      },
    ],
  };
}
