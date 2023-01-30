import {
  StreamOrderbookRequest,
  StreamOrderbookResponse,
  StreamOrderbookV2Request,
  StreamOrderbookV2Response,
  StreamOrdersRequest,
  StreamOrdersResponse,
  StreamTradesRequest,
  StreamTradesResponse,
  StreamPositionsRequest,
  StreamPositionsResponse,
  StreamMarketRequest,
  StreamMarketResponse,
  StreamOrdersHistoryRequest,
  StreamOrdersHistoryResponse,
} from '@injectivelabs/indexer-api/injective_derivative_exchange_rpc_pb'
import { InjectiveDerivativeExchangeRPCClient } from '@injectivelabs/indexer-api/injective_derivative_exchange_rpc_pb_service'
import {
  TradeDirection,
  TradeExecutionSide,
  TradeExecutionType,
} from '../../../types'
import { StreamStatusResponse } from '../types'
import { PaginationOption } from '../../../types/pagination'
import { DerivativeOrderSide, DerivativeOrderState } from '../types/derivatives'
import { IndexerDerivativeStreamTransformer } from '../transformers'
import { getGrpcTransport } from '../../../utils/grpc'

export type DerivativeOrderbookStreamCallback = (
  response: ReturnType<
    typeof IndexerDerivativeStreamTransformer.orderbookStreamCallback
  >,
) => void

export type DerivativeOrderbookV2StreamCallback = (
  response: ReturnType<
    typeof IndexerDerivativeStreamTransformer.orderbookV2StreamCallback
  >,
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

export type PositionsStreamCallback = (
  response: ReturnType<
    typeof IndexerDerivativeStreamTransformer.positionStreamCallback
  >,
) => void

export type MarketStreamCallback = (response: StreamMarketResponse) => void

/**
 * @category Indexer Grpc Stream
 */
export class IndexerGrpcDerivativesStream {
  protected client: InjectiveDerivativeExchangeRPCClient

  constructor(endpoint: string) {
    this.client = new InjectiveDerivativeExchangeRPCClient(endpoint, {
      transport: getGrpcTransport(),
    })
  }

  streamDerivativeOrderbook({
    marketIds,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketIds: string[]
    callback: DerivativeOrderbookStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = new StreamOrderbookRequest()
    request.setMarketIdsList(marketIds)

    const stream = this.client.streamOrderbook(request)

    stream.on('data', (response: StreamOrderbookResponse) => {
      callback(
        IndexerDerivativeStreamTransformer.orderbookStreamCallback(response),
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

  streamDerivativeOrders({
    marketId,
    subaccountId,
    orderSide,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketId?: string
    subaccountId?: string
    orderSide?: DerivativeOrderSide
    callback: DerivativeOrdersStreamCallback
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
      callback(
        IndexerDerivativeStreamTransformer.ordersStreamCallback(response),
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

  streamDerivativeOrderHistory({
    subaccountId,
    marketId,
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
    orderTypes?: DerivativeOrderSide[]
    executionTypes?: TradeExecutionType[]
    direction?: TradeDirection
    state?: DerivativeOrderState
    callback: DerivativeOrderHistoryStreamCallback
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
        IndexerDerivativeStreamTransformer.orderHistoryStreamCallback(response),
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

  streamDerivativeTrades({
    marketIds,
    marketId,
    subaccountIds,
    subaccountId,
    callback,
    pagination,
    executionSide,
    direction,
    onEndCallback,
    onStatusCallback,
  }: {
    marketIds?: string[]
    marketId?: string
    subaccountIds?: string[]
    subaccountId?: string
    pagination?: PaginationOption
    executionSide?: TradeExecutionSide
    direction?: TradeDirection
    callback: DerivativeTradesStreamCallback
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
      callback(
        IndexerDerivativeStreamTransformer.tradesStreamCallback(response),
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

  streamDerivativePositions({
    marketId,
    subaccountId,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketId?: string
    subaccountId?: string
    callback: PositionsStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = new StreamPositionsRequest()

    if (marketId) {
      request.setMarketId(marketId)
    }

    if (subaccountId) {
      request.setSubaccountId(subaccountId)
    }

    const stream = this.client.streamPositions(request)

    stream.on('data', (response: StreamPositionsResponse) => {
      callback(
        IndexerDerivativeStreamTransformer.positionStreamCallback(response),
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

  streamDerivativeMarket({
    marketIds,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketIds?: string[]
    callback: MarketStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = new StreamMarketRequest()

    if (marketIds) {
      request.setMarketIdsList(marketIds)
    }

    const stream = this.client.streamMarket(request)

    stream.on('data', (response: StreamMarketResponse) => {
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

  streamDerivativeOrderbookV2({
    marketIds,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketIds: string[]
    callback: DerivativeOrderbookV2StreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = new StreamOrderbookV2Request()
    request.setMarketIdsList(marketIds)

    const stream = this.client.streamOrderbookV2(request)

    stream.on('data', (response: StreamOrderbookV2Response) => {
      callback(
        IndexerDerivativeStreamTransformer.orderbookV2StreamCallback(response),
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
}
