import {
  StreamPositionsRequest,
  StreamPositionsResponse,
} from '@injectivelabs/exchange-api/injective_derivative_exchange_rpc_pb'
import { InjectiveDerivativeExchangeRPCClient } from '@injectivelabs/exchange-api/injective_derivative_exchange_rpc_pb_service'
import { DerivativeTransformer } from '../../transformers/DerivativeTransformer'
import { Position, StreamStatusResponse } from '../../types'

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
    onEndCallback,
    onStatusCallback,
  }: {
    marketId: string
    callback: PositionStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = new StreamPositionsRequest()
    request.setMarketId(marketId)

    const stream = this.client.streamPositions(request)

    stream.on('data', (response: StreamPositionsResponse) => {
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
    callback: PositionStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = new StreamPositionsRequest()

    if (marketId) {
      request.setMarketId(marketId)
    }

    request.setSubaccountId(subaccountId)

    const stream = this.client.streamPositions(request)

    stream.on('data', (response: StreamPositionsResponse) => {
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
