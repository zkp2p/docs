import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

const config = [
  {
    ignores: [
      '.next/**',
      '.source/**',
      'build/**',
      'node_modules/**',
      'src/pages/**',
      'src/brand/**',
    ],
  },
  ...nextVitals,
  ...nextTypescript,
];

export default config;
