import { defineConfig } from 'vitest/config'
import baseConfig from './vitest.config.js'

/**
 * Special configuration for blockchain broadcasting tests
 *
 * These tests must run sequentially because they broadcast real transactions
 * to the same blockchain account on devnet, which would cause "account sequence
 * mismatch" errors if run in parallel.
 *
 * Usage:
 *   npm run test:broadcast
 *
 * This config disables file parallelism for these specific tests while allowing
 * all other tests to run in parallel using the main vitest.config.ts
 */
export default defineConfig({
  ...baseConfig,
  test: {
    ...baseConfig.test,
    // Force single-threaded sequential execution
    fileParallelism: false,
    maxConcurrency: 1,
    maxWorkers: 1,
    // Only run the broadcasting tests
    include: [
      'packages/wallets/wallet-core/src/broadcaster/MsgBroadcaster.spec.ts',
      'packages/wallets/wallet-private-key/src/strategy/strategy.spec.ts',
      'packages/sdk-ts/src/core/stargate/SigninStargateClient.spec.ts',
    ],
    // Override exclude to allow these tests (baseConfig excludes them)
    exclude: ['**/node_modules/**', '/deprecated/'],
  },
})
