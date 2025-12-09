import { defineConfig } from 'tsdown'
import { createSimpleOnSuccess } from '../../../etc/tsdown-helpers.js'

export default defineConfig({
  entry: './src/index.ts',
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  treeshake: true,
  platform: 'neutral',
  target: 'es2018',
  outDir: 'dist',
  external: [
    // Workspace dependencies
    '@injectivelabs/exceptions',
    '@injectivelabs/sdk-ts',
    '@injectivelabs/ts-types',
    '@injectivelabs/wallet-base',
    // Transitive dependencies from @ledgerhq/* (declared as peerDependencies)
    'axios',
    'bignumber.js',
    '@ethersproject/abi',
    '@ethersproject/rlp',
    '@ethersproject/transactions',
    // Direct external dependencies
    'viem',
  ],
  // Force bundling of @ledgerhq/* packages (even though they use dynamic imports)
  // This is needed so Buffer injection can process their code
  noExternal: [/@ledgerhq\/.*/],
  inputOptions: {
    resolve: {
      // Required for platform: 'neutral' to resolve @ledgerhq packages correctly
      mainFields: ['module', 'main'],
    },
    transform: {
      inject: {
        Buffer: ['buffer', 'Buffer'],
      },
    },
  },
  onSuccess: createSimpleOnSuccess(),
})
