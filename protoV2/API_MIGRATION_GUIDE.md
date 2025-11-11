# API Migration Guide: Proto V1 to Proto V2

This guide provides step-by-step instructions for migrating API files from the old protobuf setup (`@injectivelabs/core-proto-ts`) to the new protoV2 setup (`@injectivelabs/core-proto-ts-v2`).

## Table of Contents

1. [Overview](#overview)
2. [Migration Example: ChainGrpcAuctionApi](#migration-example-chaingrpcauctionapi)
3. [Migration Example: IndexerGrpcAccountApi](#migration-example-indexergrpcaccountapi)
4. [Migration Example: Streaming APIs](#migration-example-streaming-apis)
5. [Prerequisites and Setup](#prerequisites-and-setup)
6. [Step-by-Step Migration Process](#step-by-step-migration-process)
7. [Tree-Shaking Optimization (Deep Imports)](#tree-shaking-optimization-deep-imports)
8. [Reference Examples](#reference-examples)
9. [Key Differences](#key-differences)
10. [Common Patterns](#common-patterns)
11. [Troubleshooting](#troubleshooting)

---

## Overview

### What Changes?

When migrating from V1 to V2:

1. **Base Class**:
   - Chain APIs: `BaseGrpcConsumer` → `BaseGrpcConsumerV2`
   - Indexer APIs: `BaseIndexerGrpcConsumer` → `BaseIndexerGrpcConsumerV2`
2. **Proto Package**:
   - Chain APIs: `@injectivelabs/core-proto-ts` → `@injectivelabs/core-proto-ts-v2`
   - Indexer APIs: `@injectivelabs/indexer-proto-ts` → `@injectivelabs/indexer-proto-ts-v2`
3. **Client Initialization**: Different client instantiation pattern
4. **Error Handling**: Simplified with `executeGrpcCall` helper
5. **Import Naming**: Protobuf imports now have `Pb` suffix (e.g., `QueryPb`, `RpcPb`, `Client`)

### Files to Modify

**For Chain APIs** (e.g., `ChainGrpcAuctionApi`):

1. **API File**: `packages/sdk-ts/src/client/chain/grpc/ChainGrpcAuctionApi.ts`
2. **Transformer File**: `packages/sdk-ts/src/client/chain/transformers/ChainGrpcAuctionTransformer.ts`
3. **Type File**: `packages/sdk-ts/src/client/chain/types/auction.ts` (if needed)

**For Indexer APIs** (e.g., `IndexerGrpcAccountApi`):

1. **API File**: `packages/sdk-ts/src/client/indexer/grpc/IndexerGrpcAccountApi.ts`
2. **Transformer File**: `packages/sdk-ts/src/client/indexer/transformers/IndexerGrpcAccountTransformer.ts`
3. **Type File**: `packages/sdk-ts/src/client/indexer/types/account.ts` (if needed)

### Quick Reference: Chain vs Indexer APIs

| Aspect                  | Chain APIs                                                                         | Indexer APIs                                                             |
| ----------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **V1 Package**          | `@injectivelabs/core-proto-ts`                                                     | `@injectivelabs/indexer-proto-ts`                                        |
| **V2 Package**          | `@injectivelabs/core-proto-ts-v2`                                                  | `@injectivelabs/indexer-proto-ts-v2`                                     |
| **V1 Base Class**       | `BaseGrpcConsumer`                                                                 | `BaseIndexerGrpcConsumer`                                                |
| **V2 Base Class**       | `BaseGrpcConsumerV2`                                                               | `BaseIndexerGrpcConsumerV2`                                              |
| **Message Namespace**   | `{Module}QueryPb` (e.g., `InjectiveAuctionV1Beta1QueryPb`)                         | `Injective{Service}RpcPb` (e.g., `InjectiveAccountsRpcPb`)               |
| **Client Class**        | `{Module}QueryClient` (e.g., `InjectiveAuctionV1Beta1QueryClient`)                 | `Injective{Service}RPCClient` (e.g., `InjectiveAccountsRPCClient`)       |
| **Deep Import Path**    | `generated/{module}/{version}/{file}_pb.mjs`                                       | `generated/{service}_pb` (no extension)                                  |
| **Deep Import Example** | `@injectivelabs/core-proto-ts-v2/generated/injective/auction/v1beta1/query_pb.mjs` | `@injectivelabs/indexer-proto-ts-v2/generated/injective_accounts_rpc_pb` |
| **File Extension**      | `.mjs` required for deep imports                                                   | No extension for deep imports                                            |

---

## Migration Example: ChainGrpcAuctionApi

Let's use `ChainGrpcAuctionApi` as our example, following the patterns from the already-migrated `ChainGrpcBankApi` and `AbacusGrpcApi`.

### Before (V1)

```typescript
import { InjectiveAuctionV1Beta1Query } from '@injectivelabs/core-proto-ts'
import {
  UnspecifiedErrorCode,
  grpcErrorCodeToErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { ChainModule } from '../types/index.js'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { ChainGrpcAuctionTransformer } from '../transformers/index.js'

export class ChainGrpcAuctionApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Auction
  protected client: InjectiveAuctionV1Beta1Query.QueryClientImpl

  constructor(endpoint: string) {
    super(endpoint)
    this.client = new InjectiveAuctionV1Beta1Query.QueryClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchModuleParams() {
    const request =
      InjectiveAuctionV1Beta1Query.QueryAuctionParamsRequest.create()

    try {
      const response =
        await this.retry<InjectiveAuctionV1Beta1Query.QueryAuctionParamsResponse>(
          () => this.client.AuctionParams(request, this.metadata),
        )

      return ChainGrpcAuctionTransformer.moduleParamsResponseToModuleParams(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveAuctionV1Beta1Query.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'AuctionParams',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'AuctionParams',
        contextModule: this.module,
      })
    }
  }
}
```

### After (V2)

```typescript
import {
  InjectiveAuctionV1Beta1QueryPb,
  InjectiveAuctionV1Beta1QueryClient,
} from '@injectivelabs/core-proto-ts-v2'
import { ChainModule } from '../types/index.js'
import BaseGrpcConsumerV2 from '../../base/BaseGrpcConsumerV2.js'
import { ChainGrpcAuctionTransformer } from '../transformers/index.js'

export class ChainGrpcAuctionApi extends BaseGrpcConsumerV2 {
  protected module: string = ChainModule.Auction
  private client: InjectiveAuctionV1Beta1QueryClient

  constructor(endpoint: string) {
    super(endpoint)
    this.client = new InjectiveAuctionV1Beta1QueryClient(this.transport)
  }

  async fetchModuleParams() {
    const request =
      InjectiveAuctionV1Beta1QueryPb.QueryAuctionParamsRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveAuctionV1Beta1QueryPb.QueryAuctionParamsRequest,
      InjectiveAuctionV1Beta1QueryPb.QueryAuctionParamsResponse
    >(request, this.client.auctionParams.bind(this.client))

    return ChainGrpcAuctionTransformer.moduleParamsResponseToModuleParams(
      response,
    )
  }
}
```

---

## Migration Example: IndexerGrpcAccountApi

Let's use `IndexerGrpcAccountApi` as an example for migrating Indexer APIs. The process is similar to Chain APIs but uses different base classes and proto packages.

### Before (V1)

```typescript
import { InjectiveAccountRpc } from '@injectivelabs/indexer-proto-ts'
import {
  UnspecifiedErrorCode,
  grpcErrorCodeToErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { IndexerModule } from '../types/index.js'
import BaseGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import { IndexerGrpcAccountTransformer } from '../transformers/index.js'

export class IndexerGrpcAccountApi extends BaseGrpcConsumer {
  protected module: string = IndexerModule.Account
  protected client: InjectiveAccountRpc.InjectiveAccountsRPCClientImpl

  constructor(endpoint: string) {
    super(endpoint)
    this.client = new InjectiveAccountRpc.InjectiveAccountsRPCClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchRewards({ address, epoch }: { address: string; epoch: number }) {
    const request = InjectiveAccountRpc.RewardsRequest.create()

    request.accountAddress = address

    if (epoch) {
      request.epoch = epoch.toString()
    }

    try {
      const response = await this.retry<InjectiveAccountRpc.RewardsResponse>(
        () => this.client.Rewards(request, this.metadata),
      )

      return IndexerGrpcAccountTransformer.tradingRewardsResponseToTradingRewards(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveAccountRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'Rewards',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Rewards',
        contextModule: this.module,
      })
    }
  }

  async fetchSubaccountsList(address: string) {
    const request = InjectiveAccountRpc.SubaccountsListRequest.create()

    request.accountAddress = address

    try {
      const response =
        await this.retry<InjectiveAccountRpc.SubaccountsListResponse>(() =>
          this.client.SubaccountsList(request, this.metadata),
        )

      return response.subaccounts
    } catch (e: unknown) {
      if (e instanceof InjectiveAccountRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: grpcErrorCodeToErrorCode(e.code),
          context: 'SubaccountsList',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'SubaccountsList',
        contextModule: this.module,
      })
    }
  }
}
```

### After (V2)

```typescript
import {
  InjectiveAccountsRpcPb,
  InjectiveAccountsRPCClient,
} from '@injectivelabs/indexer-proto-ts-v2'
import { IndexerModule } from '../types/index.js'
import BaseIndexerGrpcConsumerV2 from '../../base/BaseIndexerGrpcConsumerV2.js'
import { IndexerGrpcAccountTransformer } from '../transformers/index.js'

export class IndexerGrpcAccountApi extends BaseIndexerGrpcConsumerV2 {
  protected module: string = IndexerModule.Account
  private client: InjectiveAccountsRPCClient

  constructor(endpoint: string) {
    super(endpoint)
    this.client = new InjectiveAccountsRPCClient(this.transport)
  }

  async fetchRewards({ address, epoch }: { address: string; epoch: number }) {
    const request = InjectiveAccountsRpcPb.RewardsRequest.create()

    request.accountAddress = address

    if (epoch) {
      request.epoch = epoch.toString()
    }

    const response = await this.executeGrpcCall<
      InjectiveAccountsRpcPb.RewardsRequest,
      InjectiveAccountsRpcPb.RewardsResponse
    >(request, this.client.rewards.bind(this.client))

    return IndexerGrpcAccountTransformer.tradingRewardsResponseToTradingRewards(
      response,
    )
  }

  async fetchSubaccountsList(address: string) {
    const request = InjectiveAccountsRpcPb.SubaccountsListRequest.create()

    request.accountAddress = address

    const response = await this.executeGrpcCall<
      InjectiveAccountsRpcPb.SubaccountsListRequest,
      InjectiveAccountsRpcPb.SubaccountsListResponse
    >(request, this.client.subaccountsList.bind(this.client))

    return response.subaccounts
  }
}
```

### Key Differences for Indexer APIs

**Import Changes:**

| V1                                                   | V2                                          |
| ---------------------------------------------------- | ------------------------------------------- |
| `@injectivelabs/indexer-proto-ts`                    | `@injectivelabs/indexer-proto-ts-v2`        |
| `InjectiveAccountRpc`                                | `InjectiveAccountsRpcPb` (message types)    |
| `InjectiveAccountRpc.InjectiveAccountsRPCClientImpl` | `InjectiveAccountsRPCClient` (client class) |
| `BaseGrpcConsumer` (from `BaseIndexerGrpcConsumer`)  | `BaseIndexerGrpcConsumerV2`                 |

**Base Class:**

- V1: `BaseIndexerGrpcConsumer` (extends `GrpcWebImpl`)
- V2: `BaseIndexerGrpcConsumerV2` (extends `BaseGrpcConsumerV2`)

**Client Method Names:**

- V1: PascalCase (`Rewards`, `SubaccountsList`)
- V2: camelCase (`rewards`, `subaccountsList`)

**Naming Pattern for Indexer Protos:**

The V2 indexer protos follow this pattern:

- **Message namespace**: `Injective{Service}RpcPb` (e.g., `InjectiveAccountsRpcPb`, `InjectiveSpotExchangeRpcPb`)
- **Client class**: `Injective{Service}RPCClient` (e.g., `InjectiveAccountsRPCClient`, `InjectiveSpotExchangeRPCClient`)

**Common Indexer Services:**

| Service     | V1 Namespace             | V2 Message Namespace               | V2 Client Class                        |
| ----------- | ------------------------ | ---------------------------------- | -------------------------------------- |
| Account     | `InjectiveAccountRpc`    | `InjectiveAccountsRpcPb`           | `InjectiveAccountsRPCClient`           |
| Spot        | `InjectiveSpotRpc`       | `InjectiveSpotExchangeRpcPb`       | `InjectiveSpotExchangeRPCClient`       |
| Derivatives | `InjectiveDerivativeRpc` | `InjectiveDerivativeExchangeRpcPb` | `InjectiveDerivativeExchangeRPCClient` |
| Explorer    | `InjectiveExplorerRpc`   | `InjectiveExplorerRpcPb`           | `InjectiveExplorerRPCClient`           |
| Oracle      | `InjectiveOracleRpc`     | `InjectiveOracleRpcPb`             | `InjectiveOracleRPCClient`             |
| Insurance   | `InjectiveInsuranceRpc`  | `InjectiveInsuranceRpcPb`          | `InjectiveInsuranceRPCClient`          |
| Auction     | `InjectiveAuctionRpc`    | `InjectiveAuctionRpcPb`            | `InjectiveAuctionRPCClient`            |
| Meta        | `InjectiveMetaRpc`       | `InjectiveMetaRpcPb`               | `InjectiveMetaRPCClient`               |
| Campaign    | `InjectiveCampaignRpc`   | `InjectiveCampaignRpcPb`           | `InjectiveCampaignRPCClient`           |
| Archiver    | `InjectiveArchiverRpc`   | `InjectiveArchiverRpcPb`           | `InjectiveArchiverRPCClient`           |
| Portfolio   | `InjectivePortfolioRpc`  | `InjectivePortfolioRpcPb`          | `InjectivePortfolioRPCClient`          |
| Referral    | `InjectiveReferralRpc`   | `InjectiveReferralRpcPb`           | `InjectiveReferralRPCClient`           |
| MegaVault   | `InjectiveMegavaultRpc`  | `InjectiveMegavaultRpcPb`          | `InjectiveMegavaultRPCClient`          |
| Trading     | `InjectiveTradingRpc`    | `InjectiveTradingRpcPb`            | `InjectiveTradingRPCClient`            |

### Indexer API Migration Checklist

When migrating an Indexer API file:

- [ ] **Update imports**

  - [ ] Change package from `@injectivelabs/indexer-proto-ts` to `@injectivelabs/indexer-proto-ts-v2`
  - [ ] Import message namespace with `RpcPb` suffix (e.g., `InjectiveAccountsRpcPb`)
  - [ ] Import client class (e.g., `InjectiveAccountsRPCClient`)
  - [ ] Remove error handling imports (no longer needed)

- [ ] **Update base class**

  - [ ] Change from `BaseGrpcConsumer` (imported from `BaseIndexerGrpcConsumer`) to `BaseIndexerGrpcConsumerV2`
  - [ ] Update client type from `ClientImpl` to new client class
  - [ ] Change client visibility from `protected` to `private`

- [ ] **Update constructor**

  - [ ] Pass `this.transport` instead of `this.getGrpcWebImpl(endpoint)`

- [ ] **Update each method**

  - [ ] Change request creation to use `RpcPb` namespace
  - [ ] Replace try-catch with `executeGrpcCall`
  - [ ] Add type parameters to `executeGrpcCall<TRequest, TResponse>`
  - [ ] Convert client method names to camelCase
  - [ ] Use `.bind(this.client)` for client methods
  - [ ] Remove the third parameter (context string) - it's now automatically derived from the method name

- [ ] **Update transformer file (if needed)**

  - [ ] Update proto imports to V2 package
  - [ ] Add `RpcPb` suffix to type references
  - [ ] Fix any implicit `any` types

- [ ] **Update type file (if needed)**
  - [ ] Update proto imports to V2 package
  - [ ] Add `RpcPb` suffix to type aliases

---

## Migration Example: Streaming APIs

Streaming APIs require special handling in V2 due to the different streaming interface provided by `@protobuf-ts`. This section covers migrating streaming endpoints like `IndexerGrpcSpotStream` and `IndexerGrpcDerivativesStream`.

### Key Differences for Streaming

**V1 Streaming:**

- Used `grpc-web` streaming with direct subscription management
- Had built-in `unsubscribe()` method on streams
- Simple error handling with try-catch

**V2 Streaming:**

- Uses `@protobuf-ts` `ServerStreamingCall` with async iteration
- Requires `AbortController` for proper stream cancellation
- Need to manually create subscription wrapper to maintain API compatibility
- Better error handling with abort signal checking

### Critical Issue: Stream Cancellation

⚠️ **IMPORTANT**: The V2 `ServerStreamingCall` does NOT have a direct `unsubscribe()` method. You MUST use `AbortController` to properly cancel streams. Without this, streams will continue running even after `unsubscribe()` is called, leading to memory leaks and unwanted callbacks.

### Before (V1 - Broken in V2)

```typescript
streamOrders({
  marketId,
  subaccountId,
  orderSide,
  callback,
  onEndCallback,
  onStatusCallback,
}: {
  marketId?: string
  subaccountId?: string
  orderSide?: OrderSide
  callback: (order: any) => void
  onEndCallback?: () => void
  onStatusCallback?: (status: StreamStatusResponse) => void
}): Subscription {
  const request = InjectiveSpotExchangeRpc.StreamOrdersRequest.create()

  if (marketId) {
    request.marketId = marketId
  }

  if (subaccountId) {
    request.subaccountId = subaccountId
  }

  if (orderSide) {
    request.orderSide = orderSide
  }

  const stream = this.client.StreamOrders(request)

  // V1 streaming with grpc-web
  stream.on('data', (response) => {
    callback(IndexerSpotStreamTransformer.ordersStreamCallback(response))
  })

  stream.on('end', () => {
    if (onEndCallback) {
      onEndCallback()
    }
  })

  stream.on('error', (error) => {
    if (onStatusCallback) {
      onStatusCallback(error)
    }
  })

  return {
    unsubscribe: () => {
      stream.cancel()
    },
  } as Subscription
}
```

### After (V2 - Correct Implementation)

```typescript
streamSpotOrders({
  marketId,
  subaccountId,
  orderSide,
  callback,
  onEndCallback,
  onStatusCallback,
}: {
  marketId?: string
  subaccountId?: string
  orderSide?: OrderSide
  callback: SpotOrdersStreamCallback
  onEndCallback?: (status?: StreamStatusResponse) => void
  onStatusCallback?: (status: StreamStatusResponse) => void
}): Subscription {
  const request = InjectiveSpotExchangeRpcPb.StreamOrdersRequest.create()

  if (marketId) {
    request.marketId = marketId
  }

  if (subaccountId) {
    request.subaccountId = subaccountId
  }

  if (orderSide) {
    request.orderSide = orderSide
  }

  const stream = this.client.streamOrders(request)

  // In V2, ServerStreamingCall has a different interface than V1
  // We need to adapt streaming response to match expected callback pattern
  const handleStreamResponse = (
    response: InjectiveSpotExchangeRpcPb.StreamOrdersResponse,
  ) => {
    callback(IndexerSpotStreamTransformer.ordersStreamCallback(response))
  }

  // Use AbortController for proper stream cancellation
  const abortController = new AbortController()

  // Create a wrapper that mimics V1 streaming interface
  const subscription = {
    unsubscribe: () => {
      abortController.abort()
    },
  }

  // Handle stream using async iteration
  ;(async () => {
    try {
      for await (const response of stream.responses) {
        if (abortController.signal.aborted) {
          break
        }
        handleStreamResponse(response)
      }
      if (onEndCallback && !abortController.signal.aborted) {
        onEndCallback()
      }
    } catch (error) {
      if (!abortController.signal.aborted && onStatusCallback) {
        onStatusCallback(error as any)
      }
    }
  })()

  return subscription as Subscription
}
```

### Key Changes Explained

1. **Import Changes:**

   ```typescript
   // Old
   import { InjectiveSpotExchangeRpc } from '@injectivelabs/indexer-proto-ts'

   // New
   import {
     InjectiveSpotExchangeRpcPb,
     InjectiveSpotExchangeRPCClient,
   } from '@injectivelabs/indexer-proto-ts-v2'
   ```

2. **Type Safety - Define Callback Types:**

   ```typescript
   export type SpotOrdersStreamCallback = (
     response: ReturnType<
       typeof IndexerSpotStreamTransformer.ordersStreamCallback
     >,
   ) => void

   export type SpotOrderHistoryStreamCallback = (
     response: ReturnType<
       typeof IndexerSpotStreamTransformer.orderHistoryStreamCallback
     >,
   ) => void

   export type SpotTradesStreamCallback = (
     response: ReturnType<
       typeof IndexerSpotStreamTransformer.tradesStreamCallback
     >,
   ) => void
   ```

3. **Callback Signature Consistency:**

   ```typescript
   // Make onEndCallback consistent across all methods
   onEndCallback?: (status?: StreamStatusResponse) => void
   ```

4. **AbortController Pattern:**

   ```typescript
   const abortController = new AbortController()

   const subscription = {
     unsubscribe: () => {
       abortController.abort()
     },
   }
   ```

5. **Async Iteration with Abort Checking:**
   ```typescript
   ;(async () => {
     try {
       for await (const response of stream.responses) {
         // Check if stream was cancelled
         if (abortController.signal.aborted) {
           break
         }
         handleStreamResponse(response)
       }
       // Only call onEndCallback if not aborted
       if (onEndCallback && !abortController.signal.aborted) {
         onEndCallback()
       }
     } catch (error) {
       // Only call error callback if not aborted
       if (!abortController.signal.aborted && onStatusCallback) {
         onStatusCallback(error as any)
       }
     }
   })()
   ```

### Why AbortController is Critical

**Without AbortController (Broken):**

```typescript
// ❌ BAD: Stream continues running after unsubscribe
const subscription = {
  unsubscribe: () => {
    stream.headers.then(() => {
      // Connection closed - but this doesn't actually stop the stream!
    })
  },
}
```

**Problems:**

- The async iteration continues running
- Callbacks are still called after `unsubscribe()`
- Memory leaks from unclosed streams
- Unwanted side effects from callbacks

**With AbortController (Correct):**

```typescript
// ✅ GOOD: Stream properly cancelled
const abortController = new AbortController()

const subscription = {
  unsubscribe: () => {
    abortController.abort()
  },
}

;(async () => {
  try {
    for await (const response of stream.responses) {
      if (abortController.signal.aborted) {
        break // Exit the loop immediately
      }
      handleStreamResponse(response)
    }
  } catch (error) {
    // Don't call error callback if intentionally aborted
    if (!abortController.signal.aborted && onStatusCallback) {
      onStatusCallback(error as any)
    }
  }
})()
```

**Benefits:**

- ✅ Stream stops immediately when `unsubscribe()` is called
- ✅ No callbacks after cancellation
- ✅ No memory leaks
- ✅ Proper cleanup

### Complete Example: IndexerGrpcSpotStream

**File**: `packages/sdk-ts/src/client/indexer/grpc_stream/IndexerGrpcSpotStream.ts`

```typescript
import { GeneralException } from '@injectivelabs/exceptions'
import {
  InjectiveSpotExchangeRpcPb,
  InjectiveSpotExchangeRPCClient,
} from '@injectivelabs/indexer-proto-ts-v2'
import { GrpcWebRpcTransport } from '../../base/GrpcWebRpcTransport.js'
import { IndexerSpotStreamTransformer } from '../transformers/index.js'
import type { Subscription } from 'rxjs'
import type { OrderSide, OrderState } from '@injectivelabs/ts-types'
import type { StreamStatusResponse } from '../types/index.js'
import type { PaginationOption } from '../../../types/pagination.js'
import type {
  TradeDirection,
  TradeExecutionSide,
  TradeExecutionType,
} from '../../../types/index.js'

// Define typed callbacks for better type safety
export type MarketsStreamCallback = (
  response: InjectiveSpotExchangeRpcPb.StreamMarketsResponse,
) => void

export type SpotOrderbookV2StreamCallback = (
  response: ReturnType<
    typeof IndexerSpotStreamTransformer.orderbookV2StreamCallback
  >,
) => void

export type SpotOrderbookUpdateStreamCallback = (
  response: ReturnType<
    typeof IndexerSpotStreamTransformer.orderbookUpdateStreamCallback
  >,
) => void

export type SpotOrdersStreamCallback = (
  response: ReturnType<
    typeof IndexerSpotStreamTransformer.ordersStreamCallback
  >,
) => void

export type SpotOrderHistoryStreamCallback = (
  response: ReturnType<
    typeof IndexerSpotStreamTransformer.orderHistoryStreamCallback
  >,
) => void

export type SpotTradesStreamCallback = (
  response: ReturnType<
    typeof IndexerSpotStreamTransformer.tradesStreamCallback
  >,
) => void

/**
 * @category Indexer Grpc Stream
 */
export class IndexerGrpcSpotStream {
  protected client: InjectiveSpotExchangeRPCClient
  protected transport: GrpcWebRpcTransport

  constructor(endpoint: string) {
    this.transport = new GrpcWebRpcTransport(endpoint)
    this.client = new InjectiveSpotExchangeRPCClient(this.transport)
  }

  streamSpotOrders({
    marketId,
    subaccountId,
    orderSide,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketId?: string
    subaccountId?: string
    orderSide?: OrderSide
    callback: SpotOrdersStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    const request = InjectiveSpotExchangeRpcPb.StreamOrdersRequest.create()

    if (marketId) {
      request.marketId = marketId
    }

    if (subaccountId) {
      request.subaccountId = subaccountId
    }

    if (orderSide) {
      request.orderSide = orderSide
    }

    const stream = this.client.streamOrders(request)

    const handleStreamResponse = (
      response: InjectiveSpotExchangeRpcPb.StreamOrdersResponse,
    ) => {
      callback(IndexerSpotStreamTransformer.ordersStreamCallback(response))
    }

    const abortController = new AbortController()

    const subscription = {
      unsubscribe: () => {
        abortController.abort()
      },
    }

    ;(async () => {
      try {
        for await (const response of stream.responses) {
          if (abortController.signal.aborted) {
            break
          }
          handleStreamResponse(response)
        }
        if (onEndCallback && !abortController.signal.aborted) {
          onEndCallback()
        }
      } catch (error) {
        if (!abortController.signal.aborted && onStatusCallback) {
          onStatusCallback(error as any)
        }
      }
    })()

    return subscription as Subscription
  }

  // ... other streaming methods follow the same pattern
}
```

### Streaming API Migration Checklist

When migrating a streaming API file:

- [ ] **Update imports**

  - [ ] Change package from `@injectivelabs/indexer-proto-ts` to `@injectivelabs/indexer-proto-ts-v2`
  - [ ] Import message namespace with `RpcPb` suffix
  - [ ] Import client class (e.g., `InjectiveSpotExchangeRPCClient`)

- [ ] **Define typed callbacks**

  - [ ] Create callback type aliases using `ReturnType` of transformer methods
  - [ ] Replace `any` callback types with proper typed callbacks

- [ ] **Update constructor**

  - [ ] Initialize `GrpcWebRpcTransport` with endpoint
  - [ ] Pass `this.transport` to client constructor

- [ ] **Update each streaming method**

  - [ ] Change request creation to use `RpcPb` namespace
  - [ ] Convert client method names to camelCase (e.g., `StreamOrders` → `streamOrders`)
  - [ ] **Add `AbortController` for stream cancellation**
  - [ ] Create subscription wrapper with `unsubscribe()` that calls `abort()`
  - [ ] Use `for await...of stream.responses` for async iteration
  - [ ] **Check `abortController.signal.aborted` in the loop**
  - [ ] **Only call callbacks if not aborted**
  - [ ] Update callback signatures to include optional `status` parameter in `onEndCallback`

- [ ] **Test stream cancellation**
  - [ ] Verify `unsubscribe()` stops the stream immediately
  - [ ] Verify no callbacks are called after `unsubscribe()`
  - [ ] Check for memory leaks with long-running streams

### Common Streaming Patterns

**Pattern 1: Basic Stream**

```typescript
const stream = this.client.streamOrders(request)
const abortController = new AbortController()

const subscription = {
  unsubscribe: () => abortController.abort(),
}

;(async () => {
  try {
    for await (const response of stream.responses) {
      if (abortController.signal.aborted) break
      callback(transform(response))
    }
    if (onEndCallback && !abortController.signal.aborted) {
      onEndCallback()
    }
  } catch (error) {
    if (!abortController.signal.aborted && onStatusCallback) {
      onStatusCallback(error as any)
    }
  }
})()

return subscription as Subscription
```

**Pattern 2: Stream with Pagination**

```typescript
const request = InjectiveSpotExchangeRpcPb.StreamTradesRequest.create()

if (pagination) {
  if (pagination.skip !== undefined) {
    request.skip = BigInt(pagination.skip)
  }
  if (pagination.limit !== undefined) {
    request.limit = pagination.limit
  }
}

// ... rest follows Pattern 1
```

**Pattern 3: Stream with Multiple Optional Parameters**

```typescript
if (marketIds) {
  request.marketIds = marketIds
}

if (subaccountIds) {
  request.subaccountIds = subaccountIds
}

if (executionSide) {
  request.executionSide = executionSide
}

// ... rest follows Pattern 1
```

---

## Prerequisites and Setup

Before starting the migration, ensure your environment is properly configured:

### 1. Build ProtoV2 Packages

First, build the protoV2 packages you'll be using:

```bash
# Navigate to the protoV2 directory
cd /Users/leeruianthomas/Public/injective/injective-ts/protoV2

# Build core proto package (required for chain APIs)
cd core
pnpm install
pnpm run generate
pnpm run build
cd ..

# Build indexer proto package (required for indexer APIs)
cd indexer
pnpm install
pnpm run generate
pnpm run build
cd ..

# Build abacus proto package (if migrating abacus APIs)
cd abacus
pnpm install
pnpm run generate
pnpm run build
cd ..

# Build other packages as needed (mito, olp)
```

### 2. Configure TypeScript Path Mappings

Add path mappings to the root `tsconfig.json` for Jest test support:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@injectivelabs/core-proto-ts-v2": ["protoV2/core/src"],
      "@injectivelabs/indexer-proto-ts-v2": ["protoV2/indexer/src"],
      "@injectivelabs/abacus-proto-ts-v2": ["protoV2/abacus/src"]
      // Add other protoV2 packages as needed:
      // "@injectivelabs/mito-proto-ts-v2": ["protoV2/mito/src"],
      // "@injectivelabs/olp-proto-ts-v2": ["protoV2/olp/src"],
      // ... existing paths
    }
  }
}
```

**Important:** This step is crucial for Jest tests to work. Without these path mappings, Jest won't be able to resolve the V2 proto packages.

### 3. Install Dependencies

```bash
# Install/update dependencies in the SDK package
cd /Users/leeruianthomas/Public/injective/injective-ts/packages/sdk-ts
pnpm install
```

### 4. Verify Setup

Test that the packages are properly linked:

```bash
# Try importing from the V2 package in a test file
# If no errors, you're ready to migrate!
```

---

## Step-by-Step Migration Process

### Step 1: Update Imports

**Old V1 imports:**

```typescript
import { InjectiveAuctionV1Beta1Query } from '@injectivelabs/core-proto-ts'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
```

**New V2 imports:**

```typescript
import {
  InjectiveAuctionV1Beta1QueryPb,
  InjectiveAuctionV1Beta1QueryClient,
} from '@injectivelabs/core-proto-ts-v2'
import BaseGrpcConsumerV2 from '../../base/BaseGrpcConsumerV2.js'
```

**Pattern:**

- Package: `@injectivelabs/core-proto-ts` → `@injectivelabs/core-proto-ts-v2`
- Import the `Pb` namespace (e.g., `InjectiveAuctionV1Beta1QueryPb`) for message types
- Import the `Client` class (e.g., `InjectiveAuctionV1Beta1QueryClient`) for the gRPC client
- Base class: `BaseGrpcConsumer` → `BaseGrpcConsumerV2`

**Remove these imports (no longer needed):**

```typescript
import {
  UnspecifiedErrorCode,
  grpcErrorCodeToErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
```

_Note: Error handling is now built into `BaseGrpcConsumerV2.executeGrpcCall`_

### Step 2: Update Class Declaration

**Old V1:**

```typescript
export class ChainGrpcAuctionApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.Auction
  protected client: InjectiveAuctionV1Beta1Query.QueryClientImpl
```

**New V2:**

```typescript
export class ChainGrpcAuctionApi extends BaseGrpcConsumerV2 {
  protected module: string = ChainModule.Auction
  private client: InjectiveAuctionV1Beta1QueryClient
```

**Changes:**

- Extend `BaseGrpcConsumerV2` instead of `BaseGrpcConsumer`
- Client type: `InjectiveAuctionV1Beta1Query.QueryClientImpl` → `InjectiveAuctionV1Beta1QueryClient`
- Client visibility: `protected` → `private` (recommended)

### Step 3: Update Constructor

**Old V1:**

```typescript
constructor(endpoint: string) {
  super(endpoint)
  this.client = new InjectiveAuctionV1Beta1Query.QueryClientImpl(
    this.getGrpcWebImpl(endpoint),
  )
}
```

**New V2:**

```typescript
constructor(endpoint: string) {
  super(endpoint)
  this.client = new InjectiveAuctionV1Beta1QueryClient(this.transport)
}
```

**Changes:**

- Client initialization: Pass `this.transport` instead of `this.getGrpcWebImpl(endpoint)`
- The transport is automatically created by `BaseGrpcConsumerV2`

### Step 4: Update Each API Method

This is the most significant change. V2 simplifies error handling using the `executeGrpcCall` helper.

#### Pattern for Simple Methods

**Old V1:**

```typescript
async fetchModuleParams() {
  const request = InjectiveAuctionV1Beta1Query.QueryAuctionParamsRequest.create()

  try {
    const response =
      await this.retry<InjectiveAuctionV1Beta1Query.QueryAuctionParamsResponse>(
        () => this.client.AuctionParams(request, this.metadata),
      )

    return ChainGrpcAuctionTransformer.moduleParamsResponseToModuleParams(response)
  } catch (e: unknown) {
    if (e instanceof InjectiveAuctionV1Beta1Query.GrpcWebError) {
      throw new GrpcUnaryRequestException(new Error(e.toString()), {
        code: grpcErrorCodeToErrorCode(e.code),
        context: 'AuctionParams',
        contextModule: this.module,
      })
    }

    throw new GrpcUnaryRequestException(e as Error, {
      code: UnspecifiedErrorCode,
      context: 'AuctionParams',
      contextModule: this.module,
    })
  }
}
```

**New V2:**

```typescript
async fetchModuleParams() {
  const request = InjectiveAuctionV1Beta1QueryPb.QueryAuctionParamsRequest.create()

  const response = await this.executeGrpcCall<
    InjectiveAuctionV1Beta1QueryPb.QueryAuctionParamsRequest,
    InjectiveAuctionV1Beta1QueryPb.QueryAuctionParamsResponse
  >(request, this.client.auctionParams.bind(this.client))

  return ChainGrpcAuctionTransformer.moduleParamsResponseToModuleParams(response)
}
```

**Key Changes:**

1. **Request creation**: Use `Pb` namespace (e.g., `InjectiveAuctionV1Beta1QueryPb.QueryAuctionParamsRequest`)
2. **Remove try-catch**: Error handling is built into `executeGrpcCall`
3. **Use executeGrpcCall**: Pass request and client method (context name is automatically derived)
4. **Client method naming**: `AuctionParams` → `auctionParams` (camelCase)
5. **Type parameters**: Specify request and response types in `executeGrpcCall<TRequest, TResponse>`
6. **Context parameter**: The third parameter (context string) is now optional and automatically derived from the method name

#### Method Name Conversion

V1 client methods use PascalCase, V2 uses camelCase:

| V1 Method              | V2 Method              |
| ---------------------- | ---------------------- |
| `AuctionParams`        | `auctionParams`        |
| `CurrentAuctionBasket` | `currentAuctionBasket` |
| `AuctionModuleState`   | `auctionModuleState`   |
| `LastAuctionResult`    | `lastAuctionResult`    |
| `AllBalances`          | `allBalances`          |
| `TotalSupply`          | `totalSupply`          |

**Pattern**: Convert PascalCase to camelCase for all client method names.

### Step 5: Update Transformer File (if needed)

The transformer file may need updates if the protobuf message structure has changed.

**Check the transformer imports:**

**Old V1:**

```typescript
import type {
  InjectiveAuctionV1Beta1Query,
  InjectiveAuctionV1Beta1Genesis,
} from '@injectivelabs/core-proto-ts'
```

**New V2:**

```typescript
import type {
  InjectiveAuctionV1Beta1QueryPb,
  InjectiveAuctionV1Beta1GenesisPb,
} from '@injectivelabs/core-proto-ts-v2'
```

**Update type references in transformer methods:**

**Old V1:**

```typescript
static moduleParamsResponseToModuleParams(
  response: InjectiveAuctionV1Beta1Query.QueryAuctionParamsResponse,
): AuctionModuleStateParams {
  // ...
}
```

**New V2:**

```typescript
static moduleParamsResponseToModuleParams(
  response: InjectiveAuctionV1Beta1QueryPb.QueryAuctionParamsResponse,
): AuctionModuleStateParams {
  // ...
}
```

**Important**: The transformer logic usually stays the same, only the import paths and type names change.

#### Fixing Implicit `any` Types in Transformers

When migrating transformers, you may encounter implicit `any` type errors, especially in `.map()` and `.reduce()` callbacks. TypeScript cannot always infer types from proto message fields.

**Common Issue: Implicit `any` in map callbacks**

```typescript
// ❌ Error: Parameter 'reward' implicitly has an 'any' type
return grpcRewards.map((grpcReward) => {
  const rewards = grpcReward.reward.map((reward) => ({
    amount: toHumanReadable(reward.amount).toFixed(),
    denom: reward.denom,
  }))
})
```

**Solution: Add explicit type annotations**

1. **Import the proto type** from the generated files:

```typescript
import type * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb.mjs'
```

2. **Export the type alias** in your types file:

```typescript
// types/distribution.ts
export type GrpcDecCoin = CosmosBaseV1Beta1CoinPb.DecCoin
```

3. **Import and use the type** in your transformer:

```typescript
import type { GrpcDecCoin } from '../types/distribution.js'

// ✅ Fixed: Explicit type annotation
return grpcRewards.map((grpcReward) => {
  const rewards = grpcReward.reward.map((reward: GrpcDecCoin) => ({
    amount: toHumanReadable(reward.amount).toFixed(),
    denom: reward.denom,
  }))
})
```

**Common Proto Types Needing Explicit Annotations:**

| Proto Type                  | Import Path                             | Common Use Case                 |
| --------------------------- | --------------------------------------- | ------------------------------- |
| `DecCoin`                   | `cosmos/base/v1beta1/coin_pb.mjs`       | Decimal coin amounts in rewards |
| `Coin`                      | `cosmos/base/v1beta1/coin_pb.mjs`       | Standard coin amounts           |
| `UnbondingDelegationEntry`  | `cosmos/staking/v1beta1/staking_pb.mjs` | Unbonding delegation entries    |
| `RedelegationEntryResponse` | `cosmos/staking/v1beta1/staking_pb.mjs` | Redelegation entries            |

**Example: Complete Fix for Distribution Transformer**

```typescript
// types/distribution.ts
import type { Coin } from '@injectivelabs/ts-types'
import type * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb.mjs'
import type * as CosmosDistributionV1Beta1DistributionPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/distribution/v1beta1/distribution_pb.mjs'

export type GrpcDecCoin = CosmosBaseV1Beta1CoinPb.DecCoin
export type GrpcDelegationDelegatorReward =
  CosmosDistributionV1Beta1DistributionPb.DelegationDelegatorReward
```

```typescript
// transformers/ChainGrpcDistributionTransformer.ts
import { toHumanReadable } from '@injectivelabs/utils'
import type { Coin } from '@injectivelabs/ts-types'
import type {
  GrpcDecCoin,
  ValidatorRewards,
  DistributionModuleParams,
} from '../types/distribution.js'
import type * as CosmosDistributionV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/distribution/v1beta1/query_pb.mjs'

export class ChainGrpcDistributionTransformer {
  static totalDelegationRewardResponseToTotalReward(
    response: CosmosDistributionV1Beta1QueryPb.QueryDelegationTotalRewardsResponse,
  ): ValidatorRewards[] {
    const grpcRewards = response.rewards

    return grpcRewards.map((grpcReward) => {
      const rewards = grpcReward.reward.map((reward: GrpcDecCoin) => ({
        amount: toHumanReadable(reward.amount).toFixed(),
        denom: reward.denom,
      }))

      return {
        rewards,
        validatorAddress: grpcReward.validatorAddress,
      }
    })
  }
}
```

**Type Guard Pattern for Filter Operations:**

When filtering arrays that may contain undefined values, use type guards:

```typescript
// ❌ Before: Implicit any in filter
tierInfosList: schedule.tierInfos
  .map(Transformer.grpcFeeDiscountTierInfoToFeeDiscountTierInfo)
  .filter((info: any) => info) as FeeDiscountTierInfo[]

// ✅ After: Proper type guard
tierInfosList: schedule.tierInfos
  .map(Transformer.grpcFeeDiscountTierInfoToFeeDiscountTierInfo)
  .filter((info): info is FeeDiscountTierInfo => info !== undefined)
```

**Verification:**

After fixing implicit `any` types, verify there are no remaining issues:

```bash
# Check for any remaining 'any' types in transformers
grep -r "any" packages/sdk-ts/src/client/chain/transformers/

# Run linter to check for implicit any errors
pnpm lint

# Or check specific files
pnpm tsc --noEmit
```

### Step 6: Update Type Definitions (if needed)

Check the type definition file (e.g., `types/auction.ts`) for any Grpc type aliases:

**Old V1:**

```typescript
import type { InjectiveAuctionV1Beta1Auction } from '@injectivelabs/core-proto-ts'

export type GrpcAuctionParams = InjectiveAuctionV1Beta1Auction.Params
export type GrpcAuctionBid = InjectiveAuctionV1Beta1Auction.Bid
```

**New V2:**

```typescript
import type { InjectiveAuctionV1Beta1AuctionPb } from '@injectivelabs/core-proto-ts-v2'

export type GrpcAuctionParams = InjectiveAuctionV1Beta1AuctionPb.Params
export type GrpcAuctionBid = InjectiveAuctionV1Beta1AuctionPb.Bid
```

**Pattern**: Add `Pb` suffix to the imported namespace.

### Step 7: Test the Migration

After migration, test the API:

1. **Build the package:**

   ```bash
   cd packages/sdk-ts
   pnpm build
   ```

2. **Check for TypeScript errors:**

   ```bash
   pnpm type-check
   ```

3. **Run tests (if available):**

   ```bash
   pnpm test
   ```

4. **Manual testing:**
   - Create a test script that calls the migrated API methods
   - Verify responses match expected format

---

## Tree-Shaking Optimization (Deep Imports)

### Overview

For optimal tree-shaking and bundle size reduction, use **deep imports** instead of barrel exports. This bypasses the main index file and imports directly from the generated proto files.

### Why Deep Imports?

**Problem with Barrel Exports:**

The main index file (`@injectivelabs/core-proto-ts-v2`) exports all proto modules:

```typescript
// index.mjs contains 488 lines of imports/exports for the entire protocol
export * as InjectiveAuctionV1Beta1QueryPb from './generated/injective/auction/v1beta1/query_pb.js'
export * as InjectiveEvmV1QueryPb from './generated/injective/evm/v1/query_pb.js'
// ... 486 more lines
```

When you import from the barrel:

```typescript
import { InjectiveEvmV1QueryPb } from '@injectivelabs/core-proto-ts-v2'
```

The bundler must:

- Parse all 488 lines of imports
- Load the entire dependency graph
- Spend extra time analyzing what can be tree-shaken

**Solution with Deep Imports:**

```typescript
import * as InjectiveEvmV1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/evm/v1/query_pb.mjs'
```

Benefits:

- ✅ Bypasses the 488-line barrel file
- ✅ Direct module resolution
- ✅ Faster build times
- ✅ Better tree-shaking
- ✅ Smaller bundle sizes

### Migration Pattern

#### Core Proto Package

**Before (Barrel Import):**

```typescript
import {
  InjectiveEvmV1QueryPb,
  InjectiveEvmV1QueryClient,
} from '@injectivelabs/core-proto-ts-v2'
```

**After (Deep Import - Recommended):**

```typescript
import * as InjectiveEvmV1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/evm/v1/query_pb.mjs'
import { QueryClient as InjectiveEvmV1QueryClient } from '@injectivelabs/core-proto-ts-v2/generated/injective/evm/v1/query_pb.client.mjs'
```

#### Abacus Proto Package

**Before (Barrel Import):**

```typescript
import { PointsSvcClient, PointsSvcPb } from '@injectivelabs/abacus-proto-ts-v2'
```

**After (Deep Import - Recommended):**

```typescript
import * as PointsSvcPb from '@injectivelabs/abacus-proto-ts-v2/generated/points_svc_pb'
import { PointsSvcClient } from '@injectivelabs/abacus-proto-ts-v2/generated/points_svc_pb.client'
```

### Complete Example: ChainGrpcEvmApi

**API File with Deep Imports:**

```typescript
import * as InjectiveEvmV1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/evm/v1/query_pb.mjs'
import { QueryClient as InjectiveEvmV1QueryClient } from '@injectivelabs/core-proto-ts-v2/generated/injective/evm/v1/query_pb.client.mjs'
import { ChainModule } from '../types/index.js'
import BaseGrpcConsumerV2 from '../../base/BaseGrpcConsumerV2.js'
import { ChainGrpcEvmTransformer } from '../transformers/index.js'

export class ChainGrpcEvmApi extends BaseGrpcConsumerV2 {
  protected module: string = ChainModule.Evm
  private client: InjectiveEvmV1QueryClient

  constructor(endpoint: string) {
    super(endpoint)
    this.client = new InjectiveEvmV1QueryClient(this.transport)
  }

  async fetchAccount(ethAddress: string) {
    const request = InjectiveEvmV1QueryPb.QueryAccountRequest.create()
    request.address = ethAddress

    const response = await this.executeGrpcCall<
      InjectiveEvmV1QueryPb.QueryAccountRequest,
      InjectiveEvmV1QueryPb.QueryAccountResponse
    >(request, this.client.account.bind(this.client))

    return ChainGrpcEvmTransformer.accountResponseToAccount(response)
  }
}
```

**Transformer File with Deep Imports:**

```typescript
import type * as InjectiveEvmV1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/evm/v1/query_pb.mjs'
import type { EvmParams, EvmChainConfig } from '../types/evm.js'

export class ChainGrpcEvmTransformer {
  static accountResponseToAccount(
    response: InjectiveEvmV1QueryPb.QueryAccountResponse,
  ): Account {
    // transformation logic
  }
}
```

**Type File with Deep Imports:**

```typescript
import type { Coin } from '@injectivelabs/ts-types'
import type * as InjectiveEvmV1LogPb from '@injectivelabs/core-proto-ts-v2/generated/injective/evm/v1/log_pb.mjs'
import type * as InjectiveEvmV1ParamsPb from '@injectivelabs/core-proto-ts-v2/generated/injective/evm/v1/params_pb.mjs'
import type * as InjectiveEvmV1ChainConfigPb from '@injectivelabs/core-proto-ts-v2/generated/injective/evm/v1/chain_config_pb.mjs'

export type GrpcEvmLog = InjectiveEvmV1LogPb.Log
export type GrpcEvmParams = InjectiveEvmV1ParamsPb.Params
export type GrpcEvmChainConfig = InjectiveEvmV1ChainConfigPb.ChainConfig
```

### Import Path Patterns

#### Core Proto Package Paths

The core proto package follows this structure:

```
@injectivelabs/core-proto-ts-v2/generated/{module}/{version}/{file}_pb.mjs
```

**Common Modules:**

| Module                | Path Pattern                           | Example                                  |
| --------------------- | -------------------------------------- | ---------------------------------------- |
| **Injective Modules** | `injective/{module}/v1beta1/` or `v1/` | `injective/auction/v1beta1/query_pb.mjs` |
| **Cosmos Modules**    | `cosmos/{module}/v1beta1/`             | `cosmos/bank/v1beta1/query_pb.mjs`       |
| **Google Protobuf**   | `google/protobuf/`                     | `google/protobuf/any_pb.mjs`             |

**Examples:**

```typescript
// Injective Auction
import * as InjectiveAuctionV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/auction/v1beta1/query_pb.mjs'
import { QueryClient as InjectiveAuctionV1Beta1QueryClient } from '@injectivelabs/core-proto-ts-v2/generated/injective/auction/v1beta1/query_pb.client.mjs'

// Injective EVM (v1, not v1beta1)
import * as InjectiveEvmV1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/evm/v1/query_pb.mjs'
import { QueryClient as InjectiveEvmV1QueryClient } from '@injectivelabs/core-proto-ts-v2/generated/injective/evm/v1/query_pb.client.mjs'

// Cosmos Bank
import * as CosmosBankV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/bank/v1beta1/query_pb.mjs'
import { QueryClient as CosmosBankV1BetaQueryClient } from '@injectivelabs/core-proto-ts-v2/generated/cosmos/bank/v1beta1/query_pb.client.mjs'

// Cosmos Gov (v1, not v1beta1)
import * as CosmosGovV1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/gov/v1/query_pb.mjs'
import { QueryClient as CosmosGovV1QueryClient } from '@injectivelabs/core-proto-ts-v2/generated/cosmos/gov/v1/query_pb.client.mjs'

// Google Protobuf Any
import type * as GoogleProtobufAnyPb from '@injectivelabs/core-proto-ts-v2/generated/google/protobuf/any_pb.mjs'
```

#### Abacus Proto Package Paths

The abacus package has explicit exports configured:

```typescript
// Points Service
import * as PointsSvcPb from '@injectivelabs/abacus-proto-ts-v2/generated/points_svc_pb'
import { PointsSvcClient } from '@injectivelabs/abacus-proto-ts-v2/generated/points_svc_pb.client'
```

#### Indexer Proto Package Paths

The indexer package follows a flat structure for its generated files:

```
@injectivelabs/indexer-proto-ts-v2/generated/{service}_pb
```

**Deep Import Pattern for Indexer:**

```typescript
// Before (Barrel Import)
import {
  InjectiveAccountsRpcPb,
  InjectiveAccountsRPCClient,
} from '@injectivelabs/indexer-proto-ts-v2'

// After (Deep Import - Recommended)
import * as InjectiveAccountsRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_accounts_rpc_pb'
import { InjectiveAccountsRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_accounts_rpc_pb.client'
```

**Common Indexer Services:**

```typescript
// Account Service
import * as InjectiveAccountsRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_accounts_rpc_pb'
import { InjectiveAccountsRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_accounts_rpc_pb.client'

// Spot Exchange Service
import * as InjectiveSpotExchangeRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_spot_exchange_rpc_pb'
import { InjectiveSpotExchangeRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_spot_exchange_rpc_pb.client'

// Derivative Exchange Service
import * as InjectiveDerivativeExchangeRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_derivative_exchange_rpc_pb'
import { InjectiveDerivativeExchangeRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_derivative_exchange_rpc_pb.client'

// Explorer Service
import * as InjectiveExplorerRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_explorer_rpc_pb'
import { InjectiveExplorerRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_explorer_rpc_pb.client'

// Oracle Service
import * as InjectiveOracleRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_oracle_rpc_pb'
import { InjectiveOracleRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_oracle_rpc_pb.client'

// Insurance Service
import * as InjectiveInsuranceRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_insurance_rpc_pb'
import { InjectiveInsuranceRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_insurance_rpc_pb.client'

// Auction Service
import * as InjectiveAuctionRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_auction_rpc_pb'
import { InjectiveAuctionRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_auction_rpc_pb.client'

// Meta Service
import * as InjectiveMetaRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_meta_rpc_pb'
import { InjectiveMetaRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_meta_rpc_pb.client'

// Campaign Service
import * as InjectiveCampaignRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_campaign_rpc_pb'
import { InjectiveCampaignRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_campaign_rpc_pb.client'

// Archiver Service
import * as InjectiveArchiverRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_archiver_rpc_pb'
import { InjectiveArchiverRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_archiver_rpc_pb.client'

// Portfolio Service
import * as InjectivePortfolioRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_portfolio_rpc_pb'
import { InjectivePortfolioRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_portfolio_rpc_pb.client'

// Referral Service
import * as InjectiveReferralRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_referral_rpc_pb'
import { InjectiveReferralRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_referral_rpc_pb.client'

// MegaVault Service
import * as InjectiveMegavaultRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_megavault_rpc_pb'
import { InjectiveMegavaultRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_megavault_rpc_pb.client'

// Trading Service
import * as InjectiveTradingRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_trading_rpc_pb'
import { InjectiveTradingRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_trading_rpc_pb.client'
```

**Note:** Unlike core proto (which uses `.mjs` extension), indexer proto deep imports do NOT use file extensions.

### Package Export Configuration

For deep imports to work, the package.json must have proper export mappings:

**Core Proto Package (`protoV2/core/proto-ts/package.json`):**

```json
{
  "exports": {
    ".": {
      "types": "./esm/index.d.ts",
      "import": "./esm/index.mjs"
    },
    "./generated/*.mjs": {
      "types": "./esm/generated/*.d.ts",
      "import": "./esm/generated/*.mjs"
    },
    "./generated/*": "./esm/generated/*"
  }
}
```

**Abacus Proto Package (`protoV2/abacus/proto-ts/package.json`):**

```json
{
  "exports": {
    ".": {
      "types": "./esm/index.d.ts",
      "import": "./esm/index.mjs"
    },
    "./generated/points_svc_pb": {
      "types": "./esm/generated/points_svc_pb.d.ts",
      "import": "./esm/generated/points_svc_pb.mjs"
    },
    "./generated/points_svc_pb.client": {
      "types": "./esm/generated/points_svc_pb.client.d.ts",
      "import": "./esm/generated/points_svc_pb.client.mjs"
    }
  }
}
```

**Indexer Proto Package (`protoV2/indexer/proto-ts/package.json`):**

```json
{
  "exports": {
    ".": {
      "types": "./esm/index.d.ts",
      "import": "./esm/index.mjs"
    },
    "./generated/*": "./esm/generated/*"
  }
}
```

The indexer package uses a wildcard export pattern, allowing any file in the `generated/` directory to be imported directly.

### Import Order (ESLint)

When using deep imports, follow this import order to satisfy ESLint:

```typescript
// 1. External packages (non-type imports)
import * as ModuleQueryPb from '@injectivelabs/core-proto-ts-v2/generated/module/query_pb.mjs'
import { QueryClient as ModuleQueryClient } from '@injectivelabs/core-proto-ts-v2/generated/module/query_pb.client.mjs'

// 2. Local imports
import { ChainModule } from '../types/index.js'
import BaseGrpcConsumerV2 from '../../base/BaseGrpcConsumerV2.js'

// 3. Type imports from parent directories
import type { PaginationOption } from '../../../types/pagination.js'

// 4. Type imports from external packages
import type * as ModuleTypePb from '@injectivelabs/core-proto-ts-v2/generated/module/type_pb.mjs'
```

### Migration Checklist for Deep Imports

When updating existing files to use deep imports:

- [ ] **API Files**: Replace barrel imports with deep imports

  - [ ] Import `*Pb` namespace from `query_pb.mjs`
  - [ ] Import `QueryClient` from `query_pb.client.mjs`
  - [ ] Use `.mjs` extension for core proto imports
  - [ ] Verify import order for ESLint

- [ ] **Transformer Files**: Update type imports

  - [ ] Use `import type * as` for proto namespaces
  - [ ] Import from specific generated files
  - [ ] Update all type references

- [ ] **Type Files**: Update proto type imports

  - [ ] Import from specific proto files (e.g., `auction_pb.mjs`, `params_pb.mjs`)
  - [ ] Use `type * as` for namespace imports
  - [ ] Update type aliases

- [ ] **Test Files**: Update test imports
  - [ ] Use deep imports for proto types
  - [ ] Verify tests still pass

### Performance Impact

**Bundle Size Comparison:**

| Import Method | Modules Loaded         | Build Time | Bundle Impact                    |
| ------------- | ---------------------- | ---------- | -------------------------------- |
| Barrel Export | All 488 modules parsed | Slower     | Larger (depends on tree-shaking) |
| Deep Import   | Only required modules  | Faster     | Smaller (explicit dependencies)  |

**Real-World Impact:**

- **Build Time**: 10-20% faster builds (less parsing)
- **Bundle Size**: Varies by bundler, but explicit imports always help tree-shaking
- **Development Experience**: Better IDE performance (less to analyze)

### When to Use Deep Imports

**Always use deep imports for:**

- ✅ Production code
- ✅ Library packages
- ✅ Large applications
- ✅ Any code that will be bundled

**Barrel imports might be acceptable for:**

- ⚠️ Quick prototypes
- ⚠️ Internal tooling scripts
- ⚠️ Test utilities (but deep imports are still better)

### Troubleshooting Deep Imports

**Issue: Cannot find module with deep import path**

```
Cannot find module '@injectivelabs/core-proto-ts-v2/generated/injective/evm/v1/query_pb.mjs'
```

**Solutions:**

1. **Verify the file exists:**

   ```bash
   ls protoV2/core/proto-ts/esm/generated/injective/evm/v1/
   ```

2. **Check package.json exports:**
   Ensure the package has wildcard exports configured (see above)

3. **Use correct extension:**

   - Core proto: Use `.mjs` extension
   - Abacus proto: No extension (uses package.json exports)

4. **Rebuild the proto package:**
   ```bash
   cd protoV2/core
   pnpm run build
   ```

**Issue: TypeScript can't find types**

**Solution:** The `.mjs` files have corresponding `.d.ts` files. TypeScript should automatically find them. If not:

1. Check that `.d.ts` files exist alongside `.mjs` files
2. Verify `package.json` exports map types correctly
3. Clear TypeScript cache: `rm -rf node_modules/.cache`

---

## Reference Examples

### Example 1: AbacusGrpcApi (Already Migrated with Deep Imports)

**File**: `packages/sdk-ts/src/client/abacus/grpc/AbacusGrpcApi.ts`

```typescript
import { IndexerErrorModule } from '@injectivelabs/exceptions'
import * as PointsSvcPb from '@injectivelabs/abacus-proto-ts-v2/generated/points_svc_pb'
import { PointsSvcClient } from '@injectivelabs/abacus-proto-ts-v2/generated/points_svc_pb.client'
import { AbacusGrpcTransformer } from './transformers/index.js'
import BaseGrpcConsumerV2 from '../../base/BaseGrpcConsumerV2.js'

export class AbacusGrpcApi extends BaseGrpcConsumerV2 {
  protected module: string = IndexerErrorModule.Abacus
  private client: PointsSvcClient

  constructor(endpoint: string) {
    super(endpoint)
    this.client = new PointsSvcClient(this.transport)
  }

  async fetchAccountLatestPoints(address: string) {
    const request = PointsSvcPb.PointsLatestForAccountRequest.create({
      accountAddress: address,
    })

    const response = await this.executeGrpcCall<
      PointsSvcPb.PointsLatestForAccountRequest,
      PointsSvcPb.PointsLatestForAccountResponse
    >(request, this.client.pointsLatestForAccount.bind(this.client))

    return AbacusGrpcTransformer.grpcPointsLatestToPointsLatest(response)
  }
}
```

**Key Observations:**

- ✅ Uses deep imports for tree-shaking optimization
- Uses `BaseGrpcConsumerV2`
- Client initialized with `this.transport`
- Uses `executeGrpcCall` for all API calls
- No manual error handling
- Client method names are camelCase

### Example 2: ChainGrpcBankApi (Already Migrated with Deep Imports)

**File**: `packages/sdk-ts/src/client/chain/grpc/ChainGrpcBankApi.ts`

```typescript
import * as CosmosBankV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/bank/v1beta1/query_pb.mjs'
import { QueryClient as CosmosBankV1BetaQueryClient } from '@injectivelabs/core-proto-ts-v2/generated/cosmos/bank/v1beta1/query_pb.client.mjs'
import { ChainModule } from '../types/index.js'
import BaseGrpcConsumerV2 from '../../base/BaseGrpcConsumerV2.js'
import { ChainGrpcBankTransformer } from '../transformers/index.js'
import { fetchAllWithPagination } from '../../../utils/pagination.js'
import { ChainGrpcCommonTransformer } from '../transformers/ChainGrpcCommonTransformer.js'
import type { PaginationOption } from '../../../types/pagination.js'

export class ChainGrpcBankApi extends BaseGrpcConsumerV2 {
  protected module: string = ChainModule.Bank
  private client: CosmosBankV1BetaQueryClient

  constructor(endpoint: string) {
    super(endpoint)
    this.client = new CosmosBankV1BetaQueryClient(this.transport)
  }

  async fetchBalance({
    accountAddress,
    denom,
  }: {
    accountAddress: string
    denom: string
  }) {
    const request = CosmosBankV1Beta1QueryPb.QueryBalanceRequest.create()

    request.address = accountAddress
    request.denom = denom

    const response = await this.executeGrpcCall<
      CosmosBankV1Beta1QueryPb.QueryBalanceRequest,
      CosmosBankV1Beta1QueryPb.QueryBalanceResponse
    >(request, this.client.balance.bind(this.client))

    return ChainGrpcBankTransformer.balanceResponseToBalance(response)
  }

  async fetchBalances(address: string, pagination?: PaginationOption) {
    const request = CosmosBankV1Beta1QueryPb.QueryAllBalancesRequest.create()

    request.address = address

    const paginationForRequest =
      ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

    if (paginationForRequest) {
      request.pagination = paginationForRequest
    }

    const response = await this.executeGrpcCall<
      CosmosBankV1Beta1QueryPb.QueryAllBalancesRequest,
      CosmosBankV1Beta1QueryPb.QueryAllBalancesResponse
    >(request, this.client.allBalances.bind(this.client))

    return ChainGrpcBankTransformer.balancesResponseToBalances(response)
  }
}
```

**Key Observations:**

- ✅ Uses deep imports for tree-shaking optimization
- Shows how to handle request parameters
- Shows pagination handling with V2
- Uses `pageRequestToGrpcPageRequestV2` for pagination
- Multiple methods demonstrate consistent pattern

---

## Key Differences

### 1. Import Structure

| Aspect            | V1                             | V2                                   |
| ----------------- | ------------------------------ | ------------------------------------ |
| **Package**       | `@injectivelabs/core-proto-ts` | `@injectivelabs/core-proto-ts-v2`    |
| **Message Types** | `InjectiveAuctionV1Beta1Query` | `InjectiveAuctionV1Beta1QueryPb`     |
| **Client Class**  | `QueryClientImpl`              | `InjectiveAuctionV1Beta1QueryClient` |
| **Naming**        | No suffix                      | `Pb` suffix for message namespace    |

### 2. Base Class

| Feature            | BaseGrpcConsumer (V1)           | BaseGrpcConsumerV2 (V2)               |
| ------------------ | ------------------------------- | ------------------------------------- |
| **Transport**      | Uses `GrpcWebImpl`              | Uses `GrpcWebRpcTransport`            |
| **Client Init**    | `this.getGrpcWebImpl(endpoint)` | `this.transport`                      |
| **Error Handling** | Manual try-catch                | Built-in via `executeGrpcCall`        |
| **Metadata**       | `grpc.Metadata` object          | Plain object `Record<string, string>` |
| **Retry Logic**    | Manual                          | Built-in via `executeGrpcCall`        |

### 3. Error Handling

**V1 (Manual):**

```typescript
try {
  const response = await this.retry(() => this.client.Method(request, this.metadata))
  return transform(response)
} catch (e: unknown) {
  if (e instanceof SomeGrpcError) {
    throw new GrpcUnaryRequestException(...)
  }
  throw new GrpcUnaryRequestException(...)
}
```

**V2 (Automatic):**

```typescript
const response = await this.executeGrpcCall<TRequest, TResponse>(
  request,
  this.client.method.bind(this.client),
)
return transform(response)
```

**Note:** The context parameter (third argument) is now optional. If omitted, it's automatically derived from the method name (e.g., `method` → `Method`). You can still provide a custom context string if needed for specific error messages.

#### Automatic Context Derivation

The `executeGrpcCall` method now automatically extracts the context name from the bound client method:

```typescript
// The context is automatically derived as "AuctionParams"
const response = await this.executeGrpcCall<TRequest, TResponse>(
  request,
  this.client.auctionParams.bind(this.client),
)

// You can still provide a custom context if needed
const response = await this.executeGrpcCall<TRequest, TResponse>(
  request,
  this.client.auctionParams.bind(this.client),
  'CustomContextName',
)
```

**How it works:**

- The method name is extracted from the bound function (e.g., `auctionParams`)
- It's converted from camelCase to PascalCase (e.g., `auctionParams` → `AuctionParams`)
- This PascalCase name is used as the context in error messages

**Benefits:**

- ✅ **Type-safe**: No hardcoded strings that can become stale
- ✅ **DRY**: Method name is the single source of truth
- ✅ **Maintainable**: Renaming a method automatically updates error context
- ✅ **Less boilerplate**: One less parameter to pass in every call

### 4. Client Method Names

| V1 (PascalCase)        | V2 (camelCase)         |
| ---------------------- | ---------------------- |
| `AuctionParams`        | `auctionParams`        |
| `CurrentAuctionBasket` | `currentAuctionBasket` |
| `AllBalances`          | `allBalances`          |
| `TotalSupply`          | `totalSupply`          |
| `DenomMetadata`        | `denomMetadata`        |

### 5. Enum Handling

**V1 (Const Objects):**

```typescript
export const BlockIDFlag = {
  BLOCK_ID_FLAG_UNKNOWN: 0,
  BLOCK_ID_FLAG_ABSENT: 1,
  UNRECOGNIZED: -1,
}
```

**V2 (TypeScript Enums):**

```typescript
export enum BlockIDFlag {
  BLOCK_ID_FLAG_UNKNOWN = 0,
  BLOCK_ID_FLAG_ABSENT = 1,
}
```

_Note: Usage is the same, but underlying type differs. See `MIGRATION_NOTES.md` for details._

---

## Common Patterns

### Pattern 1: Simple Query (No Parameters)

**Template:**

```typescript
async fetchModuleParams() {
  const request = ModuleQueryPb.QueryParamsRequest.create()

  const response = await this.executeGrpcCall<
    ModuleQueryPb.QueryParamsRequest,
    ModuleQueryPb.QueryParamsResponse
  >(request, this.client.params.bind(this.client))

  return Transformer.responseToParams(response)
}
```

### Pattern 2: Query with Simple Parameters

**Template:**

```typescript
async fetchBalance(address: string, denom: string) {
  const request = ModuleQueryPb.QueryBalanceRequest.create()

  request.address = address
  request.denom = denom

  const response = await this.executeGrpcCall<
    ModuleQueryPb.QueryBalanceRequest,
    ModuleQueryPb.QueryBalanceResponse
  >(request, this.client.balance.bind(this.client))

  return Transformer.balanceResponseToBalance(response)
}
```

### Pattern 3: Query with Object Parameters

**Template:**

```typescript
async fetchBalance({
  accountAddress,
  denom,
}: {
  accountAddress: string
  denom: string
}) {
  const request = ModuleQueryPb.QueryBalanceRequest.create()

  request.address = accountAddress
  request.denom = denom

  const response = await this.executeGrpcCall<
    ModuleQueryPb.QueryBalanceRequest,
    ModuleQueryPb.QueryBalanceResponse
  >(request, this.client.balance.bind(this.client))

  return Transformer.balanceResponseToBalance(response)
}
```

### Pattern 4: Query with Pagination

**Template:**

```typescript
async fetchBalances(address: string, pagination?: PaginationOption) {
  const request = ModuleQueryPb.QueryAllBalancesRequest.create()

  request.address = address

  const paginationForRequest =
    ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)

  if (paginationForRequest) {
    request.pagination = paginationForRequest
  }

  const response = await this.executeGrpcCall<
    ModuleQueryPb.QueryAllBalancesRequest,
    ModuleQueryPb.QueryAllBalancesResponse
  >(request, this.client.allBalances.bind(this.client))

  return Transformer.balancesResponseToBalances(response)
}
```

**Important**: Use `pageRequestToGrpcPageRequestV2` (not `pageRequestToGrpcPageRequest`) for V2 migrations.

### Pattern 5: Query with Optional Parameters

**Template:**

```typescript
async fetchAccountDailyPoints(address: string, daysLimit?: number) {
  const request = ModulePb.QueryDailyPointsRequest.create({
    accountAddress: address,
    daysLimit: daysLimit ? BigInt(daysLimit) : undefined,
  })

  const response = await this.executeGrpcCall<
    ModulePb.QueryDailyPointsRequest,
    ModulePb.QueryDailyPointsResponse
  >(request, this.client.queryDailyPoints.bind(this.client))

  return Transformer.responseToPoints(response)
}
```

---

## Troubleshooting

### Issue 1: Cannot find module '@injectivelabs/core-proto-ts-v2' or '@injectivelabs/indexer-proto-ts-v2'

**Problem:**

```
Cannot find module '@injectivelabs/core-proto-ts-v2' from 'packages/sdk-ts/src/client/chain/grpc/ChainGrpcAuctionApi.ts'
Cannot find module '@injectivelabs/indexer-proto-ts-v2' from 'packages/sdk-ts/src/client/indexer/grpc/IndexerGrpcAccountApi.ts'
```

This error can occur in two scenarios:

1. **During TypeScript compilation** - The package isn't built or linked properly
2. **During Jest tests** - The tsconfig.json is missing the path mapping

**Solution 1: Build and Link the V2 Proto Package**

Ensure the V2 proto package is built and linked:

**For Chain APIs:**

```bash
cd /Users/leeruianthomas/Public/injective/injective-ts/protoV2/core
pnpm install
pnpm run generate
pnpm run build
```

**For Indexer APIs:**

```bash
cd /Users/leeruianthomas/Public/injective/injective-ts/protoV2/indexer
pnpm install
pnpm run generate
pnpm run build
```

Then link it in your SDK package:

```bash
cd /Users/leeruianthomas/Public/injective/injective-ts/packages/sdk-ts
pnpm install
```

**Solution 2: Add Path Mapping to tsconfig.json (For Jest)**

If the error occurs during Jest tests, you need to add the path mapping to the root `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@injectivelabs/core-proto-ts-v2": ["protoV2/core/src"],
      "@injectivelabs/indexer-proto-ts-v2": ["protoV2/indexer/src"],
      "@injectivelabs/abacus-proto-ts-v2": ["protoV2/abacus/src"]
      // ... other paths
    }
  }
}
```

**Why is this needed?**

Jest uses the `tsconfig.json` paths to resolve module imports during testing. The workspace protocol (`workspace:*`) in `package.json` works for runtime, but Jest needs explicit path mappings to resolve modules during test execution.

**For other protoV2 packages:**

If you're using other protoV2 packages (mito, olp), add them to tsconfig.json as well:

```json
"@injectivelabs/mito-proto-ts-v2": ["protoV2/mito/src"],
"@injectivelabs/olp-proto-ts-v2": ["protoV2/olp/src"]
```

### Issue 2: Type errors on client methods

**Problem:**

```
Property 'AuctionParams' does not exist on type 'InjectiveAuctionV1Beta1QueryClient'
```

**Solution:**
V2 uses camelCase method names. Change `AuctionParams` to `auctionParams`.

### Issue 3: Pagination not working

**Problem:**
Using old pagination transformer.

**Solution:**
Use `pageRequestToGrpcPageRequestV2` instead of `pageRequestToGrpcPageRequest`:

```typescript
const paginationForRequest =
  ChainGrpcCommonTransformer.pageRequestToGrpcPageRequestV2(pagination)
```

### Issue 4: Enum type errors

**Problem:**
Enum comparisons failing or type mismatches.

**Solution:**
V2 uses TypeScript enums instead of const objects. Usage is the same, but if you need to check enum values, use:

```typescript
// Both V1 and V2 work the same
if (value === MyEnum.SOME_VALUE) { ... }
```

See `MIGRATION_NOTES.md` for detailed enum differences.

### Issue 5: Transformer type errors

**Problem:**

```
Type 'InjectiveAuctionV1Beta1Query.QueryAuctionParamsResponse' is not assignable to parameter
```

**Solution:**
Update transformer file to use V2 types:

```typescript
// Old
import type { InjectiveAuctionV1Beta1Query } from '@injectivelabs/core-proto-ts'

// New
import type { InjectiveAuctionV1Beta1QueryPb } from '@injectivelabs/core-proto-ts-v2'
```

### Issue 6: Metadata not working

**Problem:**
Metadata not being sent with requests.

**Solution:**
V2 uses plain objects for metadata. Ensure you're calling `setMetadata` with a plain object:

```typescript
api.setMetadata({
  'x-custom-header': 'value',
})
```

### Issue 7: TypeScript errors about unused parameters in generated proto files

**Problem:**

```
protoV2/core/src/generated/google/protobuf/timestamp_pb.ts:200:43 - error TS6133: 'options' is declared but its value is never read.
```

This occurs when Jest compiles the protoV2 source files with strict TypeScript settings (`noUnusedParameters: true`).

### Issue 8: JavaScript heap out of memory

**Problem:**

```
FATAL ERROR: Ineffective mark-compacts near heap limit Allocation failed - JavaScript heap out of memory
```

This occurs because the generated protobuf files are very large (10,000+ lines) and TypeScript compilation requires significant memory.

**Solution:**

Increase Node's memory limit. Update `/package.json`:

```json
{
  "scripts": {
    "test": "NODE_OPTIONS='--max-old-space-size=8192' jest"
  }
}
```

Then run tests with the memory setting:

```bash
# Option 1: Use pnpm (includes memory setting)
pnpm test ChainGrpcAuctionApi

# Option 2: Set memory directly
NODE_OPTIONS="--max-old-space-size=8192" npx jest ChainGrpcAuctionApi

# Option 3: Use the provided script
bash RUN_JEST_WITH_MEMORY.sh
```

### Issue 9: Unused import - snakecaseKeys

**Problem:**

```typescript
import snakecaseKeys from 'snakecase-keys' // Imported but never used
```

After migrating to V2, many message classes no longer use `snakecaseKeys` because they use explicit field ordering in `toAmino()` for EIP712 compatibility.

**Solution:**

Remove the unused import:

```typescript
// ❌ Before
import snakecaseKeys from 'snakecase-keys'
import * as CosmosBankV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/bank/v1beta1/tx_pb.mjs'

// ✅ After
import * as CosmosBankV1Beta1TxPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/bank/v1beta1/tx_pb.mjs'
```

**When to keep snakecaseKeys:**

- Complex nested messages with many fields (5+)
- Messages where manual field ordering would be error-prone
- See MSG_MIGRATION_GUIDE.md for detailed guidance

### Issue 10: Generic type parameters reversed in MsgBase

**Problem:**

```typescript
// ❌ Wrong - params and proto are swapped
export default class MsgMultiSend extends MsgBase<
  MsgMultiSend.Proto,
  MsgMultiSend.Params
>
```

**Solution:**

The correct order is `Params` first, then `Proto`:

```typescript
// ✅ Correct - params first, proto second
export default class MsgMultiSend extends MsgBase<
  MsgMultiSend.Params,
  MsgMultiSend.Proto
>
```

**Why this matters:**

- `MsgBase` is defined as `MsgBase<TParams, TProto>`
- Swapping them causes type errors in `toData()`, `toProto()`, and other methods
- Always check the order: **Params, Proto**

### Issue 11: Implicit `any` type errors in transformers and message classes

**Problem:**

```
Parameter 'reward' implicitly has an 'any' type.
Parameter 'entry' implicitly has an 'any' type.
Parameter 'validator' implicitly has an 'any' type.
Parameter 'c' implicitly has an 'any' type.
```

These errors occur when TypeScript cannot infer the type of callback parameters in `.map()`, `.reduce()`, or `.filter()` operations on proto message fields.

**Solution:**

Add explicit type annotations by importing and using the proto types:

**Step 1: Identify the proto type**

Look at the proto definition to find the field type. For example:

- `reward: DecCoin[]` → Use `GrpcDecCoin`
- `entries: UnbondingDelegationEntry[]` → Use `GrpcUnbondingDelegationEntry`
- `validators: Validator[]` → Use `GrpcValidator`

**Step 2: Import the proto type in your types file**

```typescript
// types/distribution.ts
import type * as CosmosBaseV1Beta1CoinPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/base/v1beta1/coin_pb.mjs'

export type GrpcDecCoin = CosmosBaseV1Beta1CoinPb.DecCoin
```

**Step 3: Use the type in your transformer or message class**

```typescript
// transformers/ChainGrpcDistributionTransformer.ts
import type { GrpcDecCoin } from '../types/distribution.js'

// ✅ Add explicit type annotation
const rewards = grpcReward.reward.map((reward: GrpcDecCoin) => ({
  amount: toHumanReadable(reward.amount).toFixed(),
  denom: reward.denom,
}))
```

**For Message Classes:**

```typescript
// ❌ Before - implicit any error
const inputs = params.inputs.map((i) => {
  return CosmosBankV1Beta1BankPb.Input.create({
    address: i.address,
    coins: i.coins.map((c) => {
      // Error: Parameter 'c' implicitly has an 'any' type
      return CosmosBaseV1Beta1CoinPb.Coin.create({
        denom: c.denom,
        amount: c.amount,
      })
    }),
  })
})

// ✅ After - explicit type annotation
const inputs = params.inputs.map((i) => {
  return CosmosBankV1Beta1BankPb.Input.create({
    address: i.address,
    coins: i.coins.map((c: CosmosBaseV1Beta1CoinPb.Coin) => {
      return CosmosBaseV1Beta1CoinPb.Coin.create({
        denom: c.denom,
        amount: c.amount,
      })
    }),
  })
})
```

**Common Proto Types:**

| Error Location                       | Proto Type                     | Import From                             |
| ------------------------------------ | ------------------------------ | --------------------------------------- |
| `reward.map((reward) => ...)`        | `GrpcDecCoin`                  | `cosmos/base/v1beta1/coin_pb.mjs`       |
| `entries.map((entry) => ...)`        | `GrpcUnbondingDelegationEntry` | `cosmos/staking/v1beta1/staking_pb.mjs` |
| `validators.map((validator) => ...)` | `GrpcValidator`                | `cosmos/staking/v1beta1/staking_pb.mjs` |
| `deposits.map((deposit) => ...)`     | Inferred (usually works)       | -                                       |

**For filter operations with undefined values:**

Use type guards instead of `any`:

```typescript
// ❌ Bad
.filter((info: any) => info)

// ✅ Good
.filter((info): info is FeeDiscountTierInfo => info !== undefined)
```

---

## Combined Solution for Issues 7 & 8

Update both `jest.config.js` and `package.json`:

```javascript
transform: {
  '^.+\\.ts?$': [
    'ts-jest',
    {
      useESM: true,
      tsconfig: {
        module: 'ESNext',
        moduleResolution: 'Node',
        allowSyntheticDefaultImports: true,
        esModuleInterop: true,
        noUnusedParameters: false,  // Add this
        noUnusedLocals: false,      // Add this
        skipLibCheck: true,         // Add this
      },
    },
  ],
},
```

**Important:** After making this change, clear Jest's cache:

```bash
jest --clearCache
# or
pnpm jest --clearCache
```

**Why this happens:**

The generated protobuf files from `@protobuf-ts` sometimes have unused parameters (like `options` in JSON serialization methods) that are required by the interface but not used in the implementation. While the generator adds underscore prefixes (`_options`) to indicate they're intentionally unused, Jest's TypeScript compilation with strict settings still reports them as errors.

**Alternative solution:**

If you don't want to modify Jest config globally, you can also update the protoV2 package's `tsconfig.json`:

```json
{
  "compilerOptions": {
    "noUnusedLocals": false,
    "noUnusedParameters": false
    // ... other options
  }
}
```

---

## Complete Migration Checklist

Use this checklist when migrating an API file or message class:

### Message Class Files (`MsgXxx.ts`)

- [ ] Update imports to V2 deep imports with `.mjs` extension
- [ ] **Remove ALL V1 imports** from `@injectivelabs/core-proto-ts`
- [ ] Add `Pb` suffix to all proto namespace references
- [ ] **Remove unused `snakecaseKeys` import** if using explicit field ordering
- [ ] **Verify MsgBase generic parameters are in correct order**: `MsgBase<Params, Proto>`
- [ ] Update `toProto()` method:
  - [ ] Use `Message.create({ fields })` pattern
  - [ ] Return message directly (no `.fromPartial()`)
  - [ ] Use `BigInt()` for uint64/int64 fields
  - [ ] **Add explicit type annotations for nested `.map()` callbacks**
- [ ] Update `toData()` method:
  - [ ] Spread proto object (`...proto`)
  - [ ] Keep BigInt types (don't convert to string)
- [ ] Update `toAmino()` method:
  - [ ] Use explicit field ordering for simple messages (1-5 fields)
  - [ ] Use `snakecaseKeys()` for complex nested messages (5+ fields)
  - [ ] Convert BigInt to string
- [ ] Update `toBinary()` method:
  - [ ] Use `Message.toBinary(msg)` instead of `.encode().finish()`
- [ ] Run linter to catch type errors
- [ ] Run tests to verify migration

### API File (`ChainGrpcXxxApi.ts`)

- [ ] Update import from `@injectivelabs/core-proto-ts` to `@injectivelabs/core-proto-ts-v2`
- [ ] Import both `XxxQueryPb` and `XxxQueryClient`
- [ ] Change base class from `BaseGrpcConsumer` to `BaseGrpcConsumerV2`
- [ ] Update client type to use V2 client class
- [ ] Update constructor to pass `this.transport` to client
- [ ] For each method:
  - [ ] Update request creation to use `Pb` namespace
  - [ ] Replace try-catch with `executeGrpcCall`
  - [ ] Add type parameters to `executeGrpcCall<TRequest, TResponse>`
  - [ ] Convert client method name to camelCase
  - [ ] Use `.bind(this.client)` for the client method
  - [ ] Remove the third parameter (context string) - it's now automatically derived from the method name
- [ ] Remove unused error handling imports

### Transformer File (`ChainGrpcXxxTransformer.ts`)

- [ ] Update proto imports to use V2 package
- [ ] Add `Pb` suffix to imported namespaces
- [ ] Update method parameter types to use V2 types
- [ ] Fix implicit `any` types in `.map()`, `.reduce()`, and `.filter()` callbacks
  - [ ] Add explicit type annotations for callback parameters
  - [ ] Import and export necessary proto types (e.g., `GrpcDecCoin`, `GrpcUnbondingDelegationEntry`)
  - [ ] Use type guards for filter operations
- [ ] Verify transformer logic still works (usually no changes needed)
- [ ] If using pagination, ensure using V2 pagination transformer

### Type File (`types/xxx.ts`)

- [ ] Update proto imports to use V2 package
- [ ] Add `Pb` suffix to type aliases
- [ ] Export additional proto types needed for transformer type annotations
  - [ ] Common types: `GrpcDecCoin`, `GrpcUnbondingDelegationEntry`, `GrpcReDelegationEntryResponse`
- [ ] Verify interface definitions (usually no changes needed)

### Testing

- [ ] Build the package successfully
- [ ] Run type-check
- [ ] Run tests (if available)
- [ ] Manual testing with real endpoint
- [ ] Verify all methods return expected data

---

## Additional Resources

- **ProtoV2 README**: `/protoV2/README.md` - Overview of V2 setup
- **Migration Notes**: `/protoV2/MIGRATION_NOTES.md` - Detailed V1 vs V2 differences
- **Base Classes**:
  - `packages/sdk-ts/src/client/base/BaseGrpcConsumerV2.ts` - Base class for Chain/Abacus APIs
  - `packages/sdk-ts/src/client/base/BaseIndexerGrpcConsumerV2.ts` - Base class for Indexer APIs
- **Reference Implementations**:
  - **Chain APIs**: `packages/sdk-ts/src/client/chain/grpc/ChainGrpcBankApi.ts`
  - **Indexer APIs**: (To be migrated - use this guide)
  - **Abacus APIs**: `packages/sdk-ts/src/client/abacus/grpc/AbacusGrpcApi.ts`
  - **Tx API**: `packages/sdk-ts/src/core/tx/api/TxGrpcApi.ts`

---

## Summary

The migration from V1 to V2 primarily involves:

### For Chain APIs:

1. **Import changes**: `@injectivelabs/core-proto-ts` → `@injectivelabs/core-proto-ts-v2` with `Pb` suffix
2. **Base class**: `BaseGrpcConsumer` → `BaseGrpcConsumerV2`
3. **Client initialization**: Pass `this.transport`
4. **Method simplification**: Use `executeGrpcCall` instead of manual error handling
5. **Method naming**: Convert PascalCase to camelCase
6. **Deep imports**: Use direct imports from `generated/` for better tree-shaking

### For Indexer APIs:

1. **Import changes**: `@injectivelabs/indexer-proto-ts` → `@injectivelabs/indexer-proto-ts-v2` with `RpcPb` suffix
2. **Base class**: `BaseIndexerGrpcConsumer` → `BaseIndexerGrpcConsumerV2`
3. **Client initialization**: Pass `this.transport`
4. **Method simplification**: Use `executeGrpcCall` instead of manual error handling
5. **Method naming**: Convert PascalCase to camelCase
6. **Deep imports**: Use direct imports from `generated/` (without `.mjs` extension)

### Key Benefits:

- ✅ **Cleaner code**: Eliminates repetitive try-catch blocks
- ✅ **Better maintainability**: Consistent error handling across all APIs
- ✅ **Type safety**: Improved TypeScript types from protobuf-ts
- ✅ **Smaller bundles**: Better tree-shaking with deep imports
- ✅ **Easier testing**: Simplified mocking and testing patterns

The V2 approach reduces boilerplate code by ~60% per API method. Follow the patterns from `ChainGrpcBankApi` for Chain APIs and use this guide's `IndexerGrpcAccountApi` example for Indexer APIs.
