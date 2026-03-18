# Align-Proto Workflow: AI-Powered Proto Change Detection & Implementation

## Quick Start

**Want to sync proto changes?**

In OpenCode, just type:

```
/align-proto
```

**Want to check only (no implementation)?**

```
/align-proto --check-only
```

That's it! The AI will handle everything automatically.

## Detailed Implementation Flow

**Supported Packages**:

- `@injectivelabs/indexer-proto-ts-v2` - Indexer gRPC services
- `@injectivelabs/abacus-proto-ts-v2` - Abacus gRPC services
- `@injectivelabs/tc-abacus-proto-ts-v2` - TC Abacus gRPC services (Trading Competition)

When you run `/align-proto`, the AI follows this exact workflow:

**Task Tracking**: The AI creates a todo list at the start and updates it in real-time as each step completes, giving you full visibility into progress.

**0. Package Selection**

- AI asks: "Which proto package do you want to sync?"
- Options:
  - `indexer-proto-ts-v2` - For Indexer services
  - `abacus-proto-ts-v2` - For Abacus services
  - `tc-abacus-proto-ts-v2` - For TC Abacus services (Trading Competition)
- You select ONE package to work with

**1. Initialization**

- AI detects current proto package version in `packages/sdk-ts/package.json`
- Shows current version of selected package

**2. Version Selection**

- AI asks: "What proto version should we bump to?"
- You answer with target version (e.g., `1.18.7`)

**3. Backup Current Proto Files**

- AI creates backup directory: `scripts/.align-proto-backup/{package-name}/{current-version}/`
- AI copies all proto files from node_modules to backup:
  - **Indexer**: `node_modules/.pnpm/@injectivelabs+indexer-proto-ts-v2@{version}/node_modules/@injectivelabs/indexer-proto-ts-v2/generated/`
  - **Abacus**: `node_modules/.pnpm/@injectivelabs+abacus-proto-ts-v2@{version}/node_modules/@injectivelabs/abacus-proto-ts-v2/generated/`
  - **TC Abacus**: `node_modules/.pnpm/@injectivelabs+tc-abacus-proto-ts-v2@{version}/node_modules/@injectivelabs/tc-abacus-proto-ts-v2/generated/`
- This allows comparison after the bump

**4. Bump Package Version (PERMANENT)**

- AI updates `packages/sdk-ts/package.json` with new version for selected package
- This change is permanent (no rollback unless install fails)

**5. Install New Package**

- AI runs `pnpm install` in project root
- Downloads new proto files from npm
- If install fails → Show error, exit (user fixes manually)

**6. Compare Proto Files**

- AI compares backup vs new proto files
- Detects:
  - ✅ New services (new `*_rpc_pb.d.ts` files)
  - ✅ Modified services (existing files with changes)
  - ✅ Removed services (files that disappeared)

**7. Show Changes & Ask Which to Implement**

- AI presents detected changes
- AI asks: "Which services should I implement?"
- You select which ones to implement (skip old missing services)

**8. Generate Detailed Proposal**

- AI analyzes selected services
- AI parses proto files to extract RPC methods, types, fields
- AI generates proposal showing:
  - Files to create with line estimates
  - Methods to implement
  - Field breakdowns
  - Export updates needed

**9. User Approval → Implementation**

- AI asks: "Proceed with implementation?"
- If you approve → AI creates all files:
  - Types interfaces
  - Transformer classes
  - API classes (fetch methods)
  - Stream API classes (if streaming methods exist)
  - Updates index.ts files with exports

**10. Validation**

- **Important**: If you modified `@injectivelabs/exceptions` (e.g., added IndexerModule or AbacusModule), build it first:
  ```bash
  cd packages/exceptions && pnpm build
  ```
- AI runs `pnpm type-check` in `packages/sdk-ts`
- AI runs `pnpm build` in `packages/sdk-ts` (or `pnpm tsdown` if type-check has pre-existing errors)
- Shows any errors (does NOT delete files on errors)
- Distinguishes between new errors (in your files) vs pre-existing errors (in other files)
- You can iterate and fix issues if needed

**11. Cleanup**

- AI asks: "Delete backup files?"
- If approved → AI deletes `scripts/.align-proto-backup/{package-name}/{version}/`
- Done!

**Key Principles:**

- ✅ Version bump is permanent (only rollback if install fails)
- ✅ Only implement new/modified services (ignore old missing ones)
- ✅ User chooses what to implement (if multiple services added)
- ✅ Keep files on validation errors (let user fix)
- ✅ No shell scripts needed (AI-driven workflow)
- ✅ **Real-time todo list tracking** - See progress at every step with checkmarks

## Commands

### `/align-proto`

**Full sync mode** - Detects changes and implements them.

**What it does:**

1. Checks for proto package version changes
2. Identifies new proto services
3. Analyzes what needs implementation
4. Shows detailed proposal
5. Waits for approval
6. Implements all files automatically
7. Validates implementation

**Example conversation:**

```
You: /align-proto

AI: 🔍 Align-Proto: Package Selection

    Which proto package do you want to sync?

    1. indexer-proto-ts-v2 (Indexer gRPC services)
    2. abacus-proto-ts-v2 (Abacus gRPC services)
    3. tc-abacus-proto-ts-v2 (TC Abacus gRPC services)

You: indexer-proto-ts-v2

AI: ✅ Creating task list...

    📋 Todo List:
    [ ] Select package version
    [ ] Backup current proto files
    [ ] Update package.json
    [ ] Install new package
    [ ] Compare proto files
    [ ] Analyze changes
    [ ] Implement changes
    [ ] Validate implementation
    [ ] Cleanup backup files

AI: 🔍 Detecting package version...

    Current version: @injectivelabs/indexer-proto-ts-v2@1.18.6

    What version should we bump to?

You: 1.18.7

AI: 📋 Todo List:
    [✓] Select package version (1.18.7)
    [→] Backup current proto files
    [ ] Update package.json
    [ ] Install new package
    [ ] Compare proto files
    [ ] Analyze changes
    [ ] Implement changes
    [ ] Validate implementation
    [ ] Cleanup backup files

AI: 📦 Bumping proto package version...

    ⚠️  This will permanently update package.json. Continue? (yes/no)

You: yes

AI: 💾 Backing up current proto files...
    📁 Source: node_modules/.pnpm/@injectivelabs+indexer-proto-ts-v2@1.18.6/
    📁 Backup: scripts/.align-proto-backup/indexer-proto-ts-v2/1.18.6/
    ✅ Backed up 80 proto files

    📋 Todo List:
    [✓] Select package version (1.18.7)
    [✓] Backup current proto files
    [✓] Update package.json
    [→] Install new package
    [ ] Compare proto files
    [ ] Analyze changes
    [ ] Implement changes
    [ ] Validate implementation
    [ ] Cleanup backup files

    📥 Running pnpm install...
    ✅ Package installed successfully

    📋 Todo List:
    [✓] Select package version (1.18.7)
    [✓] Backup current proto files
    [✓] Update package.json
    [✓] Install new package
    [→] Compare proto files
    [ ] Analyze changes
    [ ] Implement changes
    [ ] Validate implementation
    [ ] Cleanup backup files

    🔍 Comparing proto files (1.18.6 vs 1.18.7)...

    📊 Changes Detected:

    🆕 New Services (1):
      • InjectiveTCDerivativesRPC (injective_tc_derivatives_rpc_pb.d.ts)
        - 3 unary RPCs: OrdersHistory, Trades, Positions
        - 2 streaming RPCs: StreamOrdersHistory, StreamTrades

    📝 Modified Services: None
    ❌ Removed Services: None

    📋 Todo List:
    [✓] Select package version (1.18.7)
    [✓] Backup current proto files
    [✓] Update package.json
    [✓] Install new package
    [✓] Compare proto files
    [→] Analyze changes
    [ ] Implement changes
    [ ] Validate implementation
    [ ] Cleanup backup files

    Which services should I implement?
      [x] InjectiveTCDerivativesRPC

    (Press Enter to continue)

You: (Enter)

AI: 📋 Analyzing TC Derivatives service...

    Implementation Proposal:

    Files to create:
    1. types/tc-derivatives.ts (~120 lines)
       - TCDerivativeOrderHistory (9 fields)
       - TCDerivativeTrade (13 fields)
       - TCDerivativePosition (14 fields)
       - 3 response interfaces
       - 4 gRPC type aliases

    2. transformers/IndexerGrpcTcDerivativesTransformer.ts (~145 lines)
       - 6 transformer methods
       - Handles bigint → number conversions

    3. transformers/IndexerTcDerivativesStreamTransformer.ts (~42 lines)
       - 2 stream callback transformers

    4. grpc/IndexerGrpcTcDerivativesApi.ts (~122 lines)
       - Module: 'tc-derivatives'
       - 3 methods: fetchOrdersHistory(), fetchTrades(), fetchPositions()
       - All with pagination support

    5. grpc_stream/streamV2/IndexerGrpcTcDerivativesStreamV2.ts (~98 lines)
       - 2 stream methods: streamOrdersHistory(), streamTrades()

    Updates needed:
    - types/index.ts (add export)
    - transformers/index.ts (add 2 exports)
    - grpc/index.ts (add export)
    - grpc_stream/index.ts (add export)

    Total: 5 new files, 4 updates, ~527 lines of code

    📋 Todo List:
    [✓] Select package version (1.18.7)
    [✓] Backup current proto files
    [✓] Update package.json
    [✓] Install new package
    [✓] Compare proto files
    [✓] Analyze changes (TC Derivatives: 5 files, 527 lines)
    [→] Implement changes
    [ ] Validate implementation
    [ ] Cleanup backup files

    Proceed with implementation? (yes/no)

You: yes

AI: ✅ Implementing TC Derivatives...

    [1/5] Creating types/tc-derivatives.ts... ✅ (120 lines)
    [2/5] Creating IndexerGrpcTcDerivativesTransformer.ts... ✅ (145 lines)
    [3/5] Creating IndexerTcDerivativesStreamTransformer.ts... ✅ (42 lines)
    [4/5] Creating IndexerGrpcTcDerivativesApi.ts... ✅ (122 lines)
    [5/5] Creating IndexerGrpcTcDerivativesStreamV2.ts... ✅ (98 lines)

    Updating exports...
    - types/index.ts ✅
    - transformers/index.ts ✅
    - grpc/index.ts ✅
    - grpc_stream/index.ts ✅

    ✅ Implementation complete!

    📋 Todo List:
    [✓] Select package version (1.18.7)
    [✓] Backup current proto files
    [✓] Update package.json
    [✓] Install new package
    [✓] Compare proto files
    [✓] Analyze changes (TC Derivatives: 5 files, 527 lines)
    [✓] Implement changes (5 files created, 4 exports updated)
    [→] Validate implementation
    [ ] Cleanup backup files

    🧪 Validating implementation...

    Running type-check...
    ✅ Type check passed (0 errors)

    Running build...
    ✅ Build successful

    🎉 TC Derivatives implementation validated successfully!

    📋 Todo List:
    [✓] Select package version (1.18.7)
    [✓] Backup current proto files
    [✓] Update package.json
    [✓] Install new package
    [✓] Compare proto files
    [✓] Analyze changes (TC Derivatives: 5 files, 527 lines)
    [✓] Implement changes (5 files created, 4 exports updated)
    [✓] Validate implementation (type-check & build passed)
    [→] Cleanup backup files

    🧹 Delete backup files at scripts/.align-proto-backup/indexer-proto-ts-v2/1.18.6/? (yes/no)

You: yes

AI: ✅ Cleaned up backup directory

    📋 Final Todo List:
    [✓] Select package version (1.18.7)
    [✓] Backup current proto files
    [✓] Update package.json
    [✓] Install new package
    [✓] Compare proto files
    [✓] Analyze changes (TC Derivatives: 5 files, 527 lines)
    [✓] Implement changes (5 files created, 4 exports updated)
    [✓] Validate implementation (type-check & build passed)
    [✓] Cleanup backup files

    ✨ Align-proto complete!

    Summary:
    • Bumped @injectivelabs/indexer-proto-ts-v2: 1.18.6 → 1.18.7
    • Implemented 1 new service (TC Derivatives)
    • Created 5 files (~527 lines)
    • Updated 4 export files
    • Validation: ✅ All checks passed
```

### `/align-proto --check-only`

**Check mode** - Only detects and reports, no implementation.

**What it does:**

1. Checks for proto package version changes
2. Identifies new proto services
3. Analyzes what needs implementation
4. Shows status report
5. **Does NOT implement** (read-only mode)

**Example conversation:**

```
You: /align-proto --check-only

AI: 🔍 Package Selection

    Which proto package do you want to check?

    1. indexer-proto-ts-v2 (Indexer gRPC services)
    2. abacus-proto-ts-v2 (Abacus gRPC services)
    3. tc-abacus-proto-ts-v2 (TC Abacus gRPC services)

You: indexer-proto-ts-v2

AI: 🔍 Checking proto package status...

    📦 Proto Version: @injectivelabs/indexer-proto-ts-v2: 1.18.7

    📊 Implementation Status:

    ✅ Complete (18 services):
      • accounts → IndexerGrpcAccountApi
      • archiver → IndexerGrpcArchiverApi
      • auction → IndexerGrpcAuctionApi
      • campaign → IndexerGrpcCampaignApi
      • derivative_exchange → IndexerGrpcDerivativesApi
      • explorer → IndexerGrpcExplorerApi
      • insurance → IndexerGrpcInsuranceFundApi
      • megavault → IndexerGrpcMegaVaultApi
      • meta → IndexerGrpcMetaApi
      • mito → IndexerGrpcMitoApi
      • oracle → IndexerGrpcOracleApi
      • portfolio → IndexerGrpcAccountPortfolioApi
      • referral → IndexerGrpcReferralApi
      • rfq → IndexerGrpcRFQApi
      • spot_exchange → IndexerGrpcSpotApi
      • tc_derivatives → IndexerGrpcTcDerivativesApi
      • trading → IndexerGrpcTradingApi
      • web3gw → IndexerGrpcWeb3GwApi

    ❌ Not Implemented (0 services):
      None

    Summary:
    ✅ All proto services are fully implemented!
    No action needed.
```

**If there were missing services:**

```
You: /align-proto --check-only

AI: 🔍 Checking proto package status...

    📦 Proto Version: @injectivelabs/indexer-proto-ts-v2: 1.18.7

    ❌ Not Implemented (1 service):
      • chart → IndexerGrpcChartApi
        RPC Methods: 7 (SpotMarketHistory, DerivativeMarketHistory, ...)
        Streaming: No

    Recommendation:
    Run `/align-proto` to implement missing services.
```

## How the AI Implements

When you approve a `/align-proto` proposal, the AI follows this systematic approach:

### Phase 1: Analysis

**Step 1.1: Identify New Proto Services**

The AI scans for new `*_rpc_pb.d.ts` files and extracts:

1. **Service Name** (e.g., `InjectiveTCDerivativesRPC`)
2. **RPC Methods** - Parses the `ServiceType` definition:
   ```typescript
   export const ServiceName = new ServiceType('package.ServiceName', [
     { name: 'MethodName', options: {}, I: RequestType, O: ResponseType },
     { name: 'StreamMethod', serverStreaming: true, options: {}, I: RequestType, O: ResponseType },
   ])
   ```
3. **Request/Response Types** - Each method's input/output message types
4. **Message Structure** - Reviews interfaces to understand data fields

**Step 1.2: Categorize RPC Methods**

For each RPC method, determines:

- **Unary RPC**: Standard request-response (implement as `fetch*` method)
- **Server Streaming**: Continuous updates (implement as `stream*` method)

### Phase 2: Pattern Matching

**Step 2.1: Find Similar Implementation**

The AI looks for existing implementations with similar characteristics:

| Pattern                  | Example                     | Use When                                |
| ------------------------ | --------------------------- | --------------------------------------- |
| **Simple Query Service** | `IndexerGrpcMetaApi`        | 1-3 simple unary methods, no pagination |
| **Paginated Service**    | `IndexerGrpcRfqApi`         | Fetch methods with pagination support   |
| **Stream-Heavy Service** | `IndexerGrpcSpotStreamV2`   | Multiple streaming methods              |
| **Complex Nested Data**  | `IndexerGrpcDerivativesApi` | Complex transformations, nested objects |

**Step 2.2: Determine Required Files**

Based on the service characteristics:

**Minimum Required (all services):**

- ✅ `types/*.ts` - TypeScript interfaces
- ✅ `transformers/IndexerGrpc*Transformer.ts` - Data transformation
- ✅ `grpc/IndexerGrpc*Api.ts` - Main API class

**Optional (if streaming exists):**

- ⚠️ `transformers/Indexer*StreamTransformer.ts` - Stream transformation
- ⚠️ `grpc_stream/streamV2/IndexerGrpc*StreamV2.ts` - Stream API class

**Updates Required:**

- 📝 `grpc/index.ts` - Export API class
- 📝 `transformers/index.ts` - Export transformer(s)
- 📝 `types/index.ts` - Export types

### Phase 3: Implementation

**Step 3.1: Implementation Order**

Files are created in dependency order:

```
1. types/*.ts                          (no dependencies)
2. transformers/*Transformer.ts        (depends on types)
3. transformers/*StreamTransformer.ts  (depends on main transformer)
4. grpc/*Api.ts                        (depends on types + transformers)
5. grpc_stream/streamV2/*StreamV2.ts   (depends on stream transformer)
6. Update all index.ts exports         (depends on all above)
```

**Step 3.2: File Templates**

The AI uses these established patterns:

#### Template 1: Types File (Indexer)

```typescript
import type * as ProtoPackagePb from '@injectivelabs/indexer-proto-ts-v2/generated/[proto_file]_pb'

// Main data interfaces
export interface DataType {
  field1: string
  field2: number // Convert bigint to number for timestamps
  // ... all fields from proto
}

export interface ListResponse {
  items: DataType[]
  next: string[] // Pagination tokens
}

// gRPC type aliases
export type GrpcDataType = ProtoPackagePb.DataType
```

#### Template 1b: Types File (Abacus)

```typescript
import type * as ProtoPackagePb from '@injectivelabs/abacus-proto-ts-v2/generated/[proto_file]_pb'

// Main data interfaces
export interface DataType {
  field1: string
  field2: number // Convert bigint to number for timestamps
  // ... all fields from proto
}

export interface ListResponse {
  items: DataType[]
}

// gRPC type aliases
export type GrpcDataType = ProtoPackagePb.DataType
```

#### Template 1c: Types File (TC Abacus)

```typescript
import type * as TcAbacusPb from '@injectivelabs/tc-abacus-proto-ts-v2/generated/[proto_file]_pb'

// Main data interfaces
export interface DataType {
  field1: string
  field2: number // Convert bigint to number for timestamps
  // ... all fields from proto
}

export interface ListResponse {
  items: DataType[]
}

// gRPC type aliases
export type GrpcDataType = TcAbacusPb.DataType
```

**Handling Type Naming Conflicts:**

If the new service introduces types with names that conflict with existing types (e.g., `PositionDelta` already exists in derivatives), use a prefix based on the service name:

```typescript
// Instead of generic names that might conflict:
export interface PositionDelta { ... }        // ❌ May conflict
export type GrpcPositionDelta = ...           // ❌ May conflict

// Use service-specific prefixes:
export interface TCPositionDelta { ... }      // ✅ Unique
export type GrpcTCPositionDelta = ...         // ✅ Unique
```

Check for conflicts before implementing by searching existing type files.

#### Template 2: Main Transformer (Indexer)

```typescript
import type * as ProtoPackagePb from '@injectivelabs/indexer-proto-ts-v2/generated/[proto_file]_pb'
import type {
  DataType,
  GrpcDataType,
  ListResponse,
} from '../types'

/**
 * @category Indexer Grpc Transformer
 */
export class IndexerGrpc[Service]Transformer {
  static grpcDataTypeToDataType(
    grpcData: GrpcDataType,
  ): DataType {
    return {
      field1: grpcData.field1,
      field2: Number(grpcData.field2),  // Convert bigint
      // ... transform all fields
    }
  }

  static listResponseToItems(
    response: ProtoPackagePb.ListResponse,
  ): ListResponse {
    return {
      items: response.items.map(
        IndexerGrpc[Service]Transformer.grpcDataTypeToDataType,
      ),
      next: response.next,
    }
  }
}
```

#### Template 2b: Main Transformer (Abacus)

```typescript
import type * as ProtoPackagePb from '@injectivelabs/abacus-proto-ts-v2/generated/[proto_file]_pb'
import type {
  DataType,
  GrpcDataType,
  ListResponse,
} from '../types'

/**
 * @category Abacus Grpc Transformer
 */
export class AbacusGrpc[Service]Transformer {
  static grpcDataTypeToDataType(
    grpcData: GrpcDataType,
  ): DataType {
    return {
      field1: grpcData.field1,
      field2: Number(grpcData.field2),  // Convert bigint
      // ... transform all fields
    }
  }

  static listResponseToItems(
    response: ProtoPackagePb.ListResponse,
  ): ListResponse {
    return {
      items: response.items.map(
        AbacusGrpc[Service]Transformer.grpcDataTypeToDataType,
      ),
    }
  }
}
```

#### Template 2c: Main Transformer (TC Abacus)

```typescript
import type * as TcAbacusPb from '@injectivelabs/tc-abacus-proto-ts-v2/generated/[proto_file]_pb'
import type {
  DataType,
  GrpcDataType,
  ListResponse,
} from '../types'

/**
 * @category TC Abacus Grpc Transformer
 */
export class TcAbacusGrpc[Service]Transformer {
  static grpcDataTypeToDataType(
    grpcData: GrpcDataType,
  ): DataType {
    return {
      field1: grpcData.field1,
      field2: Number(grpcData.field2),  // Convert bigint
      // ... transform all fields
    }
  }

  static listResponseToItems(
    response: TcAbacusPb.ListResponse,
  ): ListResponse {
    return {
      items: response.items.map(
        TcAbacusGrpc[Service]Transformer.grpcDataTypeToDataType,
      ),
    }
  }
}
```

#### Template 3: API Class (Indexer)

```typescript
import * as ProtoPackagePb from '@injectivelabs/indexer-proto-ts-v2/generated/[proto_file]_pb'
import { [ServiceClient] } from '@injectivelabs/indexer-proto-ts-v2/generated/[proto_file]_pb.client'
import { IndexerModule } from '../types/index.js'
import { IndexerGrpc[Service]Transformer } from '../transformers/index.js'
import BaseIndexerGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpc[Service]Api extends BaseIndexerGrpcConsumer {
  protected module: string = '[module-name]'

  private get client() {
    return this.initClient([ServiceClient])
  }
```

#### Template 3b: API Class (Abacus)

```typescript
import * as ProtoPackagePb from '@injectivelabs/abacus-proto-ts-v2/generated/[proto_file]_pb'
import { [ServiceClient] } from '@injectivelabs/abacus-proto-ts-v2/generated/[proto_file]_pb.client'
import { AbacusModule } from '../types/index.js'
import { AbacusGrpc[Service]Transformer } from '../transformers/index.js'
import BaseAbacusGrpcConsumer from '../../base/BaseAbacusGrpcConsumer.js'

/**
 * @category Abacus Grpc API
 */
export class AbacusGrpc[Service]Api extends BaseAbacusGrpcConsumer {
  protected module: string = '[module-name]'

  private get client() {
    return this.initClient([ServiceClient])
  }
```

#### Template 3c: API Class (TC Abacus)

```typescript
import * as TcAbacusPb from '@injectivelabs/tc-abacus-proto-ts-v2/generated/[proto_file]_pb'
import { [ServiceClient] } from '@injectivelabs/tc-abacus-proto-ts-v2/generated/[proto_file]_pb.client'
import { IndexerErrorModule } from '@injectivelabs/exceptions'
import { TcAbacusGrpc[Service]Transformer } from './transformers/index.js'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'

/**
 * @category TC Abacus Grpc API
 */
export class TcAbacusGrpc[Service]Api extends BaseGrpcConsumer {
  protected module: string = '[module-name]'

  private get client() {
    return this.initClient([ServiceClient])
  }
```

**Module Naming Convention:**

The `module` field references module enums from `@injectivelabs/exceptions`:

**For Indexer services:**

```typescript
// In your API class:
protected module: string = IndexerModule.TcDerivatives

// This maps to packages/exceptions/src/exceptions/types/modules.ts:
export const IndexerErrorModule = {
  // ... existing modules
  TcDerivatives: 'indexer-tc-derivatives',  // ← Add new service here
} as const
```

**For Abacus services:**

```typescript
// In your API class:
protected module: string = AbacusModule.VaultOracle

// This maps to packages/exceptions/src/exceptions/types/modules.ts:
export const AbacusErrorModule = {
  // ... existing modules
  VaultOracle: 'abacus-vault-oracle',  // ← Add new service here
} as const
```

**For TC Abacus services:**

```typescript
// In your API class:
protected module: string = IndexerErrorModule.Abacus

// This maps to packages/exceptions/src/exceptions/types/modules.ts:
export const IndexerErrorModule = {
  // ... existing modules
  Abacus: 'abacus',  // ← TC Abacus uses this module
} as const
```

**When implementing a new service:**

1. Add the module to `packages/exceptions/src/exceptions/types/modules.ts`
2. Use kebab-case naming: `indexer-{service-name}`, `abacus-{service-name}`, or `tc-abacus-{service-name}`
3. Build the exceptions package before building sdk-ts

```typescript
  async fetchItems(params?: {
    marketIds?: string[]
    perPage?: number
    token?: string
  }) {
    const { marketIds, perPage, token } = params || {}
    const request = ProtoPackagePb.ItemsRequest.create()

    if (marketIds && marketIds.length > 0) {
      request.marketIds = marketIds
    }

    if (token) {
      request.token = token
    }

    if (perPage) {
      request.perPage = perPage
    }

    const response = await this.executeGrpcCall<
      ProtoPackagePb.ItemsRequest,
      ProtoPackagePb.ItemsResponse
    >(request, this.client.items.bind(this.client))

    return IndexerGrpc[Service]Transformer.listResponseToItems(response)
  }
}
```

#### Template 4: Stream Transformer

```typescript
import { IndexerGrpc[Service]Transformer } from './IndexerGrpc[Service]Transformer.js'
import type * as ProtoPackagePb from '@injectivelabs/indexer-proto-ts-v2/generated/[proto_file]_pb'

/**
 * @category Indexer Stream Transformer
 */
export class Indexer[Service]StreamTransformer {
  static itemStreamCallback = (
    response: ProtoPackagePb.StreamItemResponse,
  ) => {
    const item = response.item

    return {
      item: item
        ? IndexerGrpc[Service]Transformer.grpcItemToItem(item)
        : undefined,
      operationType: response.operationType,
      timestamp: Number(response.timestamp),
    }
  }
}
```

#### Template 5: Stream API Class

```typescript
import * as ProtoPackagePb from '@injectivelabs/indexer-proto-ts-v2/generated/[proto_file]_pb'
import { [ServiceClient] } from '@injectivelabs/indexer-proto-ts-v2/generated/[proto_file]_pb.client'
import { createStreamSubscriptionV2 } from './streamHelpersV2.js'
import { Indexer[Service]StreamTransformer } from '../../transformers/index.js'
import { GrpcWebRpcTransport } from '../../../base/GrpcWebRpcTransport.js'
import type { StreamSubscription } from '../../../../types/index.js'

export type ItemStreamCallbackV2 = (
  response: ReturnType<
    typeof Indexer[Service]StreamTransformer.itemStreamCallback
  >,
) => void

export class IndexerGrpc[Service]StreamV2 {
  private client: [ServiceClient]
  private transport: GrpcWebRpcTransport

  constructor(endpoint: string, metadata?: Record<string, string>) {
    this.transport = new GrpcWebRpcTransport(endpoint, metadata)
    this.client = new [ServiceClient](this.transport)
  }

  streamItems({
    marketIds,
    callback,
  }: {
    marketIds?: string[]
    callback: ItemStreamCallbackV2
  }): StreamSubscription {
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = ProtoPackagePb.StreamItemRequest.create()

    if (marketIds && marketIds.length > 0) {
      request.marketIds = marketIds
    }

    const stream = this.client.streamItem(request)

    return createStreamSubscriptionV2(stream, (response) => {
      const transformed =
        Indexer[Service]StreamTransformer.itemStreamCallback(response)

      callback(transformed)
    })
  }
}
```

**Step 5.3: Implementation Checklist**

During implementation, verify:

- [ ] All imports use `.js` extension
- [ ] Bigint fields converted to number for timestamps
- [ ] Optional parameters handled with `params || {}`
- [ ] Arrays checked with `length > 0` before assignment
- [ ] Client methods bound: `this.client.method.bind(this.client)`
- [ ] Stream callbacks validated: `typeof callback !== 'function'`
- [ ] JSDoc comments match existing style: `/** @category */`
- [ ] Alphabetical ordering in index.ts exports

**Step 5.4: Export Updates**

Update index.ts files in **strict alphabetical order**:

```typescript
// grpc/index.ts - Alphabetical by class name
export { IndexerGrpcDerivativesApi } from './IndexerGrpcDerivativesApi.js'
export { IndexerGrpcTcDerivativesApi } from './IndexerGrpcTcDerivativesApi.js' // ← Insert here (Tc comes after Derivatives, before Transaction)
export { IndexerGrpcTransactionApi } from './IndexerGrpcTransactionApi.js'

// grpc_stream/index.ts - Group V2 streams alphabetically
export * from './streamV2/IndexerGrpcDerivativesStreamV2.js'
export * from './streamV2/IndexerGrpcTcDerivativesStreamV2.js' // ← Insert alphabetically in V2 section
export * from './streamV2/IndexerGrpcAccountPortfolioStreamV2.js'

// transformers/index.ts - After related transformers
export * from './IndexerGrpc[Service]Transformer.js'
export * from './Indexer[Service]StreamTransformer.js' // if streaming

// types/index.ts - After related types
export type * from './[service-name].js'
```

**Tip**: Use `grep` to find where your export should go alphabetically before adding it.

### Phase 6: Validation

**Step 6.1: Type Check**

```bash
cd packages/sdk-ts
pnpm type-check
```

**Step 6.2: Build Test**

**Important**: If you modified the `@injectivelabs/exceptions` package (e.g., added a new IndexerModule), build it first:

```bash
# Build exceptions package first (if modified)
cd packages/exceptions && pnpm build

# Then build sdk-ts
cd packages/sdk-ts && pnpm build
```

**Step 6.3: Code Review Checklist**

- [ ] All files follow existing patterns exactly
- [ ] No TypeScript errors in your new files
- [ ] No linting errors
- [ ] All exports resolve correctly
- [ ] Module name follows convention
- [ ] Naming is consistent (TcDerivatives, not TCDerivatives)
- [ ] Comments match existing style

**Step 6.4: Distinguishing New vs Pre-existing Errors**

The codebase may have pre-existing TypeScript errors unrelated to your changes. To verify your implementation is correct:

1. **Check if errors are in your new files**: Look for file paths matching your implementation
   - ✅ If no errors in your new files → Your implementation is correct
   - ❌ If errors in your new files → Fix those specific issues

2. **Run the build directly** (if type-check shows many errors):

   ```bash
   pnpm tsdown
   ```

   - The build tool may succeed even with type-check warnings
   - If build succeeds → Your implementation compiled correctly

3. **Common pre-existing error patterns** (safe to ignore if not in your files):
   - `Cannot find module '@protobuf-ts/runtime-rpc'`
   - `Property 'toBinary' does not exist on type`
   - `Property 'fromBinary' does not exist on type`
   - `Argument of type 'unknown' is not assignable` (in other stream files)

**Example from TC Derivatives implementation:**

```
✅ Type-check showed 150+ errors (all pre-existing, none in TC Derivatives files)
✅ Build completed successfully
✅ Implementation validated
```

## Success Criteria

✅ **Detection**: New proto service identified automatically
✅ **Analysis**: All RPC methods understood and categorized
✅ **Proposal**: Complete implementation plan with file structure
✅ **Implementation**: All files created following patterns
✅ **Validation**: Type check and build succeed
✅ **Consistency**: Code style matches existing implementations

## Example: TC Derivatives Implementation

**Scenario: Proto package upgraded from 1.18.6 → 1.18.7**

This is a real-world example showing how `/align-proto` detected and implemented the TC Derivatives service.

### The Complete AI Conversation

```
You: /align-proto

AI: 🔍 Analyzing proto package changes...

    📦 Proto Version Change Detected:
    @injectivelabs/indexer-proto-ts-v2: 1.18.6 → 1.18.7

    🆕 New Service Found: TC Derivatives
    Proto file: injective_tc_derivatives_rpc_pb.d.ts

    📋 Service Analysis:

    Service: InjectiveTCDerivativesRPC

    Unary RPC Methods (3):
    • OrdersHistory - Fetch order history with pagination
    • Trades - Fetch trades with pagination
    • Positions - Fetch positions with pagination

    Streaming RPC Methods (2):
    • StreamOrdersHistory - Real-time order updates
    • StreamTrades - Real-time trade updates

    Pattern Match: Similar to RFQ (paginated + streaming)

    📋 Implementation Proposal:

    Files to create:

    1. types/tc-derivatives.ts (~102 lines)
       - TCDerivativeOrderHistory (9 fields)
       - TCDerivativeTrade (13 fields)
       - TCDerivativePosition (14 fields)
       - TCDerivativeOrdersHistoryResponse
       - TCDerivativeTradesResponse
       - TCDerivativePositionsResponse
       - 4 gRPC type aliases

    2. transformers/IndexerGrpcTcDerivativesTransformer.ts (~138 lines)
       - grpcOrderHistoryToOrderHistory()
       - grpcTradeToTrade()
       - grpcPositionToPosition()
       - ordersHistoryResponseToOrdersHistory()
       - tradesResponseToTrades()
       - positionsResponseToPositions()

    3. transformers/IndexerTcDerivativesStreamTransformer.ts (~42 lines)
       - orderHistoryStreamCallback()
       - tradesStreamCallback()

    4. grpc/IndexerGrpcTcDerivativesApi.ts (~122 lines)
       - Module: 'tc-derivatives'
       - fetchOrdersHistory(params?: { marketIds?, perPage?, token? })
       - fetchTrades(params?: { marketIds?, perPage?, token? })
       - fetchPositions(params?: { marketIds?, perPage?, token? })

    5. grpc_stream/streamV2/IndexerGrpcTcDerivativesStreamV2.ts (~98 lines)
       - streamOrdersHistory({ marketIds?, callback })
       - streamTrades({ marketIds?, callback })

    Updates needed:
    - types/index.ts (add export)
    - transformers/index.ts (add 2 exports)
    - grpc/index.ts (add export)
    - grpc_stream/index.ts (add export)

    Total: 5 new files, 4 updates, ~502 lines of code

    Proceed with implementation? (yes/no)

You: yes

AI: ✅ Implementing TC Derivatives service...

    [1/5] Creating types/tc-derivatives.ts...
          • TCDerivativeOrderHistory interface ✅
          • TCDerivativeTrade interface ✅
          • TCDerivativePosition interface ✅
          • Response interfaces ✅
          • gRPC type aliases ✅
          Done (102 lines)

    [2/5] Creating transformers/IndexerGrpcTcDerivativesTransformer.ts...
          • grpcOrderHistoryToOrderHistory() ✅
          • grpcTradeToTrade() ✅
          • grpcPositionToPosition() ✅
          • ordersHistoryResponseToOrdersHistory() ✅
          • tradesResponseToTrades() ✅
          • positionsResponseToPositions() ✅
          Done (138 lines)

    [3/5] Creating transformers/IndexerTcDerivativesStreamTransformer.ts...
          • orderHistoryStreamCallback() ✅
          • tradesStreamCallback() ✅
          Done (42 lines)

    [4/5] Creating grpc/IndexerGrpcTcDerivativesApi.ts...
          • Module: 'tc-derivatives' ✅
          • fetchOrdersHistory() ✅
          • fetchTrades() ✅
          • fetchPositions() ✅
          Done (122 lines)

    [5/5] Creating grpc_stream/streamV2/IndexerGrpcTcDerivativesStreamV2.ts...
          • streamOrdersHistory() ✅
          • streamTrades() ✅
          Done (98 lines)

    Updating exports...
    ✅ types/index.ts - Added tc-derivatives export
    ✅ transformers/index.ts - Added 2 transformer exports
    ✅ grpc/index.ts - Added IndexerGrpcTcDerivativesApi export
    ✅ grpc_stream/index.ts - Added IndexerGrpcTcDerivativesStreamV2 export

    ✅ Implementation complete!

    Files created:
    • packages/sdk-ts/src/client/indexer/types/tc-derivatives.ts
    • packages/sdk-ts/src/client/indexer/transformers/IndexerGrpcTcDerivativesTransformer.ts
    • packages/sdk-ts/src/client/indexer/transformers/IndexerTcDerivativesStreamTransformer.ts
    • packages/sdk-ts/src/client/indexer/grpc/IndexerGrpcTcDerivativesApi.ts
    • packages/sdk-ts/src/client/indexer/grpc_stream/streamV2/IndexerGrpcTcDerivativesStreamV2.ts

    Next steps:
    cd packages/sdk-ts
    pnpm type-check
    pnpm build

You: Run the validation commands

AI: Running validation...

    $ cd packages/sdk-ts && pnpm type-check
    ✓ Type check passed (0 errors specific to TC Derivatives)

    $ pnpm build
    ✓ Build succeeded

    ✅ TC Derivatives implementation validated successfully!

    Implementation summary:
    • 5 files created (502 lines)
    • 4 export files updated
    • 3 unary RPC methods implemented
    • 2 streaming methods implemented
    • All type checks passed
    • Build successful
```

### What the AI Did

**Detection Phase:**

- ✅ Detected proto version change (1.18.6 → 1.18.7)
- ✅ Found new proto file: `injective_tc_derivatives_rpc_pb.d.ts`
- ✅ Parsed service: `InjectiveTCDerivativesRPC`
- ✅ Extracted 3 unary RPCs + 2 streaming RPCs
- ✅ Identified similar pattern (RFQ service)

**Implementation Phase:**

- ✅ Created types with proper TypeScript interfaces
- ✅ Built transformers for data conversion (bigint → number)
- ✅ Implemented main API class with pagination support
- ✅ Created stream API class with callback handling
- ✅ Updated all export files in alphabetical order

**Validation Phase:**

- ✅ All files follow existing patterns
- ✅ Naming conventions correct (TcDerivatives not TCDerivatives)
- ✅ Type checks passed
- ✅ Build succeeded
- ✅ No linting errors

## Backup Strategy

**Location**: `scripts/.align-proto-backup/{package-name}/{version}/`

**What gets backed up**: All proto files from the npm package in node_modules:

**For Indexer:**

- Source: `node_modules/.pnpm/@injectivelabs+indexer-proto-ts-v2@{version}/node_modules/@injectivelabs/indexer-proto-ts-v2/generated/`
- All `*_rpc_pb.d.ts`, `*_rpc_pb.js`, and related files

**For Abacus:**

- Source: `node_modules/.pnpm/@injectivelabs+abacus-proto-ts-v2@{version}/node_modules/@injectivelabs/abacus-proto-ts-v2/generated/`
- All `*_rpc_pb.d.ts`, `*_rpc_pb.js`, and related files

**For TC Abacus:**

- Source: `node_modules/.pnpm/@injectivelabs+tc-abacus-proto-ts-v2@{version}/node_modules/@injectivelabs/tc-abacus-proto-ts-v2/generated/`
- All `*_rpc_pb.d.ts`, `*_rpc_pb.js`, and related files

**Backup process**:

1. Before running `pnpm install`, AI copies all current proto files to backup directory
2. Backup directory is named after the package and version (e.g., `indexer-proto-ts-v2/1.18.6`)
3. After install completes, new version appears at the appropriate package location
4. AI compares backup vs new files to detect changes

**Cleanup**:

- AI asks if you want to delete backup after successful implementation
- If you decline, backup remains for manual reference
- You can manually delete: `rm -rf scripts/.align-proto-backup/`

**Why backup?**:

- Proto files come from npm package (in node_modules), not from local files
- When we bump version and run `pnpm install`, old version may be removed from node_modules
- Need to compare old vs new to detect what changed
- Backup preserves old version for comparison

**Note**: The `protoV2/` directories in the repo are separate workspace packages (used for publishing), NOT used by the SDK. The SDK imports from npm packages.

## Error Handling

**Install Failures**:

- If `pnpm install` fails → AI shows error and exits
- Package.json has already been updated (permanent)
- User fixes issue manually (network, npm registry, etc.)
- Re-run `/align-proto` and choose same version

**Parse Errors**:

- If proto file is malformed → AI shows warning, skips that service
- Continues with other services

**Generation Errors**:

- If file creation fails → AI stops, shows error, keeps partial files
- User can inspect and fix manually

**Validation Errors**:

- If type-check fails → AI shows errors, DOES NOT delete files
- Files remain for iteration and fixing
- User can fix issues and re-run validation manually
- No automatic rollback (keeps your work)

**Key Principle**: Never delete work automatically. Let user decide.

## Future Enhancements

Potential improvements to the align-proto workflow:

1. **Enhanced Proto Parsing**: Deep analysis of message field types to auto-detect complex nested structures
2. **Test Generation**: Auto-generate unit tests from proto method definitions
3. **API Documentation**: Auto-generate markdown documentation from JSDoc comments
4. **Diff Analysis**: Compare proto versions to show exactly what changed in each method
5. **Validation Testing**: Auto-generate integration tests that verify transformer correctness
6. **Type Safety Checks**: Validate that all proto fields are properly handled in transformers

## Notes

- This workflow is designed to be **reusable** for any new proto service
- Each implementation serves as a **reference** for future work
- **Consistency** is key - always follow existing patterns
- When in doubt, find the **most similar** existing implementation and copy its structure
- The pattern matching phase is **critical** - spend time finding the right reference
- **No shell scripts required** - Everything is AI-driven through OpenCode
- **Todo list provides visibility** - Track progress in real-time with `[✓]` completed, `[→]` in progress, `[ ]` pending
- **Single package per run** - Choose either indexer, abacus, or tc-abacus, not multiple simultaneously

---

**Version**: 2.2
**Last Updated**: 2026-03-17
**Maintainer**: SDK Team
