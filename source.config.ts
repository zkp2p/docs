import { defineCollections, defineConfig, defineDocs, frontmatterSchema } from 'fumadocs-mdx/config';
import lastModified from 'fumadocs-mdx/plugins/last-modified';
import { remarkDirectiveAdmonition } from 'fumadocs-core/mdx-plugins';
import remarkDirective from 'remark-directive';
import remarkGfm from 'remark-gfm';
import { z } from 'zod';

const docOptions = {
  postprocess: {
    includeProcessedMarkdown: true,
    extractLinkReferences: true,
  },
};

export const guides = defineDocs({
  dir: 'content/guides',
  docs: docOptions,
});

export const protocol = defineDocs({
  dir: 'content/protocol',
  docs: docOptions,
});

export const developer = defineDocs({
  dir: 'content/developer',
  docs: docOptions,
});

export const brandKit = defineDocs({
  dir: 'content/brand-kit',
  docs: docOptions,
});

export const blog = defineCollections({
  type: 'doc',
  dir: 'content/blog',
  schema: frontmatterSchema.extend({
    date: z.string(),
    excerpt: z.string(),
    image: z.string().optional(),
    readTime: z.number().optional(),
  }),
});

export default defineConfig({
  plugins: [lastModified()],
  mdxOptions: {
    remarkPlugins: (plugins) => [remarkDirective, remarkDirectiveAdmonition, remarkGfm, ...plugins],
  },
});
