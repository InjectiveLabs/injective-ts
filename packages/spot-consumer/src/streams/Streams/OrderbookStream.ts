import {
  StreamOrderbookRequest,
  StreamOrderbookResponse,
} from '@injectivelabs/exchange-api/injective_spot_exchange_rpc_pb'
import { InjectiveSpotExchangeRPCClient } from '@injectivelabs/exchange-api/injective_spot_exchange_rpc_pb_service'
import { StreamOperation } from '@injectivelabs/ts-types'
import { Orderbook, StreamStatusResponse } from '../../types'
import { SpotTransformer } from '../../transformers/SpotTransformer'

export type OrderbookStreamCallback = ({
  orderbook,
  operation,
  timestamp,
  marketId,
}: {
  orderbook: Orderbook | undefined
  operation: StreamOperation
  marketId: string
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
    marketId: response.getMarketId(),
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
    marketIds,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketIds: string[]
    callback: OrderbookStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = new StreamOrderbookRequest()
    request.setMarketIdsList(marketIds)

    const stream = this.client.streamOrderbook(request)

    stream.on('data', (response: StreamOrderbookResponse) => {
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
