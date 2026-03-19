/* eslint-disable @next/next/no-img-element */

import type { Metadata } from 'next';
import Link from 'next/link';

import { blogPosts, formatDate } from '@/lib/blog';
import { siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Blog',
  description: 'Latest insights, updates, and stories from the Peer team.',
  openGraph: {
    title: 'Peer Blog',
    description: 'Latest insights, updates, and stories from the Peer team.',
    images: [{ url: siteConfig.ogImage }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Peer Blog',
    description: 'Latest insights, updates, and stories from the Peer team.',
    images: [siteConfig.ogImage],
  },
};

export default function BlogIndexPage() {
  return (
    <main className="blogs-page">
      <div className="container">
        <div className="hero-section">
          <h1>Peer Blog</h1>
          <p className="hero-description">
            Stay updated with insights, technical deep dives, and community stories from
            the team building Peer.
          </p>
        </div>

        <div className="blogs-grid">
          {blogPosts.map((post) => (
            <Link key={post.slug} href={post.url} className="blog-post-card">
              <div className="post-header">
                {post.image ? (
                  <img
                    src={post.image}
                    alt={`${post.title} header image`}
                    className="post-image"
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <div className="image-placeholder">
                    <svg
                      aria-hidden="true"
                      focusable="false"
                      width="40"
                      height="40"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="post-content">
                <div className="post-meta">
                  <span className="post-date">{formatDate(post.date)}</span>
                  {post.readTime ? (
                    <span className="post-read-time">{post.readTime} min read</span>
                  ) : null}
                </div>
                <h2 className="post-title">{post.title}</h2>
                <p className="post-excerpt">{post.excerpt}</p>
                <div className="post-link">
                  <span>Read more</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
