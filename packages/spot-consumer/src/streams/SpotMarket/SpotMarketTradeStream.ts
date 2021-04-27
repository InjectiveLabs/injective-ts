import {
  StreamMarketTradesRequest,
  StreamMarketTradesResponse,
} from '@injectivelabs/exchange-api/injective_spot_markets_rpc_pb'
import { InjectiveSpotMarketsRPCClient } from '@injectivelabs/exchange-api/injective_spot_markets_rpc_pb_service'
import { StreamOperation } from '@injectivelabs/ts-types'
import { SpotMarketTransformer } from '../../transformers/SpotMarketTransformer'
import { SpotMarketTrade } from '../../types'

export type SpotMarketTradeStreamCallback = ({
  trade,
  operation,
  timestamp,
}: {
  trade: SpotMarketTrade | undefined
  operation: StreamOperation
  timestamp: number
}) => void

const transformer = (response: StreamMarketTradesResponse) => {
  const trade = response.getTrade()

  return {
    trade: trade ? SpotMarketTransformer.grpcTradeToTrade(trade) : undefined,
    operation: response.getOperationType() as StreamOperation,
    timestamp: response.getTimestamp(),
  }
}

export class SpotMarketTradeStream {
  protected client: InjectiveSpotMarketsRPCClient

  protected endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
    this.client = new InjectiveSpotMarketsRPCClient(endpoint)
  }

  start({
    marketId,
    callback,
  }: {
    marketId: string
    callback: SpotMarketTradeStreamCallback
  }) {
    const request = new StreamMarketTradesRequest()
    request.setMarketId(marketId)

    const stream = this.client.streamMarketTrades(request)

    stream.on('data', (response: StreamMarketTradesResponse) => {
      callback(transformer(response))
    })

    return stream
  }

  subaccount({
    marketId,
    subaccountId,
    callback,
  }: {
    marketId: string
    subaccountId: string
    callback: SpotMarketTradeStreamCallback
  }) {
    const request = new StreamMarketTradesRequest()
    request.setMarketId(marketId)
    request.setSubaccountId(subaccountId)

    const stream = this.client.streamMarketTrades(request)

    stream.on('data', (response: StreamMarketTradesResponse) => {
      callback(transformer(response))
    })

    return stream
  }
}
