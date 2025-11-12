import { defineConfig } from 'vitest/config'
import { readFileSync } from 'fs'
import { join } from 'path'

const tsconfig = JSON.parse(
  readFileSync(join(__dirname, 'tsconfig.json'), 'utf8'),
)

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['dotenv/config'],
    testTimeout: 30000,
    maxWorkers: 1, // Keep single worker for BigInt serialization
    include: [
      'packages/**/__tests__/**/*.[jt]s?(x)',
      'packages/**/?(*.)+(spec|test).[tj]s?(x)',
    ],
    exclude: ['**/node_modules/**', '/deprecated/'],
    coverage: {
      provider: 'v8',
      reporter: ['json', 'html'],
      exclude: ['**/node_modules/**'],
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
      // Map proto-v2 packages
      '@injectivelabs/core-proto-ts-v2': join(
        __dirname,
        'protoV2/core/src/index.ts',
      ),
      '@injectivelabs/core-proto-ts-v2/generated': join(
        __dirname,
        'protoV2/core/proto-ts/esm/generated',
      ),
      '@injectivelabs/indexer-proto-ts-v2': join(
        __dirname,
        'protoV2/indexer/src/index.ts',
      ),
      '@injectivelabs/indexer-proto-ts-v2/generated': join(
        __dirname,
        'protoV2/indexer/proto-ts/esm/generated',
      ),
      '@injectivelabs/indexer-proto-ts-v2/generated/injective_exchange_rpc_pb':
        join(
          __dirname,
          'protoV2/indexer/proto-ts/esm/generated/injective_exchange_rpc_pb.mjs',
        ),
    },
  },
})
