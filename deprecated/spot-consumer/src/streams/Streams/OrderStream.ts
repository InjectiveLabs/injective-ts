import {
  StreamOrdersRequest,
  StreamOrdersResponse,
} from '@injectivelabs/exchange-api/injective_spot_exchange_rpc_pb'
import { InjectiveSpotExchangeRPCClient } from '@injectivelabs/exchange-api/injective_spot_exchange_rpc_pb_service'
import { StreamOperation } from '@injectivelabs/ts-types'
import { SpotTransformer } from '../../transformers/SpotTransformer'
import { SpotLimitOrder, StreamStatusResponse } from '../../types'

export type OrderStreamCallback = ({
  order,
  operation,
  timestamp,
}: {
  order: SpotLimitOrder | undefined
  operation: StreamOperation
  timestamp: number
}) => void

const transformer = (response: StreamOrdersResponse) => {
  const order = response.getOrder()

  return {
    order: order ? SpotTransformer.grpcOrderToOrder(order) : undefined,
    operation: response.getOperationType() as StreamOperation,
    timestamp: response.getTimestamp(),
  }
}

export class OrderStream {
  protected client: InjectiveSpotExchangeRPCClient

  protected endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
    this.client = new InjectiveSpotExchangeRPCClient(endpoint)
  }

  start({
    marketId,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketId: string
    callback: OrderStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = new StreamOrdersRequest()
    request.setMarketId(marketId)

    const stream = this.client.streamOrders(request)

    stream.on('data', (response: StreamOrdersResponse) => {
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
    onEndCallback,
    onStatusCallback,
  }: {
    marketId?: string
    subaccountId: string
    callback: OrderStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = new StreamOrdersRequest()

    if (marketId) {
      request.setMarketId(marketId)
    }

    request.setSubaccountId(subaccountId)

    const stream = this.client.streamOrders(request)

    stream.on('data', (response: StreamOrdersResponse) => {
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
