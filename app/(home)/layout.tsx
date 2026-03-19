import { HomeLayout } from 'fumadocs-ui/layouts/home';

import { SiteFooter } from '@/components/site-footer';
import { baseOptions } from '@/lib/layout.shared';

export default function MarketingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <HomeLayout {...baseOptions()} className="site-home-layout">
        {children}
      </HomeLayout>
      <SiteFooter />
    </>
  );
}
