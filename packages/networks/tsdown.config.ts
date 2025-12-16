import { defineConfig } from 'tsdown'
import { createSimpleOnSuccess } from '../../etc/tsdown-helpers.js'

export default defineConfig({
  entry: './src/index.ts',
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  treeshake: true, // Enable tree-shaking
  platform: 'neutral', // Works in Node, browser, React Native
  target: 'es2018',
  outDir: 'dist',
  external: [
    // External workspace dependencies
    '@injectivelabs/ts-types',
  ],
  onSuccess: createSimpleOnSuccess(),
})
