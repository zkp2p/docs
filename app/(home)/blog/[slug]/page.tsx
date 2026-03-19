import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { DocsBody } from 'fumadocs-ui/layouts/docs/page';

import { getMDXComponents } from '@/components/mdx';
import { getBlogPost, blogPosts, formatDate } from '@/lib/blog';
import { siteConfig } from '@/lib/site';

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) return {};

  return {
    title: post.title,
    description: post.description ?? post.excerpt,
    openGraph: {
      title: post.title,
      description: post.description ?? post.excerpt,
      type: 'article',
      publishedTime: `${post.date}T00:00:00Z`,
      images: post.image ? [{ url: post.image }] : [{ url: siteConfig.ogImage }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description ?? post.excerpt,
      images: post.image ? [post.image] : [siteConfig.ogImage],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  const MDX = post.body;
  const components = getMDXComponents();

  return (
    <article className="blog-post-page">
      <div className="container">
        <header className="blog-header">
          <h1>{post.title}</h1>
          <p className="blog-subtitle">{post.excerpt}</p>
          <div className="blog-meta">
            <span className="blog-date">{formatDate(post.date)}</span>
            {post.readTime ? (
              <span className="blog-read-time">{post.readTime} min read</span>
            ) : null}
          </div>
        </header>

        <DocsBody className="blog-content">
          <MDX components={components} />
        </DocsBody>
      </div>
    </article>
  );
}
