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
9. [V2 Compatibility Analysis](#v2-compatibility-analysis)
10. [References](#references)

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

### Updated Implementation

- **File:** `src/strategy/strategy.ts` (in-place update)
- **Class:** `WalletConnect` extends `BaseConcreteStrategy` (unchanged class name)
- **Approach:** Update existing strategy directly, no separate v2 file

---

## Key Decisions

| Topic           | Decision                                                     |
| --------------- | ------------------------------------------------------------ |
| QR Modal        | Fireblocks-only configuration, exclude all other wallets     |
| RPC URLs        | Use WalletConnect default proxy (no custom config needed)    |
| Types           | Update existing types in-place                               |
| Strategy Export | Single `WalletConnectStrategy` export (no v1/v2 coexistence) |
| Wallet Enum     | No changes to `Wallet` const/enums                           |
| Timeline        | No deadline - validate thoroughly before releasing           |

---

## Breaking Changes

### Consumer API Changes

**None** - The public API remains identical. Consumers will not need to change their code.

### Internal API Changes in WalletConnect v2

#### 1. Initialization

```typescript
// OLD (forked package)
this.provider = await EthereumProvider.init({
  projectId: projectId,
  metadata: metadata,
  showQrModal: true,
  optionalChains: [this.evmChainId]
})

// NEW (official v2)
this.provider = await EthereumProvider.init({
  projectId: projectId,
  optionalChains: [this.evmChainId, 1, 11155111],  // Use optionalChains only (recommended)
  optionalMethods: ['eth_sendTransaction', 'personal_sign', 'eth_signTypedData_v4', ...],
  optionalEvents: ['chainChanged', 'accountsChanged', 'connect', 'disconnect'],
  metadata: { name, description, url, icons },
  showQrModal: true,
})
```

#### 2. optionalChains vs chains (Important)

**Use `optionalChains` only** - Do not use `chains` (required namespaces).

Per [WalletConnect docs](https://docs.reown.com/advanced/providers/ethereum):

> "We recommend using optionalChains (optional namespaces) over chains (required namespaces). Required namespaces will block wallets from connecting to your application if any of the chains are not supported by the wallet. Smart Contract Wallets can only support one chain, the one that they had been deployed to."

```typescript
// RECOMMENDED - use optionalChains only
this.provider = await EthereumProvider.init({
  projectId,
  optionalChains: [this.evmChainId, 1, 11155111], // All chains as optional
  optionalMethods: [...],
  optionalEvents: [...],
})

// NOT RECOMMENDED - chains creates required namespaces
this.provider = await EthereumProvider.init({
  projectId,
  chains: [this.evmChainId], // Will block Smart Contract Wallets!
  optionalChains: [...],
})
```

#### 3. Required vs Optional Methods

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
Phase 1: Update Dependencies        (0.5 day)  - Replace forked packages with official ones
Phase 2: Build Verification         (0.5 day)  - Verify official package builds correctly
Phase 3: Update Strategy            (1-2 days) - Modify strategy.ts for v2 API changes
Phase 4: Update Build Config        (0.5 day)  - Update tsdown.config.ts externals
Phase 5: Testing                    (2 days)   - Manual testing with Fireblocks
Phase 6: Release                    (0.5 day)  - Version bump and publish
```

**Total: ~5-6 days (1 week)**

---

## Phase Details

### Phase 1: Update Dependencies

**Goal:** Replace forked packages with official WalletConnect packages.

**Steps:**

1. Update `package.json`:

```bash
# Remove forked dependencies
pnpm remove @bangjelkoski/wc-ethereum-provider @bangjelkoski/wallet-connect-ethereum-provider --filter @injectivelabs/wallet-wallet-connect

# Add official dependencies
pnpm add @walletconnect/ethereum-provider@^2.23.0 @walletconnect/types@^2.23.0 --filter @injectivelabs/wallet-wallet-connect
```

2. Update import statements in `src/strategy/strategy.ts`:

```typescript
// OLD
import EthereumProvider from '@bangjelkoski/wc-ethereum-provider'

// NEW
import { EthereumProvider } from '@walletconnect/ethereum-provider'
```

---

### Phase 2: Build Verification

**Goal:** Verify the official `@walletconnect/ethereum-provider` package builds correctly with our tsdown configuration.

**Steps:**

1. Run `pnpm build` in the package
2. Check for ESM/CJS resolution errors
3. Test the output works in both module formats

**If build fails:**

- Check tsdown.config.ts externals
- Verify package.json exports configuration
- May need to adjust bundler settings

---

### Phase 3: Update Strategy

**Goal:** Update `src/strategy/strategy.ts` for v2 API compatibility.

**File:** `src/strategy/strategy.ts`

#### Key Changes:

1. **Update `getWalletConnect()`** - Add explicit methods/events to provider init
2. **Add `session_delete` handler** - Handle remote disconnection
3. **Update import** - Change from default to named export

Note: The timeout parameter for `signEip712TypedData()` works the same way - the official v2 package supports the `expiry` parameter.

#### Fireblocks-Specific Configuration (unchanged):

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

### Phase 4: Build Configuration

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
    // Updated for v2 (remove old forked packages)
    '@walletconnect/ethereum-provider',
    '@walletconnect/types',
    '@walletconnect/utils',
  ],
})
```

---

### Phase 5: Testing

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

### Phase 6: Release

**Goal:** Version bump and publish the updated package.

**Steps:**

1. Update CHANGELOG.md with migration notes
2. Version bump (minor version recommended since public API is unchanged)
3. Run full test suite across dependent packages
4. Publish to npm

---

## Code Patterns

### Updated Import Statement

```typescript
// OLD (forked package)
import EthereumProvider from '@bangjelkoski/wc-ethereum-provider'

// NEW (official v2)
import { EthereumProvider } from '@walletconnect/ethereum-provider'
```

### Initialization Pattern (Updated for v2)

```typescript
private async getWalletConnect(): Promise<EthereumProvider> {
  if (this.provider) {
    return this.provider
  }

  const projectId = this.metadata?.walletConnect?.projectId
  if (!projectId) {
    throw new WalletConnectException(
      new Error('WalletConnect projectId is required'),
    )
  }

  this.provider = await EthereumProvider.init({
    projectId,
    optionalChains: [
      ...(this.evmChainId ? [this.evmChainId] : []),
      1,        // Mainnet
      11155111, // Sepolia
    ],
    optionalMethods: [
      'eth_sendTransaction',
      'personal_sign',
      'eth_signTypedData_v4',
      'wallet_switchEthereumChain',
    ],
    optionalEvents: ['chainChanged', 'accountsChanged', 'connect', 'disconnect'],
    metadata: {
      name: this.metadata?.walletConnect?.name || 'Injective',
      description: this.metadata?.walletConnect?.description || 'Injective Protocol',
      url: this.metadata?.walletConnect?.url || 'https://injective.com',
      icons: this.metadata?.walletConnect?.icons || [],
    },
    showQrModal: true,
    qrModalOptions: {
      explorerRecommendedWalletIds: [FIREBLOCKS_WALLET_ID],
      explorerExcludedWalletIds: 'ALL',
      // ... Fireblocks config
    },
  })

  // NEW: Handle remote session deletion
  this.provider.on('session_delete', () => {
    this.provider = undefined
  })

  return this.provider
}
```

### Timeout Parameter (expiry)

The official v2 package **does support** a timeout parameter called `expiry` (second parameter to `request()`). This is the same functionality as the forked package - no workaround needed!

```typescript
// Official v2 API signature:
public async request<T = unknown>(args: RequestArguments, expiry?: number): Promise<T>

// Usage - works the same as the forked package:
return await wc.request<string>(
  { method: 'eth_signTypedData_v4', params: [address, eip712json] },
  txTimeout || undefined, // expiry parameter - same API as before
)
```

**No code changes required** for the timeout functionality.

### Event Handling Pattern (unchanged)

```typescript
async onAccountChange(callback: (account: string | string[]) => void): Promise<void> {
  const wc = await this.getConnectedWalletConnect()

  const handler = (accounts: string[]) => {
    callback(accounts.length === 1 ? accounts[0] : accounts)
  }

  this.listeners[WalletEventListener.AccountChange] = handler
  wc.on('accountsChanged', handler)
}
```

### Disconnect Pattern (unchanged)

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
- [ ] `signEip712TypedData()` works (with timeout/expiry)
- [ ] `sendEvmTransaction()` works
- [ ] Account change events fire
- [ ] Chain change events fire
- [ ] `disconnect()` cleans up properly
- [ ] Can reconnect after disconnect
- [ ] Session restoration works on page refresh
- [ ] `session_delete` event handled (remote disconnect)

### Error Handling

- [ ] User rejection handled gracefully
- [ ] Network errors handled
- [ ] Timeout errors handled
- [ ] Invalid session errors handled

---

## V2 Compatibility Analysis

### Method Compatibility Matrix

| Method                         | Current Implementation                      | V2 Compatibility | Notes                         |
| ------------------------------ | ------------------------------------------- | ---------------- | ----------------------------- |
| `getWalletDeviceType()`        | Returns `WalletDeviceType.Browser`          | ✅ No change     | Static method                 |
| `enable(topic?)`               | Calls `connectWalletConnect(topic)`         | ✅ Compatible    | `pairingTopic` works the same |
| `disconnect()`                 | Removes listeners + `provider.disconnect()` | ✅ Compatible    | Same API                      |
| `getAddresses()`               | `eth_requestAccounts`                       | ✅ Compatible    | Standard EIP-1193             |
| `getSessionOrConfirm()`        | `wc.session?.topic`                         | ✅ Compatible    | `session.topic` exists in v2  |
| `sendEvmTransaction()`         | `eth_sendTransaction`                       | ✅ Compatible    | Standard EIP-1193             |
| `sendTransaction()`            | Uses `TxGrpcApi.broadcast()`                | ✅ No change     | Doesn't touch WC              |
| `signEip712TypedData()`        | `eth_signTypedData_v4` + timeout            | ✅ Compatible    | `expiry` param supported      |
| `signAminoCosmosTransaction()` | Throws "not supported"                      | ✅ No change     | Keep throwing                 |
| `signCosmosTransaction()`      | Throws "not supported"                      | ✅ No change     | Keep throwing                 |
| `signArbitrary()`              | `personal_sign`                             | ✅ Compatible    | Standard EIP-1193             |
| `getEthereumChainId()`         | `eth_chainId`                               | ✅ Compatible    | Standard EIP-1193             |
| `getEvmTransactionReceipt()`   | Throws "not supported"                      | ✅ No change     | Keep throwing                 |
| `getPubKey()`                  | Throws "not supported"                      | ✅ No change     | Keep throwing                 |
| `onChainIdChanged()`           | `wc.on('chainChanged')`                     | ✅ Compatible    | Same event name               |
| `onAccountChange()`            | `wc.on('accountsChanged')`                  | ✅ Compatible    | Same event name               |
| `getEip1193Provider()`         | Returns provider                            | ✅ Compatible    | Standard EIP-1193             |

**Summary:** All methods map directly to v2 with no code changes required (except import statement).

---

### Critical Items

#### 1. Request Timeout Parameter (`expiry`)

The official v2 package **does support** a timeout parameter called `expiry`:

```typescript
// Official v2 API signature:
public async request<T = unknown>(args: RequestArguments, expiry?: number): Promise<T>

// Current implementation works as-is:
return await wc.request(
  { method: 'eth_signTypedData_v4', params: [address, eip712json] },
  txTimeout || undefined, // expiry parameter - same API
)
```

**No changes required** - the timeout functionality works identically to the forked package.

#### 2. QR Modal Deprecation Notice

The WalletConnect docs note that `showQrModal` is deprecated (rebranded as Reown's AppKit).

**Options:**

1. **Keep using `showQrModal: true`** - Still works, just deprecated (recommended for now)
2. **Subscribe to `display_uri` event** - Handle URI manually for custom QR
3. **Migrate to AppKit** - Bigger change, consider for future

**Recommendation:** Start with option 1, migrate later if needed.

#### 3. Session Delete Event (NEW)

v2 has a `session_delete` event that fires when the wallet disconnects the session remotely.

**Add this handler in `getWalletConnect()` after provider init:**

```typescript
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

### Implementation Checklist

Code changes required based on the compatibility analysis:

- [ ] Update import from `@bangjelkoski/wc-ethereum-provider` to `@walletconnect/ethereum-provider`
- [ ] Use `optionalChains` only (do not use `chains`)
- [ ] Add explicit `optionalMethods`, `optionalEvents` to provider init
- [ ] Add `session_delete` event handler
- [ ] Update `tsdown.config.ts` externals

---

## References

- [WalletConnect v2 Docs](https://docs.walletconnect.com/)
- [Ethereum Provider API](https://github.com/WalletConnect/walletconnect-monorepo/tree/v2.0/providers/ethereum-provider)
- [Reown AppKit Docs](https://docs.reown.com/appkit/react/core/installation)
- [WalletConnect v2 Types](https://github.com/WalletConnect/walletconnect-monorepo/blob/v2.0/providers/ethereum-provider/src/types.ts)
