import {
  StreamOrderbookRequest,
  StreamOrderbookResponse,
} from '@injectivelabs/exchange-api/injective_derivative_exchange_rpc_pb'
import { InjectiveDerivativeExchangeRPCClient } from '@injectivelabs/exchange-api/injective_derivative_exchange_rpc_pb_service'
import { StreamOperation } from '@injectivelabs/ts-types'
import { Orderbook, StreamStatusResponse } from '../../types'
import { DerivativeTransformer } from '../../transformers/DerivativeTransformer'

export type OrderbookStreamCallback = ({
  orderbook,
  operation,
  timestamp,
}: {
  orderbook: Orderbook | undefined
  marketId: string
  operation: StreamOperation
  timestamp: number
}) => void

const transformer = (response: StreamOrderbookResponse) => {
  const orderbook = response.getOrderbook()

  return {
    orderbook: orderbook
      ? DerivativeTransformer.grpcOrderbookToOrderbook({
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
  protected client: InjectiveDerivativeExchangeRPCClient

  protected endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
    this.client = new InjectiveDerivativeExchangeRPCClient(endpoint)
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
