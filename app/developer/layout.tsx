import { DocsSectionLayout } from '@/components/docs-section-layout';
import { developerSource } from '@/lib/source';

export default function DeveloperLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DocsSectionLayout tree={developerSource.pageTree}>{children}</DocsSectionLayout>;
}
