import type { Metadata } from 'next';

import { BrandKitPage } from '@/components/brand-kit-page';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Brand Kit',
  description: 'Download Peer logos, colors, and brand guidelines.',
  openGraph: {
    title: 'Peer Brand Kit',
    description: 'Download Peer logos, colors, and brand guidelines.',
    images: [{ url: siteConfig.ogImage }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Peer Brand Kit',
    description: 'Download Peer logos, colors, and brand guidelines.',
    images: [siteConfig.ogImage],
  },
};

export default function BrandKitRoute() {
  return <BrandKitPage />;
}
