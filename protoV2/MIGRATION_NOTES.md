# ProtoV2 Migration Notes

## Overview

This document outlines the key differences between the v1 (proto) and v2 (protoV2) protobuf generation setups.

## Key Differences

### 1. Code Generation Tool

| Aspect         | v1 (proto)                | v2 (protoV2)                      |
| -------------- | ------------------------- | --------------------------------- |
| **Generator**  | `ts-proto`                | `@protobuf-ts/plugin`             |
| **Package**    | `ts-proto` npm package    | `@protobuf-ts/plugin` npm package |
| **Build Tool** | TypeScript compiler (tsc) | `tsup`                            |

### 2. Enum Generation

⚠️ **IMPORTANT DIFFERENCE**: Enum generation behavior differs between v1 and v2.

#### v1 (ts-proto with `enumsAsLiterals=true`)

Generates enums as `const` objects with literal types:

```typescript
// Generated code
export const BlockIDFlag = {
  BLOCK_ID_FLAG_UNKNOWN: 0,
  BLOCK_ID_FLAG_ABSENT: 1,
  BLOCK_ID_FLAG_COMMIT: 2,
  BLOCK_ID_FLAG_NIL: 3,
  UNRECOGNIZED: -1,
}
export type BlockIDFlag = (typeof BlockIDFlag)[keyof typeof BlockIDFlag]
```

**Configuration in gen.sh:**

```bash
--ts_proto_opt="enumsAsLiterals=true"
```

#### v2 (@protobuf-ts)

Generates enums as TypeScript `enum` types:

```typescript
// Generated code
export enum BlockIDFlag {
  BLOCK_ID_FLAG_UNKNOWN = 0,
  BLOCK_ID_FLAG_ABSENT = 1,
  BLOCK_ID_FLAG_COMMIT = 2,
  BLOCK_ID_FLAG_NIL = 3,
}
```

**Note:** `@protobuf-ts` does NOT have an `enumsAsLiterals` option. It always generates TypeScript enums.

**Configuration in gen.sh:**

```bash
--ts_opt=add_pb_suffix
```

### 3. Template Files

Both v1 and v2 now use `index.template.ts` files for consistency:

```
proto/
├── core/stub/index.ts.template          ✅ v1
├── indexer/stub/index.ts.template       ✅ v1
├── abacus/stub/index.ts.template        ✅ v1
├── mito/stub/index.ts.template          ✅ v1
└── olp/stub/index.ts.template           ✅ v1

protoV2/
├── core/src/index.template.ts           ✅ v2
├── indexer/src/index.template.ts        ✅ v2
├── abacus/src/index.template.ts         ✅ v2
├── mito/src/index.template.ts           ✅ v2
└── olp/src/index.template.ts            ✅ v2
```

### 4. Build Process

#### v1 (proto)

```
1. Generate .ts files → proto-ts/proto/
2. Copy stub templates → proto-ts/proto/
3. Compile with ESM config → proto-ts/esm/
4. Copy stub templates → proto-ts/proto/
5. Compile with CJS config → proto-ts/cjs/
6. Clean up proto-ts/proto/
```

#### v2 (protoV2)

```
1. Generate .ts files → src/generated/
2. Copy index.template.ts → src/index.ts
3. Run tsup → proto-ts/esm/
```

### 5. Output Format

| Aspect          | v1 (proto)                     | v2 (protoV2)                         |
| --------------- | ------------------------------ | ------------------------------------ |
| **ESM**         | ✅ proto-ts/esm/               | ✅ proto-ts/esm/                     |
| **CJS**         | ✅ proto-ts/cjs/               | ❌ ESM only (can be added)           |
| **File Suffix** | No suffix (e.g., `auction.ts`) | `_pb` suffix (e.g., `auction_pb.ts`) |

## Migration Considerations

### For Consumers of These Packages

1. **Enum Usage**: If you're using enums from v1, be aware that v2 uses TypeScript enums instead of const objects.

   **v1 usage:**

   ```typescript
   import { BlockIDFlag } from '@injectivelabs/core-proto-ts'
   const flag = BlockIDFlag.BLOCK_ID_FLAG_UNKNOWN // 0
   ```

   **v2 usage (same, but different underlying type):**

   ```typescript
   import { BlockIDFlag } from '@injectivelabs/core-proto-ts'
   const flag = BlockIDFlag.BLOCK_ID_FLAG_UNKNOWN // 0
   ```

2. **Import Paths**: File names have `_pb` suffix in v2:

   **v1:**

   ```typescript
   import * as AuctionPb from './injective/auction/v1beta1/auction'
   ```

   **v2:**

   ```typescript
   import * as AuctionPb from './generated/injective/auction/v1beta1/auction_pb'
   ```

3. **Client Classes**: Client import patterns remain similar but paths differ.

## Benefits of v2

1. ✅ **Modern tooling** - Uses `@protobuf-ts` which is actively maintained
2. ✅ **Faster builds** - Single-pass build with `tsup`
3. ✅ **Better tree-shaking** - Individual file exports for optimal bundling
4. ✅ **Simpler configuration** - No need for separate ESM/CJS configs
5. ✅ **Consistent templates** - All packages use `index.template.ts`

## Enum Behavior Summary

| Feature             | v1 (ts-proto)                  | v2 (@protobuf-ts)         |
| ------------------- | ------------------------------ | ------------------------- |
| **Type**            | Const object with literal type | TypeScript enum           |
| **Runtime**         | Plain object                   | Enum object               |
| **Type Safety**     | ✅ Strong                      | ✅ Strong                 |
| **Reverse Mapping** | ❌ No                          | ✅ Yes (number enums)     |
| **Tree Shaking**    | ✅ Better                      | ⚠️ Standard enum behavior |
| **Configuration**   | `enumsAsLiterals=true`         | No equivalent option      |

## Recommendation

The enum difference is **intentional** and reflects the different philosophies of the two generators:

- `ts-proto` prefers const objects for better tree-shaking
- `@protobuf-ts` uses TypeScript enums for standard TypeScript patterns

Both approaches are valid. Choose based on your needs:

- **Use v1** if you need const object enums for maximum tree-shaking
- **Use v2** if you prefer standard TypeScript enums and modern tooling

### Can protoV2 Generate Const Object Enums?

**No.** `@protobuf-ts` does NOT support generating enums as const objects. This is a fundamental architectural difference.

**Options if you need const object enums:**

1. **Keep v1 (proto)** - Continue using ts-proto with `enumsAsLiterals=true`
2. **Switch protoV2 to ts-proto** - See `SWITCHING_TO_TS_PROTO.md` for migration guide
3. **Accept TypeScript enums** - Modern bundlers handle enum tree-shaking well

**Recommended:** Stick with `@protobuf-ts` and TypeScript enums. The tree-shaking difference is minimal with modern bundlers (webpack 5+, vite, esbuild), and you get the benefits of standard TypeScript patterns and active maintenance.

## Template Files Implementation

All packages now use `index.template.ts` for consistency:

### Benefits:

1. ✅ **Version controlled** - Changes are tracked in git
2. ✅ **Manual override** - Can exclude or customize exports
3. ✅ **Documentation** - Can add comments and grouping
4. ✅ **Consistency** - Same pattern across all packages
5. ✅ **Easy maintenance** - Edit template, run `gen.sh --skip-clone`

### Usage:

```bash
# Full generation (clone repos + generate)
npm run generate

# Quick regeneration (skip cloning, just regenerate from template)
npm run generate:skip-clone
```

### Updating Templates:

When proto files are added or removed, update the `index.template.ts` files:

```bash
# Update all packages
./protoV2/_scripts/update-index-template.sh

# Update specific package
./protoV2/_scripts/update-index-template.sh indexer
```

**Note:** The core package template should be maintained manually due to its complex organization.

See `protoV2/_scripts/README.md` for detailed documentation.
