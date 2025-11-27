# Ledger Implementation Improvements

This document outlines recommended improvements to the `@injectivelabs/wallet-ledger` package based on analysis of the current implementation against the latest official Ledger SDK (v6.47.1).

---

## Bug Fixes (High Priority)

### 1. Signature `v` Value Padding

**Issue:** The signature `v` value is not properly padded, which can result in invalid signatures when `v` is a single hex digit.

**Affected Files:**

- `src/strategy/Ledger/Base.ts` (lines 180, 207, 263)
- `src/strategy/Ledger/Eip1193Provider.ts` (lines 57, 97)

**Current Code:**

```typescript
const combined = `${result.r}${result.s}${result.v.toString(16)}`
```

**Problem:**

- When `v = 0`, output is `"0"` (1 char) instead of `"00"` (2 chars)
- When `v = 1`, output is `"1"` (1 char) instead of `"01"` (2 chars)
- Results in signature string being 1 character short → invalid signature

**Fix:**

```typescript
const v = result.v.toString(16).padStart(2, '0')
const combined = `${result.r}${result.s}${v}`
```

---

### 2. Public Client Caching Bug (Multi-Chain Support)

**Issue:** The public client is cached without considering the chain ID, causing incorrect chain to be used when switching networks.

**Affected File:** `src/strategy/Ledger/Base.ts` (lines 430-448)

**Current Code:**

```typescript
private publicClient: PublicClient | undefined

private async getPublicClient(evmChainId?: EvmChainId) {
  if (this.publicClient) {
    return this.publicClient  // Returns cached client even if chainId differs!
  }
  // ...
}
```

**Fix:**

```typescript
private publicClients: Map<number, PublicClient> = new Map()

private async getPublicClient(evmChainId?: EvmChainId) {
  const chainId = evmChainId || this.evmOptions.evmChainId

  if (!this.publicClients.has(chainId)) {
    const url = this.evmOptions.rpcUrl || this.evmOptions.rpcUrls?.[chainId]

    if (!url) {
      throw new GeneralException(
        new Error('Please pass rpcUrl within the evmOptions'),
      )
    }

    this.publicClients.set(chainId, getViemPublicClient(chainId, url))
  }

  return this.publicClients.get(chainId)!
}
```

---

### 3. Error Message Typos in LedgerCosmos

**Issue:** Error messages incorrectly reference "Keplr" instead of "LedgerCosmos".

**Affected File:** `src/strategy/LedgerCosmos/index.ts` (lines 225-231, 235-241)

**Current Code:**

```typescript
throw new CosmosWalletException(
  new Error('getEthereumChainId is not supported on Keplr'), // Wrong!
  // ...
)
```

**Fix:**

```typescript
throw new CosmosWalletException(
  new Error('getEthereumChainId is not supported on LedgerCosmos'),
  // ...
)
```

---

### 4. Unused `derivationPath` Parameter in Eip1193Provider

**Issue:** The `derivationPath` parameter passed to the constructor is ignored.

**Affected File:** `src/strategy/Ledger/Eip1193Provider.ts` (lines 18-26)

**Current Code:**

```typescript
constructor(
  ledger: LedgerHW,
  params: { derivationPath?: string; chainId?: string },
) {
  this.ledger = ledger
  this.derivationPath = "m/44'/60'/0'/0/0"  // Hardcoded!
  this.chainId = parseInt(params.chainId || '1')
}
```

**Fix:**

```typescript
constructor(
  ledger: LedgerHW,
  params: { derivationPath?: string; chainId?: string },
) {
  this.ledger = ledger
  this.derivationPath = params.derivationPath || "m/44'/60'/0'/0/0"
  this.chainId = parseInt(params.chainId || '1')
}
```

---

## Enhancements (Medium Priority)

### 5. Use `clearSignTransaction` API

**Benefit:** Combines transaction resolution and signing in one call with better error handling.

**Affected File:** `src/strategy/Ledger/Base.ts` (lines 350-366)

**Current Code:**

```typescript
const resolution = await ledgerService.resolveTransaction(serializedTxHex, {}, {})
const txSig = await ledger.signTransaction(derivationPath, serializedTxHex, resolution)
```

**Improved Code:**

```typescript
const txSig = await ledger.clearSignTransaction(derivationPath, serializedTxHex, {
  erc20: true,
  externalPlugins: true,
  nft: true,
})
```

---

### 6. Add Device Feature Detection with `getAppConfiguration()`

**Benefit:** Proactively check device capabilities instead of catching errors.

**Affected File:** `src/strategy/Ledger/Base.ts`

**Current Approach (error-based detection):**

```typescript
const isKnownNanoSError = errorMessage.includes('instruction not supported') || errorMessage.includes('invalid status') || errorMessage.includes('not supported') || errorMessage.includes('INS_NOT_SUPPORTED')
```

**Better Approach:**

```typescript
// Add to LedgerHW class or use directly
async getAppConfig() {
  const ledger = await this.getInstance()
  return ledger.getAppConfiguration()
  // Returns: { version: "1.11.1", arbitraryDataEnabled, erc20ProvisioningNecessary, ... }
}

// Usage: Check version before attempting signEIP712Message
const config = await this.ledger.getAppConfig()
const supportsEIP712 = semver.gte(config.version, '1.10.0')  // Example version check
```

---

### 7. Configure Resolution Service for Clear-Signing

**Benefit:** Enable clear-signing for ERC20 tokens, NFTs, and ENS domains on device display.

**Affected File:** `src/strategy/Ledger/Base.ts`

**Current Code:**

```typescript
const resolution = await ledgerService.resolveTransaction(
  serializedTxHex,
  {}, // Empty LoadConfig
  {}, // Empty ResolutionConfig
)
```

**Improved Code:**

```typescript
const loadConfig: LoadConfig = {
  // Use Ledger's CAL service for token metadata
  cryptoassetsBaseURL: 'https://cdn.live.ledger.com/cryptoassets',
}

const resolutionConfig: ResolutionConfig = {
  erc20: true, // Show token names on device
  nft: true, // Show NFT info on device
  externalPlugins: true,
  // domains: [],     // For ENS support if needed
}

const resolution = await ledgerService.resolveTransaction(serializedTxHex, loadConfig, resolutionConfig)
```

---

### 8. Add Chain ID Display for Stax/Flex Devices

**Benefit:** Shows network name (e.g., "Ethereum Mainnet", "Injective") on Ledger Stax/Flex screens.

**Affected File:** `src/strategy/Ledger/hw/AccountManager.ts` (line 91)

**Current Code:**

```typescript
const result = await this.ledger.getAddress(path)
```

**Improved Code:**

```typescript
const result = await this.ledger.getAddress(
  path,
  false, // boolDisplay
  true, // boolChaincode (you already use this)
  chainId, // NEW: Pass chain ID for Stax/Flex display
)
```

---

## Good to Have (Low Priority)

### 9. Implement EIP-1193 Event Methods

**Benefit:** Full EIP-1193 provider compliance for better dApp compatibility.

**Affected File:** `src/strategy/Ledger/Eip1193Provider.ts` (lines 197-211)

**Current Code:**

```typescript
on(_event: string, _listener: (...args: any[]) => void): this {
  throw new Error('Method not implemented.')
}
```

**Improved Implementation:**

```typescript
import { EventEmitter } from 'events'

export class LedgerEip1193Provider extends EventEmitter implements Eip1193Provider {
  // ... existing code ...

  on(event: string, listener: (...args: any[]) => void): this {
    return super.on(event, listener)
  }

  once(event: string, listener: (...args: any[]) => void): this {
    return super.once(event, listener)
  }

  removeListener(event: string, listener: (...args: any[]) => void): this {
    return super.removeListener(event, listener)
  }

  off(event: string, listener: (...args: any[]) => void): this {
    return super.off(event, listener)
  }

  // Emit events when appropriate:
  // this.emit('chainChanged', `0x${chainId.toString(16)}`)
  // this.emit('accountsChanged', [address])
  // this.emit('connect', { chainId: `0x${chainId.toString(16)}` })
  // this.emit('disconnect', error)
}
```

---

### 10. ENS Domain Display Support

**Benefit:** Show ENS names (e.g., "vitalik.eth") instead of raw addresses on device.

**New API Available:**

```typescript
// Before signing a transaction to an ENS address
await ledger.provideDomainName(tlvEncodedDomainData)
```

**Note:** Requires TLV encoding of domain data. See Ledger documentation for format.

---

### 11. Transport Event Cleanup

**Issue:** Disconnect event listener is not cleaned up when manually closing transport.

**Affected File:** `src/strategy/Ledger/hw/index.ts` (lines 61-64)

**Current Code:**

```typescript
transport.on('disconnect', () => {
  this.ledger = null
  this.accountManager = null
})
```

**Improved Code:**

```typescript
private disconnectHandler = () => {
  this.ledger = null
  this.accountManager = null
}

// In getInstance():
transport.on('disconnect', this.disconnectHandler)

// In refresh() before closing:
if (this.ledger) {
  this.ledger.transport.off('disconnect', this.disconnectHandler)
  this.ledger.transport.close()
}
```

---

## Summary

| #   | Issue                    | Priority | Type         | Files Affected              |
| --- | ------------------------ | -------- | ------------ | --------------------------- |
| 1   | Signature `v` padding    | High     | Bug Fix      | Base.ts, Eip1193Provider.ts |
| 2   | Public client caching    | High     | Bug Fix      | Base.ts                     |
| 3   | "Keplr" typos            | High     | Bug Fix      | LedgerCosmos/index.ts       |
| 4   | Unused derivationPath    | High     | Bug Fix      | Eip1193Provider.ts          |
| 5   | clearSignTransaction API | Medium   | Enhancement  | Base.ts                     |
| 6   | getAppConfiguration()    | Medium   | Enhancement  | Base.ts, hw/index.ts        |
| 7   | Resolution config        | Medium   | Enhancement  | Base.ts                     |
| 8   | Chain ID display         | Medium   | Enhancement  | AccountManager.ts           |
| 9   | EIP-1193 events          | Low      | Good to Have | Eip1193Provider.ts          |
| 10  | ENS domain support       | Low      | Good to Have | New feature                 |
| 11  | Transport cleanup        | Low      | Good to Have | hw/index.ts                 |

---

## Implementation Order

**Phase 1 (Bug Fixes):**

1. Signature `v` padding (#1)
2. Public client caching (#2)
3. Error message typos (#3)
4. Unused derivationPath (#4)

**Phase 2 (Enhancements):** 5. clearSignTransaction API (#5) 6. Resolution config (#7) 7. getAppConfiguration (#6) 8. Chain ID display (#8)

**Phase 3 (Good to Have):** 9. EIP-1193 events (#9) 10. Transport cleanup (#11) 11. ENS support (#10)
