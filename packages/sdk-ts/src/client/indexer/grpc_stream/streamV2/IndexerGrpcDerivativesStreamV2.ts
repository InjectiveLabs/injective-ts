import * as InjectiveDerivativeExchangeRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_derivative_exchange_rpc_pb'
import { InjectiveDerivativeExchangeRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_derivative_exchange_rpc_pb.client'
import { createStreamSubscriptionV2 } from './streamHelpersV2.js'
import { GrpcWebRpcTransport } from '../../../base/GrpcWebRpcTransport.js'
import { IndexerDerivativeStreamTransformer } from '../../transformers/index.js'
import type { StreamSubscription } from '../../../../types/index.js'
import type {
  OrderSide,
  OrderState,
  TradeDirection,
  PaginationOption,
  TradeExecutionSide,
  TradeExecutionType,
} from '../../../../types/index.js'

export type DerivativeMarketStreamCallbackV2 = (
  response: InjectiveDerivativeExchangeRpcPb.StreamMarketResponse,
) => void

export type DerivativeOrdersStreamCallbackV2 = (
  response: ReturnType<
    typeof IndexerDerivativeStreamTransformer.ordersStreamCallback
  >,
) => void

export type DerivativeOrderHistoryStreamCallbackV2 = (
  response: ReturnType<
    typeof IndexerDerivativeStreamTransformer.orderHistoryStreamCallback
  >,
) => void

export type DerivativeTradesStreamCallbackV2 = (
  response: ReturnType<
    typeof IndexerDerivativeStreamTransformer.tradesStreamCallback
  >,
) => void

export type DerivativePositionsStreamCallbackV2 = (
  response: ReturnType<
    typeof IndexerDerivativeStreamTransformer.positionStreamCallback
  >,
) => void

export type DerivativePositionsV2StreamCallbackV2 = (
  response: ReturnType<
    typeof IndexerDerivativeStreamTransformer.positionV2StreamCallback
  >,
) => void

export type DerivativeOrderbookV2StreamCallbackV2 = (
  response: ReturnType<
    typeof IndexerDerivativeStreamTransformer.orderbookV2StreamCallback
  >,
) => void

export type DerivativeOrderbookUpdateStreamCallbackV2 = (
  response: ReturnType<
    typeof IndexerDerivativeStreamTransformer.orderbookUpdateStreamCallback
  >,
) => void

export class IndexerGrpcDerivativesStreamV2 {
  private client: InjectiveDerivativeExchangeRPCClient
  private transport: GrpcWebRpcTransport

  constructor(endpoint: string, metadata?: Record<string, string>) {
    this.transport = new GrpcWebRpcTransport(endpoint, metadata)
    this.client = new InjectiveDerivativeExchangeRPCClient(this.transport)
  }

  /**
   * Stream derivative orders
   * @param params.marketId - Optional market ID to filter
   * @param params.subaccountId - Optional subaccount ID to filter
   * @param params.orderSide - Optional order side to filter
   * @param params.callback - Called for each order update
   * @returns StreamSubscription
   */
  streamOrders({
    marketId,
    subaccountId,
    orderSide,
    callback,
  }: {
    marketId?: string
    subaccountId?: string
    orderSide?: OrderSide
    callback: DerivativeOrdersStreamCallbackV2
  }): StreamSubscription {
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

    return createStreamSubscriptionV2(stream, (response) => {
      const transformed =
        IndexerDerivativeStreamTransformer.ordersStreamCallback(response)
      callback(transformed)
    })
  }

  /**
   * Stream derivative order history
   * @param params.subaccountId - Optional subaccount ID to filter
   * @param params.marketId - Optional market ID to filter
   * @param params.orderTypes - Optional order types to filter
   * @param params.direction - Optional direction to filter
   * @param params.state - Optional state to filter
   * @param params.executionTypes - Optional execution types to filter
   * @param params.callback - Called for each order history update
   * @returns StreamSubscription
   */
  streamOrdersHistory({
    subaccountId,
    marketId,
    orderTypes,
    direction,
    state,
    executionTypes,
    callback,
  }: {
    subaccountId?: string
    marketId?: string
    orderTypes?: string[]
    direction?: TradeDirection
    state?: OrderState
    executionTypes?: TradeExecutionType[]
    callback: DerivativeOrderHistoryStreamCallbackV2
  }): StreamSubscription {
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

    return createStreamSubscriptionV2(stream, (response) => {
      const transformed =
        IndexerDerivativeStreamTransformer.orderHistoryStreamCallback(response)
      callback(transformed)
    })
  }

  /**
   * Stream derivative trades
   * @param params.marketId - Optional market ID to filter
   * @param params.marketIds - Optional array of market IDs to filter
   * @param params.subaccountId - Optional subaccount ID to filter
   * @param params.subaccountIds - Optional array of subaccount IDs to filter
   * @param params.executionSide - Optional execution side to filter
   * @param params.direction - Optional direction to filter
   * @param params.pagination - Optional pagination options
   * @param params.callback - Called for each trade update
   * @returns StreamSubscription
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
  }: {
    marketIds?: string[]
    marketId?: string
    subaccountIds?: string[]
    subaccountId?: string
    executionSide?: TradeExecutionSide
    direction?: TradeDirection
    pagination?: PaginationOption
    callback: DerivativeTradesStreamCallbackV2
  }): StreamSubscription {
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

    return createStreamSubscriptionV2(stream, (response) => {
      const transformed =
        IndexerDerivativeStreamTransformer.tradesStreamCallback(response)
      callback(transformed)
    })
  }

  /**
   * Stream derivative positions
   * @param params.marketId - Optional market ID to filter
   * @param params.address - Optional address to filter
   * @param params.subaccountId - Optional subaccount ID to filter
   * @param params.callback - Called for each position update
   * @returns StreamSubscription
   */
  streamPositions({
    marketId,
    address,
    subaccountId,
    callback,
  }: {
    marketId?: string
    address?: string
    subaccountId?: string
    callback: DerivativePositionsStreamCallbackV2
  }): StreamSubscription {
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

    return createStreamSubscriptionV2(stream, (response) => {
      const transformed =
        IndexerDerivativeStreamTransformer.positionStreamCallback(response)
      callback(transformed)
    })
  }

  /**
   * Stream derivative markets
   * @param params.marketIds - Optional array of market IDs to filter
   * @param params.callback - Called for each market update
   * @returns StreamSubscription
   */
  streamMarkets({
    marketIds,
    callback,
  }: {
    marketIds?: string[]
    callback: DerivativeMarketStreamCallbackV2
  }): StreamSubscription {
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request =
      InjectiveDerivativeExchangeRpcPb.StreamMarketRequest.create()

    if (marketIds && marketIds.length) {
      request.marketIds = marketIds
    }

    const stream = this.client.streamMarket(request)

    return createStreamSubscriptionV2(stream, (response) => {
      callback(response)
    })
  }

  /**
   * Stream derivative orderbooks V2
   * @param params.marketIds - Array of market IDs to stream
   * @param params.callback - Called for each orderbook update
   * @returns StreamSubscription
   */
  streamOrderbooksV2({
    marketIds,
    callback,
  }: {
    marketIds: string[]
    callback: DerivativeOrderbookV2StreamCallbackV2
  }): StreamSubscription {
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

    return createStreamSubscriptionV2(stream, (response) => {
      const transformed =
        IndexerDerivativeStreamTransformer.orderbookV2StreamCallback(response)
      callback(transformed)
    })
  }

  /**
   * Stream derivative orderbook updates
   * @param params.marketIds - Array of market IDs to stream
   * @param params.callback - Called for each orderbook update
   * @returns StreamSubscription
   */
  streamOrderbookUpdates({
    marketIds,
    callback,
  }: {
    marketIds: string[]
    callback: DerivativeOrderbookUpdateStreamCallbackV2
  }): StreamSubscription {
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

    return createStreamSubscriptionV2(stream, (response) => {
      const transformed =
        IndexerDerivativeStreamTransformer.orderbookUpdateStreamCallback(
          response,
        )
      callback(transformed)
    })
  }

  /**
   * Stream derivative positions V2
   * @param params.marketId - Optional market ID to filter
   * @param params.address - Optional address to filter
   * @param params.subaccountId - Optional subaccount ID to filter
   * @param params.callback - Called for each position update
   * @returns StreamSubscription
   */
  streamPositionsV2({
    marketId,
    address,
    subaccountId,
    callback,
  }: {
    marketId?: string
    address?: string
    subaccountId?: string
    callback: DerivativePositionsV2StreamCallbackV2
  }): StreamSubscription {
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

    return createStreamSubscriptionV2(stream, (response) => {
      const transformed =
        IndexerDerivativeStreamTransformer.positionV2StreamCallback(response)
      callback(transformed)
    })
  }
}
