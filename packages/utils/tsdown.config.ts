import { defineConfig } from 'tsdown'
import { createNestedOnSuccess } from '../../etc/tsdown-helpers.js'

export default defineConfig({
  entry: {
    index: './src/index.ts',
    'test-utils/index': './src/test-utils/index.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  treeshake: true, // Enable tree-shaking
  platform: 'neutral', // Works in Node, browser, React Native
  target: 'es2018',
  outDir: 'dist',
  external: [
    // External workspace dependencies
    '@injectivelabs/exceptions',
    '@injectivelabs/networks',
    '@injectivelabs/ts-types',
  ],
  onSuccess: createNestedOnSuccess(),
})
