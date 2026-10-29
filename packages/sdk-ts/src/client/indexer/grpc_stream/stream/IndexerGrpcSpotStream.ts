import { GeneralException } from '@injectivelabs/exceptions'
import * as InjectiveSpotExchangeRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_spot_exchange_rpc_pb'
import { InjectiveSpotExchangeRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_spot_exchange_rpc_pb.client'
import { createStreamSubscription } from './streamHelpers.js'
import { GrpcWebRpcTransport } from '../../../base/GrpcWebRpcTransport.js'
import { IndexerSpotStreamTransformer } from '../../transformers/index.js'
import type { StreamStatusResponse } from '../../types/index.js'
import type { LegacyStreamSubscription } from './streamHelpers.js'
import type {
  OrderSide,
  OrderState,
  TradeDirection,
  PaginationOption,
  TradeExecutionSide,
  TradeExecutionType,
} from '../../../../types/index.js'

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
 * @description Provides streaming access to spot market data from Injective Indexer
 */
export class IndexerGrpcSpotStream {
  private client: InjectiveSpotExchangeRPCClient
  private transport: GrpcWebRpcTransport

  constructor(endpoint: string, metadata?: Record<string, string>) {
    this.transport = new GrpcWebRpcTransport(endpoint, metadata)
    this.client = new InjectiveSpotExchangeRPCClient(this.transport)
  }

  /** @deprecated - use streamOrderbookV2 */
  streamOrderbook(_args: {
    marketIds: string[]
    callback: any
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
    signal?: AbortSignal
  }): LegacyStreamSubscription {
    throw new GeneralException(new Error('deprecated - use streamOrderbookV2'))
  }

  /**
   * Stream spot orders
   * @param params - Stream parameters
   * @param params.marketId - Optional market ID to filter orders
   * @param params.subaccountId - Optional subaccount ID to filter orders
   * @param params.orderSide - Optional order side to filter
   * @param params.callback - Called for each order update
   * @param params.onEndCallback - Called when stream ends normally
   * @param params.onStatusCallback - Called on stream errors
   * @param params.signal - Optional signal that cancels the stream
   * @returns Subscription object with unsubscribe method
   */
  streamOrders({
    marketId,
    subaccountId,
    orderSide,
    callback,
    onEndCallback,
    onStatusCallback,
    signal,
  }: {
    marketId?: string
    subaccountId?: string
    orderSide?: OrderSide
    callback: SpotOrdersStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
    signal?: AbortSignal
  }): LegacyStreamSubscription {
    // Input validation
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

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

    return createStreamSubscription(
      (abortSignal) =>
        this.client.streamOrders(request, { abort: abortSignal }),
      (response: InjectiveSpotExchangeRpcPb.StreamOrdersResponse) => {
        callback(IndexerSpotStreamTransformer.ordersStreamCallback(response))
      },
      onEndCallback,
      onStatusCallback,
      { signal },
    )
  }

  /**
   * Stream spot order history
   * @param params - Stream parameters
   * @param params.marketId - Optional market ID to filter orders
   * @param params.subaccountId - Optional subaccount ID to filter orders
   * @param params.orderTypes - Optional array of order types to filter
   * @param params.executionTypes - Optional array of execution types to filter
   * @param params.direction - Optional trade direction to filter
   * @param params.state - Optional order state to filter
   * @param params.callback - Called for each order history update
   * @param params.onEndCallback - Called when stream ends normally
   * @param params.onStatusCallback - Called on stream errors
   * @param params.signal - Optional signal that cancels the stream
   * @returns Subscription object with unsubscribe method
   */
  streamOrderHistory({
    marketId,
    subaccountId,
    orderTypes,
    executionTypes,
    direction,
    state,
    callback,
    onEndCallback,
    onStatusCallback,
    signal,
  }: {
    marketId?: string
    subaccountId?: string
    orderTypes?: OrderSide[]
    executionTypes?: TradeExecutionType[]
    direction?: TradeDirection
    state?: OrderState
    callback: SpotOrderHistoryStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
    signal?: AbortSignal
  }): LegacyStreamSubscription {
    // Input validation
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request =
      InjectiveSpotExchangeRpcPb.StreamOrdersHistoryRequest.create()

    if (subaccountId) {
      request.subaccountId = subaccountId
    }

    if (marketId) {
      request.marketId = marketId
    }

    if (orderTypes) {
      request.orderTypes = orderTypes
    }

    if (direction) {
      request.direction = direction
    }

    if (state) {
      request.state = state
    }

    if (executionTypes) {
      request.executionTypes = executionTypes
    }

    return createStreamSubscription(
      (abortSignal) =>
        this.client.streamOrdersHistory(request, { abort: abortSignal }),
      (response: InjectiveSpotExchangeRpcPb.StreamOrdersHistoryResponse) => {
        callback(
          IndexerSpotStreamTransformer.orderHistoryStreamCallback(response),
        )
      },
      onEndCallback,
      onStatusCallback,
      { signal },
    )
  }

  /**
   * Stream spot trades
   * @param params - Stream parameters
   * @param params.marketIds - Optional array of market IDs to filter trades
   * @param params.marketId - Optional market ID to filter trades
   * @param params.subaccountIds - Optional array of subaccount IDs to filter trades
   * @param params.subaccountId - Optional subaccount ID to filter trades
   * @param params.pagination - Optional pagination options
   * @param params.direction - Optional trade direction to filter
   * @param params.executionSide - Optional trade execution side to filter
   * @param params.callback - Called for each trade update
   * @param params.onEndCallback - Called when stream ends normally
   * @param params.onStatusCallback - Called on stream errors
   * @param params.signal - Optional signal that cancels the stream
   * @returns Subscription object with unsubscribe method
   */
  streamTrades({
    marketIds,
    marketId,
    subaccountIds,
    subaccountId,
    pagination,
    direction,
    executionSide,
    callback,
    onEndCallback,
    onStatusCallback,
    signal,
  }: {
    marketIds?: string[]
    marketId?: string
    subaccountIds?: string[]
    subaccountId?: string
    pagination?: PaginationOption
    direction?: TradeDirection
    executionSide?: TradeExecutionSide
    callback: SpotTradesStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
    signal?: AbortSignal
  }): LegacyStreamSubscription {
    // Input validation
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = InjectiveSpotExchangeRpcPb.StreamTradesRequest.create()

    if (marketIds) {
      request.marketIds = marketIds
    }

    if (marketId) {
      request.marketId = marketId
    }

    if (subaccountIds) {
      request.subaccountIds = subaccountIds
    }

    if (subaccountId) {
      request.subaccountId = subaccountId
    }

    if (executionSide) {
      request.executionSide = executionSide
    }

    if (direction) {
      request.direction = direction
    }

    if (pagination) {
      if (pagination.skip !== undefined) {
        request.skip = BigInt(pagination.skip)
      }

      if (pagination.limit !== undefined) {
        request.limit = pagination.limit
      }
    }

    return createStreamSubscription(
      (abortSignal) =>
        this.client.streamTrades(request, { abort: abortSignal }),
      (response: InjectiveSpotExchangeRpcPb.StreamTradesResponse) => {
        callback(IndexerSpotStreamTransformer.tradesStreamCallback(response))
      },
      onEndCallback,
      onStatusCallback,
      { signal },
    )
  }

  /**
   * Stream spot market data
   * @param params - Stream parameters
   * @param params.marketIds - Optional array of market IDs to filter
   * @param params.callback - Called for each market update
   * @param params.onEndCallback - Called when stream ends normally
   * @param params.onStatusCallback - Called on stream errors
   * @param params.signal - Optional signal that cancels the stream
   * @returns Subscription object with unsubscribe method
   */
  streamMarkets({
    marketIds,
    callback,
    onEndCallback,
    onStatusCallback,
    signal,
  }: {
    marketIds?: string[]
    callback: MarketsStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
    signal?: AbortSignal
  }): LegacyStreamSubscription {
    // Input validation
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = InjectiveSpotExchangeRpcPb.StreamMarketsRequest.create()

    if (marketIds) {
      request.marketIds = marketIds
    }

    return createStreamSubscription(
      (abortSignal) =>
        this.client.streamMarkets(request, { abort: abortSignal }),
      (response: InjectiveSpotExchangeRpcPb.StreamMarketsResponse) => {
        callback(response)
      },
      onEndCallback,
      onStatusCallback,
      { signal },
    )
  }

  /**
   * Stream spot orderbook V2
   * @param params - Stream parameters
   * @param params.marketIds - Array of market IDs to stream orderbook for
   * @param params.callback - Called for each orderbook update
   * @param params.onEndCallback - Called when stream ends normally
   * @param params.onStatusCallback - Called on stream errors
   * @param params.signal - Optional signal that cancels the stream
   * @returns Subscription object with unsubscribe method
   */
  streamOrderbooksV2({
    marketIds,
    callback,
    onEndCallback,
    onStatusCallback,
    signal,
  }: {
    marketIds: string[]
    callback: SpotOrderbookV2StreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
    signal?: AbortSignal
  }): LegacyStreamSubscription {
    // Input validation
    if (!marketIds || marketIds.length === 0) {
      throw new Error('marketIds is required and cannot be empty')
    }
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = InjectiveSpotExchangeRpcPb.StreamOrderbookV2Request.create()

    request.marketIds = marketIds

    return createStreamSubscription(
      (abortSignal) =>
        this.client.streamOrderbookV2(request, { abort: abortSignal }),
      (response: InjectiveSpotExchangeRpcPb.StreamOrderbookV2Response) => {
        callback(
          IndexerSpotStreamTransformer.orderbookV2StreamCallback(response),
        )
      },
      onEndCallback,
      onStatusCallback,
      { signal },
    )
  }

  /**
   * Stream spot orderbook updates
   * @param params - Stream parameters
   * @param params.marketIds - Array of market IDs to stream orderbook updates for
   * @param params.callback - Called for each orderbook update
   * @param params.onEndCallback - Called when stream ends normally
   * @param params.onStatusCallback - Called on stream errors
   * @param params.signal - Optional signal that cancels the stream
   * @returns Subscription object with unsubscribe method
   */
  streamOrderbookUpdates({
    marketIds,
    callback,
    onEndCallback,
    onStatusCallback,
    signal,
  }: {
    marketIds: string[]
    callback: SpotOrderbookUpdateStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
    signal?: AbortSignal
  }): LegacyStreamSubscription {
    // Input validation
    if (!marketIds || marketIds.length === 0) {
      throw new Error('marketIds is required and cannot be empty')
    }
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request =
      InjectiveSpotExchangeRpcPb.StreamOrderbookUpdateRequest.create()

    request.marketIds = marketIds

    return createStreamSubscription(
      (abortSignal) =>
        this.client.streamOrderbookUpdate(request, { abort: abortSignal }),
      (response: InjectiveSpotExchangeRpcPb.StreamOrderbookUpdateResponse) => {
        callback(
          IndexerSpotStreamTransformer.orderbookUpdateStreamCallback(response),
        )
      },
      onEndCallback,
      onStatusCallback,
      { signal },
    )
  }
}
