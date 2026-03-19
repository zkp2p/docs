import type { ComponentProps, ReactNode } from 'react';

import { DocsLayout } from 'fumadocs-ui/layouts/docs';

import { SiteFooter } from '@/components/site-footer';
import { baseOptions } from '@/lib/layout.shared';

type DocsSectionLayoutProps = {
  children: ReactNode;
  tree: ComponentProps<typeof DocsLayout>['tree'];
};

export function DocsSectionLayout({ children, tree }: DocsSectionLayoutProps) {
  return (
    <>
      <DocsLayout {...baseOptions()} tree={tree}>
        {children}
      </DocsLayout>
      <SiteFooter />
    </>
  );
}
