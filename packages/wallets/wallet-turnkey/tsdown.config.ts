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
    '@injectivelabs/exceptions',
    '@injectivelabs/networks',
    '@injectivelabs/sdk-ts',
    '@injectivelabs/ts-types',
    '@injectivelabs/utils',
    '@injectivelabs/wallet-base',
    '@injectivelabs/wallet-core',
    '@turnkey/http',
    '@turnkey/sdk-browser',
    '@turnkey/sdk-base',
    '@turnkey/sdk-server',
  ],
  onSuccess: createSimpleOnSuccess(),
})
