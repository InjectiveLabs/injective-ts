import { join } from 'path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['dotenv/config'],
    testTimeout: 30000,
    maxWorkers: 'max',
    pool: 'threads',
    include: [
      'packages/**/__tests__/**/*.[jt]s?(x)',
      'packages/**/?(*.)+(spec|test).[tj]s?(x)',
    ],
    exclude: [
      '**/node_modules/**',
      '/deprecated/',
      // Exclude blockchain broadcasting tests - run separately with npm run test:broadcast
      '**/MsgBroadcaster.spec.ts',
      '**/wallet-private-key/src/strategy/strategy.spec.ts',
      '**/SigninStargateClient.spec.ts',
    ],
    fileParallelism: true,
    hookTimeout: 10000,
    clearMocks: true,
    mockReset: true,
    restoreMocks: true,
    unstubGlobals: true,
    dangerouslyIgnoreUnhandledErrors: false,
    slowTestThreshold: 5000,
    coverage: {
      provider: 'v8',
      reporter: ['json', 'html', 'text', 'lcov'],
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/*.spec.ts',
        '**/*.test.ts',
        '**/proto/**',
        '**/protoV2/**',
        '**/__tests__/**',
        '**/coverage/**',
      ],
    },
  },
  resolve: {
    alias: {
      // Map workspace packages (adjust paths as needed)
      '@injectivelabs/exceptions': join(
        __dirname,
        'packages/exceptions/src/index.ts',
      ),
      '@injectivelabs/utils/test-utils': join(
        __dirname,
        'packages/utils/src/test-utils/index.ts',
      ),
      '@injectivelabs/utils': join(__dirname, 'packages/utils/src/index.ts'),
      '@injectivelabs/networks': join(
        __dirname,
        'packages/networks/src/index.ts',
      ),
      '@injectivelabs/ts-types': join(
        __dirname,
        'packages/ts-types/src/index.ts',
      ),
      '@injectivelabs/sdk-ts/client/indexer': join(
        __dirname,
        'packages/sdk-ts/src/client/indexer/index.ts',
      ),
      '@injectivelabs/sdk-ts/client/chain': join(
        __dirname,
        'packages/sdk-ts/src/client/chain/index.ts',
      ),
      '@injectivelabs/sdk-ts/client/wasm': join(
        __dirname,
        'packages/sdk-ts/src/client/wasm/index.ts',
      ),
      '@injectivelabs/sdk-ts/client/abacus': join(
        __dirname,
        'packages/sdk-ts/src/client/abacus/index.ts',
      ),
      '@injectivelabs/sdk-ts/client/olp': join(
        __dirname,
        'packages/sdk-ts/src/client/olp/index.ts',
      ),
      '@injectivelabs/sdk-ts/client/tcAbacus': join(
        __dirname,
        'packages/sdk-ts/src/client/tcAbacus/index.ts',
      ),
      '@injectivelabs/sdk-ts/core/modules': join(
        __dirname,
        'packages/sdk-ts/src/core/modules/index.ts',
      ),
      '@injectivelabs/sdk-ts/core/accounts': join(
        __dirname,
        'packages/sdk-ts/src/core/accounts/index.ts',
      ),
      '@injectivelabs/sdk-ts/core/tx': join(
        __dirname,
        'packages/sdk-ts/src/core/tx/index.ts',
      ),
      '@injectivelabs/sdk-ts/types': join(
        __dirname,
        'packages/sdk-ts/src/types/index.ts',
      ),
      '@injectivelabs/sdk-ts/utils': join(
        __dirname,
        'packages/sdk-ts/src/utils/index.ts',
      ),
      '@injectivelabs/sdk-ts/service': join(
        __dirname,
        'packages/sdk-ts/src/service/index.ts',
      ),
      '@injectivelabs/sdk-ts/cosmjs': join(
        __dirname,
        'packages/sdk-ts/src/cosmjs.ts',
      ),
      '@injectivelabs/sdk-ts/proto/cosmos-tx': join(
        __dirname,
        'packages/sdk-ts/src/proto/cosmos-tx.ts',
      ),
      '@injectivelabs/sdk-ts': join(__dirname, 'packages/sdk-ts/src/index.ts'),
      '@injectivelabs/wallet-base': join(
        __dirname,
        'packages/wallets/wallet-base/src/index.ts',
      ),
      '@injectivelabs/wallet-core': join(
        __dirname,
        'packages/wallets/wallet-core/src/index.ts',
      ),
      '@injectivelabs/wallet-cosmos': join(
        __dirname,
        'packages/wallets/wallet-cosmos/src/index.ts',
      ),
      '@injectivelabs/wallet-cosmostation': join(
        __dirname,
        'packages/wallets/wallet-cosmostation/src/index.ts',
      ),
      '@injectivelabs/wallet-cosmos-strategy': join(
        __dirname,
        'packages/wallets/wallet-cosmos-strategy/src/index.ts',
      ),
      '@injectivelabs/wallet-evm': join(
        __dirname,
        'packages/wallets/wallet-evm/src/index.ts',
      ),
      '@injectivelabs/wallet-ledger': join(
        __dirname,
        'packages/wallets/wallet-ledger/src/index.ts',
      ),
      '@injectivelabs/wallet-magic': join(
        __dirname,
        'packages/wallets/wallet-magic/src/index.ts',
      ),
      '@injectivelabs/wallet-private-key': join(
        __dirname,
        'packages/wallets/wallet-private-key/src/index.ts',
      ),
      '@injectivelabs/wallet-strategy': join(
        __dirname,
        'packages/wallets/wallet-strategy/src/index.ts',
      ),
      '@injectivelabs/wallet-trezor': join(
        __dirname,
        'packages/wallets/wallet-trezor/src/index.ts',
      ),
      '@injectivelabs/wallet-turnkey': join(
        __dirname,
        'packages/wallets/wallet-turnkey/src/index.ts',
      ),
      '@injectivelabs/wallet-wallet-connect': join(
        __dirname,
        'packages/wallets/wallet-wallet-connect/src/index.ts',
      ),
    },
  },
})
