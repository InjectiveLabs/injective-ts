# Proto V2 Message Migration Guide

## Overview

This guide provides step-by-step instructions for migrating message classes from `@injectivelabs/core-proto-ts` (V1) to `@injectivelabs/core-proto-ts-v2` (V2). The migration will be done module by module, with tests run after each module to ensure compatibility.

## ⚠️ Critical Differences from V1

Before starting the migration, understand these key differences:

### 1. Field Ordering in toAmino()

**Most Important:** Protobuf-ts serializes fields in protobuf field number order, which differs from V1. You **MUST** explicitly order fields in `toAmino()` to match EIP712 expectations:

```typescript
// ❌ WRONG - Will cause EIP712 test failures
public toAmino() {
  const proto = this.toProto()
  return {
    type: 'auction/MsgBid',
    value: { ...snakecaseKeys(proto), round: proto.round.toString() }
  }
}

// ✅ CORRECT - Explicit field ordering
public toAmino() {
  const proto = this.toProto()
  return {
    type: 'auction/MsgBid',
    value: {
      sender: proto.sender,
      bid_amount: proto.bidAmount,
      round: proto.round.toString(),
    }
  }
}
```

### 2. API Method Changes

| V1 Method                          | V2 Method                    |
| ---------------------------------- | ---------------------------- |
| `Message.create()` then set fields | `Message.create({ fields })` |
| `Message.fromPartial(msg)`         | Return `msg` directly        |
| `Message.encode(msg).finish()`     | `Message.toBinary(msg)`      |

### 3. BigInt Handling

- V2 uses native `bigint` for uint64/int64 fields
- `toData()`: Keep bigint as-is (spread proto object)
- `toAmino()` & `toWeb3Gw()`: Convert bigint to string explicitly

### 4. Test Expectations

Update test expectations to match V2 behavior:

- `toData()` test: Spread proto object (keeps bigint)
- `toAmino()` test: Expect explicit field ordering

## Prerequisites

### 1. Build ProtoV2 Core Package

```bash
cd /Users/leeruianthomas/Public/injective/injective-ts/protoV2/core
pnpm install
pnpm run generate
pnpm run build
```

### 2. Configure TypeScript Path Mappings

Ensure the root `tsconfig.json` has the V2 path mapping for Jest:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@injectivelabs/core-proto-ts-v2": ["protoV2/core/src"]
    }
  }
}
```

### 3. Install Dependencies

```bash
cd /Users/leeruianthomas/Public/injective/injective-ts/packages/sdk-ts
pnpm install
```

## Key Differences Between V1 and V2

### Proto Generation Libraries

- **V1**: Uses `ts-proto` library
- **V2**: Uses `@protobuf-ts` library

### API Differences

| Operation              | V1 (ts-proto)                      | V2 (@protobuf-ts)                  |
| ---------------------- | ---------------------------------- | ---------------------------------- |
| **Create message**     | `Message.create()` then set fields | `Message.create({ field: value })` |
| **Finalize message**   | `Message.fromPartial(msg)`         | Return `msg` directly              |
| **Encode to binary**   | `Message.encode(msg).finish()`     | `Message.toBinary(msg)`            |
| **Decode from binary** | `Message.decode(bytes)`            | `Message.fromBinary(bytes)`        |

## Migration Steps (Per Module)

### Step 1: Identify Proto Imports

For each message file (e.g., `MsgBid.ts`), identify all V1 proto imports:

**Example - Before:**

```typescript
import {
  CosmosBaseV1Beta1Coin,
  InjectiveAuctionV1Beta1Tx,
} from '@injectivelabs/core-proto-ts'
```

### Step 2: Convert to Deep Imports (V2) and Remove Unused Imports

Replace with V2 deep imports using the `_pb.mjs` suffix:

**Example - After:**

```typescript
import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb.mjs'
import * as InjectiveAuctionV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/auction/v1beta1/tx_pb.mjs'
```

**⚠️ IMPORTANT: Remove `snakecaseKeys` import if not used**

In V2, most messages use explicit field ordering in `toAmino()` instead of `snakecaseKeys()`. After migration, check if `snakecaseKeys` is actually used:

```typescript
// ❌ Remove if unused (most cases)
import snakecaseKeys from 'snakecase-keys'
import * as InjectiveAuctionV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/auction/v1beta1/tx_pb.mjs'

// ✅ Clean imports
import * as InjectiveAuctionV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/auction/v1beta1/tx_pb.mjs'
```

**When to KEEP `snakecaseKeys`:**

- Complex nested messages with 5+ fields
- Messages using `snakecaseKeys()` in `toAmino()` method
- See Step 6 for guidance on when to use `snakecaseKeys()` vs explicit ordering

**Deep Import Path Pattern:**

```
@injectivelabs/core-proto-ts-v2/generated/{module}/{version}/{file}_pb.mjs
```

**⚠️ Important: Remove ALL V1 imports**

Make sure to remove any leftover V1 imports from `@injectivelabs/core-proto-ts`:

```typescript
// ❌ Remove these V1 imports
import type { GoogleProtobufAny } from '@injectivelabs/core-proto-ts'
import { CosmosBaseV1Beta1Coin } from '@injectivelabs/core-proto-ts'

// ✅ Replace with V2 imports
import * as GoogleProtobufAnyPb from '@injectivelabs/core-proto-ts-v2/generated/google/protobuf/any_pb.mjs'
import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb.mjs'
```

### Step 3: Update Type Declarations

Update the `Proto` type in the namespace declaration:

**Before:**

```typescript
export declare namespace MsgBid {
  export type Proto = InjectiveAuctionV1Beta1Tx.MsgBid
}
```

**After:**

```typescript
export declare namespace MsgBid {
  export type Proto = InjectiveAuctionV1Beta1TxPb.MsgBid
}
```

### Step 4: Update `toProto()` Method

Replace all proto references with the `Pb` suffix and use the new V2 API:

**Before (V1):**

```typescript
public toProto() {
  const { params } = this

  const amountCoin = CosmosBaseV1Beta1Coin.Coin.create()
  amountCoin.denom = params.amount.denom
  amountCoin.amount = params.amount.amount

  const message = InjectiveAuctionV1Beta1Tx.MsgBid.create()
  message.sender = params.injectiveAddress
  message.bidAmount = amountCoin
  message.round = params.round.toString()

  return InjectiveAuctionV1Beta1Tx.MsgBid.fromPartial(message)
}
```

**After (V2):**

```typescript
public toProto() {
  const { params } = this

  const amountCoin = CosmosBaseV1Beta1CoinPb.Coin.create({
    denom: params.amount.denom,
    amount: params.amount.amount,
  })

  const message = InjectiveAuctionV1Beta1TxPb.MsgBid.create({
    sender: params.injectiveAddress,
    bidAmount: amountCoin,
    round: BigInt(params.round),
  })

  return message
}
```

**Key Changes:**

1. Use `Pb` suffix for all proto namespaces
2. Pass object to `.create()` instead of setting fields after creation
3. Return message directly (no `.fromPartial()` needed)
4. Use `BigInt()` for uint64/int64 fields (V2 uses bigint natively)

### Step 5: Update `toData()` Method

The `toData()` method should simply spread the proto object:

**Pattern:**

```typescript
public toData() {
  const proto = this.toProto()

  return {
    '@type': '/injective.auction.v1beta1.MsgBid',
    ...proto,
  }
}
```

**Important:** Do NOT manually convert bigint fields to strings in `toData()`. The proto object should be returned as-is with its original types.

### Step 6: Update `toAmino()` Method

The `toAmino()` method should handle bigint to string conversions and **maintain correct field ordering**:

**Pattern:**

```typescript
public toAmino() {
  const proto = this.toProto()
  const message = {
    sender: proto.sender,
    bid_amount: proto.bidAmount,
    round: proto.round.toString(), // Convert bigint to string
  }

  return {
    type: 'auction/MsgBid',
    value: message,
  }
}
```

**Important Notes:**

1. **Field Ordering Matters**: Protobuf-ts serializes fields in protobuf field number order, which may differ from the order expected by EIP712. Explicitly order fields in `toAmino()` to match the expected order (typically: sender first, then other fields in the order they appear in the proto definition).

2. **When to use `snakecaseKeys()` vs explicit ordering**:

   - **Simple messages (1-3 fields)**: Use explicit field ordering for clarity and EIP712 compatibility
   - **Complex nested messages**: Use `snakecaseKeys()` for complex structures where manual ordering is error-prone (e.g., `MsgGrant`, `MsgGrantWithAuthorization`)
   - **Rule of thumb**: If you have nested objects or more than 5 fields, consider using `snakecaseKeys()` with explicit overrides for bigint fields

3. **Convert bigint to string**: Only convert bigint fields to strings in `toAmino()` and `toWeb3Gw()`, not in `toData()`.

### Step 7: Update `toBinary()` Method

Update the encode method to use V2 API:

**Before (V1):**

```typescript
public toBinary(): Uint8Array {
  return InjectiveAuctionV1Beta1Tx.MsgBid.encode(this.toProto()).finish()
}
```

**After (V2):**

```typescript
public toBinary(): Uint8Array {
  return InjectiveAuctionV1Beta1TxPb.MsgBid.toBinary(this.toProto())
}
```

**Key Change:** Use `.toBinary(message)` instead of `.encode(message).finish()`

### Step 8: Update Enum References (if applicable)

If the message uses enums, update them:

**Before:**

```typescript
orderType: InjectiveExchangeV1Beta1Exchange.OrderType
```

**After:**

```typescript
orderType: InjectiveExchangeV1Beta1ExchangePb.OrderType
```

**For enum JSON conversion:**

**Before:**

```typescript
order_type: InjectiveExchangeV1Beta1Exchange.orderTypeToJSON(params.orderType)
```

**After:**

```typescript
order_type: InjectiveExchangeV1Beta1ExchangePb.OrderType[params.orderType]
```

**Note:** V2 uses TypeScript enums, so conversion is simpler using bracket notation.

### Step 9: Update Helper Functions (if any)

If there are helper functions outside the class, update them too:

**Before:**

```typescript
const createLimitOrder = (params: MsgCreateSpotLimitOrder.Params) => {
  const orderInfo = InjectiveExchangeV1Beta1Exchange.OrderInfo.create()
  orderInfo.subaccountId = params.subaccountId
  // ...
}
```

**After:**

```typescript
const createLimitOrder = (params: MsgCreateSpotLimitOrder.Params) => {
  const orderInfo = InjectiveExchangeV1Beta1ExchangePb.OrderInfo.create({
    subaccountId: params.subaccountId,
    // ...
  })
}
```

### Step 10: Run Tests

After migrating all message files in a module, run the tests:

```bash
cd /Users/leeruianthomas/Public/injective/injective-ts/packages/sdk-ts

# Run tests for specific module
pnpm test -- auction
# or
pnpm test -- MsgBid

# If memory issues occur, increase Node memory:
NODE_OPTIONS="--max-old-space-size=8192" pnpm test -- auction
```

### Step 11: Update Test Expectations

After migrating the message class, update the test file to match V2 behavior:

**Update `toData()` test:**

```typescript
// Before (V1)
expect(data).toStrictEqual({
  '@type': protoType,
  sender: protoParams.sender,
  bidAmount: protoParams.bidAmount,
  round: protoParams.round.toString(), // String conversion
})

// After (V2)
expect(data).toStrictEqual({
  '@type': protoType,
  ...protoParams, // Spread proto with bigint
})
```

**Update `toAmino()` test:**

```typescript
// Ensure the test expects explicit field ordering
expect(amino).toStrictEqual({
  type: protoTypeAmino,
  value: {
    sender: protoParams.sender,
    bid_amount: protoParams.bidAmount,
    round: protoParams.round.toString(), // String conversion
  },
})
```

### Step 12: Fix Any Test Failures

Common issues and solutions:

**Issue 1: Import not found**

- Verify the deep import path is correct
- Check that protoV2/core is built
- Ensure file has `.mjs` extension

**Issue 2: Type mismatch**

- Ensure all proto references use `Pb` suffix
- Check enum conversions (V2 uses TypeScript enums)
- Verify bigint usage for uint64/int64 fields

**Issue 3: Method not found (fromPartial, encode, etc.)**

- V2 doesn't have `.fromPartial()` - return message directly from `.create()`
- V2 uses `.toBinary()` instead of `.encode().finish()`

**Issue 4: EIP712 test failures**

- Check field ordering in `toAmino()` - must match Web3Gateway expectations
- Ensure fields are explicitly ordered, not relying on `snakecaseKeys()` alone
- Verify bigint fields are converted to strings in `toAmino()`

## Common Proto Import Mappings

### Cosmos Modules

| V1 Import                     | V2 Deep Import                                                                    |
| ----------------------------- | --------------------------------------------------------------------------------- |
| `CosmosBaseV1Beta1Coin`       | `@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb.mjs`       |
| `CosmosBankV1Beta1Tx`         | `@injectivelabs/core-proto-ts-v2/generated/cosmos/bank/v1beta1/tx_pb.mjs`         |
| `CosmosDistributionV1Beta1Tx` | `@injectivelabs/core-proto-ts-v2/generated/cosmos/distribution/v1beta1/tx_pb.mjs` |
| `CosmosStakingV1Beta1Tx`      | `@injectivelabs/core-proto-ts-v2/generated/cosmos/staking/v1beta1/tx_pb.mjs`      |
| `CosmosGovV1Tx`               | `@injectivelabs/core-proto-ts-v2/generated/cosmos/gov/v1/tx_pb.mjs`               |
| `CosmosAuthzV1Beta1Tx`        | `@injectivelabs/core-proto-ts-v2/generated/cosmos/authz/v1beta1/tx_pb.mjs`        |
| `CosmosFeegrantV1Beta1Tx`     | `@injectivelabs/core-proto-ts-v2/generated/cosmos/feegrant/v1beta1/tx_pb.mjs`     |

### Injective Modules

| V1 Import                          | V2 Deep Import                                                                         |
| ---------------------------------- | -------------------------------------------------------------------------------------- |
| `InjectiveAuctionV1Beta1Tx`        | `@injectivelabs/core-proto-ts-v2/generated/injective/auction/v1beta1/tx_pb.mjs`        |
| `InjectiveExchangeV1Beta1Tx`       | `@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/tx_pb.mjs`       |
| `InjectiveExchangeV1Beta1Exchange` | `@injectivelabs/core-proto-ts-v2/generated/injective/exchange/v1beta1/exchange_pb.mjs` |
| `InjectiveInsuranceV1Beta1Tx`      | `@injectivelabs/core-proto-ts-v2/generated/injective/insurance/v1beta1/tx_pb.mjs`      |
| `InjectivePeggyV1Tx`               | `@injectivelabs/core-proto-ts-v2/generated/injective/peggy/v1/tx_pb.mjs`               |
| `InjectivePermissionsV1Beta1Tx`    | `@injectivelabs/core-proto-ts-v2/generated/injective/permissions/v1beta1/tx_pb.mjs`    |
| `InjectiveTokenfactoryV1Beta1Tx`   | `@injectivelabs/core-proto-ts-v2/generated/injective/tokenfactory/v1beta1/tx_pb.mjs`   |

### IBC & Wasm Modules

| V1 Import                     | V2 Deep Import                                                                     |
| ----------------------------- | ---------------------------------------------------------------------------------- |
| `IbcApplicationsTransferV1Tx` | `@injectivelabs/core-proto-ts-v2/generated/ibc/applications/transfer/v1/tx_pb.mjs` |
| `CosmwasmWasmV1Tx`            | `@injectivelabs/core-proto-ts-v2/generated/cosmwasm/wasm/v1/tx_pb.mjs`             |

## Module-by-Module Checklist

For each module, follow this checklist:

- [ ] **Identify all message files** in the module
- [ ] **For each message file:**
  - [ ] Update imports to V2 deep imports
  - [ ] **Remove ALL V1 imports** from `@injectivelabs/core-proto-ts`
  - [ ] Add `Pb` suffix to all proto namespace references
  - [ ] Update type declarations
  - [ ] Update `toProto()` method (use `.create({ fields })` pattern)
  - [ ] Update `toData()` method (spread proto object)
  - [ ] Update `toAmino()` method (convert bigint to string, explicit ordering for simple messages)
  - [ ] Update `toBinary()` method (use `.toBinary()`)
  - [ ] Update enum references (if applicable)
  - [ ] Update helper functions (if any)
  - [ ] **Check for unused imports** (remove `snakecaseKeys` if not used)
- [ ] **Run linter** to catch any type errors or unused imports
- [ ] **Run module tests**
- [ ] **Fix any test failures**
- [ ] **Verify all tests pass**
- [ ] **Move to next module**

## Module List (Suggested Order)

1. **auction** - Simple module, good starting point
2. **bank** - Common module with straightforward messages
3. **distribution** - Simple reward/commission messages
4. **staking** - Standard cosmos staking messages
5. **gov** - Governance proposals
6. **authz** - Authorization messages
7. **feegrant** - Fee grant allowances
8. **ibc** - IBC transfer messages
9. **insurance** - Insurance fund messages
10. **peggy** - Bridge messages
11. **permissions** - Permission management
12. **tokenfactory** - Token factory messages
13. **exchange** - Complex trading messages (largest module)
14. **wasm** - Contract execution messages

## Troubleshooting

### Issue: Cannot find module with deep import

**Error:**

```
Cannot find module '@injectivelabs/core-proto-ts-v2/generated/...'
```

**Solution:**

1. Verify protoV2/core is built: `cd protoV2/core && pnpm run build`
2. Check the file exists in `protoV2/core/proto-ts/esm/generated/`
3. Ensure `.mjs` extension is included in import path

### Issue: Type errors on enum usage

**Error:**

```
Type 'number' is not assignable to type 'OrderType'
```

**Solution:**

V2 uses TypeScript enums. Ensure you're using the enum value directly:

```typescript
// Correct
orderType: InjectiveExchangeV1Beta1ExchangePb.OrderType.BUY

// Incorrect
orderType: 1
```

### Issue: Enum JSON serialization

**Error:**

```
Property 'orderTypeToJSON' does not exist
```

**Solution:**

V2 doesn't have `*ToJSON` functions. Use bracket notation:

```typescript
// V1
InjectiveExchangeV1Beta1Exchange.orderTypeToJSON(params.orderType)

// V2
InjectiveExchangeV1Beta1ExchangePb.OrderType[params.orderType]
```

### Issue: Property 'fromPartial' does not exist

**Error:**

```
Property 'fromPartial' does not exist on type 'MsgBid$Type'
```

**Solution:**

V2 doesn't have `.fromPartial()`. Just return the message directly from `.create()`:

```typescript
// V1
const message = Message.create()
// set fields...
return Message.fromPartial(message)

// V2
const message = Message.create({
  /* fields */
})
return message
```

### Issue: Property 'encode' does not exist

**Error:**

```
Property 'encode' does not exist on type 'MsgBid$Type'
```

**Solution:**

V2 uses `.toBinary()` instead of `.encode().finish()`:

```typescript
// V1
return Message.encode(proto).finish()

// V2
return Message.toBinary(proto)
```

### Issue: Memory errors during tests

**Error:**

```
JavaScript heap out of memory
```

**Solution:**

Increase Node memory limit:

```bash
NODE_OPTIONS="--max-old-space-size=8192" pnpm test
```

### Issue: toData() type mismatch with bigint

**Error:**

```
Type 'string' is not assignable to type 'bigint'
```

**Solution:**

Don't convert bigint to string in `toData()`. The proto object should be spread as-is:

```typescript
// ❌ Wrong
public toData() {
  const proto = this.toProto()
  return {
    '@type': '/...',
    sender: proto.sender,
    round: proto.round.toString(), // Don't do this!
  }
}

// ✅ Correct
public toData() {
  const proto = this.toProto()
  return {
    '@type': '/...',
    ...proto, // Spread the proto object as-is
  }
}
```

### Issue: EIP712 field ordering mismatch

**Error:**

```
expect(received).toStrictEqual(expected) // deep equality

- Expected
+ Received

  "msgs": "[{\"@type\":\"...\",\"sender\":\"...\",\"bid_amount\":{...},\"round\":\"1\"}]"
+ "msgs": "[{\"@type\":\"...\",\"sender\":\"...\",\"round\":\"1\",\"bid_amount\":{...}}]"
```

**Cause:**

Protobuf-ts serializes fields in protobuf field number order (field 1, field 2, field 3, etc.), which may differ from the order expected by EIP712 or Web3Gateway.

**Solution:**

Explicitly order fields in `toAmino()` instead of relying on `snakecaseKeys()`:

```typescript
// ❌ Wrong - field order may be incorrect
public toAmino() {
  const proto = this.toProto()
  const message = {
    ...snakecaseKeys(proto),
    round: proto.round.toString(),
  }
  return { type: 'auction/MsgBid', value: message }
}

// ✅ Correct - explicit field ordering
public toAmino() {
  const proto = this.toProto()
  const message = {
    sender: proto.sender,           // Field 1
    bid_amount: proto.bidAmount,    // Field 2
    round: proto.round.toString(),  // Field 3
  }
  return { type: 'auction/MsgBid', value: message }
}
```

**Why this matters:**

- EIP712 signatures are sensitive to field ordering in the JSON serialization
- The Web3Gateway expects fields in a specific order
- Tests compare the exact JSON string, including field order
- Protobuf-ts uses field number order, which may differ from V1's ts-proto

### Issue: Web3Gateway doesn't support V2 message types

**Error:**

```
failed to unmarshal msg: unable to resolve type URL /injective.exchange.v2.MsgSetDelegationTransferReceivers
```

**Cause:**

This error occurs in EIP712 integration tests that call the actual Web3Gateway API. The Web3Gateway doesn't yet support V2 message types (e.g., `/injective.exchange.v2.*`).

**Solution:**

Skip the EIP712 integration tests for V2 messages until the Web3Gateway is updated:

```typescript
describe('generates proper EIP712 compared to the Web3Gw (chain)', () => {
  const { endpoints, eip712Args, prepareEip712Request } = prepareEip712({
    messages: message,
  })

  // TODO: Web3Gateway doesn't support V2 message types yet
  it.skip('EIP712 v1', async () => {
    // ... test code
  })

  // TODO: Web3Gateway doesn't support V2 message types yet
  it.skip('EIP712 v2', async () => {
    // ... test code
  })
})
```

**Note:** This is **not a bug in your migration**. The unit tests (`toProto()`, `toData()`, `toAmino()`, `toWeb3Gw()`) should all pass. Only the integration tests that call the actual Web3Gateway API need to be skipped.

### Issue: Mixed V1 and V2 imports

**Error:**

```
Cannot find namespace 'GoogleProtobufAny'. Did you mean 'GoogleProtobufAnyPb'?
```

**Cause:**

You have a leftover V1 import from `@injectivelabs/core-proto-ts` mixed with V2 imports.

**Solution:**

1. Search for all V1 imports: `grep -r "@injectivelabs/core-proto-ts'" src/`
2. Replace ALL V1 imports with V2 deep imports
3. Update all type references to use the `Pb` suffix

```typescript
// ❌ Wrong - mixing V1 and V2
import type { GoogleProtobufAny } from '@injectivelabs/core-proto-ts'
import * as CosmosAuthzV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/authz/v1beta1/tx_pb.mjs'

export type Any = GoogleProtobufAny.Any // Error!

// ✅ Correct - all V2
import * as GoogleProtobufAnyPb from '@injectivelabs/core-proto-ts-v2/generated/google/protobuf/any_pb.mjs'
import * as CosmosAuthzV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/authz/v1beta1/tx_pb.mjs'

export type Any = GoogleProtobufAnyPb.Any
```

**Common V1 imports to replace:**

- `GoogleProtobufAny` → `GoogleProtobufAnyPb` from `google/protobuf/any_pb.mjs`
- `GoogleProtobufTimestamp` → `GoogleProtobufTimestampPb` from `google/protobuf/timestamp_pb.mjs`
- Any cosmos or injective proto types → Use V2 deep imports with `Pb` suffix

### Issue: Jest cannot find @injectivelabs packages

**Error:**

```
Configuration error:

Could not locate module @injectivelabs/utils mapped as:
/Users/leeruianthomas/Public/packages/utils.
```

**Cause:**

The root `jest.config.js` has incorrect path mappings. When running `pnpm test` from the root, `<rootDir>` is the repository root, so paths should be relative to that.

**Solution:**

Update the root `jest.config.js` to use correct path prefixes:

```javascript
moduleNameMapper: {
  // Proto V2 packages
  '^@injectivelabs/core-proto-ts-v2/generated/(.+)\\.mjs$':
    '<rootDir>/protoV2/core/src/generated/$1.ts',

  // Use pathsToModuleNameMapper with correct prefix
  ...pathsToModuleNameMapper(packagePaths, { prefix: '<rootDir>/' }),
  ...pathsToModuleNameMapper(directoryPaths, { prefix: '<rootDir>/' }),

  // Override with explicit mappings (must come AFTER pathsToModuleNameMapper)
  '^@injectivelabs/exceptions$': '<rootDir>/packages/exceptions/src/index.ts',
  '^@injectivelabs/utils/test-utils$': '<rootDir>/packages/utils/src/test-utils/index.ts',
  '^@injectivelabs/utils$': '<rootDir>/packages/utils/src/index.ts',
  '^@injectivelabs/networks$': '<rootDir>/packages/networks/src/index.ts',
  '^@injectivelabs/ts-types$': '<rootDir>/packages/ts-types/src/index.ts',
}
```

**Key points:**

1. Use `<rootDir>/` not `<rootDir>/../../` for paths relative to repository root
2. Place explicit package mappings AFTER `pathsToModuleNameMapper` to override auto-generated mappings
3. Add mapping for `@injectivelabs/utils/test-utils` for test utilities
4. Clear Jest cache after config changes: `jest --clearCache`

## Example: Complete Migration

### Before (V1)

```typescript
import snakecaseKeys from 'snakecase-keys'
import {
  CosmosBaseV1Beta1Coin,
  InjectiveAuctionV1Beta1Tx,
} from '@injectivelabs/core-proto-ts'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgBid {
  export interface Params {
    round: number
    injectiveAddress: string
    amount: {
      denom: string
      amount: string
    }
  }

  export type Proto = InjectiveAuctionV1Beta1Tx.MsgBid
}

export default class MsgBid extends MsgBase<MsgBid.Params, MsgBid.Proto> {
  static fromJSON(params: MsgBid.Params): MsgBid {
    return new MsgBid(params)
  }

  public toProto() {
    const { params } = this

    const amountCoin = CosmosBaseV1Beta1Coin.Coin.create()
    amountCoin.denom = params.amount.denom
    amountCoin.amount = params.amount.amount

    const message = InjectiveAuctionV1Beta1Tx.MsgBid.create()
    message.sender = params.injectiveAddress
    message.bidAmount = amountCoin
    message.round = params.round.toString()

    return InjectiveAuctionV1Beta1Tx.MsgBid.fromPartial(message)
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.auction.v1beta1.MsgBid',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      ...snakecaseKeys(proto),
    }

    return {
      type: 'auction/MsgBid',
      value: message,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.auction.v1beta1.MsgBid',
      message: proto,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.auction.v1beta1.MsgBid',
      ...value,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveAuctionV1Beta1Tx.MsgBid.encode(this.toProto()).finish()
  }
}
```

### After (V2)

```typescript
import snakecaseKeys from 'snakecase-keys'
import * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb.mjs'
import * as InjectiveAuctionV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/injective/auction/v1beta1/tx_pb.mjs'
import { MsgBase } from '../../MsgBase.js'

export declare namespace MsgBid {
  export interface Params {
    round: number
    injectiveAddress: string
    amount: {
      denom: string
      amount: string
    }
  }

  export type Proto = InjectiveAuctionV1Beta1TxPb.MsgBid
}

export default class MsgBid extends MsgBase<MsgBid.Params, MsgBid.Proto> {
  static fromJSON(params: MsgBid.Params): MsgBid {
    return new MsgBid(params)
  }

  public toProto() {
    const { params } = this

    const amountCoin = CosmosBaseV1Beta1CoinPb.Coin.create({
      denom: params.amount.denom,
      amount: params.amount.amount,
    })

    const message = InjectiveAuctionV1Beta1TxPb.MsgBid.create({
      sender: params.injectiveAddress,
      bidAmount: amountCoin,
      round: BigInt(params.round),
    })

    return message
  }

  public toData() {
    const proto = this.toProto()

    return {
      '@type': '/injective.auction.v1beta1.MsgBid',
      ...proto,
    }
  }

  public toAmino() {
    const proto = this.toProto()
    const message = {
      sender: proto.sender,
      bid_amount: proto.bidAmount,
      round: proto.round.toString(),
    }

    return {
      type: 'auction/MsgBid',
      value: message,
    }
  }

  public toDirectSign() {
    const proto = this.toProto()

    return {
      type: '/injective.auction.v1beta1.MsgBid',
      message: proto,
    }
  }

  public toWeb3Gw() {
    const amino = this.toAmino()
    const { value } = amino

    return {
      '@type': '/injective.auction.v1beta1.MsgBid',
      ...value,
    }
  }

  public toBinary(): Uint8Array {
    return InjectiveAuctionV1Beta1TxPb.MsgBid.toBinary(this.toProto())
  }
}
```

## Key Changes Summary

1. **Imports**: Barrel imports → Deep imports with `.mjs` extension
2. **Naming**: Add `Pb` suffix to all proto namespace references
3. **Message Creation**: Pass object to `.create()` instead of setting fields after
4. **No fromPartial()**: Return message directly from `.create()`
5. **Binary Encoding**: Use `.toBinary(msg)` instead of `.encode(msg).finish()`
6. **BigInt**: Use `BigInt()` for uint64/int64 fields (native bigint support)
7. **toData()**: Spread proto object as-is (keep bigint types)
8. **toAmino()**: Explicitly order fields and convert bigint to strings (don't rely on `snakecaseKeys()` alone)
9. **Enums**: Use TypeScript enum bracket notation instead of `*ToJSON` functions
10. **Field Ordering**: Protobuf-ts uses field number order - explicitly order fields in `toAmino()` for EIP712 compatibility

## Testing Strategy

After each module migration:

1. Run module-specific tests
2. Verify all serialization methods work correctly
3. Check EIP712 generation matches Web3Gateway
4. Ensure no type errors
5. Confirm tests pass before moving to next module

## Notes

- The migration is **mechanical and repetitive** - perfect for module-by-module approach
- Most changes are **find-and-replace** with `Pb` suffix
- **API changes** require updating `.create()`, `.toBinary()`, and removing `.fromPartial()`
- Tests ensure **backward compatibility** is maintained
- Deep imports provide **better tree-shaking** and smaller bundle sizes
