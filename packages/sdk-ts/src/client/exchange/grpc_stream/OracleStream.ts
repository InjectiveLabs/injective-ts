import {
  StreamPricesRequest,
  StreamPricesResponse,
} from '@injectivelabs/exchange-api/injective_oracle_rpc_pb'
import { InjectiveOracleRPCClient } from '@injectivelabs/exchange-api/injective_oracle_rpc_pb_service'
import { StreamStatusResponse } from '../types'

export type OraclePriceStreamCallback = (response: StreamPricesResponse) => void

export class OracleStream {
  protected client: InjectiveOracleRPCClient

  constructor(endpoint: string) {
    this.client = new InjectiveOracleRPCClient(endpoint)
  }

  streamOraclePrices({
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
    callback: OraclePriceStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = new StreamPricesRequest()
    request.setBaseSymbol(baseSymbol)
    request.setQuoteSymbol(quoteSymbol)
    request.setOracleType(oracleType)

    const stream = this.client.streamPrices(request)

    stream.on('data', (response: StreamPricesResponse) => {
      callback(response)
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
