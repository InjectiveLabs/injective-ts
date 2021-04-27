import {
  StreamMarketOrderbookRequest,
  StreamMarketOrderbookResponse,
} from '@injectivelabs/exchange-api/injective_spot_markets_rpc_pb'
import { InjectiveSpotMarketsRPCClient } from '@injectivelabs/exchange-api/injective_spot_markets_rpc_pb_service'
import { StreamOperation } from '@injectivelabs/ts-types'
import { Orderbook } from '../../types'
import { SpotMarketTransformer } from '../../transformers/SpotMarketTransformer'

export type SpotMarketOrderbookStreamCallback = ({
  orderbook,
  operation,
  timestamp,
}: {
  orderbook: Orderbook | undefined
  operation: StreamOperation
  timestamp: number
}) => void

const transformer = (response: StreamMarketOrderbookResponse) => {
  const orderbook = response.getOrderbook()

  return {
    orderbook: orderbook
      ? SpotMarketTransformer.grpcOrderbookToOrderbook({
          buys: orderbook.getBuysList(),
          sells: orderbook.getSellsList(),
        })
      : undefined,
    operation: response.getOperationType() as StreamOperation,
    timestamp: response.getTimestamp(),
  }
}

export class SpotMarketOrderbookStream {
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
    callback: SpotMarketOrderbookStreamCallback
  }) {
    const request = new StreamMarketOrderbookRequest()
    request.setMarketId(marketId)

    const stream = this.client.streamMarketOrderbook(request)

    stream.on('data', (response: StreamMarketOrderbookResponse) => {
      callback(transformer(response))
    })

    return stream
  }
}
