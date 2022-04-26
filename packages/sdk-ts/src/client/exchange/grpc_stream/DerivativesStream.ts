import {
  StreamOrderbookRequest,
  StreamOrderbookResponse,
  StreamOrdersRequest,
  StreamOrdersResponse,
  StreamTradesRequest,
  StreamTradesResponse,
  StreamPositionsRequest,
  StreamPositionsResponse,
} from '@injectivelabs/exchange-api/injective_derivative_exchange_rpc_pb'
import { InjectiveDerivativeExchangeRPCClient } from '@injectivelabs/exchange-api/injective_derivative_exchange_rpc_pb_service'
import { TradeExecutionSide } from '../../../types'
import { StreamStatusResponse } from '../types'

export type DerivativeOrderbookStreamCallback = (
  response: StreamOrderbookResponse,
) => void

export type DerivativeOrdersStreamCallback = (
  response: StreamOrdersResponse,
) => void

export type DerivativeTradesStreamCallback = (
  response: StreamTradesResponse,
) => void

export type PositionsStreamCallback = (
  response: StreamPositionsResponse,
) => void

export class DerivativesStream {
  protected client: InjectiveDerivativeExchangeRPCClient

  constructor(endpoint: string) {
    this.client = new InjectiveDerivativeExchangeRPCClient(endpoint)
  }

  orderbook({
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

  orders({
    marketId,
    subaccountId,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketId?: string
    subaccountId?: string
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

  trades({
    marketId,
    subaccountId,
    callback,
    skip = 0,
    executionSide,
    onEndCallback,
    onStatusCallback,
  }: {
    marketId?: string
    subaccountId?: string
    skip?: number
    executionSide?: TradeExecutionSide
    callback: DerivativeTradesStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = new StreamTradesRequest()

    if (marketId) {
      request.setMarketId(marketId)
    }

    if (subaccountId) {
      request.setSubaccountId(subaccountId)
    }

    if (executionSide) {
      request.setExecutionSide(executionSide)
    }

    if (skip !== undefined) {
      request.setSkip(skip)
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

  positions({
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
