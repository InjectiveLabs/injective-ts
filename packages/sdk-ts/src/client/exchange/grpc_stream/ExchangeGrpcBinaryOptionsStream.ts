import {
  StreamOrderbookRequest,
  StreamOrderbookResponse,
  StreamOrdersRequest,
  StreamOrdersResponse,
  StreamTradesRequest,
  StreamTradesResponse,
  StreamPositionsRequest,
  StreamPositionsResponse,
  StreamMarketRequest,
  StreamMarketResponse,
} from '@injectivelabs/exchange-api/injective_derivative_exchange_rpc_pb'
import { InjectiveDerivativeExchangeRPCClient as InjectiveBinaryOptionsExchangeRPCClient } from '@injectivelabs/exchange-api/injective_derivative_exchange_rpc_pb_service'
import { TradeDirection, TradeExecutionSide } from '../../../types'
import { StreamStatusResponse } from '../types'
import { isServerSide } from '../../../utils/helpers'
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport'
import { PaginationOption } from '../../../types/pagination'
import { BinaryOptionsOrderSide } from '../types/binary-options'
import { BinaryOptionsStreamTransformer } from '../transformers'

export type BinaryOptionsOrderbookStreamCallback = (
  response: ReturnType<
    typeof BinaryOptionsStreamTransformer.orderbookStreamCallback
  >,
) => void

export type BinaryOptionsOrdersStreamCallback = (
  response: ReturnType<
    typeof BinaryOptionsStreamTransformer.ordersStreamCallback
  >,
) => void

export type BinaryOptionsTradesStreamCallback = (
  response: ReturnType<
    typeof BinaryOptionsStreamTransformer.tradesStreamCallback
  >,
) => void

export type BinaryOptionsPositionsStreamCallback = (
  response: ReturnType<
    typeof BinaryOptionsStreamTransformer.positionStreamCallback
  >,
) => void

export type BinaryOptionMarketStreamCallback = (
  response: StreamMarketResponse,
) => void

export class ExchangeGrpcBinaryOptionsStream {
  protected client: InjectiveBinaryOptionsExchangeRPCClient

  constructor(endpoint: string) {
    this.client = new InjectiveBinaryOptionsExchangeRPCClient(endpoint, {
      transport: isServerSide() ? NodeHttpTransport() : undefined,
    })
  }

  streamBinaryOptionsOrderbook({
    marketIds,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketIds: string[]
    callback: BinaryOptionsOrderbookStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = new StreamOrderbookRequest()
    request.setMarketIdsList(marketIds)

    const stream = this.client.streamOrderbook(request)

    stream.on('data', (response: StreamOrderbookResponse) => {
      callback(BinaryOptionsStreamTransformer.orderbookStreamCallback(response))
    })

    if (onEndCallback) {
      stream.on('end', onEndCallback)
    }

    if (onStatusCallback) {
      stream.on('status', onStatusCallback)
    }

    return stream
  }

  streamBinaryOptionsOrders({
    marketId,
    subaccountId,
    orderSide,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketId?: string
    subaccountId?: string
    orderSide?: BinaryOptionsOrderSide
    callback: BinaryOptionsOrdersStreamCallback
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
      callback(BinaryOptionsStreamTransformer.ordersStreamCallback(response))
    })

    if (onEndCallback) {
      stream.on('end', onEndCallback)
    }

    if (onStatusCallback) {
      stream.on('status', onStatusCallback)
    }

    return stream
  }

  streamBinaryOptionsTrades({
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
    callback: BinaryOptionsTradesStreamCallback
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
      callback(BinaryOptionsStreamTransformer.tradesStreamCallback(response))
    })

    if (onEndCallback) {
      stream.on('end', onEndCallback)
    }

    if (onStatusCallback) {
      stream.on('status', onStatusCallback)
    }

    return stream
  }

  streamBinaryOptionsPositions({
    marketId,
    subaccountId,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketId?: string
    subaccountId?: string
    callback: BinaryOptionsPositionsStreamCallback
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
      callback(BinaryOptionsStreamTransformer.positionStreamCallback(response))
    })

    if (onEndCallback) {
      stream.on('end', onEndCallback)
    }

    if (onStatusCallback) {
      stream.on('status', onStatusCallback)
    }

    return stream
  }

  streamBinaryOptionsMarket({
    marketIds,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketIds?: string[]
    callback: BinaryOptionMarketStreamCallback
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
}
