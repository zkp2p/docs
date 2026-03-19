import type { DocsRouteProps } from '@/lib/docs';
import { generateDocMetadata, generateDocStaticParams, renderDocPage } from '@/lib/docs';
import { guidesSource } from '@/lib/source';

export function generateStaticParams() {
  return generateDocStaticParams(guidesSource);
}

export async function generateMetadata({ params }: DocsRouteProps) {
  return generateDocMetadata(guidesSource, params);
}

export default async function GuidesDocPage({ params }: DocsRouteProps) {
  return renderDocPage(guidesSource, params);
}
