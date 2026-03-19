import { DocsSectionLayout } from '@/components/docs-section-layout';
import { guidesSource } from '@/lib/source';

export default function GuidesLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DocsSectionLayout tree={guidesSource.pageTree}>{children}</DocsSectionLayout>;
}
