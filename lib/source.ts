import { developer, brandKit, guides, protocol } from 'collections/server';
import { loader, llms, multiple } from 'fumadocs-core/source';

export const guidesSource = loader({
  baseUrl: '/guides',
  source: guides.toFumadocsSource(),
});

export const protocolSource = loader({
  baseUrl: '/protocol',
  source: protocol.toFumadocsSource(),
});

export const developerSource = loader({
  baseUrl: '/developer',
  source: developer.toFumadocsSource(),
});

export const brandKitSource = loader({
  baseUrl: '/brand-kit',
  source: brandKit.toFumadocsSource(),
});

export const allDocsSource = loader(
  multiple({
    guides: guides.toFumadocsSource(),
    protocol: protocol.toFumadocsSource(),
    developer: developer.toFumadocsSource(),
    'brand-kit': brandKit.toFumadocsSource(),
  }),
  {
    baseUrl: '/',
  },
);

export const docsLlms = llms(allDocsSource);
