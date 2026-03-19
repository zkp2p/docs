import type { Metadata } from 'next';
import localFont from 'next/font/local';

import { RootProvider } from 'fumadocs-ui/provider/next';

import { siteConfig } from '@/lib/site';

import './global.css';

const headlineFont = localFont({
  src: [
    {
      path: '../src/brand/fonts/PPValve-PlainSemibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../src/brand/fonts/PPValve-PlainExtrabold.otf',
      weight: '800',
      style: 'normal',
    },
  ],
  variable: '--font-headline',
  display: 'swap',
});

const bodyFont = localFont({
  src: [
    {
      path: '../src/brand/fonts/Inter-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../src/brand/fonts/Inter-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.siteUrl,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/img/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${headlineFont.variable} ${bodyFont.variable}`}>
        <RootProvider
          search={{ enabled: false }}
          theme={{
            enabled: true,
            defaultTheme: 'dark',
            forcedTheme: 'dark',
            enableSystem: false,
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
