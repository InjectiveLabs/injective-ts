import { defineConfig } from 'tsdown'
import { createNestedOnSuccess } from '../../../etc/tsdown-helpers.js'

export default defineConfig({
  entry: {
    index: './src/index.ts',
    strategy: './src/strategy/index.ts',
    broadcaster: './src/broadcaster/index.ts',
  },
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
    '@injectivelabs/wallet-base',
  ],
  onSuccess: createNestedOnSuccess(),
})
