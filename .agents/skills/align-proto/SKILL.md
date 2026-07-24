---
name: align-proto
description: Detect proto package changes (indexer-proto-ts-v2, abacus-proto-ts-v2, tc-abacus-proto-ts-v2, platform-services-proto-ts-v2), compare old vs new proto files, and implement new/modified gRPC services in sdk-ts following established patterns.
user-invocable: true
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, Agent, TodoWrite, AskUserQuestion
---

# Align-Proto Workflow

You are an AI that detects proto package changes and implements new gRPC services in the SDK. Follow this workflow exactly.

## Arguments

- `$ARGUMENTS` may contain `--check-only` to run in read-only mode (detect and report only, no implementation).

## Interaction Contract

This skill is procedural and approval-gated. Do **not** collapse it into an end-to-end implementation sprint.

- Always show the todo checklist from Step 3 before making file changes.
- Update checklist status as each step completes.
- Narrate the result of each major step: selected package, current version, target version, backup status, install result, detected proto changes, proposal, validation result.
- Do not infer package/version silently unless the user provided it explicitly in the prompt.
- Before Step 5 changes `package.json` or runs install, show the dependency change plan and ask for explicit approval.
- Before Step 10 implementation, show the detailed proposal from Step 9 and ask for explicit approval.
- If the selected package is not currently in `packages/sdk-ts/package.json`, treat it as **initial onboarding**:
  - Current version is `none`
  - Backup is skipped with a clear explanation
  - Generated proto files are treated as all-new
  - Still require the Step 5 dependency/install approval and Step 10 implementation approval
- If the user asks for `--check-only`, never edit files; stop after the implementation status report.

## Supported Packages

| Package | Import Prefix | Base Class | Module Enum Source |
|---------|--------------|------------|-------------------|
| `@injectivelabs/indexer-proto-ts-v2` | `indexer-proto-ts-v2` | `BaseIndexerGrpcConsumer` | `IndexerModule` from `../types/index.js` |
| `@injectivelabs/abacus-proto-ts-v2` | `abacus-proto-ts-v2` | `BaseAbacusGrpcConsumer` | `AbacusModule` from `../types/index.js` |
| `@injectivelabs/tc-abacus-proto-ts-v2` | `tc-abacus-proto-ts-v2` | `BaseGrpcConsumer` | `IndexerErrorModule` from `@injectivelabs/exceptions` |
| `@injectivelabs/platform-services-proto-ts-v2` | `platform-services-proto-ts-v2` | `BaseGrpcConsumer` | `IndexerErrorModule` from `@injectivelabs/exceptions` unless a platform module exists |

## Proto Source Packages

- **Indexer**: generated from `protoV2/indexer/gen.sh`, source repo path `injective-indexer/api/gen/grpc/**/*.proto`
- **Abacus**: generated from `protoV2/abacus/gen.sh`, source repo path `injective-abacus/api/gen/grpc/points_svc/pb/**/*.proto`
- **TC Abacus**: generated from `protoV2/tcAbacus/gen.sh`, source repo path `injective-abacus/api/gen_tc/gen/grpc/injective_tc_abacus_rpc/pb/**/*.proto`
- **Platform Services**: generated from `protoV2/platform-services/gen.sh`, source repo path `platform-services/api/gen/grpc/**/*.proto`

## Workflow Steps

### Step 0: Package Selection

Ask the user which proto package to sync:

1. `indexer-proto-ts-v2` (Indexer gRPC services)
2. `abacus-proto-ts-v2` (Abacus gRPC services)
3. `tc-abacus-proto-ts-v2` (TC Abacus gRPC services)
4. `platform-services-proto-ts-v2` (Platform services gRPC APIs, including positions/social leaderboard services)

### Step 1: Initialization

- Detect the current version of the selected package in `packages/sdk-ts/package.json`
- Show the current version to the user

### Step 2: Version Selection

- Ask: "What version should we bump to?"
- User provides target version (e.g., `1.18.7`) or says "latest"
- If user says "latest", resolve it via `npm view @injectivelabs/{package-name} version`

### Step 3: Create Todo List

Create a todo list to track progress:

- [ ] Select package version
- [ ] Backup current proto files
- [ ] Update package.json
- [ ] Install new package
- [ ] Compare proto files
- [ ] Analyze changes
- [ ] Show proposal & get approval
- [ ] Implement changes
- [ ] Validate implementation
- [ ] Cleanup backup files

Update each item as it completes.

### Step 4: Backup Current Proto Files

Create backup directory: `scripts/.align-proto-backup/{package-name}/{current-version}/`

Copy all proto files from the package's node_modules generated directory:

- **Indexer**: `node_modules/.pnpm/@injectivelabs+indexer-proto-ts-v2@{version}/node_modules/@injectivelabs/indexer-proto-ts-v2/generated/`
- **Abacus**: `node_modules/.pnpm/@injectivelabs+abacus-proto-ts-v2@{version}/node_modules/@injectivelabs/abacus-proto-ts-v2/generated/`
- **TC Abacus**: `node_modules/.pnpm/@injectivelabs+tc-abacus-proto-ts-v2@{version}/node_modules/@injectivelabs/tc-abacus-proto-ts-v2/generated/`
- **Platform Services**: `node_modules/.pnpm/@injectivelabs+platform-services-proto-ts-v2@{version}/node_modules/@injectivelabs/platform-services-proto-ts-v2/generated/`

### Step 5: Bump Package Version (PERMANENT)

Approval gate: show the exact dependency change and install command, then wait for explicit approval before editing `packages/sdk-ts/package.json` or running install.

Update `packages/sdk-ts/package.json` with the new version. This change is permanent.

### Step 6: Install New Package

Run `pnpm install --force` in project root. The `--force` flag ensures all packages are properly re-linked from the pnpm store, preventing empty package directories from stale/corrupted installs. If install fails, show error and exit.

### Step 7: Compare Proto Files

Compare backup vs new proto files. Detect:

- **New services** (new `*_rpc_pb.d.ts` files; platform-services may use Goa names like `goagen_api_*_pb.d.ts`)
- **Modified services** (existing files with changes) — see Step 7a for field-level audit
- **Removed services** (files that disappeared)

Use `diff -rq` for a file-level summary, then `diff` individual files for details. For modified services, use `awk '/^export interface MessageName/,/^}/'` on both versions to isolate and compare individual message definitions cleanly (raw `.d.ts` diffs are hard to read because messages are reordered between generator runs).

### Step 7a: Field-Level Audit of Modified Services

When an existing `*_rpc_pb.d.ts` or platform-services `goagen_api_*_pb.d.ts` file is modified, do NOT assume the changes are purely additive. Check for each of these change types:

1. **New/renamed/removed RPC methods** — compare `protobuf rpc:` entries in the matching `*.client.d.ts`
2. **New/renamed/removed message types** — compare `export interface` declarations
3. **New/renamed/removed fields on request/response messages** — diff each message body individually
4. **New enum values in `messageType` string fields** — check doc comments like `Type: 'a', 'b', 'c'` on bidirectional/WS stream wrapper responses (e.g. `TakerStreamResponse.messageType`). Added values require new `case` arms in the corresponding WS stream handler, even when no new gRPC method was added.
5. **New oneof/payload fields on stream wrappers** — e.g. a new `conditionalOrder?: ...` sibling to existing `quote?`, `requestAck?`. These deliver payload for the new `messageType` value above.

For each detected change, map it to SDK-side updates:
- New field on request → add optional param to the existing `fetch*` / `stream*` method; wire onto the request builder
- New field on response → extend the SDK type interface + map it in the transformer
- Removed method/type → prune the `fetch*` / `stream*` method, transformer method, type interface(s), and spec tests
- New `messageType` value → add `case` arm in WS stream handler + new event key in the `*StreamEvents` interface
- Pre-existing gaps in WS stream switches (message types in proto that the SDK never handled) — flag them; offer to close while you're already editing the file

### Step 8: Show Changes & Ask Which to Implement

Present detected changes. Ask which services to implement. Skip old missing services.

**If `--check-only`**: Stop here. Show implementation status report and exit.

### Step 9: Generate Detailed Proposal

For each selected service:

1. Parse the proto `*_rpc_pb.d.ts` file (or platform-services `goagen_api_*_pb.d.ts`) to extract:
   - Service name from `ServiceType` definition
   - RPC methods (name, request type, response type)
   - Whether each method is streaming (`serverStreaming: true`)
   - Message interfaces with all fields

2. Categorize methods:
   - **Unary RPC** → implement as `fetch*` method
   - **Server Streaming** → implement as `stream*` method
   - **Bidirectional/WS stream** (e.g. `TakerStream`, `MakerStream`) → extend existing `IndexerWs*Stream.ts` handlers; do NOT generate a new `*StreamV2.ts` class

3. Find the most similar existing implementation as reference:
   - Simple query: like `IndexerGrpcMetaApi`
   - Paginated: like `IndexerGrpcRfqApi`
   - Stream-heavy: like `IndexerGrpcSpotStreamV2`
   - Complex nested: like `IndexerGrpcDerivativesApi`
   - WS bidirectional: like `IndexerWsTakerStream` / `IndexerWsMakerStream`
   - Platform services: start from `packages/sdk-ts/src/client/platformServices` if present; otherwise mirror the closest unary gRPC consumer pattern and keep names platform-scoped (for example `PlatformServicesGrpcPositionsApi`)

4. For **modified services**, the proposal is a surgical edit list — NOT a file-creation list. Enumerate each existing file that needs editing with the specific add/remove/rename per field. Call out breaking removals explicitly (they affect downstream consumers).

5. Show file list (or edit list), method breakdown, line estimates. Ask for approval.

### Step 10: Implementation

Approval gate: do not create or edit SDK implementation files until the user explicitly approves the Step 9 proposal.

Create files in dependency order:

```
1. types/*.ts                                   (no dependencies)
2. transformers/*Transformer.ts                  (depends on types)
3. transformers/*StreamTransformer.ts            (depends on main transformer)
4. grpc/*Api.ts                                  (depends on types + transformers)
5. grpc/*Api.spec.ts                             (depends on API class + transformers)
6. grpc_stream/streamV2/*StreamV2.ts             (depends on stream transformer)
7. grpc_stream/streamV2/*StreamV2.spec.ts        (depends on stream class)
8. Update all index.ts exports                   (depends on all above)
```

#### Required files (all services):

- `types/*.ts` - TypeScript interfaces
- `transformers/IndexerGrpc*Transformer.ts` (or `AbacusGrpc*` / `TcAbacusGrpc*`) - Data transformation
- `grpc/IndexerGrpc*Api.ts` (or `AbacusGrpc*` / `TcAbacusGrpc*`) - Main API class
- `grpc/IndexerGrpc*Api.spec.ts` (or `AbacusGrpc*` / `TcAbacusGrpc*`) - Test file for the API class
- For platform-services wrappers, use platform-scoped folders/names if they exist (for example `platformServices`, `PlatformServicesGrpc*Api`) instead of indexer names.

#### Optional files (if streaming methods exist):

- `transformers/Indexer*StreamTransformer.ts` - Stream transformation
- `grpc_stream/streamV2/IndexerGrpc*StreamV2.ts` - Stream API class
- `grpc_stream/streamV2/IndexerGrpc*StreamV2.spec.ts` - Stream test file

#### Export updates required:

- `grpc/index.ts`
- `transformers/index.ts`
- `types/index.ts`
- `grpc_stream/index.ts` (if streaming)

All exports must be in **strict alphabetical order**.

### Step 11: Validation

1. If `@injectivelabs/exceptions` was modified (new module added), build it first:
   ```bash
   cd packages/exceptions && pnpm build
   ```
2. If regenerating the platform-services proto package itself, run `protoV2/platform-services/gen.sh` before SDK validation.
3. Run `pnpm type-check` in `packages/sdk-ts`
4. Run `pnpm build` in `packages/sdk-ts` (or `pnpm tsdown` if type-check has pre-existing errors)
5. Distinguish new errors (in your files) vs pre-existing errors (in other files)
6. Do NOT delete files on errors - let user fix

### Step 12: Cleanup

Ask: "Delete backup files?" If approved, delete `scripts/.align-proto-backup/{package-name}/{version}/`.

## SDK Message EIP712 Debugging

When debugging broken EIP712 generation for a `Msg*` abstraction:

1. Get the actual EIP712 JSON that failed from the client, usually from console logs or the chain validation error.
2. Reproduce the client transaction in the matching `*.spec.ts` by changing the test message params and `prepareEip712` args to match the client payload exactly: account number, chain ID, fee, gas, memo, sequence, timeout height, signer addresses, and every message field. Preserve omitted optional fields as omitted in the SDK params if the client omitted them.
3. Capture the Web3Gw output in the test with:
   ```typescript
   const txResponse = await new IndexerGrpcWeb3GwApi(
     endpoints.indexer,
   ).prepareEip712Request({
   ```
4. Compare JSON diffs between the client EIP712 and `txResponse`. For EIP712 v2, parse `message.context` and `message.msgs` before diffing when useful because they are stringified JSON.
5. Watch for fields that Web3Gw or the chain normalizes even when omitted by SDK callers, especially optional numeric fields that become `"0"` or decimal strings. The SDK must sign the normalized value if Web3Gw includes it.
6. Apply the smallest fix in the `Msg*` abstraction so `toEip712V2()`/`toWeb3Gw()` matches the chain/Web3Gw output. Keep the regression test parameters aligned with the broken client payload and add a focused assertion for any optional-field defaulting behavior.
7. Remove temporary console logs after the diff is understood. Keep only useful regression coverage.

## Implementation Templates

### Types File

```typescript
// For Indexer:
import type * as ProtoPackagePb from '@injectivelabs/indexer-proto-ts-v2/generated/[proto_file]_pb'
// For Abacus:
import type * as ProtoPackagePb from '@injectivelabs/abacus-proto-ts-v2/generated/[proto_file]_pb'
// For TC Abacus:
import type * as TcAbacusPb from '@injectivelabs/tc-abacus-proto-ts-v2/generated/[proto_file]_pb'
// For Platform Services:
import type * as PlatformServicesPb from '@injectivelabs/platform-services-proto-ts-v2/generated/[proto_file]_pb'

export interface DataType {
  field1: string
  field2: number // Convert bigint to number for timestamps
}

export interface ListResponse {
  items: DataType[]
  next: string[] // Pagination tokens (indexer only)
}

export type GrpcDataType = ProtoPackagePb.DataType
```

**Type naming conflicts**: If the service introduces types that conflict with existing ones (e.g., `PositionDelta` already in derivatives), use a service-specific prefix (e.g., `TCPositionDelta`). Always check for conflicts before implementing.

### Main Transformer

```typescript
import type * as ProtoPackagePb from '@injectivelabs/indexer-proto-ts-v2/generated/[proto_file]_pb'
import type { DataType, GrpcDataType, ListResponse } from '../types'

/**
 * @category Indexer Grpc Transformer
 */
export class IndexerGrpc[Service]Transformer {
  static grpcDataTypeToDataType(grpcData: GrpcDataType): DataType {
    return {
      field1: grpcData.field1,
      field2: Number(grpcData.field2), // Convert bigint
    }
  }

  static listResponseToItems(response: ProtoPackagePb.ListResponse): ListResponse {
    return {
      items: response.items.map(IndexerGrpc[Service]Transformer.grpcDataTypeToDataType),
      next: response.next,
    }
  }
}
```

### API Class

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
  protected module: string = IndexerModule.[ServiceName]

  private get client() {
    return this.initClient([ServiceClient])
  }

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

### Stream Transformer

```typescript
import { IndexerGrpc[Service]Transformer } from './IndexerGrpc[Service]Transformer.js'
import type * as ProtoPackagePb from '@injectivelabs/indexer-proto-ts-v2/generated/[proto_file]_pb'

/**
 * @category Indexer Stream Transformer
 */
export class Indexer[Service]StreamTransformer {
  static itemStreamCallback = (response: ProtoPackagePb.StreamItemResponse) => {
    const item = response.item
    return {
      item: item ? IndexerGrpc[Service]Transformer.grpcItemToItem(item) : undefined,
      operationType: response.operationType,
      timestamp: Number(response.timestamp),
    }
  }
}
```

### Stream API Class

```typescript
import * as ProtoPackagePb from '@injectivelabs/indexer-proto-ts-v2/generated/[proto_file]_pb'
import { [ServiceClient] } from '@injectivelabs/indexer-proto-ts-v2/generated/[proto_file]_pb.client'
import { createStreamSubscriptionV2 } from './streamHelpersV2.js'
import { Indexer[Service]StreamTransformer } from '../../transformers/index.js'
import { GrpcWebRpcTransport } from '../../../base/GrpcWebRpcTransport.js'
import type { StreamSubscription } from '../../../../types/index.js'

export type ItemStreamCallbackV2 = (
  response: ReturnType<typeof Indexer[Service]StreamTransformer.itemStreamCallback>,
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
      const transformed = Indexer[Service]StreamTransformer.itemStreamCallback(response)
      callback(transformed)
    })
  }
}
```

### Test File

```typescript
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { IndexerGrpc[Service]Api } from './IndexerGrpc[Service]Api.js'
import type { IndexerGrpc[Service]Transformer } from '../transformers/index.js'

const endpoints = getNetworkEndpoints(Network.Mainnet)
const indexerGrpc[service]Api = new IndexerGrpc[Service]Api(endpoints.indexer)

describe('IndexerGrpc[Service]Api', () => {
  test('fetchItems', async () => {
    try {
      const response = await indexerGrpc[service]Api.fetchItems({
        // provide realistic test parameters
      })

      expect(response).toBeDefined()
      expect(response).toEqual(
        expect.objectContaining<
          ReturnType<
            typeof IndexerGrpc[Service]Transformer.listResponseToItems
          >
        >(response),
      )
    } catch (e) {
      console.error(
        'IndexerGrpc[Service]Api.fetchItems => ' + (e as any).message,
      )
    }
  })
})
```

**Test file conventions:**
- One test per API method
- Use `Network.Mainnet` endpoints
- Wrap each test in try/catch (these hit real endpoints)
- Use `expect.objectContaining` with transformer return types for type validation
- Import the transformer as `type` only (used for type checking, not runtime)

### Stream V2 Test File

```typescript
import { Network, getNetworkEndpoints } from '@injectivelabs/networks'
import { IndexerGrpc[Service]StreamV2 } from './IndexerGrpc[Service]StreamV2.js'

const endpoints = getNetworkEndpoints(Network.MainnetSentry)

describe('IndexerGrpc[Service]StreamV2', () => {
  let stream: IndexerGrpc[Service]StreamV2

  beforeEach(() => {
    stream = new IndexerGrpc[Service]StreamV2(endpoints.indexer)
  })

  describe('constructor', () => {
    it('should create instance with endpoint', () => {
      expect(stream).toBeDefined()
      expect(stream).toBeInstanceOf(IndexerGrpc[Service]StreamV2)
    })

    it('should create instance with endpoint and metadata', () => {
      const metadata = { 'x-custom-header': 'test-value' }
      const s = new IndexerGrpc[Service]StreamV2(endpoints.indexer, metadata)

      expect(s).toBeDefined()
      expect(s).toBeInstanceOf(IndexerGrpc[Service]StreamV2)
    })
  })

  describe('streamItems', () => {
    it('should create subscription with unsubscribe method', () => {
      const subscription = stream.streamItems({
        callback: () => {},
      })

      expect(subscription).toBeDefined()
      expect(typeof subscription.unsubscribe).toBe('function')

      subscription.unsubscribe()
    })

    it('should throw error if callback is not a function', () => {
      expect(() => {
        stream.streamItems({
          callback: null as any,
        })
      }).toThrow('callback must be a function')
    })
  })
})
```

**Stream test file conventions:**
- Use `Network.MainnetSentry` endpoints (not `Network.Mainnet`)
- Test constructor (with/without metadata)
- For each stream method: test subscription creation, callback validation, optional params
- No try/catch needed — these are synchronous subscription tests
- Always call `subscription.unsubscribe()` after creation tests

## Module Naming Convention

The `module` field references module enums from `@injectivelabs/exceptions` in `packages/exceptions/src/exceptions/types/modules.ts`:

- **Indexer**: `IndexerModule.ServiceName` → `'indexer-{service-name}'`
- **Abacus**: `AbacusModule.ServiceName` → `'abacus-{service-name}'`
- **TC Abacus**: `IndexerErrorModule.Abacus` → `'abacus'`

When implementing a new service, add the module to the exceptions package and build it before building sdk-ts.

## Implementation Checklist

- [ ] All imports use `.js` extension
- [ ] Bigint fields converted to number for timestamps
- [ ] Optional parameters handled with `params || {}`
- [ ] Arrays checked with `length > 0` before assignment
- [ ] Client methods bound: `this.client.method.bind(this.client)`
- [ ] Stream callbacks validated: `typeof callback !== 'function'`
- [ ] JSDoc comments match existing style: `/** @category */`
- [ ] Length-sorted (shortest → longest) ordering in index.ts exports (visual pyramid, matches existing sdk-ts convention — not alphabetical)
- [ ] No type naming conflicts with existing types
- [ ] Test file created with one test per API method
- [ ] Stream V2 test file created (if streaming methods exist)

## Distinguishing New vs Pre-existing Errors

The codebase may have pre-existing TypeScript errors. To verify your implementation:

1. Check if errors are in your new files. If not, your implementation is correct.
2. Run `pnpm tsdown` directly if type-check shows many errors - the build may succeed.
3. Common pre-existing error patterns (safe to ignore if not in your files):
   - `Cannot find module '@protobuf-ts/runtime-rpc'`
   - `Property 'toBinary' does not exist on type`
   - `Argument of type 'unknown' is not assignable`

## Key Principles

- Version bump is permanent (only rollback if install fails)
- Only implement new/modified services (ignore old missing ones)
- User chooses what to implement
- Keep files on validation errors (let user fix)
- Never delete work automatically
- Single package per run
- When in doubt, find the most similar existing implementation and copy its structure
