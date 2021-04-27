import {
  StreamMarketOrdersRequest,
  StreamMarketOrdersResponse,
} from '@injectivelabs/exchange-api/injective_spot_markets_rpc_pb'
import { InjectiveSpotMarketsRPCClient } from '@injectivelabs/exchange-api/injective_spot_markets_rpc_pb_service'
import { StreamOperation } from '@injectivelabs/ts-types'
import { SpotMarketTransformer } from '../../transformers/SpotMarketTransformer'
import { SpotMarketOrder } from '../../types'

export type SpotMarketOrderStreamCallback = ({
  order,
  operation,
  timestamp,
}: {
  order: SpotMarketOrder | undefined
  operation: StreamOperation
  timestamp: number
}) => void

const transformer = (response: StreamMarketOrdersResponse) => {
  const order = response.getOrder()

  return {
    order: order ? SpotMarketTransformer.grpcOrderToOrder(order) : undefined,
    operation: response.getOperationType() as StreamOperation,
    timestamp: response.getTimestamp(),
  }
}

export class SpotMarketOrderStream {
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
    callback: SpotMarketOrderStreamCallback
  }) {
    const request = new StreamMarketOrdersRequest()
    request.setMarketId(marketId)

    const stream = this.client.streamMarketOrders(request)

    stream.on('data', (response: StreamMarketOrdersResponse) => {
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
    callback: SpotMarketOrderStreamCallback
  }) {
    const request = new StreamMarketOrdersRequest()
    request.setMarketId(marketId)
    request.setSubaccountId(subaccountId)

    const stream = this.client.streamMarketOrders(request)

    stream.on('data', (response: StreamMarketOrdersResponse) => {
      callback(transformer(response))
    })

    return stream
  }
}
