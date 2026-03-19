import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';

import { TweetEmbed } from '@/components/tweet-embed';
import { VideoEmbed } from '@/components/video-embed';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    TweetEmbed,
    VideoEmbed,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
