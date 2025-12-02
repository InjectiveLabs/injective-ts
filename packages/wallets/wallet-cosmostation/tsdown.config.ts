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
    '@injectivelabs/utils',
    '@injectivelabs/sdk-ts',
    '@injectivelabs/networks',
    '@injectivelabs/ts-types',
    '@injectivelabs/exceptions',
    '@injectivelabs/wallet-base',
    '@injectivelabs/wallet-core',
  ],
  onSuccess: createSimpleOnSuccess(),
})
