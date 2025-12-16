import { defineConfig } from 'tsdown'
import { createSimpleOnSuccess } from '../../../etc/tsdown-helpers.js'

export default defineConfig({
  entry: './src/index.ts',
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  treeshake: true, // Enable tree-shaking
  platform: 'neutral',
  target: 'es2018',
  outDir: 'dist',
  external: [
    // External workspace dependencies
    '@injectivelabs/exceptions',
    '@injectivelabs/networks',
    '@injectivelabs/sdk-ts',
    '@injectivelabs/ts-types',
    '@injectivelabs/utils',
    // External dependencies
    'axios',
    'store2',
    'http-status-codes',
    'form-data',
    // Node.js built-ins
    'crypto',
    'http',
    'https',
    'http2',
    'util',
    'zlib',
    'stream',
    'events',
    'url',
    'assert',
  ],
  onSuccess: createSimpleOnSuccess(),
})
