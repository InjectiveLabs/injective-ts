import { defineConfig } from 'tsdown'
import { createNestedOnSuccess } from '../../etc/tsdown-helpers.js'

export default defineConfig({
  entry: {
    index: './src/index.ts',
    exports: './src/exports.ts',
    cosmjs: './src/cosmjs.ts',
  },
  format: ['cjs', 'esm'],
  dts: {
    resolve: true, // Resolves path aliases
  },
  clean: true,
  treeshake: true, // Enable tree-shaking
  platform: 'neutral',
  target: 'es2018',
  outDir: 'dist',
  external: [
    // External workspace dependencies
    '@injectivelabs/exceptions',
    '@injectivelabs/networks',
    '@injectivelabs/ts-types',
    '@injectivelabs/utils',
    // External proto packages
    '@injectivelabs/olp-proto-ts-v2',
    '@injectivelabs/mito-proto-ts-v2',
    '@injectivelabs/core-proto-ts-v2',
    '@injectivelabs/abacus-proto-ts-v2',
    '@injectivelabs/indexer-proto-ts-v2',
    // Other heavy external dependencies
    '@cosmjs/amino',
    '@cosmjs/proto-signing',
    '@cosmjs/stargate',
    'axios',
    'ethers',
    'rxjs',
  ],
  onSuccess: createNestedOnSuccess(),
})
