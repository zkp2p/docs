import { createMDX } from 'fumadocs-mdx/next';

/** @type {import('next').NextConfig} */
const config = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/brand-kit-legacy',
        destination: '/brand-kit',
        permanent: true,
      },
      {
        source: '/brand-kit/brand-kit-legacy',
        destination: '/brand-kit',
        permanent: true,
      },
      {
        source: '/developer/api/v3/post-intent-hooks',
        destination: '/developer/post-intent-hooks',
        permanent: true,
      },
      {
        source: '/developer/sdk',
        destination: '/developer/sdk/sdk-overview',
        permanent: true,
      },
      {
        source: '/developer/sdk/client-reference',
        destination: '/developer/sdk/sdk-client-reference',
        permanent: true,
      },
      {
        source: '/developer/sdk/react-hooks',
        destination: '/developer/sdk/sdk-react-hooks',
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX();

export default withMDX(config);
