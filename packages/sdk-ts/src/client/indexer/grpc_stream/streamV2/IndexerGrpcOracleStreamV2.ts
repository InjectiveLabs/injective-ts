import * as InjectiveOracleRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_oracle_rpc_pb'
import { InjectiveOracleRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_oracle_rpc_pb.client'
import { createStreamSubscriptionV2 } from './streamHelpersV2.js'
import { GrpcWebRpcTransport } from '../../../base/GrpcWebRpcTransport.js'
import { IndexerOracleStreamTransformer } from '../../transformers/IndexerOracleStreamTransformer.js'
import type { StreamSubscription } from '../../../../types/index.js'

export type OraclePriceStreamCallbackV2 = (
  response: ReturnType<
    typeof IndexerOracleStreamTransformer.pricesStreamCallback
  >,
) => void

export type OraclePricesByMarketsStreamCallbackV2 = (
  response: ReturnType<
    typeof IndexerOracleStreamTransformer.pricesByMarketsCallback
  >,
) => void

export class IndexerGrpcOracleStreamV2 {
  private client: InjectiveOracleRPCClient
  private transport: GrpcWebRpcTransport

  constructor(endpoint: string, metadata?: Record<string, string>) {
    this.transport = new GrpcWebRpcTransport(endpoint, metadata)
    this.client = new InjectiveOracleRPCClient(this.transport)
  }

  /**
   * Stream oracle price updates
   * @param params.oracleType - The oracle type to stream prices for
   * @param params.baseSymbol - Optional base symbol filter
   * @param params.quoteSymbol - Optional quote symbol filter
   * @param params.callback - Called for each price update
   * @returns StreamSubscription
   */
  streamOraclePrices({
    oracleType,
    baseSymbol,
    quoteSymbol,
    callback,
  }: {
    oracleType: string
    baseSymbol?: string
    quoteSymbol?: string
    callback: OraclePriceStreamCallbackV2
  }): StreamSubscription {
    if (!oracleType) {
      throw new Error('oracleType is required')
    }
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = InjectiveOracleRpcPb.StreamPricesRequest.create()

    if (baseSymbol) {
      request.baseSymbol = baseSymbol
    }

    if (quoteSymbol) {
      request.quoteSymbol = quoteSymbol
    }

    request.oracleType = oracleType

    const stream = this.client.streamPrices(request)

    return createStreamSubscriptionV2(stream, (response) => {
      const transformed =
        IndexerOracleStreamTransformer.pricesStreamCallback(response)
      callback(transformed)
    })
  }

  /**
   * Stream oracle prices by markets
   * @param params.marketIds - Optional array of market IDs to filter
   * @param params.callback - Called for each price update
   * @returns StreamSubscription
   */
  streamOraclePricesByMarkets({
    marketIds,
    callback,
  }: {
    marketIds?: string[]
    callback: OraclePricesByMarketsStreamCallbackV2
  }): StreamSubscription {
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = InjectiveOracleRpcPb.StreamPricesByMarketsRequest.create()

    if (marketIds) {
      request.marketIds = marketIds
    }

    const stream = this.client.streamPricesByMarkets(request)

    return createStreamSubscriptionV2(stream, (response) => {
      const transformed =
        IndexerOracleStreamTransformer.pricesByMarketsCallback(response)
      callback(transformed)
    })
  }
}
