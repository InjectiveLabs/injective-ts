import {
  StreamOrderbookRequest,
  StreamOrderbookResponse,
  StreamOrderbookV2Request,
  StreamOrderbookV2Response,
  StreamOrdersRequest,
  StreamOrdersResponse,
  StreamTradesRequest,
  StreamTradesResponse,
  StreamMarketsRequest,
  StreamMarketsResponse,
  StreamOrdersHistoryRequest,
  StreamOrdersHistoryResponse,
} from '@injectivelabs/indexer-api/injective_spot_exchange_rpc_pb'
import { InjectiveSpotExchangeRPCClient } from '@injectivelabs/indexer-api/injective_spot_exchange_rpc_pb_service'
import {
  TradeExecutionSide,
  TradeDirection,
  TradeExecutionType,
} from '../../../types'
import { StreamStatusResponse } from '../types'
import { PaginationOption } from '../../../types/pagination'
import { SpotOrderSide, SpotOrderState } from '../types/spot'
import { IndexerSpotStreamTransformer } from '../transformers'
import { getGrpcTransport } from '../../../utils/grpc'

export type MarketsStreamCallback = (response: StreamMarketsResponse) => void

export type SpotOrderbookStreamCallback = (
  response: ReturnType<
    typeof IndexerSpotStreamTransformer.orderbookStreamCallback
  >,
) => void

export type SpotOrderbookV2StreamCallback = (
  response: ReturnType<
    typeof IndexerSpotStreamTransformer.orderbookV2StreamCallback
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

  constructor(endpoint: string) {
    this.client = new InjectiveSpotExchangeRPCClient(endpoint, {
      transport: getGrpcTransport(),
    })
  }

  streamSpotOrderbook({
    marketIds,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketIds: string[]
    callback: SpotOrderbookStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = new StreamOrderbookRequest()
    request.setMarketIdsList(marketIds)

    const stream = this.client.streamOrderbook(request)

    stream.on('data', (response: StreamOrderbookResponse) => {
      callback(IndexerSpotStreamTransformer.orderbookStreamCallback(response))
    })

    if (onEndCallback) {
      stream.on('end', onEndCallback)
    }

    if (onStatusCallback) {
      stream.on('status', onStatusCallback)
    }

    return stream
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
    orderSide?: SpotOrderSide
    callback: SpotOrdersStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = new StreamOrdersRequest()

    if (marketId) {
      request.setMarketId(marketId)
    }

    if (subaccountId) {
      request.setSubaccountId(subaccountId)
    }

    if (orderSide) {
      request.setOrderSide(orderSide)
    }

    const stream = this.client.streamOrders(request)

    stream.on('data', (response: StreamOrdersResponse) => {
      callback(IndexerSpotStreamTransformer.ordersStreamCallback(response))
    })

    if (onEndCallback) {
      stream.on('end', onEndCallback)
    }

    if (onStatusCallback) {
      stream.on('status', onStatusCallback)
    }

    return stream
  }

  streamSpotOrderHistory({
    marketId,
    subaccountId,
    orderTypes,
    executionTypes,
    direction,
    state,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketId?: string
    subaccountId?: string
    orderTypes?: SpotOrderSide[]
    executionTypes?: TradeExecutionType[]
    direction?: TradeDirection
    state?: SpotOrderState
    callback: SpotOrderHistoryStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = new StreamOrdersHistoryRequest()

    if (subaccountId) {
      request.setSubaccountId(subaccountId)
    }

    if (marketId) {
      request.setMarketId(marketId)
    }

    if (orderTypes) {
      request.setOrderTypesList(orderTypes)
    }

    if (direction) {
      request.setDirection(direction)
    }

    if (state) {
      request.setState(state)
    }

    if (executionTypes) {
      request.setExecutionTypesList(executionTypes)
    }

    const stream = this.client.streamOrdersHistory(request)

    stream.on('data', (response: StreamOrdersHistoryResponse) => {
      callback(
        IndexerSpotStreamTransformer.orderHistoryStreamCallback(response),
      )
    })

    if (onEndCallback) {
      stream.on('end', onEndCallback)
    }

    if (onStatusCallback) {
      stream.on('status', onStatusCallback)
    }

    return stream
  }

  streamSpotTrades({
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
  }) {
    const request = new StreamTradesRequest()

    if (marketIds) {
      request.setMarketIdsList(marketIds)
    }

    if (marketId) {
      request.setMarketId(marketId)
    }

    if (subaccountIds) {
      request.setSubaccountIdsList(subaccountIds)
    }

    if (subaccountId) {
      request.setSubaccountId(subaccountId)
    }

    if (executionSide) {
      request.setExecutionSide(executionSide)
    }

    if (direction) {
      request.setDirection(direction)
    }

    if (pagination) {
      if (pagination.skip !== undefined) {
        request.setSkip(pagination.skip)
      }

      if (pagination.limit !== undefined) {
        request.setLimit(pagination.limit)
      }
    }

    const stream = this.client.streamTrades(request)

    stream.on('data', (response: StreamTradesResponse) => {
      callback(IndexerSpotStreamTransformer.tradesStreamCallback(response))
    })

    if (onEndCallback) {
      stream.on('end', onEndCallback)
    }

    if (onStatusCallback) {
      stream.on('status', onStatusCallback)
    }

    return stream
  }

  streamSpotMarket({
    marketIds,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketIds?: string[]
    callback: MarketsStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = new StreamMarketsRequest()

    if (marketIds) {
      request.setMarketIdsList(marketIds)
    }

    const stream = this.client.streamMarkets(request)

    stream.on('data', (response: StreamMarketsResponse) => {
      callback(response)
    })

    if (onEndCallback) {
      stream.on('end', onEndCallback)
    }

    if (onStatusCallback) {
      stream.on('status', onStatusCallback)
    }

    return stream
  }

  streamSpotOrderbookV2({
    marketIds,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketIds: string[]
    callback: SpotOrderbookV2StreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = new StreamOrderbookV2Request()
    request.setMarketIdsList(marketIds)

    const stream = this.client.streamOrderbookV2(request)

    stream.on('data', (response: StreamOrderbookV2Response) => {
      callback(IndexerSpotStreamTransformer.orderbookV2StreamCallback(response))
    })

    if (onEndCallback) {
      stream.on('end', onEndCallback)
    }

    if (onStatusCallback) {
      stream.on('status', onStatusCallback)
    }

    return stream
  }
}
