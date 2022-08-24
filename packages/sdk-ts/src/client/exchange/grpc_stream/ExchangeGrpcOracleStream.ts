import {
  StreamPricesRequest,
  StreamPricesResponse,
} from '@injectivelabs/exchange-api/injective_oracle_rpc_pb'
import { InjectiveOracleRPCClient } from '@injectivelabs/exchange-api/injective_oracle_rpc_pb_service'
import { StreamStatusResponse } from '../types'
import { isServerSide } from '../../../utils/helpers'
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport'
import { ExchangeOracleStreamTransformer } from './../transformers/ExchangeOracleStreamTransformer'

export type OraclePriceStreamCallback = (
  response: ReturnType<
    typeof ExchangeOracleStreamTransformer.pricesStreamCallback
  >,
) => void

/**
 * @category Exchange Grpc Stream
 */
export class ExchangeGrpcOracleStream {
  protected client: InjectiveOracleRPCClient

  constructor(endpoint: string) {
    this.client = new InjectiveOracleRPCClient(endpoint, {
      transport: isServerSide() ? NodeHttpTransport() : undefined,
    })
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
    baseSymbol?: string
    quoteSymbol?: string
    callback: OraclePriceStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = new StreamPricesRequest()

    if (baseSymbol) {
      request.setBaseSymbol(baseSymbol)
    }

    if (quoteSymbol) {
      request.setQuoteSymbol(quoteSymbol)
    }

    request.setOracleType(oracleType)

    const stream = this.client.streamPrices(request)

    stream.on('data', (response: StreamPricesResponse) => {
      callback(ExchangeOracleStreamTransformer.pricesStreamCallback(response))
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
