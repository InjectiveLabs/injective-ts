import {
  StreamPricesRequest,
  StreamPricesResponse,
} from '@injectivelabs/indexer-api/injective_oracle_rpc_pb'
import { InjectiveOracleRPCClient } from '@injectivelabs/indexer-api/injective_oracle_rpc_pb_service'
import { StreamStatusResponse } from '../types'
import { isServerSide } from '../../../utils/helpers'
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport'
import { IndexerOracleStreamTransformer } from '../transformers/IndexerOracleStreamTransformer'

export type OraclePriceStreamCallback = (
  response: ReturnType<
    typeof IndexerOracleStreamTransformer.pricesStreamCallback
  >,
) => void

/**
 * @category Indexer Grpc Stream
 */
export class IndexerGrpcOracleStream {
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
      callback(IndexerOracleStreamTransformer.pricesStreamCallback(response))
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
