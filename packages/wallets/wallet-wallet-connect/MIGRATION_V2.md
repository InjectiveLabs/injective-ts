# WalletConnect v2 Migration Guide

This document outlines the migration plan from the forked WalletConnect packages (`@bangjelkoski/*`) to the official `@walletconnect/ethereum-provider` v2.

---

## Table of Contents

1. [Current State](#current-state)
2. [Target State](#target-state)
3. [Key Decisions](#key-decisions)
4. [Breaking Changes](#breaking-changes)
5. [Implementation Plan](#implementation-plan)
6. [Phase Details](#phase-details)
7. [Code Patterns](#code-patterns)
8. [Testing Checklist](#testing-checklist)
9. [Rollback Plan](#rollback-plan)

---

## Current State

### Dependencies (to be replaced)

```json
{
  "@bangjelkoski/wc-ethereum-provider": "2.18.1",
  "@bangjelkoski/wallet-connect-ethereum-provider": "2.17.2"
}
```

### Current Implementation

- **File:** `src/strategy/strategy.ts`
- **Class:** `WalletConnect` extends `BaseConcreteStrategy`
- **Primary Wallet:** Fireblocks (only supported wallet)
- **Forked packages reason:** ESM/CJS module resolution issues (suspected)

---

## Target State

### New Dependencies

```json
{
  "@walletconnect/ethereum-provider": "^2.23.0",
  "@walletconnect/types": "^2.23.0"
}
```

### New Implementation

- **New File:** `src/strategy/strategy-v2.ts`
- **New Class:** `WalletConnectV2` extends `BaseConcreteStrategy`
- **Coexistence:** Both v1 and v2 strategies exported until v2 is validated

---

## Key Decisions

| Topic           | Decision                                                                        |
| --------------- | ------------------------------------------------------------------------------- |
| QR Modal        | Fireblocks-only configuration, exclude all other wallets                        |
| RPC URLs        | Use WalletConnect default proxy (no custom config needed)                       |
| Types           | Create new `WalletConnectMetadataV2` type in `wallet-base`                      |
| Strategy Export | Export both `WalletConnectStrategy` (v1) and `WalletConnectV2Strategy` (v2)     |
| Wallet Enum     | No changes to `Wallet` const/enums - both strategies use `Wallet.WalletConnect` |
| Timeline        | No deadline - validate thoroughly before switching                              |

---

## Breaking Changes

### API Changes in WalletConnect v2

#### 1. Initialization

```typescript
// OLD (v1 fork)
this.provider = await EthereumProvider.init({
  projectId: projectId,
  metadata: metadata,
  showQrModal: true,
  optionalChains: [this.evmChainId]
})

// NEW (v2)
this.provider = await EthereumProvider.init({
  projectId: projectId,
  chains: [this.evmChainId],  // Required chains (not optional)
  optionalChains: [...],
  methods: ['eth_sendTransaction', 'personal_sign'],  // Explicit methods
  optionalMethods: ['eth_signTypedData_v4', ...],
  events: ['chainChanged', 'accountsChanged'],  // Explicit events
  metadata: { name, description, url, icons },
  showQrModal: true,
})
```

#### 2. Required vs Optional Methods

```typescript
// REQUIRED (must be supported or connection fails)
const REQUIRED_METHODS = ['eth_sendTransaction', 'personal_sign']
const REQUIRED_EVENTS = ['chainChanged', 'accountsChanged']

// OPTIONAL (nice to have)
const OPTIONAL_METHODS = ['eth_accounts', 'eth_requestAccounts', 'eth_signTypedData_v4', 'wallet_switchEthereumChain', 'wallet_addEthereumChain']
```

#### 3. New Events

```typescript
// New events in v2 to handle
type Event =
  | 'connect'
  | 'disconnect'
  | 'message'
  | 'chainChanged'
  | 'accountsChanged'
  | 'session_delete' // NEW - handle session cleanup
  | 'session_event' // NEW
  | 'session_update' // NEW
  | 'display_uri' // NEW - for custom QR handling
```

#### 4. Error Codes

```typescript
// v2 specific error codes
const WalletConnectV2ErrorCodes = {
  USER_REJECTED: 4001,
  UNAUTHORIZED: 4100,
  UNSUPPORTED_METHOD: 4200,
  DISCONNECTED: 4900,
  CHAIN_DISCONNECTED: 4901,
}
```

---

## Implementation Plan

### Overview

```
Phase 1: Build Verification     (1 day)   - Verify official package builds
Phase 2: Type Definitions       (1 day)   - Create WalletConnectMetadataV2
Phase 3: Core Implementation    (3 days)  - Build WalletConnectV2Strategy
Phase 4: Error Handling         (1 day)   - Update WalletConnectException
Phase 5: Build Config           (0.5 day) - Update tsdown.config.ts
Phase 6: Testing                (2 days)  - Manual testing with Fireblocks
Phase 7: Cleanup (later)        (1 day)   - Remove v1 after validation
```

**Total: ~10 days (2 weeks)**

---

## Phase Details

### Phase 1: Build Verification

**Goal:** Verify the official `@walletconnect/ethereum-provider` package builds correctly with our tsdown configuration.

**Steps:**

1. Add `@walletconnect/ethereum-provider@2.23.0` to `package.json`
2. Run `pnpm build` in the package
3. Check for ESM/CJS resolution errors
4. Test the output works in both module formats

**If build fails:**

- Check tsdown.config.ts externals
- Verify package.json exports configuration
- May need to adjust bundler settings

---

### Phase 2: Type Definitions

**Goal:** Create new types without breaking existing implementations.

**File:** `packages/wallets/wallet-base/src/types/strategy.ts`

```typescript
// Keep existing type unchanged
export type WalletConnectMetadata = {
  projectId?: string
}

// Add new v2 type
export type WalletConnectMetadataV2 = {
  projectId: string // Required in v2
  name?: string
  description?: string
  url?: string
  icons?: string[]
}
```

**File:** `packages/wallets/wallet-wallet-connect/src/types/v2-types.ts`

```typescript
import type { SessionTypes, SignClientTypes } from '@walletconnect/types'

export interface WalletConnectV2Options {
  projectId: string
  chains?: number[]
  optionalChains?: number[]
  methods?: string[]
  optionalMethods?: string[]
  events?: string[]
  optionalEvents?: string[]
  metadata?: WalletConnectV2Metadata
  showQrModal?: boolean
}

export interface WalletConnectV2Metadata {
  name: string
  description: string
  url: string
  icons: string[]
}

export interface WalletConnectV2Events {
  connect: { chainId: string }
  disconnect: { code: number; message: string }
  chainChanged: string
  accountsChanged: string[]
  session_delete: { topic: string }
  display_uri: string
}

export type WalletConnectSession = SessionTypes.Struct | undefined
```

---

### Phase 3: Core Implementation

**Goal:** Create `WalletConnectV2Strategy` class alongside existing implementation.

**New File:** `src/strategy/strategy-v2.ts`

#### Key Methods to Implement:

1. **`getWalletConnect()`** - Provider initialization
2. **`connectWalletConnect()`** - Connection flow
3. **`getConnectedWalletConnect()`** - Get active provider
4. **`enable()`** - Wallet enablement
5. **`disconnect()`** - Cleanup and disconnection
6. **`getAddresses()`** - Get connected addresses
7. **`signEip712TypedData()`** - EIP-712 signing (critical for Injective)
8. **`sendEvmTransaction()`** - Transaction sending
9. **`onAccountChange()`** - Account change listener
10. **`onChainIdChange()`** - Chain change listener
11. **`getSessionOrConfirm()`** - Session management

#### Fireblocks-Specific Configuration:

```typescript
const FIREBLOCKS_WALLET_ID = 'ecc4036f86e27eb4cfde344e696a5982e524c10b7cf04044e3de08508aa911cf'

const qrModalOptions = {
  explorerRecommendedWalletIds: [FIREBLOCKS_WALLET_ID],
  explorerExcludedWalletIds: 'ALL' as const,
  desktopWallets: [
    {
      id: FIREBLOCKS_WALLET_ID,
      name: 'Fireblocks',
      links: {
        native: '',
        universal: 'https://console.fireblocks.io/v2/walletconnect',
      },
    },
  ],
  mobileWallets: [
    {
      id: FIREBLOCKS_WALLET_ID,
      name: 'Fireblocks',
      links: {
        native: '',
        universal: 'https://console.fireblocks.io/v2/walletconnect',
      },
    },
  ],
}
```

---

### Phase 4: Error Handling

**Goal:** Update `WalletConnectException` to handle v2 error patterns.

**File:** `packages/exceptions/src/exceptions/exceptions/WalletConnectException.ts`

Add handling for:

- `4001` - User rejected
- `4100` - Unauthorized
- `4200` - Unsupported method
- `4900` - Disconnected
- `4901` - Chain disconnected

---

### Phase 5: Build Configuration

**Update:** `tsdown.config.ts`

```typescript
export default defineConfig({
  // ... existing config
  external: [
    '@injectivelabs/exceptions',
    '@injectivelabs/networks',
    '@injectivelabs/sdk-ts',
    '@injectivelabs/ts-types',
    '@injectivelabs/utils',
    '@injectivelabs/wallet-base',
    '@injectivelabs/wallet-core',
    // Updated for v2
    '@walletconnect/ethereum-provider',
    '@walletconnect/types',
    '@walletconnect/utils',
  ],
})
```

**Update:** `src/index.ts`

```typescript
// Export both strategies
export { WalletConnect as WalletConnectStrategy } from './strategy/strategy.js'
export { WalletConnectV2 as WalletConnectV2Strategy } from './strategy/strategy-v2.js'

// Re-export types
export * from './types/v2-types.js'
```

---

### Phase 6: Testing

#### Manual Testing Checklist

- [ ] Build succeeds without errors
- [ ] ESM import works
- [ ] CJS require works
- [ ] Connect to Fireblocks wallet
- [ ] Sign EIP-712 typed data
- [ ] Send EVM transaction
- [ ] Account change event fires
- [ ] Chain change event fires
- [ ] Disconnect cleans up properly
- [ ] Reconnect after disconnect works
- [ ] Session persists across page refresh

#### Test Commands

```bash
# Build the package
pnpm --filter @injectivelabs/wallet-wallet-connect build

# Type check
pnpm --filter @injectivelabs/wallet-wallet-connect type-check

# Test import size (verify tree-shaking)
pnpm --filter @injectivelabs/wallet-wallet-connect test
```

---

### Phase 7: Cleanup (After Validation)

Once v2 is confirmed working:

1. Remove v1 strategy file (`strategy.ts`)
2. Remove forked dependencies from `package.json`
3. Rename `WalletConnectV2Strategy` to `WalletConnectStrategy`
4. Update exports in `index.ts`
5. Remove `WalletConnectMetadataV2` (merge into `WalletConnectMetadata`)
6. Update CHANGELOG.md

---

## Code Patterns

### Initialization Pattern (v2)

```typescript
private async getWalletConnect(): Promise<EthereumProvider> {
  if (this.provider) {
    return this.provider
  }

  const projectId = this.metadata?.walletConnectV2?.projectId
  if (!projectId) {
    throw new WalletConnectException(
      new Error('WalletConnect projectId is required'),
    )
  }

  this.provider = await EthereumProvider.init({
    projectId,
    chains: this.evmChainId ? [this.evmChainId] : undefined,
    optionalChains: [1, 11155111], // Mainnet, Sepolia
    methods: ['eth_sendTransaction', 'personal_sign'],
    optionalMethods: [
      'eth_signTypedData_v4',
      'wallet_switchEthereumChain',
    ],
    events: ['chainChanged', 'accountsChanged'],
    optionalEvents: ['connect', 'disconnect'],
    metadata: {
      name: this.metadata?.walletConnectV2?.name || 'Injective',
      description: this.metadata?.walletConnectV2?.description || 'Injective Protocol',
      url: this.metadata?.walletConnectV2?.url || 'https://injective.com',
      icons: this.metadata?.walletConnectV2?.icons || [],
    },
    showQrModal: true,
    qrModalOptions: {
      explorerRecommendedWalletIds: [FIREBLOCKS_WALLET_ID],
      explorerExcludedWalletIds: 'ALL',
      // ... Fireblocks config
    },
  })

  return this.provider
}
```

### Event Handling Pattern (v2)

```typescript
async onAccountChange(callback: (account: string | string[]) => void): Promise<void> {
  const wc = await this.getConnectedWalletConnect()

  const handler = (accounts: string[]) => {
    callback(accounts.length === 1 ? accounts[0] : accounts)
  }

  this.listeners[WalletEventListener.AccountChange] = handler
  wc.on('accountsChanged', handler)
}

async onSessionDelete(callback: () => void): Promise<void> {
  const wc = await this.getConnectedWalletConnect()
  wc.on('session_delete', () => {
    this.provider = undefined
    callback()
  })
}
```

### Disconnect Pattern (v2)

```typescript
public async disconnect(): Promise<void> {
  // Remove all listeners first
  if (this.provider) {
    Object.entries(this.listeners).forEach(([event, handler]) => {
      if (handler) {
        this.provider?.removeListener(event, handler)
      }
    })
  }

  this.listeners = {}

  if (this.provider) {
    try {
      await this.provider.disconnect()
    } catch (error) {
      // Session might already be disconnected
      console.warn('WalletConnect disconnect warning:', error)
    } finally {
      this.provider = undefined
    }
  }
}
```

---

## Testing Checklist

### Build Verification

- [ ] `pnpm build` succeeds
- [ ] No ESM/CJS resolution errors
- [ ] `dist/esm/index.js` exists and is valid
- [ ] `dist/cjs/index.js` exists and is valid
- [ ] Type declarations generated

### Functional Testing (with Fireblocks)

- [ ] QR modal shows Fireblocks only
- [ ] Can connect to Fireblocks wallet
- [ ] `getAddresses()` returns correct address
- [ ] `signEip712TypedData()` works
- [ ] `sendEvmTransaction()` works
- [ ] Account change events fire
- [ ] Chain change events fire
- [ ] `disconnect()` cleans up properly
- [ ] Can reconnect after disconnect
- [ ] Session restoration works on page refresh

### Error Handling

- [ ] User rejection handled gracefully
- [ ] Network errors handled
- [ ] Timeout errors handled
- [ ] Invalid session errors handled

---

## Rollback Plan

If v2 implementation fails or causes issues:

1. **Immediate:** Switch imports back to v1 strategy

   ```typescript
   // In consumer code
   import { WalletConnectStrategy } from '@injectivelabs/wallet-wallet-connect'
   // Instead of WalletConnectV2Strategy
   ```

2. **Package level:** v1 strategy remains unchanged and functional

3. **Dependencies:** Forked packages remain in package.json until v2 is validated

---

## References

- [WalletConnect v2 Docs](https://docs.walletconnect.com/)
- [Ethereum Provider API](https://github.com/WalletConnect/walletconnect-monorepo/tree/v2.0/providers/ethereum-provider)
- [Reown AppKit Docs](https://docs.reown.com/appkit/react/core/installation)
- [WalletConnect v2 Types](https://github.com/WalletConnect/walletconnect-monorepo/blob/v2.0/providers/ethereum-provider/src/types.ts)

---

## V2 Compatibility Analysis

### Method Compatibility Matrix

| Method                         | V1 Implementation                           | V2 Compatibility        | Notes                         |
| ------------------------------ | ------------------------------------------- | ----------------------- | ----------------------------- |
| `getWalletDeviceType()`        | Returns `WalletDeviceType.Browser`          | ✅ No change            | Static method                 |
| `enable(topic?)`               | Calls `connectWalletConnect(topic)`         | ✅ Compatible           | `pairingTopic` works the same |
| `disconnect()`                 | Removes listeners + `provider.disconnect()` | ✅ Compatible           | Same API                      |
| `getAddresses()`               | `eth_requestAccounts`                       | ✅ Compatible           | Standard EIP-1193             |
| `getSessionOrConfirm()`        | `wc.session?.topic`                         | ✅ Compatible           | `session.topic` exists in v2  |
| `sendEvmTransaction()`         | `eth_sendTransaction`                       | ✅ Compatible           | Standard EIP-1193             |
| `sendTransaction()`            | Uses `TxGrpcApi.broadcast()`                | ✅ No change            | Doesn't touch WC              |
| `signEip712TypedData()`        | `eth_signTypedData_v4` + timeout            | ⚠️ **Needs workaround** | See timeout section below     |
| `signAminoCosmosTransaction()` | Throws "not supported"                      | ✅ No change            | Keep throwing                 |
| `signCosmosTransaction()`      | Throws "not supported"                      | ✅ No change            | Keep throwing                 |
| `signArbitrary()`              | `personal_sign`                             | ✅ Compatible           | Standard EIP-1193             |
| `getEthereumChainId()`         | `eth_chainId`                               | ✅ Compatible           | Standard EIP-1193             |
| `getEvmTransactionReceipt()`   | Throws "not supported"                      | ✅ No change            | Keep throwing                 |
| `getPubKey()`                  | Throws "not supported"                      | ✅ No change            | Keep throwing                 |
| `onChainIdChanged()`           | `wc.on('chainChanged')`                     | ✅ Compatible           | Same event name               |
| `onAccountChange()`            | `wc.on('accountsChanged')`                  | ✅ Compatible           | Same event name               |
| `getEip1193Provider()`         | Returns provider                            | ✅ Compatible           | Standard EIP-1193             |

**Summary:** 90% of the implementation maps directly to v2 with no changes.

---

### Critical Items

#### 1. Request Timeout Parameter

The v1 forked package supports a timeout parameter in `request()`:

```typescript
// Current v1 implementation
return await wc.request(
  { method: 'eth_signTypedData_v4', params: [address, eip712json] },
  txTimeout || undefined, // <-- Second parameter (forked feature)
)
```

The official v2 `@walletconnect/ethereum-provider` may not support this second parameter.

**Workaround for v2:**

```typescript
async signEip712TypedData(
  eip712json: string,
  address: AccountAddress,
  options: { txTimeout?: number } = {},
): Promise<string> {
  const wc = await this.getConnectedWalletConnect()

  let txTimeout: number | undefined
  if (options?.txTimeout !== undefined) {
    const timeout = Number(options.txTimeout)
    txTimeout = isNaN(timeout) || timeout < 300 ? undefined : Math.min(timeout, 604800)
  }

  const requestPromise = wc.request<string>({
    method: 'eth_signTypedData_v4',
    params: [address, eip712json],
  })

  // Implement timeout via Promise.race if needed
  if (txTimeout) {
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new WalletConnectException(new Error('Request timed out'))),
        txTimeout * 1000
      )
    )
    return Promise.race([requestPromise, timeoutPromise])
  }

  return requestPromise
}
```

#### 2. QR Modal Deprecation Notice

The WalletConnect docs note that `showQrModal` is deprecated (rebranded as Reown's AppKit).

**Options:**

1. **Keep using `showQrModal: true`** - Still works, just deprecated (recommended for now)
2. **Subscribe to `display_uri` event** - Handle URI manually for custom QR
3. **Migrate to AppKit** - Bigger change, consider for future

**Recommendation:** Start with option 1, migrate later if needed.

#### 3. Session Delete Event (NEW)

v2 has a `session_delete` event that fires when the wallet disconnects the session remotely.

**Add this handler in v2 strategy:**

```typescript
// In getWalletConnect() after provider.init()
this.provider.on('session_delete', () => {
  this.provider = undefined
  // Optionally: emit event for UI to handle disconnection
})
```

---

### New V2 Features Worth Considering

| Feature                     | Description                            | Priority | Action                           |
| --------------------------- | -------------------------------------- | -------- | -------------------------------- |
| `session_delete` event      | Fires when wallet disconnects remotely | **High** | Add handler to clean up provider |
| `display_uri` event         | Get pairing URI for custom QR          | Low      | Only if QR modal has issues      |
| `session.peer.metadata`     | Connected wallet's metadata            | Low      | Useful for logging               |
| Verify API                  | Domain verification for security       | Medium   | Already using via metadata URL   |
| `optionalChains` preference | Avoid blocking Smart Contract Wallets  | **High** | Already in plan                  |

---

### Updated Implementation Checklist

Based on the compatibility analysis, update Phase 3 checklist:

- [ ] Implement `Promise.race` timeout workaround for `signEip712TypedData()`
- [ ] Add `session_delete` event handler
- [ ] Use `optionalChains` instead of `chains` (per WC docs recommendation)
- [ ] Verify `showQrModal: true` still works in v2
- [ ] Test all 17 methods listed in compatibility matrix

---

## Changelog

| Date       | Change                                     |
| ---------- | ------------------------------------------ |
| 2025-11-28 | Initial migration plan created             |
| 2025-11-28 | Added v2 compatibility analysis and matrix |
