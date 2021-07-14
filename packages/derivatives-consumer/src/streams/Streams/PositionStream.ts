import {
  StreamPositionsRequest,
  StreamPositionsResponse,
} from '@injectivelabs/exchange-api/injective_derivative_exchange_rpc_pb'
import { InjectiveDerivativeExchangeRPCClient } from '@injectivelabs/exchange-api/injective_derivative_exchange_rpc_pb_service'
import { DerivativeTransformer } from '../../transformers/DerivativeTransformer'
import { Position } from '../../types'

export type PositionStreamCallback = ({
  position,
  timestamp,
}: {
  position: Position | undefined
  timestamp: number
}) => void

const transformer = (response: StreamPositionsResponse) => {
  const position = response.getPosition()

  return {
    position: position
      ? DerivativeTransformer.grpcPositionToPosition(position)
      : undefined,
    timestamp: response.getTimestamp(),
  }
}

export class PositionStream {
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
    callback: PositionStreamCallback
    onEndCallback: () => void
    onStatusCallback: (status: any) => void
  }) {
    const request = new StreamPositionsRequest()
    request.setMarketId(marketId)

    const stream = this.client.streamPositions(request)

    stream.on('data', (response: StreamPositionsResponse) => {
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
    onEndCallback = () => {},
    onStatusCallback = (_status) => {},
  }: {
    marketId: string
    subaccountId: string
    callback: PositionStreamCallback
    onEndCallback: () => void
    onStatusCallback: (status: any) => void
  }) {
    const request = new StreamPositionsRequest()
    request.setMarketId(marketId)
    request.setSubaccountId(subaccountId)

    const stream = this.client.streamPositions(request)

    stream.on('data', (response: StreamPositionsResponse) => {
      callback(transformer(response))
    })
    stream.on('end', onEndCallback)
    stream.on('status', onStatusCallback)

    return stream
  }
}
