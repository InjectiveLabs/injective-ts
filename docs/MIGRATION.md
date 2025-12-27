# Migration Guide: Upgrading to v1.17.x

This guide helps you upgrade from any version **before v1.17.2** to **v1.17.x** of `@injectivelabs/sdk-ts` and related packages.

**Related PR**: [#598](https://github.com/InjectiveLabs/injective-ts/pull/598)

---

## Table of Contents

- [Migration Guide: Upgrading to v1.17.x](#migration-guide-upgrading-to-v117x)
  - [Table of Contents](#table-of-contents)
  - [Breaking Changes](#breaking-changes)
    - [1. setMetadata() is Now Async](#1-setmetadata-is-now-async)
      - [❌ Before](#-before)
      - [✅ After](#-after)
    - [2. Wallet Strategies Require Explicit Loading](#2-wallet-strategies-require-explicit-loading)
      - [❌ Before](#-before-1)
      - [✅ After](#-after-1)
    - [3. Buffer Dependency Removed](#3-buffer-dependency-removed)
      - [Migration Table](#migration-table)
      - [❌ Before](#-before-2)
      - [✅ After](#-after-2)
    - [4. Apollo GraphQL Client Removed](#4-apollo-graphql-client-removed)
      - [❌ Before](#-before-3)
      - [✅ After](#-after-3)
  - [Deprecations](#deprecations)
    - [Type Imports from @injectivelabs/ts-types](#type-imports-from-injectivelabsts-types)
      - [⚠️ Deprecated Types](#️-deprecated-types)
      - [❌ Before](#-before-4)
      - [✅ After](#-after-4)
  - [Recommended Updates](#recommended-updates)
    - [Use Subpath Imports for Better Tree-Shaking](#use-subpath-imports-for-better-tree-shaking)
      - [💡 Before (Still Works)](#-before-still-works)
      - [💡 After (Recommended)](#-after-recommended)
      - [Available Subpath Imports](#available-subpath-imports)
  - [New Features](#new-features)
    - [Lazy Loading Methods](#lazy-loading-methods)
    - [Encoding Utilities](#encoding-utilities)
  - [Troubleshooting](#troubleshooting)
    - [Error: "Wallet X strategy not loaded. Call setWallet() or loadStrategy() first."](#error-wallet-x-strategy-not-loaded-call-setwallet-or-loadstrategy-first)
    - [Error: "setMetadata is not a function" or unexpected behavior](#error-setmetadata-is-not-a-function-or-unexpected-behavior)
    - [Error: "Buffer is not defined"](#error-buffer-is-not-defined)
    - [TypeScript errors: Cannot find module '@injectivelabs/sdk-ts/client/indexer'](#typescript-errors-cannot-find-module-injectivelabssdk-tsclientindexer)
    - [Module not found errors after upgrading](#module-not-found-errors-after-upgrading)
  - [Complete Code Examples](#complete-code-examples)
    - [Full Wallet Strategy Migration](#full-wallet-strategy-migration)
      - [❌ Before v1.17.x](#-before-v117x)
      - [✅ After v1.17.x](#-after-v117x)
    - [Full Trading Application Migration](#full-trading-application-migration)
      - [❌ Before v1.17.x](#-before-v117x-1)
      - [✅ After v1.17.x (with subpath imports)](#-after-v117x-with-subpath-imports)
  - [Benefits](#benefits)
    - [Performance Improvements](#performance-improvements)
    - [Developer Experience](#developer-experience)
    - [Code Quality](#code-quality)
    - [Maintenance](#maintenance)
  - [Resources](#resources)

---

## Breaking Changes

### 1. setMetadata() is Now Async

**Impact**: HIGH - All wallet strategy users affected

The `setMetadata()` method is now asynchronous and must be called with `await`.

#### ❌ Before

```typescript
import { WalletStrategy } from '@injectivelabs/wallet-ts'

const walletStrategy = new WalletStrategy({ chainId: 'injective-1' })

// Synchronous call
walletStrategy.setMetadata({
  privateKey: { privateKey: '0x...' },
})
```

#### ✅ After

```typescript
import { WalletStrategy } from '@injectivelabs/wallet-ts'

const walletStrategy = new WalletStrategy({ chainId: 'injective-1' })

// Must use await
await walletStrategy.setMetadata({
  privateKey: { privateKey: '0x...' },
})
```

**Action Required**: Add `await` keyword to all `setMetadata()` calls. Ensure the containing function is `async`.

---

### 2. Wallet Strategies Require Explicit Loading

**Impact**: HIGH - All wallet users affected

Wallet strategies are now lazy-loaded and must be explicitly initialized before use. Calling wallet methods without loading the strategy will throw an error.

#### ❌ Before

```typescript
import { WalletStrategy, Wallet } from '@injectivelabs/wallet-ts'

const walletStrategy = new WalletStrategy({
  chainId: 'injective-1',
  wallet: Wallet.Metamask,
})

// Wallet was automatically loaded
const addresses = await walletStrategy.getAddresses()
```

#### ✅ After

```typescript
import { WalletStrategy, Wallet } from '@injectivelabs/wallet-ts'

const walletStrategy = new WalletStrategy({
  chainId: 'injective-1',
})

// Must explicitly load the wallet strategy
await walletStrategy.setWallet(Wallet.Metamask)

// Now safe to use
const addresses = await walletStrategy.getAddresses()
```

**Error if not loaded**:

```
Error: Wallet Metamask strategy not loaded. Call setWallet() or loadStrategy() first.
```

**Action Required**:

1. Remove `wallet` from `WalletStrategy` constructor options
2. Call `await walletStrategy.setWallet(Wallet.YourWallet)` before using any wallet methods
3. Ensure proper error handling for wallet loading failures

---

### 3. Buffer Dependency Removed

**Impact**: MEDIUM-HIGH - Affects code using Buffer for encoding/decoding

The `buffer` polyfill has been removed. All `Buffer` usage must be replaced with the new encoding utilities from `@injectivelabs/sdk-ts/utils`.

#### Migration Table

| Buffer Method                | New Utility                   | Import From                   |
| ---------------------------- | ----------------------------- | ----------------------------- |
| `Buffer.from(hex, 'hex')`    | `hexToUint8Array(hex)`        | `@injectivelabs/sdk-ts/utils` |
| `Buffer.from(str, 'utf8')`   | `utf8ToUint8Array(str)`       | `@injectivelabs/sdk-ts/utils` |
| `Buffer.from(str, 'base64')` | `base64ToUint8Array(str)`     | `@injectivelabs/sdk-ts/utils` |
| `buffer.toString('hex')`     | `uint8ArrayToHex(buffer)`     | `@injectivelabs/sdk-ts/utils` |
| `buffer.toString('utf8')`    | `uint8ArrayToUtf8(buffer)`    | `@injectivelabs/sdk-ts/utils` |
| `buffer.toString('base64')`  | `uint8ArrayToBase64(buffer)`  | `@injectivelabs/sdk-ts/utils` |
| `Buffer.concat([b1, b2])`    | `concatUint8Arrays([b1, b2])` | `@injectivelabs/sdk-ts/utils` |

#### ❌ Before

```typescript
import { Buffer } from 'buffer'

// Converting hex to bytes
const bytes = Buffer.from('deadbeef', 'hex')

// Converting bytes to hex
const hex = bytes.toString('hex')

// Converting string to bytes
const utf8Bytes = Buffer.from('Hello', 'utf8')

// Converting base64 to bytes
const base64Bytes = Buffer.from('SGVsbG8=', 'base64')

// Concatenating buffers
const combined = Buffer.concat([bytes, utf8Bytes])
```

#### ✅ After

```typescript
import { hexToUint8Array, uint8ArrayToHex, utf8ToUint8Array, base64ToUint8Array, concatUint8Arrays } from '@injectivelabs/sdk-ts/utils'

// Converting hex to bytes
const bytes = hexToUint8Array('deadbeef')

// Converting bytes to hex
const hex = uint8ArrayToHex(bytes)

// Converting string to bytes
const utf8Bytes = utf8ToUint8Array('Hello')

// Converting base64 to bytes
const base64Bytes = base64ToUint8Array('SGVsbG8=')

// Concatenating arrays
const combined = concatUint8Arrays([bytes, utf8Bytes])
```

**Action Required**:

1. Search your codebase for `Buffer.from` and `buffer.toString`
2. Replace with appropriate encoding utilities using the table above
3. Update imports to include the new utility functions
4. Remove `buffer` package from your dependencies if only used for Injective SDK operations

---

### 4. Apollo GraphQL Client Removed

**Impact**: LOW - Only affects users of the GraphQL client

The Apollo GraphQL client has been completely removed from `@injectivelabs/sdk-ts`.

#### ❌ Before

```typescript
import { GqlClient } from '@injectivelabs/sdk-ts'

const gqlClient = new GqlClient(endpoint)
```

#### ✅ After

If you were using the GraphQL client, use `HttpClient` for GraphQL queries:

```typescript
import { HttpClient } from '@injectivelabs/utils'

const client = new HttpClient('YOUR_GRAPHQL_ENDPOINT')

// Optional: Set auth headers if required
client.setConfig({
  headers: {
    authorization: 'Bearer YOUR_API_KEY',
  },
})

// Make a query
const query = JSON.stringify({
  query: `
    query GetData($id: ID!) {
      entity(id: $id) {
        id
        name
        value
      }
    }
  `,
  variables: { id: '123' },
})

const response = await client.post<string, { data: { data: YourResponseType } }>('', query)
console.log(response.data.data)
```

**Full documentation**: [Querying GraphQL Endpoints](https://docs.injective.network/developers-native/query-ethereum#querying-graphql-endpoints)

**Action Required**:

- If using GraphQL client, use `HttpClient` from `@injectivelabs/utils`
- See [GraphQL documentation](https://docs.injective.network/developers-native/query-ethereum#querying-graphql-endpoints) for complete implementation examples
- Remove any imports from `@injectivelabs/sdk-ts/client/gql`

---

## Deprecations

### Type Imports from @injectivelabs/ts-types

**Impact**: MEDIUM - Affects code importing types from `@injectivelabs/ts-types`

Several types in `@injectivelabs/ts-types` are now deprecated. These types have been moved to `@injectivelabs/sdk-ts/types` for better organization.

#### ⚠️ Deprecated Types

From `@injectivelabs/ts-types`:

- `TradeExecutionType`
- `TradeExecutionSide`
- `TradeDirection`
- `OrderState`
- `OrderSide`
- `StreamStatusResponse`
- `StreamOperation`

#### ❌ Before

```typescript
import { TradeExecutionType, TradeExecutionSide, TradeDirection, OrderState, OrderSide, StreamStatusResponse, StreamOperation } from '@injectivelabs/ts-types'
```

#### ✅ After

```typescript
import { TradeExecutionType, TradeExecutionSide, TradeDirection, OrderState, OrderSide, StreamStatusResponse, StreamOperation } from '@injectivelabs/sdk-ts/types'
```

**Action Required**:

1. Update imports to use `@injectivelabs/sdk-ts/types` instead of `@injectivelabs/ts-types`
2. Search for imports from `@injectivelabs/ts-types` in your codebase
3. These types still work from the old location but will be removed in a future version

**Reference Files**:

- [`packages/ts-types/src/trade.ts`](../packages/ts-types/src/trade.ts)
- [`packages/ts-types/src/common.ts`](../packages/ts-types/src/common.ts)

---

## Recommended Updates

### Use Subpath Imports for Better Tree-Shaking

**Impact**: Optional but beneficial - 10-30% smaller bundle sizes

v1.17.x introduces subpath imports that allow more granular imports and better tree-shaking. Your old imports will still work, but subpath imports can significantly reduce bundle size.

#### 💡 Before (Still Works)

```typescript
import { MsgSend, MsgBroadcasterWithPk, IndexerGrpcAccountApi, getNetworkEndpoints, Network } from '@injectivelabs/sdk-ts'
```

#### 💡 After (Recommended)

```typescript
import { MsgSend } from '@injectivelabs/sdk-ts/core/modules'
import { MsgBroadcasterWithPk } from '@injectivelabs/sdk-ts/core/tx'
import { IndexerGrpcAccountApi } from '@injectivelabs/sdk-ts/client/indexer'
import { getNetworkEndpoints, Network } from '@injectivelabs/sdk-ts/networks'
```

#### Available Subpath Imports

| Subpath                                | What It Includes                   |
| -------------------------------------- | ---------------------------------- |
| `@injectivelabs/sdk-ts/client/indexer` | Indexer gRPC/REST clients          |
| `@injectivelabs/sdk-ts/client/chain`   | Chain gRPC clients                 |
| `@injectivelabs/sdk-ts/client/wasm`    | WASM query clients                 |
| `@injectivelabs/sdk-ts/client/abacus`  | Abacus clients                     |
| `@injectivelabs/sdk-ts/client/olp`     | OLP clients                        |
| `@injectivelabs/sdk-ts/core/modules`   | Message types (Msg\*)              |
| `@injectivelabs/sdk-ts/core/accounts`  | Account management                 |
| `@injectivelabs/sdk-ts/core/tx`        | Transaction broadcasters           |
| `@injectivelabs/sdk-ts/types`          | TypeScript types and enums         |
| `@injectivelabs/sdk-ts/utils`          | Utility functions (encoding, etc.) |
| `@injectivelabs/sdk-ts/service`        | Service layer classes              |
| `@injectivelabs/sdk-ts/cosmjs`         | CosmJS utilities                   |

**Full Reference**: See [`packages/sdk-ts/package.json`](../packages/sdk-ts/package.json) `exports` field for all available subpaths.

**Action Required**:

- Optional: Update imports to use subpath imports for smaller bundles
- Use your IDE's auto-import feature to automatically use subpath imports
- Gradually migrate as you touch different parts of your codebase

---

## New Features

### Lazy Loading Methods

With lazy loading, new methods are available for managing wallet strategies:

```typescript
import { WalletStrategy, Wallet } from '@injectivelabs/wallet-ts'

const walletStrategy = new WalletStrategy({ chainId: 'injective-1' })

// Check if a strategy is loaded
if (!walletStrategy.isStrategyLoaded()) {
  // Load a specific wallet strategy
  await walletStrategy.loadStrategy(Wallet.Metamask)
}

// Or use setWallet (combines load + set)
await walletStrategy.setWallet(Wallet.Keplr)

// Get currently active wallet
const currentWallet = walletStrategy.getWallet()
```

### Encoding Utilities

New encoding utilities are available in `@injectivelabs/sdk-ts/utils`:

```typescript
import { hexToUint8Array, uint8ArrayToHex, utf8ToUint8Array, uint8ArrayToUtf8, base64ToUint8Array, uint8ArrayToBase64, concatUint8Arrays } from '@injectivelabs/sdk-ts/utils'

// All utilities work with Uint8Array instead of Buffer
const bytes = hexToUint8Array('deadbeef')
const hex = uint8ArrayToHex(bytes)
```

**Source**: [`packages/sdk-ts/src/utils/encoding.ts`](../packages/sdk-ts/src/utils/encoding.ts)

---

## Troubleshooting

### Error: "Wallet X strategy not loaded. Call setWallet() or loadStrategy() first."

**Cause**: Attempting to use wallet methods before loading the strategy.

**Solution**: Call `await walletStrategy.setWallet(Wallet.X)` before using wallet methods.

```typescript
const walletStrategy = new WalletStrategy({ chainId: 'injective-1' })

// This will throw the error
// const addresses = await walletStrategy.getAddresses()

// Fix: Load wallet first
await walletStrategy.setWallet(Wallet.Metamask)
const addresses = await walletStrategy.getAddresses() // ✅ Works
```

---

### Error: "setMetadata is not a function" or unexpected behavior

**Cause**: Forgetting to `await` the async `setMetadata()` call.

**Solution**: Add `await` keyword.

```typescript
// ❌ This might not throw an error immediately but will cause issues
walletStrategy.setMetadata({ privateKey: { privateKey: '0x...' } })

// ✅ Correct
await walletStrategy.setMetadata({ privateKey: { privateKey: '0x...' } })
```

---

### Error: "Buffer is not defined"

**Cause**: Code is trying to use `Buffer` which has been removed.

**Solution**: Replace with encoding utilities.

```typescript
// ❌ Old
import { Buffer } from 'buffer'
const bytes = Buffer.from(hex, 'hex')

// ✅ New
import { hexToUint8Array } from '@injectivelabs/sdk-ts/utils'
const bytes = hexToUint8Array(hex)
```

---

### TypeScript errors: Cannot find module '@injectivelabs/sdk-ts/client/indexer'

**Cause**: Your TypeScript configuration or bundler doesn't recognize subpath imports.

**Solution**: Ensure you're using:

- TypeScript 4.7+ with `moduleResolution: "node16"` or `"bundler"`
- Modern bundlers (Webpack 5+, Vite, etc.) with proper export map support

```json
// tsconfig.json
{
  "compilerOptions": {
    "moduleResolution": "bundler", // or "node16"
    "module": "ESNext"
  }
}
```

---

### Module not found errors after upgrading

**Cause**: Cached dependencies or lock file out of sync.

**Solution**: Clear cache and reinstall:

```bash
# npm
rm -rf node_modules package-lock.json
npm install

# yarn
rm -rf node_modules yarn.lock
yarn install

# pnpm
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

---

## Complete Code Examples

### Full Wallet Strategy Migration

#### ❌ Before v1.17.x

```typescript
import { WalletStrategy, Wallet } from '@injectivelabs/wallet-ts'
import { Buffer } from 'buffer'

async function initializeWallet() {
  // Wallet auto-loaded in constructor
  const walletStrategy = new WalletStrategy({
    chainId: 'injective-1',
    wallet: Wallet.Metamask,
  })

  // setMetadata was synchronous
  walletStrategy.setMetadata({
    privateKey: { privateKey: '0xabc123...' },
  })

  // Immediately use wallet methods
  const addresses = await walletStrategy.getAddresses()
  const [injectiveAddress] = addresses

  // Buffer usage
  const message = 'Hello Injective'
  const messageBytes = Buffer.from(message, 'utf8')
  const signature = await walletStrategy.signArbitrary(injectiveAddress, messageBytes.toString('hex'))

  return { addresses, signature }
}
```

#### ✅ After v1.17.x

```typescript
import { WalletStrategy, Wallet } from '@injectivelabs/wallet-ts'
import { utf8ToUint8Array, uint8ArrayToHex } from '@injectivelabs/sdk-ts/utils'

async function initializeWallet() {
  // Wallet not specified in constructor
  const walletStrategy = new WalletStrategy({
    chainId: 'injective-1',
  })

  // Must explicitly load wallet strategy
  await walletStrategy.setWallet(Wallet.Metamask)

  // setMetadata is now async - must await
  await walletStrategy.setMetadata({
    privateKey: { privateKey: '0xabc123...' },
  })

  // Safe to use wallet methods after loading
  const addresses = await walletStrategy.getAddresses()
  const [injectiveAddress] = addresses

  // Use encoding utilities instead of Buffer
  const message = 'Hello Injective'
  const messageBytes = utf8ToUint8Array(message)
  const signature = await walletStrategy.signArbitrary(injectiveAddress, uint8ArrayToHex(messageBytes))

  return { addresses, signature }
}
```

---

### Full Trading Application Migration

#### ❌ Before v1.17.x

```typescript
import { MsgBroadcasterWithPk, MsgSend, IndexerGrpcAccountApi, Network, getNetworkEndpoints } from '@injectivelabs/sdk-ts'
import { TradeDirection, OrderSide } from '@injectivelabs/ts-types'
import { Buffer } from 'buffer'

async function setupTrading(privateKey: string) {
  const network = Network.Mainnet
  const endpoints = getNetworkEndpoints(network)

  // Buffer usage for private key
  const privateKeyBuffer = Buffer.from(privateKey, 'hex')

  const broadcaster = new MsgBroadcasterWithPk({
    network,
    privateKey: privateKeyBuffer.toString('hex'),
  })

  const indexerApi = new IndexerGrpcAccountApi(endpoints.indexer)

  return { broadcaster, indexerApi }
}
```

#### ✅ After v1.17.x (with subpath imports)

```typescript
// Using subpath imports for better tree-shaking
import { MsgBroadcasterWithPk } from '@injectivelabs/sdk-ts/core/tx'
import { MsgSend } from '@injectivelabs/sdk-ts/core/modules'
import { IndexerGrpcAccountApi } from '@injectivelabs/sdk-ts/client/indexer'
import { Network, getNetworkEndpoints } from '@injectivelabs/sdk-ts/networks'
import { TradeDirection, OrderSide } from '@injectivelabs/sdk-ts/types' // Updated import path
import { hexToUint8Array, uint8ArrayToHex } from '@injectivelabs/sdk-ts/utils'

async function setupTrading(privateKey: string) {
  const network = Network.Mainnet
  const endpoints = getNetworkEndpoints(network)

  // Use encoding utilities instead of Buffer
  const privateKeyBytes = hexToUint8Array(privateKey)

  const broadcaster = new MsgBroadcasterWithPk({
    network,
    privateKey: uint8ArrayToHex(privateKeyBytes),
  })

  const indexerApi = new IndexerGrpcAccountApi(endpoints.indexer)

  return { broadcaster, indexerApi }
}
```

---

## Benefits

Upgrading to v1.17.x provides several benefits:

### Performance Improvements

- **Lazy wallet loading**: Only load wallet strategies when needed, reducing initial bundle size
- **Better tree-shaking**: Subpath imports allow bundlers to remove unused code more effectively
- **10-30% smaller bundles**: When using subpath imports, typical applications see significant size reductions

### Developer Experience

- **Clearer imports**: Subpath imports make it obvious where code comes from
- **Better IDE support**: More granular imports improve autocomplete and type hints
- **Native encoding utilities**: No need for Buffer polyfills in browser environments

### Code Quality

- **Explicit wallet loading**: Makes wallet initialization more predictable and debuggable
- **Async metadata**: Proper async handling prevents race conditions
- **Type safety**: Consolidated types in `sdk-ts/types` improve consistency

### Maintenance

- **Reduced dependencies**: Removal of Buffer and Apollo reduces dependency tree
- **Future-proof**: Better organized codebase for future features
- **Aligned with best practices**: Follows modern JavaScript/TypeScript patterns

---

## Resources

- **Pull Request**: [#598 - Build tool improvements and dependency cleanup](https://github.com/InjectiveLabs/injective-ts/pull/598)
- **Subpath Exports Reference**: [`packages/sdk-ts/package.json`](../packages/sdk-ts/package.json) - See `exports` field
- **Encoding Utilities Source**: [`packages/sdk-ts/src/utils/encoding.ts`](../packages/sdk-ts/src/utils/encoding.ts)
- **Deprecated Types**:
  - [`packages/ts-types/src/trade.ts`](../packages/ts-types/src/trade.ts)
  - [`packages/ts-types/src/common.ts`](../packages/ts-types/src/common.ts)
- **Wallet Strategy Source**: [`packages/wallets/wallet-strategy/src/strategy/index.ts`](../packages/wallets/wallet-strategy/src/strategy/index.ts)
- **Documentation**: [injective-docs](https://docs.injective.network/)

---

**Need help?** If you encounter issues not covered in this guide, please:

1. Check the [troubleshooting section](#troubleshooting)
2. Review the linked PR and source files
3. Open an issue on [GitHub](https://github.com/InjectiveLabs/injective-ts/issues)

Happy migrating! 🚀
