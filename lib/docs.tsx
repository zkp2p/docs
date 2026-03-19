import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';

import { getMDXComponents } from '@/components/mdx';
import { siteConfig } from '@/lib/site';
import { guidesSource } from '@/lib/source';

type DocParams = Promise<{
  slug: string[];
}>;

export type DocsRouteProps = {
  params: DocParams;
};

type DocsSource = Pick<typeof guidesSource, 'generateParams' | 'getPage'>;

export function generateDocStaticParams(source: DocsSource) {
  return source.generateParams();
}

export async function generateDocMetadata(
  source: DocsSource,
  params: DocParams,
): Promise<Metadata> {
  const { slug } = await params;
  const page = source.getPage(slug);

  if (!page) return {};

  const description = page.data.description ?? siteConfig.description;

  return {
    title: page.data.title,
    description,
    openGraph: {
      title: page.data.title,
      description,
    },
    twitter: {
      card: 'summary_large_image',
      title: page.data.title,
      description,
    },
  };
}

export async function renderDocPage(source: DocsSource, params: DocParams) {
  const { slug } = await params;
  const page = source.getPage(slug);

  if (!page) {
    notFound();
  }

  const MDX = page.data.body;

  return (
    <DocsPage toc={page.data.toc}>
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={getMDXComponents()} />
      </DocsBody>
    </DocsPage>
  );
}
