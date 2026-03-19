import type { DocsRouteProps } from '@/lib/docs';
import { generateDocMetadata, generateDocStaticParams, renderDocPage } from '@/lib/docs';
import { protocolSource } from '@/lib/source';

export function generateStaticParams() {
  return generateDocStaticParams(protocolSource);
}

export async function generateMetadata({ params }: DocsRouteProps) {
  return generateDocMetadata(protocolSource, params);
}

export default async function ProtocolDocPage({ params }: DocsRouteProps) {
  return renderDocPage(protocolSource, params);
}
