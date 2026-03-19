import { DocsSectionLayout } from '@/components/docs-section-layout';
import { protocolSource } from '@/lib/source';

export default function ProtocolLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DocsSectionLayout tree={protocolSource.pageTree}>{children}</DocsSectionLayout>;
}
