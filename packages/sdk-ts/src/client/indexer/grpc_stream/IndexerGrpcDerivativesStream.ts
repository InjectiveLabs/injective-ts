import * as InjectiveDerivativeExchangeRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_derivative_exchange_rpc_pb'
import { InjectiveDerivativeExchangeRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_derivative_exchange_rpc_pb.client'
import { createStreamSubscription } from './streamHelpers.js'
import { GrpcWebRpcTransport } from '../../base/GrpcWebRpcTransport.js'
import { IndexerDerivativeStreamTransformer } from '../transformers/index.js'
import type { Subscription } from 'rxjs'
import type { StreamStatusResponse } from '../types/index.js'
import type {
  OrderSide,
  OrderState,
  TradeDirection,
  PaginationOption,
  TradeExecutionSide,
  TradeExecutionType,
} from '../../../types/index.js'

export type DerivativeMarketStreamCallback = (
  response: InjectiveDerivativeExchangeRpcPb.StreamMarketResponse,
) => void

export type DerivativeOrdersStreamCallback = (
  response: ReturnType<
    typeof IndexerDerivativeStreamTransformer.ordersStreamCallback
  >,
) => void

export type DerivativeOrderHistoryStreamCallback = (
  response: ReturnType<
    typeof IndexerDerivativeStreamTransformer.orderHistoryStreamCallback
  >,
) => void

export type DerivativeTradesStreamCallback = (
  response: ReturnType<
    typeof IndexerDerivativeStreamTransformer.tradesStreamCallback
  >,
) => void

export type DerivativePositionsStreamCallback = (
  response: ReturnType<
    typeof IndexerDerivativeStreamTransformer.positionStreamCallback
  >,
) => void

export type DerivativePositionsV2StreamCallback = (
  response: ReturnType<
    typeof IndexerDerivativeStreamTransformer.positionV2StreamCallback
  >,
) => void

export type DerivativeOrderbookV2StreamCallback = (
  response: ReturnType<
    typeof IndexerDerivativeStreamTransformer.orderbookV2StreamCallback
  >,
) => void

export type DerivativeOrderbookUpdateStreamCallback = (
  response: ReturnType<
    typeof IndexerDerivativeStreamTransformer.orderbookUpdateStreamCallback
  >,
) => void

/**
 * @category Indexer Grpc Stream
 * @description Provides streaming access to derivatives market data from Injective Indexer
 */
export class IndexerGrpcDerivativesStream {
  private client: InjectiveDerivativeExchangeRPCClient
  private transport: GrpcWebRpcTransport

  constructor(endpoint: string, metadata?: Record<string, string>) {
    this.transport = new GrpcWebRpcTransport(endpoint, metadata)
    this.client = new InjectiveDerivativeExchangeRPCClient(this.transport)
  }

  /**
   * Stream derivative orders
   * @param params - Stream parameters
   * @param params.marketId - Optional market ID to filter orders
   * @param params.subaccountId - Optional subaccount ID to filter orders
   * @param params.orderSide - Optional order side to filter
   * @param params.callback - Called for each order update
   * @param params.onEndCallback - Called when stream ends normally
   * @param params.onStatusCallback - Called on stream errors
   * @returns Subscription object with unsubscribe method
   */
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
    callback: DerivativeOrdersStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    // Input validation
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request =
      InjectiveDerivativeExchangeRpcPb.StreamOrdersRequest.create()

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

    return createStreamSubscription(
      stream,
      (response: InjectiveDerivativeExchangeRpcPb.StreamOrdersResponse) => {
        callback(
          IndexerDerivativeStreamTransformer.ordersStreamCallback(response),
        )
      },
      onEndCallback,
      onStatusCallback,
    )
  }

  /**
   * Stream derivative order history
   * @param params - Stream parameters
   * @param params.marketId - Optional market ID to filter orders
   * @param params.subaccountId - Optional subaccount ID to filter orders
   * @param params.orderTypes - Optional array of order types to filter
   * @param params.direction - Optional trade direction to filter
   * @param params.state - Optional order state to filter
   * @param params.executionTypes - Optional array of execution types to filter
   * @param params.callback - Called for each order history update
   * @param params.onEndCallback - Called when stream ends normally
   * @param params.onStatusCallback - Called on stream errors
   * @returns Subscription object with unsubscribe method
   */
  streamOrdersHistory({
    marketId,
    subaccountId,
    orderTypes,
    direction,
    state,
    executionTypes,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketId?: string
    subaccountId?: string
    orderTypes?: string[]
    direction?: TradeDirection
    state?: OrderState
    executionTypes?: TradeExecutionType[]
    callback: DerivativeOrderHistoryStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    // Input validation
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request =
      InjectiveDerivativeExchangeRpcPb.StreamOrdersHistoryRequest.create()

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

    const stream = this.client.streamOrdersHistory(request)

    return createStreamSubscription(
      stream,
      (
        response: InjectiveDerivativeExchangeRpcPb.StreamOrdersHistoryResponse,
      ) => {
        callback(
          IndexerDerivativeStreamTransformer.orderHistoryStreamCallback(
            response,
          ),
        )
      },
      onEndCallback,
      onStatusCallback,
    )
  }

  /**
   * Stream derivative trades
   * @param params - Stream parameters
   * @param params.marketIds - Optional array of market IDs to filter trades
   * @param params.marketId - Optional market ID to filter trades
   * @param params.subaccountIds - Optional array of subaccount IDs to filter trades
   * @param params.subaccountId - Optional subaccount ID to filter trades
   * @param params.executionSide - Optional trade execution side to filter
   * @param params.direction - Optional trade direction to filter
   * @param params.pagination - Optional pagination options
   * @param params.callback - Called for each trade update
   * @param params.onEndCallback - Called when stream ends normally
   * @param params.onStatusCallback - Called on stream errors
   * @returns Subscription object with unsubscribe method
   */
  streamTrades({
    marketIds,
    marketId,
    subaccountIds,
    subaccountId,
    executionSide,
    direction,
    pagination,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketIds?: string[]
    marketId?: string
    subaccountIds?: string[]
    subaccountId?: string
    executionSide?: TradeExecutionSide
    direction?: TradeDirection
    pagination?: PaginationOption
    callback: DerivativeTradesStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    // Input validation
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request =
      InjectiveDerivativeExchangeRpcPb.StreamTradesRequest.create()

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

    const stream = this.client.streamTrades(request)

    return createStreamSubscription(
      stream,
      (response: InjectiveDerivativeExchangeRpcPb.StreamTradesResponse) => {
        callback(
          IndexerDerivativeStreamTransformer.tradesStreamCallback(response),
        )
      },
      onEndCallback,
      onStatusCallback,
    )
  }

  /**
   * Stream derivative positions
   * @param params - Stream parameters
   * @param params.marketId - Optional market ID to filter positions
   * @param params.address - Optional account address to filter positions
   * @param params.subaccountId - Optional subaccount ID to filter positions
   * @param params.callback - Called for each position update
   * @param params.onEndCallback - Called when stream ends normally
   * @param params.onStatusCallback - Called on stream errors
   * @returns Subscription object with unsubscribe method
   */
  streamPositions({
    marketId,
    address,
    subaccountId,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketId?: string
    address?: string
    subaccountId?: string
    callback: DerivativePositionsStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    // Input validation
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request =
      InjectiveDerivativeExchangeRpcPb.StreamPositionsRequest.create()

    if (marketId) {
      request.marketId = marketId
    }

    if (address) {
      request.accountAddress = address
    }

    if (subaccountId) {
      request.subaccountId = subaccountId
    }

    const stream = this.client.streamPositions(request)

    return createStreamSubscription(
      stream,
      (response: InjectiveDerivativeExchangeRpcPb.StreamPositionsResponse) => {
        callback(
          IndexerDerivativeStreamTransformer.positionStreamCallback(response),
        )
      },
      onEndCallback,
      onStatusCallback,
    )
  }

  /**
   * Stream derivative markets
   * @param params - Stream parameters
   * @param params.marketIds - Optional array of market IDs to filter
   * @param params.callback - Called for each market update
   * @param params.onEndCallback - Called when stream ends normally
   * @param params.onStatusCallback - Called on stream errors
   * @returns Subscription object with unsubscribe method
   */
  streamMarkets({
    marketIds,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketIds?: string[]
    callback: DerivativeMarketStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    // Input validation
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request =
      InjectiveDerivativeExchangeRpcPb.StreamMarketRequest.create()

    if (marketIds && marketIds.length) {
      request.marketIds = marketIds
    }

    const stream = this.client.streamMarket(request)

    return createStreamSubscription(
      stream,
      (response: InjectiveDerivativeExchangeRpcPb.StreamMarketResponse) => {
        callback(response)
      },
      onEndCallback,
      onStatusCallback,
    )
  }

  /**
   * Stream derivative orderbooks V2
   * @param params - Stream parameters
   * @param params.marketIds - Array of market IDs to stream orderbook for
   * @param params.callback - Called for each orderbook update
   * @param params.onEndCallback - Called when stream ends normally
   * @param params.onStatusCallback - Called on stream errors
   * @returns Subscription object with unsubscribe method
   */
  streamOrderbooksV2({
    marketIds,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketIds: string[]
    callback: DerivativeOrderbookV2StreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    // Input validation
    if (!marketIds || marketIds.length === 0) {
      throw new Error('marketIds is required and cannot be empty')
    }
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request =
      InjectiveDerivativeExchangeRpcPb.StreamOrderbookV2Request.create()
    request.marketIds = marketIds

    const stream = this.client.streamOrderbookV2(request)

    return createStreamSubscription(
      stream,
      (
        response: InjectiveDerivativeExchangeRpcPb.StreamOrderbookV2Response,
      ) => {
        callback(
          IndexerDerivativeStreamTransformer.orderbookV2StreamCallback(
            response,
          ),
        )
      },
      onEndCallback,
      onStatusCallback,
    )
  }

  /**
   * Stream derivative orderbook updates
   * @param params - Stream parameters
   * @param params.marketIds - Array of market IDs to stream orderbook updates for
   * @param params.callback - Called for each orderbook update
   * @param params.onEndCallback - Called when stream ends normally
   * @param params.onStatusCallback - Called on stream errors
   * @returns Subscription object with unsubscribe method
   */
  streamOrderbookUpdates({
    marketIds,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketIds: string[]
    callback: DerivativeOrderbookUpdateStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    // Input validation
    if (!marketIds || marketIds.length === 0) {
      throw new Error('marketIds is required and cannot be empty')
    }
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request =
      InjectiveDerivativeExchangeRpcPb.StreamOrderbookUpdateRequest.create()

    request.marketIds = marketIds

    const stream = this.client.streamOrderbookUpdate(request)

    return createStreamSubscription(
      stream,
      (
        response: InjectiveDerivativeExchangeRpcPb.StreamOrderbookUpdateResponse,
      ) => {
        callback(
          IndexerDerivativeStreamTransformer.orderbookUpdateStreamCallback(
            response,
          ),
        )
      },
      onEndCallback,
      onStatusCallback,
    )
  }

  /**
   * Stream derivative positions V2
   * @param params - Stream parameters
   * @param params.marketId - Optional market ID to filter positions
   * @param params.address - Optional account address to filter positions
   * @param params.subaccountId - Optional subaccount ID to filter positions
   * @param params.callback - Called for each position update
   * @param params.onEndCallback - Called when stream ends normally
   * @param params.onStatusCallback - Called on stream errors
   * @returns Subscription object with unsubscribe method
   */
  streamPositionsV2({
    marketId,
    address,
    subaccountId,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketId?: string
    address?: string
    subaccountId?: string
    callback: DerivativePositionsV2StreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    // Input validation
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request =
      InjectiveDerivativeExchangeRpcPb.StreamPositionsV2Request.create()

    if (marketId) {
      request.marketId = marketId
    }

    if (address) {
      request.accountAddress = address
    }

    if (subaccountId) {
      request.subaccountId = subaccountId
    }

    const stream = this.client.streamPositionsV2(request)

    return createStreamSubscription(
      stream,
      (
        response: InjectiveDerivativeExchangeRpcPb.StreamPositionsV2Response,
      ) => {
        callback(
          IndexerDerivativeStreamTransformer.positionV2StreamCallback(response),
        )
      },
      onEndCallback,
      onStatusCallback,
    )
  }
}
