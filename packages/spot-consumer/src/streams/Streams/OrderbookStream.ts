import {
  StreamOrderbookRequest,
  StreamOrderbookResponse,
} from '@injectivelabs/exchange-api/injective_spot_exchange_rpc_pb'
import { InjectiveSpotExchangeRPCClient } from '@injectivelabs/exchange-api/injective_spot_exchange_rpc_pb_service'
import { StreamOperation } from '@injectivelabs/ts-types'
import { Orderbook } from '../../types'
import { SpotTransformer } from '../../transformers/SpotTransformer'

export type OrderbookStreamCallback = ({
  orderbook,
  operation,
  timestamp,
}: {
  orderbook: Orderbook | undefined
  operation: StreamOperation
  timestamp: number
}) => void

const transformer = (response: StreamOrderbookResponse) => {
  const orderbook = response.getOrderbook()

  return {
    orderbook: orderbook
      ? SpotTransformer.grpcOrderbookToOrderbook({
          buys: orderbook.getBuysList(),
          sells: orderbook.getSellsList(),
        })
      : undefined,
    operation: response.getOperationType() as StreamOperation,
    timestamp: response.getTimestamp(),
  }
}

export class OrderbookStream {
  protected client: InjectiveSpotExchangeRPCClient

  protected endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
    this.client = new InjectiveSpotExchangeRPCClient(endpoint)
  }

  start({
    marketId,
    callback,
  }: {
    marketId: string
    callback: OrderbookStreamCallback
  }) {
    const request = new StreamOrderbookRequest()
    request.setMarketId(marketId)

    const stream = this.client.streamOrderbook(request)

    stream.on('data', (response: StreamOrderbookResponse) => {
      callback(transformer(response))
    })

    return stream
  }
}
