import { blog } from 'collections/server';

type RawBlogPost = (typeof blog)[number];

export type BlogPost = RawBlogPost & {
  slug: string;
  url: string;
};

function getSlug(infoPath: string): string {
  return infoPath.replace(/\.mdx$/, '').split('/').pop() ?? infoPath;
}

export function formatDate(dateString: string): string {
  const date = new Date(`${dateString}T00:00:00Z`);

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export const blogPosts: BlogPost[] = [...blog]
  .map((post) => {
    const slug = getSlug(post.info.path);

    return {
      ...post,
      slug,
      url: `/blog/${slug}`,
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date));

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
