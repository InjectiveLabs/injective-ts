# Switching protoV2 to ts-proto (For Const Object Enums)

⚠️ **Warning**: This is a significant change. Only proceed if const object enums are absolutely critical for your use case.

## Why You Might Want This

- Need `enumsAsLiterals=true` for const object enums
- Maximum tree-shaking optimization
- Consistency with v1 behavior

## Steps to Switch from @protobuf-ts to ts-proto

### 1. Update package.json Dependencies

**For each package** (core, indexer, abacus, mito, olp):

```json
{
  "devDependencies": {
    // Remove these:
    // "@protobuf-ts/plugin": "^2.11.1",
    // "@protobuf-ts/runtime": "^2.11.1",
    // "@protobuf-ts/runtime-rpc": "^2.11.1",
    
    // Add these:
    "ts-proto": "^1.180.0",
    "protobufjs": "^7.4.0",
    "long": "^5.2.3",
    
    // Keep these:
    "protoc": "^32.0.0",
    "tsup": "^8.0.0",
    "typescript": "^5.0.0"
  }
}
```

### 2. Update gen.sh Scripts

Replace the protoc command in each gen.sh:

**Current (@protobuf-ts):**
```bash
./node_modules/.bin/protoc \
  --proto_path=${PROTO_DIR} \
  --plugin=./node_modules/.bin/protoc-gen-ts \
  --ts_out=${OUT_DIR} \
  --ts_opt=add_pb_suffix \
  ${proto_file}
```

**New (ts-proto):**
```bash
protoc \
  --plugin="./node_modules/.bin/protoc-gen-ts_proto" \
  --ts_proto_opt="esModuleInterop=true" \
  --ts_proto_opt="forceLong=string" \
  --ts_proto_opt="enumsAsLiterals=true" \
  --ts_proto_opt="useExactTypes=false" \
  --ts_proto_opt="outputClientImpl=grpc-web" \
  --ts_proto_out="${OUT_DIR}" \
  -I "${PROTO_DIR}" \
  ${proto_file}
```

### 3. Update File Naming

ts-proto generates files without the `_pb` suffix:

**Update index.template.ts files:**

Before:
```typescript
export { PointsSvcClient } from './generated/points_svc_pb.client'
export * as PointsSvcPb from './generated/points_svc_pb'
```

After:
```typescript
export { PointsSvcClient } from './generated/points_svc'
export * as PointsSvcPb from './generated/points_svc'
```

### 4. Update tsup.config.ts

If you have custom tsup configs, update file patterns:

```typescript
// Change from:
find ./src/generated -name "*_pb.ts"

// To:
find ./src/generated -name "*.ts"
```

### 5. Regenerate All Protos

```bash
cd protoV2/core && npm run generate
cd protoV2/indexer && npm run generate
cd protoV2/abacus && npm run generate
cd protoV2/mito && npm run generate
cd protoV2/olp && npm run generate
```

### 6. Update Consuming Code

Any code that imports from these packages will need updates:

**File name changes:**
```typescript
// Before (@protobuf-ts)
import { AuctionPb } from './generated/injective/auction/v1beta1/auction_pb'

// After (ts-proto)
import { AuctionPb } from './generated/injective/auction/v1beta1/auction'
```

**Client API changes:**
```typescript
// @protobuf-ts uses different client APIs than ts-proto
// You'll need to update all client usage
```

## Estimated Effort

- **Time**: 4-8 hours
- **Complexity**: High
- **Risk**: Medium (breaking changes)
- **Testing**: Extensive testing required

## Alternative: Hybrid Approach

Keep v1 (proto) for packages that need const object enums, and use v2 (protoV2) for new packages. This allows you to:

- Use const object enums where critical (v1)
- Use modern tooling for new development (v2)
- Migrate gradually over time

## Recommendation

**Unless you have specific performance requirements that demand const object enums, stick with @protobuf-ts.**

The benefits of @protobuf-ts (modern tooling, standard TypeScript patterns, active maintenance) outweigh the minimal tree-shaking difference in most cases.

