import {
  StreamTradesRequest,
  StreamTradesResponse,
} from '@injectivelabs/exchange-api/injective_spot_exchange_rpc_pb'
import { InjectiveSpotExchangeRPCClient } from '@injectivelabs/exchange-api/injective_spot_exchange_rpc_pb_service'
import { StreamOperation, TradeExecutionSide } from '@injectivelabs/ts-types'
import { SpotTransformer } from '../../transformers/SpotTransformer'
import { SpotTrade } from '../../types'

export type TradeStreamCallback = ({
  trade,
  operation,
  timestamp,
}: {
  trade: SpotTrade | undefined
  operation: StreamOperation
  timestamp: number
}) => void

const transformer = (response: StreamTradesResponse) => {
  const trade = response.getTrade()

  return {
    trade: trade ? SpotTransformer.grpcTradeToTrade(trade) : undefined,
    operation: response.getOperationType() as StreamOperation,
    timestamp: response.getTimestamp(),
  }
}

export class TradeStream {
  protected client: InjectiveSpotExchangeRPCClient

  protected endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
    this.client = new InjectiveSpotExchangeRPCClient(endpoint)
  }

  start({
    marketId,
    callback,
    executionSide,
    onEndCallback = () => {},
    onStatusCallback = (_status) => {},
  }: {
    marketId: string
    executionSide?: TradeExecutionSide
    callback: TradeStreamCallback
    onEndCallback: () => void
    onStatusCallback: (status: any) => void
  }) {
    const request = new StreamTradesRequest()
    request.setMarketId(marketId)

    if (executionSide) {
      request.setExecutionSide(executionSide)
    }

    const stream = this.client.streamTrades(request)

    stream.on('data', (response: StreamTradesResponse) => {
      callback(transformer(response))
    })
    stream.on('end', onEndCallback)
    stream.on('status', onStatusCallback)

    return stream
  }

  subaccount({
    marketId,
    subaccountId,
    callback,
    executionSide,
    onEndCallback = () => {},
    onStatusCallback = (_status) => {},
  }: {
    marketId: string
    subaccountId: string
    executionSide?: TradeExecutionSide
    callback: TradeStreamCallback
    onEndCallback: () => void
    onStatusCallback: (status: any) => void
  }) {
    const request = new StreamTradesRequest()
    request.setMarketId(marketId)
    request.setSubaccountId(subaccountId)

    if (executionSide) {
      request.setExecutionSide(executionSide)
    }

    const stream = this.client.streamTrades(request)

    stream.on('data', (response: StreamTradesResponse) => {
      callback(transformer(response))
    })
    stream.on('end', onEndCallback)
    stream.on('status', onStatusCallback)

    return stream
  }
}
