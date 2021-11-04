import {
  StreamTradesRequest,
  StreamTradesResponse,
} from '@injectivelabs/exchange-api/injective_derivative_exchange_rpc_pb'
import { InjectiveDerivativeExchangeRPCClient } from '@injectivelabs/exchange-api/injective_derivative_exchange_rpc_pb_service'
import { StreamOperation, TradeExecutionSide } from '@injectivelabs/ts-types'
import { DerivativeTransformer } from '../../transformers/DerivativeTransformer'
import { DerivativeTrade, StreamStatusResponse } from '../../types'

export type TradeStreamCallback = ({
  trade,
  operation,
  timestamp,
}: {
  trade: DerivativeTrade | undefined
  operation: StreamOperation
  timestamp: number
}) => void

const transformer = (response: StreamTradesResponse) => {
  const trade = response.getTrade()

  return {
    trade: trade ? DerivativeTransformer.grpcTradeToTrade(trade) : undefined,
    operation: response.getOperationType() as StreamOperation,
    timestamp: response.getTimestamp(),
  }
}

export class TradeStream {
  protected client: InjectiveDerivativeExchangeRPCClient

  protected endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
    this.client = new InjectiveDerivativeExchangeRPCClient(endpoint)
  }

  start({
    marketId,
    callback,
    executionSide,
    onEndCallback,
    skip = 0,
    onStatusCallback,
  }: {
    marketId: string
    skip?: number
    executionSide?: TradeExecutionSide
    callback: TradeStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = new StreamTradesRequest()
    request.setMarketId(marketId)

    if (executionSide) {
      request.setExecutionSide(executionSide)
    }

    request.setSkip(skip)

    const stream = this.client.streamTrades(request)

    stream.on('data', (response: StreamTradesResponse) => {
      callback(transformer(response))
    })

    if (onEndCallback) {
      stream.on('end', onEndCallback)
    }

    if (onStatusCallback) {
      stream.on('status', onStatusCallback)
    }

    return stream
  }

  subaccount({
    marketId,
    subaccountId,
    callback,
    skip = 0,
    executionSide,
    onEndCallback,
    onStatusCallback,
  }: {
    marketId: string
    skip?: number
    subaccountId: string
    executionSide?: TradeExecutionSide
    callback: TradeStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = new StreamTradesRequest()
    request.setMarketId(marketId)
    request.setSubaccountId(subaccountId)

    if (executionSide) {
      request.setExecutionSide(executionSide)
    }

    request.setSkip(skip)

    const stream = this.client.streamTrades(request)

    stream.on('data', (response: StreamTradesResponse) => {
      callback(transformer(response))
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
