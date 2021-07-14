import {
  StreamOrderbookRequest,
  StreamOrderbookResponse,
} from '@injectivelabs/exchange-api/injective_derivative_exchange_rpc_pb'
import { InjectiveDerivativeExchangeRPCClient } from '@injectivelabs/exchange-api/injective_derivative_exchange_rpc_pb_service'
import { StreamOperation } from '@injectivelabs/ts-types'
import { Orderbook } from '../../types'
import { DerivativeTransformer } from '../../transformers/DerivativeTransformer'

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
      ? DerivativeTransformer.grpcOrderbookToOrderbook({
          buys: orderbook.getBuysList(),
          sells: orderbook.getSellsList(),
        })
      : undefined,
    operation: response.getOperationType() as StreamOperation,
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
    marketId,
    callback,
    onEndCallback = () => {},
    onStatusCallback = (_status) => {},
  }: {
    marketId: string
    callback: OrderbookStreamCallback
    onEndCallback: () => void
    onStatusCallback: (status: any) => void
  }) {
    const request = new StreamOrderbookRequest()
    request.setMarketId(marketId)

    const stream = this.client.streamOrderbook(request)

    stream.on('data', (response: StreamOrderbookResponse) => {
      callback(transformer(response))
    })
    stream.on('end', onEndCallback)
    stream.on('status', onStatusCallback)

    return stream
  }
}
