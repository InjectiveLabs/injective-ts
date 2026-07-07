import * as InjectiveSpotExchangeRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_spot_exchange_rpc_pb'
import { InjectiveSpotExchangeRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_spot_exchange_rpc_pb.client'
import { createStreamSubscriptionV2 } from './streamHelpersV2.js'
import { GrpcWebRpcTransport } from '../../../base/GrpcWebRpcTransport.js'
import { IndexerSpotStreamTransformer } from '../../transformers/index.js'
import type { OrderSide } from '../../../../types/index.js'
import type { StreamSubscription } from '../../../../types/index.js'

export type SpotOrderbookUpdateStreamCallbackV2 = (
  response: ReturnType<
    typeof IndexerSpotStreamTransformer.orderbookUpdateStreamCallback
  >,
) => void

export type SpotOrdersStreamCallbackV2 = (
  response: ReturnType<
    typeof IndexerSpotStreamTransformer.ordersStreamCallback
  >,
) => void

export type SpotOrderHistoryStreamCallbackV2 = (
  response: ReturnType<
    typeof IndexerSpotStreamTransformer.orderHistoryStreamCallback
  >,
) => void

export type SpotTradesStreamCallbackV2 = (
  response: ReturnType<
    typeof IndexerSpotStreamTransformer.tradesStreamCallback
  >,
) => void

export class IndexerGrpcSpotStreamV2 {
  private client: InjectiveSpotExchangeRPCClient
  private transport: GrpcWebRpcTransport

  constructor(endpoint: string, metadata?: Record<string, string>) {
    this.transport = new GrpcWebRpcTransport(endpoint, metadata)
    this.client = new InjectiveSpotExchangeRPCClient(this.transport)
  }

  /**
   * Stream spot orderbook updates
   * @param params.marketIds - Array of market IDs to stream
   * @param params.callback - Called for each orderbook update
   * @returns StreamSubscription
   */
  streamOrderbookUpdates({
    marketIds,
    callback,
  }: {
    marketIds: string[]
    callback: SpotOrderbookUpdateStreamCallbackV2
  }): StreamSubscription {
    if (!marketIds || marketIds.length === 0) {
      throw new Error('marketIds is required')
    }
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request =
      InjectiveSpotExchangeRpcPb.StreamOrderbookUpdateRequest.create()
    request.marketIds = marketIds

    return createStreamSubscriptionV2(
      (abortSignal) =>
        this.client.streamOrderbookUpdate(request, { abort: abortSignal }),
      (response) => {
        const transformed =
          IndexerSpotStreamTransformer.orderbookUpdateStreamCallback(response)
        callback(transformed)
      },
    )
  }

  /**
   * Stream spot orders
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
    callback: SpotOrdersStreamCallbackV2
  }): StreamSubscription {
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

    return createStreamSubscriptionV2(
      (abortSignal) =>
        this.client.streamOrders(request, { abort: abortSignal }),
      (response) => {
        const transformed =
          IndexerSpotStreamTransformer.ordersStreamCallback(response)
        callback(transformed)
      },
    )
  }

  /**
   * Stream spot order history
   * @param params.subaccountId - Optional subaccount ID to filter
   * @param params.marketId - Optional market ID to filter
   * @param params.orderTypes - Optional order types to filter
   * @param params.direction - Optional direction to filter
   * @param params.state - Optional state to filter
   * @param params.executionTypes - Optional execution types to filter
   * @param params.callback - Called for each order history update
   * @returns StreamSubscription
   */
  streamOrderHistory({
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
    direction?: string
    state?: string
    executionTypes?: string[]
    callback: SpotOrderHistoryStreamCallbackV2
  }): StreamSubscription {
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

    return createStreamSubscriptionV2(
      (abortSignal) =>
        this.client.streamOrdersHistory(request, { abort: abortSignal }),
      (response) => {
        const transformed =
          IndexerSpotStreamTransformer.orderHistoryStreamCallback(response)
        callback(transformed)
      },
    )
  }

  /**
   * Stream spot trades
   * @param params.marketId - Optional market ID to filter
   * @param params.marketIds - Optional array of market IDs to filter
   * @param params.subaccountId - Optional subaccount ID to filter
   * @param params.subaccountIds - Optional array of subaccount IDs to filter
   * @param params.executionSide - Optional execution side to filter
   * @param params.direction - Optional direction to filter
   * @param params.executionTypes - Optional execution types to filter
   * @param params.callback - Called for each trade update
   * @returns StreamSubscription
   */
  streamTrades({
    marketId,
    marketIds,
    subaccountId,
    subaccountIds,
    executionSide,
    direction,
    executionTypes,
    callback,
  }: {
    marketId?: string
    marketIds?: string[]
    subaccountId?: string
    subaccountIds?: string[]
    executionSide?: string
    direction?: string
    executionTypes?: string[]
    callback: SpotTradesStreamCallbackV2
  }): StreamSubscription {
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = InjectiveSpotExchangeRpcPb.StreamTradesRequest.create()

    if (marketId) {
      request.marketId = marketId
    }

    if (marketIds) {
      request.marketIds = marketIds
    }

    if (subaccountId) {
      request.subaccountId = subaccountId
    }

    if (subaccountIds) {
      request.subaccountIds = subaccountIds
    }

    if (executionSide) {
      request.executionSide = executionSide
    }

    if (direction) {
      request.direction = direction
    }

    if (executionTypes) {
      request.executionTypes = executionTypes
    }

    return createStreamSubscriptionV2(
      (abortSignal) =>
        this.client.streamTrades(request, { abort: abortSignal }),
      (response) => {
        const transformed =
          IndexerSpotStreamTransformer.tradesStreamCallback(response)
        callback(transformed)
      },
    )
  }
}
