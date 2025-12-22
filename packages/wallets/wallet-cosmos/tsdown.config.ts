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
    '@injectivelabs/sdk-ts',
    '@injectivelabs/ts-types',
    '@injectivelabs/utils',
    '@injectivelabs/wallet-base',
    // External cosmjs dependencies
    '@cosmjs/proto-signing',
    '@cosmjs/stargate',
  ],
  onSuccess: createSimpleOnSuccess(),
})
