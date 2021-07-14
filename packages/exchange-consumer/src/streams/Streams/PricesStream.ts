import {
  StreamPricesRequest,
  StreamPricesResponse,
} from '@injectivelabs/exchange-api/injective_oracle_rpc_pb'
import { InjectiveOracleRPCClient } from '@injectivelabs/exchange-api/injective_oracle_rpc_pb_service'
import { StreamOperation } from '@injectivelabs/ts-types'
import { StreamStatusResponse } from '../../types'

export type PricesStreamCallback = ({
  operation,
  price,
  timestamp,
}: {
  price: string
  operation: StreamOperation
  timestamp: number
}) => void

const transformer = (response: StreamPricesResponse) => ({
  price: response.getPrice(),
  operation: StreamOperation.Update as StreamOperation,
  timestamp: response.getTimestamp(),
})

export class PricesStream {
  protected client: InjectiveOracleRPCClient

  protected endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
    this.client = new InjectiveOracleRPCClient(endpoint)
  }

  start({
    oracleType,
    baseSymbol,
    quoteSymbol,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    oracleType: string
    baseSymbol: string
    quoteSymbol: string
    callback: PricesStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = new StreamPricesRequest()
    request.setBaseSymbol(baseSymbol)
    request.setQuoteSymbol(quoteSymbol)
    request.setOracleType(oracleType)

    const stream = this.client.streamPrices(request)

    stream.on('data', (response: StreamPricesResponse) => {
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
