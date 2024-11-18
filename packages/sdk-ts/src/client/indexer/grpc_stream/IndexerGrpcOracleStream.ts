import { StreamStatusResponse } from '../types/index.js'
import { IndexerOracleStreamTransformer } from '../transformers/IndexerOracleStreamTransformer.js'
import { getGrpcIndexerWebImpl } from '../../base/BaseIndexerGrpcWebConsumer.js'
import { Subscription } from 'rxjs'
import { InjectiveOracleRpc } from '@injectivelabs/indexer-proto-ts'

export type OraclePriceStreamCallback = (
  response: ReturnType<
    typeof IndexerOracleStreamTransformer.pricesStreamCallback
  >,
) => void

export type OraclePricesByMarketsStreamCallback = (
  response: ReturnType<
    typeof IndexerOracleStreamTransformer.pricesByMarketsCallback
  >,
) => void

/**
 * @category Indexer Grpc Stream
 */
export class IndexerGrpcOracleStream {
  protected client: InjectiveOracleRpc.InjectiveOracleRPCClientImpl

  constructor(endpoint: string) {
    this.client = new InjectiveOracleRpc.InjectiveOracleRPCClientImpl(
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
  }): Subscription {
    const request = InjectiveOracleRpc.StreamPricesRequest.create()

    if (baseSymbol) {
      request.baseSymbol = baseSymbol
    }

    if (quoteSymbol) {
      request.quoteSymbol = quoteSymbol
    }

    request.oracleType = oracleType

    const subscription = this.client.StreamPrices(request).subscribe({
      next(response: InjectiveOracleRpc.StreamPricesResponse) {
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

    return subscription as unknown as Subscription
  }

  streamOraclePricesByMarkets({
    marketIds,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketIds?: string[]
    callback: OraclePricesByMarketsStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    const request = InjectiveOracleRpc.StreamPricesByMarketsRequest.create()

    if (marketIds) {
      request.marketIds = marketIds
    }

    const subscription = this.client.StreamPricesByMarkets(request).subscribe({
      next(response: InjectiveOracleRpc.StreamPricesByMarketsResponse) {
        callback(
          IndexerOracleStreamTransformer.pricesByMarketsCallback(response),
        )
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

    return subscription as unknown as Subscription
  }
}
