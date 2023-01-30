import {
  InjectiveOracleRPCClientImpl,
  StreamPricesRequest,
  StreamPricesResponse,
} from '@injectivelabs/indexer-proto-ts/injective_oracle_rpc'
import { StreamStatusResponse } from '../types'
import { IndexerOracleStreamTransformer } from '../transformers/IndexerOracleStreamTransformer'
import { getGrpcIndexerWebImpl } from '../../BaseIndexerGrpcWebConsumer'

export type OraclePriceStreamCallback = (
  response: ReturnType<
    typeof IndexerOracleStreamTransformer.pricesStreamCallback
  >,
) => void

/**
 * @category Indexer Grpc Stream
 */
export class IndexerGrpcOracleStream {
  protected client: InjectiveOracleRPCClientImpl

  constructor(endpoint: string) {
    this.client = new InjectiveOracleRPCClientImpl(
      getGrpcIndexerWebImpl(endpoint),
    )
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
    const request = StreamPricesRequest.create()

    if (baseSymbol) {
      request.baseSymbol = baseSymbol
    }

    if (quoteSymbol) {
      request.quoteSymbol = quoteSymbol
    }

    request.oracleType = oracleType

    const stream = this.client.StreamPrices(request)

    return stream.subscribe({
      next(response: StreamPricesResponse) {
        callback(IndexerOracleStreamTransformer.pricesStreamCallback(response))
      },
      error(err) {
        if (onStatusCallback) {
          onStatusCallback(err)
        }
      },
      complete() {
        if (onEndCallback) {
          onEndCallback()
        }
      },
    })
  }
}
