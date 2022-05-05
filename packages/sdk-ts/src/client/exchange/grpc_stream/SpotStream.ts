import {
  StreamOrderbookRequest,
  StreamOrderbookResponse,
  StreamOrdersRequest,
  StreamOrdersResponse,
  StreamTradesRequest,
  StreamTradesResponse,
  StreamMarketsRequest,
  StreamMarketsResponse,
} from '@injectivelabs/exchange-api/injective_spot_exchange_rpc_pb'
import { InjectiveSpotExchangeRPCClient } from '@injectivelabs/exchange-api/injective_spot_exchange_rpc_pb_service'
import { TradeExecutionSide, TradeDirection, SpotOrderSide } from '../../../types'
import { StreamStatusResponse } from '../types'
import { isServerSide } from '../../../utils/helpers'
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport'

export type SpotOrderbookStreamCallback = (
  response: StreamOrderbookResponse,
) => void

export type MarketsStreamCallback = (
  response: StreamMarketsResponse,
) => void

export type SpotOrdersStreamCallback = (response: StreamOrdersResponse) => void

export type SpotTradesStreamCallback = (response: StreamTradesResponse) => void

export class SpotStream {
  protected client: InjectiveSpotExchangeRPCClient

  constructor(endpoint: string) {
    this.client = new InjectiveSpotExchangeRPCClient(endpoint, {
      transport: isServerSide() ? NodeHttpTransport() : undefined,
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

  streamSpotTrades({
    marketIds,
    marketId,
    subaccountIds,
    subaccountId,
    skip = 0,
    limit = 0,
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
    skip?: number
    limit?: number
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

    if (skip !== undefined) {
      request.setSkip(skip)
    }

    if (limit !== undefined) {
      request.setLimit(limit)
    }

    const stream = this.client.streamTrades(request)

    stream.on('data', (response: StreamTradesResponse) => {
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

  streamSpotMarket({
    marketIds,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketIds?: string[],
    callback: MarketsStreamCallback,
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
}
