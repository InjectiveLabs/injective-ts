# Ledger Dependencies Upgrade Guide

This document outlines the migration from forked `@bangjelkoski/ledgerhq-*` packages to official `@ledgerhq/*` packages.

## Background

The forked packages were created to add **named exports** alongside default exports for better ESM/TypeScript compatibility. The official packages only export classes as `default`, which required modifications to type imports and dynamic loaders.

## Dependency Changes

### package.json

**Remove these forked dependencies:**

```json
"@bangjelkoski/ledgerhq-hw-app-eth": "6.42.6-beta.0",
"@bangjelkoski/ledgerhq-hw-transport": "6.31.4-beta.0",
"@bangjelkoski/ledgerhq-hw-app-cosmos": "6.30.4-beta.0",
"@bangjelkoski/ledgerhq-hw-transport-webhid": "6.30.0-beta.0",
"@bangjelkoski/ledgerhq-hw-transport-webusb": "6.29.4-beta.0"
```

**Add these official dependencies:**

```json
"@ledgerhq/hw-app-eth": "^6.47.1",
"@ledgerhq/hw-transport": "^6.31.13",
"@ledgerhq/hw-app-cosmos": "^6.32.9",
"@ledgerhq/hw-transport-webhid": "^6.30.9",
"@ledgerhq/hw-transport-webusb": "^6.29.13"
```

**Remove from devDependencies (official packages include their own types):**

```json
"@types/ledgerhq__hw-transport-webusb": "^4.70.1"
```

---

## File Changes

### 1. `src/strategy/lib.ts`

**Type definitions - change from named exports to default exports:**

```typescript
// BEFORE
export type EthType = typeof import('@bangjelkoski/ledgerhq-hw-app-eth').Eth
export type CosmosType = typeof import('@bangjelkoski/ledgerhq-hw-app-cosmos').Cosmos
export type ledgerServiceType = typeof import('@bangjelkoski/ledgerhq-hw-app-eth').ledgerService
export type TransportWebHIDType = typeof import('@bangjelkoski/ledgerhq-hw-transport-webhid').TransportWebHID
export type TransportWebUSBType = typeof import('@bangjelkoski/ledgerhq-hw-transport-webusb').TransportWebUSB

// AFTER
export type EthType = typeof import('@ledgerhq/hw-app-eth').default
export type CosmosType = typeof import('@ledgerhq/hw-app-cosmos').default
export type ledgerServiceType = typeof import('@ledgerhq/hw-app-eth').ledgerService
export type TransportWebHIDType = typeof import('@ledgerhq/hw-transport-webhid').default
export type TransportWebUSBType = typeof import('@ledgerhq/hw-transport-webusb').default
```

**Dynamic loaders - simplify to use default exports:**

```typescript
// BEFORE
export async function loadEthType(): Promise<typeof EthType> {
  if (!EthType) {
    const module = await import('@bangjelkoski/ledgerhq-hw-app-eth')
    EthType = module.Eth ? module.Eth : (module as any).default.Eth
  }
  return EthType
}

// AFTER
export async function loadEthType(): Promise<typeof EthType> {
  if (!EthType) {
    const module = await import('@ledgerhq/hw-app-eth')
    EthType = module.default
  }
  return EthType
}
```

**Full updated `lib.ts`:**

```typescript
export type EthType = typeof import('@ledgerhq/hw-app-eth').default

export type CosmosType = typeof import('@ledgerhq/hw-app-cosmos').default

export type ledgerServiceType = typeof import('@ledgerhq/hw-app-eth').ledgerService

export type TransportWebHIDType = typeof import('@ledgerhq/hw-transport-webhid').default

export type TransportWebUSBType = typeof import('@ledgerhq/hw-transport-webusb').default

let EthType: EthType
let CosmosType: CosmosType
let ledgerServiceType: ledgerServiceType
let TransportWebUSB: TransportWebUSBType
let TransportWebHID: TransportWebHIDType

export async function loadEthType(): Promise<typeof EthType> {
  if (!EthType) {
    const module = await import('@ledgerhq/hw-app-eth')
    EthType = module.default
  }

  return EthType
}

export async function loadCosmosType(): Promise<typeof CosmosType> {
  if (!CosmosType) {
    const module = await import('@ledgerhq/hw-app-cosmos')
    CosmosType = module.default
  }

  return CosmosType
}

export async function loadLedgerServiceType(): Promise<typeof ledgerServiceType> {
  if (!ledgerServiceType) {
    const module = await import('@ledgerhq/hw-app-eth')
    ledgerServiceType = module.ledgerService
  }

  return ledgerServiceType
}

export async function loadTransportWebUSB(): Promise<TransportWebUSBType> {
  if (!TransportWebUSB) {
    const module = await import('@ledgerhq/hw-transport-webusb')
    TransportWebUSB = module.default
  }

  return TransportWebUSB
}

export async function loadTransportWebHIDType(): Promise<TransportWebHIDType> {
  if (!TransportWebHID) {
    const module = await import('@ledgerhq/hw-transport-webhid')
    TransportWebHID = module.default
  }

  return TransportWebHID
}
```

---

### 2. `src/strategy/Ledger/hw/index.ts`

**Update type imports:**

```typescript
// BEFORE
import type { Transport } from '@bangjelkoski/ledgerhq-hw-transport'
import type { Eth as EthereumApp } from '@bangjelkoski/ledgerhq-hw-app-eth'

// AFTER
import type Transport from '@ledgerhq/hw-transport'
import type Eth from '@ledgerhq/hw-app-eth'
type EthereumApp = Eth
```

---

### 3. `src/strategy/Ledger/hw/AccountManager.ts`

**Update type imports:**

```typescript
// BEFORE
import type { Eth as EthereumApp } from '@bangjelkoski/ledgerhq-hw-app-eth'

// AFTER
import type Eth from '@ledgerhq/hw-app-eth'
type EthereumApp = Eth
```

---

### 4. `src/strategy/LedgerCosmos/hw/index.ts`

**Update type imports:**

```typescript
// BEFORE
import type { Transport } from '@bangjelkoski/ledgerhq-hw-transport'
import type { Cosmos as CosmosApp } from '@bangjelkoski/ledgerhq-hw-app-cosmos'

// AFTER
import type Transport from '@ledgerhq/hw-transport'
import type Cosmos from '@ledgerhq/hw-app-cosmos'
type CosmosApp = Cosmos
```

---

### 5. `src/strategy/LedgerCosmos/hw/AccountManager.ts`

**Update type imports:**

```typescript
// BEFORE
import type { Cosmos as CosmosApp } from '@bangjelkoski/ledgerhq-hw-app-cosmos'

// AFTER
import type Cosmos from '@ledgerhq/hw-app-cosmos'
type CosmosApp = Cosmos
```

---

## Version Mapping

| Forked Package                               | Forked Version  | Official Package                | Official Version |
| -------------------------------------------- | --------------- | ------------------------------- | ---------------- |
| `@bangjelkoski/ledgerhq-hw-app-eth`          | `6.42.6-beta.0` | `@ledgerhq/hw-app-eth`          | `^6.47.1`        |
| `@bangjelkoski/ledgerhq-hw-transport`        | `6.31.4-beta.0` | `@ledgerhq/hw-transport`        | `^6.31.13`       |
| `@bangjelkoski/ledgerhq-hw-app-cosmos`       | `6.30.4-beta.0` | `@ledgerhq/hw-app-cosmos`       | `^6.32.9`        |
| `@bangjelkoski/ledgerhq-hw-transport-webhid` | `6.30.0-beta.0` | `@ledgerhq/hw-transport-webhid` | `^6.30.9`        |
| `@bangjelkoski/ledgerhq-hw-transport-webusb` | `6.29.4-beta.0` | `@ledgerhq/hw-transport-webusb` | `^6.29.13`       |

---

## Verification Steps

After implementing changes:

1. **Install dependencies:**

   ```bash
   pnpm install
   ```

2. **Run type check:**

   ```bash
   cd packages/wallets/wallet-ledger
   pnpm type-check
   ```

3. **Run build:**

   ```bash
   pnpm build
   ```

4. **Test with Ledger device:**
   - Test WebHID transport in Chrome
   - Test WebUSB transport as fallback
   - Verify Ethereum app signing works
   - Verify Cosmos app signing works (if applicable)

---

## Notes

- `ledgerService` is already a **named export** in the official `@ledgerhq/hw-app-eth` package, so that import pattern remains the same
- The official packages use `export default class X` pattern, requiring `import type X from '@ledgerhq/...'` (no curly braces for default exports)
- Your `tsconfig.build.json` has `"moduleResolution": "bundler"` which is compatible with how official packages export their ESM builds via the `module` field
- Official packages provide their own TypeScript definitions, so `@types/ledgerhq__hw-transport-webusb` is no longer needed

---

## Rollback

If issues arise, revert to forked packages by restoring the original `package.json` dependencies and source file imports.
