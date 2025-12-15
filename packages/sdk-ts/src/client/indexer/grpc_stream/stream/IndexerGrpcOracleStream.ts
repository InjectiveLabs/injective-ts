import * as InjectiveOracleRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_oracle_rpc_pb'
import { InjectiveOracleRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_oracle_rpc_pb.client'
import { createStreamSubscription } from './streamHelpers.js'
import { GrpcWebRpcTransport } from '../../../base/GrpcWebRpcTransport.js'
import { IndexerOracleStreamTransformer } from '../../transformers/IndexerOracleStreamTransformer.js'
import type { Subscription } from 'rxjs'
import type { StreamStatusResponse } from '../../types/index.js'

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
 * @description Provides streaming access to oracle price data from Injective Indexer
 */
export class IndexerGrpcOracleStream {
  private client: InjectiveOracleRPCClient
  private transport: GrpcWebRpcTransport

  constructor(endpoint: string, metadata?: Record<string, string>) {
    this.transport = new GrpcWebRpcTransport(endpoint, metadata)
    this.client = new InjectiveOracleRPCClient(this.transport)
  }

  /**
   * Stream oracle price updates
   * @param params - Stream parameters
   * @param params.oracleType - The oracle type to stream prices for
   * @param params.baseSymbol - Optional base symbol filter
   * @param params.quoteSymbol - Optional quote symbol filter
   * @param params.callback - Called for each price update
   * @param params.onEndCallback - Called when stream ends normally
   * @param params.onStatusCallback - Called on stream errors
   * @returns Subscription object with unsubscribe method
   */
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
    // Input validation
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

    return createStreamSubscription(
      stream,
      (response: InjectiveOracleRpcPb.StreamPricesResponse) => {
        callback(IndexerOracleStreamTransformer.pricesStreamCallback(response))
      },
      onEndCallback,
      onStatusCallback,
    )
  }

  /**
   * Stream oracle prices by markets
   * @param params - Stream parameters
   * @param params.marketIds - Optional array of market IDs to filter
   * @param params.callback - Called for each price update
   * @param params.onEndCallback - Called when stream ends normally
   * @param params.onStatusCallback - Called on stream errors
   * @returns Subscription object with unsubscribe method
   */
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
    // Input validation
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = InjectiveOracleRpcPb.StreamPricesByMarketsRequest.create()

    if (marketIds) {
      request.marketIds = marketIds
    }

    const stream = this.client.streamPricesByMarkets(request)

    return createStreamSubscription(
      stream,
      (response: InjectiveOracleRpcPb.StreamPricesByMarketsResponse) => {
        callback(
          IndexerOracleStreamTransformer.pricesByMarketsCallback(response),
        )
      },
      onEndCallback,
      onStatusCallback,
    )
  }
}
