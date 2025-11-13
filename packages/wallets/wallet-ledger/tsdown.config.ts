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
    '@injectivelabs/wallet-base',
    // External ledger dependencies
    '@bangjelkoski/ledgerhq-hw-app-cosmos',
    '@bangjelkoski/ledgerhq-hw-app-eth',
    '@bangjelkoski/ledgerhq-hw-transport',
    '@bangjelkoski/ledgerhq-hw-transport-webhid',
    '@bangjelkoski/ledgerhq-hw-transport-webusb',
    // External dependencies
    'alchemy-sdk',
    'viem',
  ],
  onSuccess: createSimpleOnSuccess(),
})
