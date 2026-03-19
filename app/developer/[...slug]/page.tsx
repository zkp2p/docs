import type { DocsRouteProps } from '@/lib/docs';
import { generateDocMetadata, generateDocStaticParams, renderDocPage } from '@/lib/docs';
import { developerSource } from '@/lib/source';

export function generateStaticParams() {
  return generateDocStaticParams(developerSource);
}

export async function generateMetadata({ params }: DocsRouteProps) {
  return generateDocMetadata(developerSource, params);
}

export default async function DeveloperDocPage({ params }: DocsRouteProps) {
  return renderDocPage(developerSource, params);
}
