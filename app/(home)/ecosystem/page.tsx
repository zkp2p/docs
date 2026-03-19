/* eslint-disable @next/next/no-img-element */

import type { Metadata } from 'next';

import { ecosystemProjects, siteConfig } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Ecosystem',
  description: 'Projects and tools built on and around the Peer protocol.',
  openGraph: {
    title: 'Peer Ecosystem',
    description: 'Projects and tools built on and around the Peer protocol.',
    images: [{ url: siteConfig.ogImage }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Peer Ecosystem',
    description: 'Projects and tools built on and around the Peer protocol.',
    images: [siteConfig.ogImage],
  },
};

export default function EcosystemPage() {
  return (
    <main className="ecosystem-page">
      <div className="container">
        <div className="hero-section">
          <h1>Ecosystem</h1>
          <p className="hero-description">
            Projects and tools built on and around the Peer protocol.
          </p>
        </div>

        <div className="ecosystem-grid">
          {ecosystemProjects.map((project) => (
            <a
              key={project.name}
              href={project.href}
              className="ecosystem-card"
              target="_blank"
              rel="noreferrer"
            >
              <span className="ecosystem-card__tag">{project.category}</span>
              <div className="ecosystem-card__logo-wrapper">
                <img
                  src={project.logo}
                  alt={`${project.name} logo`}
                  className="ecosystem-card__logo"
                  width="40"
                  height="40"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="ecosystem-card__content">
                <h2 className="ecosystem-card__name">{project.name}</h2>
                <p className="ecosystem-card__description">{project.description}</p>
              </div>
              <div className="ecosystem-card__link">
                <span>{new URL(project.href).hostname}</span>
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="7" y1="17" x2="17" y2="7" />
                  <polyline points="7 7 17 7 17 17" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}
