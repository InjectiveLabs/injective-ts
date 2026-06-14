import { defineConfig } from 'tsdown'
import { createNestedOnSuccess } from '../../etc/tsdown-helpers.js'

export default defineConfig({
  entry: {
    // Existing entry points (keep for backward compatibility)
    index: './src/index.ts',
    exports: './src/exports.ts',
    cosmjs: './src/cosmjs.ts',

    // New subpath entry points
    'client/indexer': './src/client/indexer/index.ts',
    'client/chain': './src/client/chain/index.ts',
    'client/wasm': './src/client/wasm/index.ts',
    'client/abacus': './src/client/abacus/index.ts',
    'client/tcAbacus': './src/client/tcAbacus/index.ts',
    'client/olp': './src/client/olp/index.ts',
    'core/modules': './src/core/modules/index.ts',
    'core/accounts': './src/core/accounts/index.ts',
    'core/tx': './src/core/tx/index.ts',
    'proto/cosmos-tx': './src/proto/cosmos-tx.ts',
    types: './src/types/index.ts',
    utils: './src/utils/index.ts',
    service: './src/service/index.ts',
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
    // CosmJS dependencies
    '@cosmjs/amino',
    '@cosmjs/math',
    '@cosmjs/proto-signing',
    '@cosmjs/stargate',
    '@cosmjs/tendermint-rpc',
    '@cosmjs/utils',
    // Other heavy external dependencies
    'axios',
    'ethers',
    'rxjs',
    'type-fest',
  ],
  onSuccess: createNestedOnSuccess(),
})
