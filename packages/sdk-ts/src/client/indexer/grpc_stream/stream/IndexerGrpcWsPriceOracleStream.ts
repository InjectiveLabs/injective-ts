import * as GoagenApiOraclePb from '@injectivelabs/ws-price-oracle-proto-ts-v2/generated/goagen_api_oracle_pb'
import { OracleClient } from '@injectivelabs/ws-price-oracle-proto-ts-v2/generated/goagen_api_oracle_pb.client'
import { createStreamSubscription } from './streamHelpers.js'
import { GrpcWebRpcTransport } from '../../../base/GrpcWebRpcTransport.js'
import { IndexerWsPriceOracleStreamTransformer } from '../../transformers/index.js'
import type { Subscription } from 'rxjs'
import type { StreamStatusResponse } from '../../types/index.js'

export type WsPriceOracleMarketsStreamCallback = (
  response: ReturnType<
    typeof IndexerWsPriceOracleStreamTransformer.streamMarketsCallback
  >,
) => void

/**
 * @category Indexer Grpc Stream
 * @description Provides streaming access to market oracle price data from the ws price oracle service
 */
export class IndexerGrpcWsPriceOracleStream {
  private client: OracleClient
  private transport: GrpcWebRpcTransport

  constructor(endpoint: string, metadata?: Record<string, string>) {
    this.transport = new GrpcWebRpcTransport(
      endpoint,
      metadata ? { meta: metadata } : undefined,
    )
    this.client = new OracleClient(this.transport)
  }

  /**
   * Stream current and live derivative market oracle prices
   * @param params - Stream parameters
   * @param params.marketIds - Optional market IDs to filter
   * @param params.oracleTypes - Optional oracle types to filter
   * @param params.includeInactive - Whether inactive markets should be included
   * @param params.callback - Called for each market oracle update
   * @param params.onEndCallback - Called when stream ends normally
   * @param params.onStatusCallback - Called on stream errors
   * @returns Subscription object with unsubscribe method
   */
  streamMarkets({
    marketIds,
    oracleTypes,
    includeInactive,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    marketIds?: string[]
    oracleTypes?: string[]
    includeInactive?: boolean
    callback: WsPriceOracleMarketsStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = GoagenApiOraclePb.StreamMarketsRequest.create()

    if (marketIds && marketIds.length > 0) {
      request.marketIds = marketIds
    }

    if (oracleTypes && oracleTypes.length > 0) {
      request.oracleTypes = oracleTypes
    }

    if (includeInactive !== undefined) {
      request.includeInactive = includeInactive
    }

    const stream = this.client.streamMarkets(request)

    return createStreamSubscription(
      stream,
      (response: GoagenApiOraclePb.StreamMarketsResponse) => {
        callback(
          IndexerWsPriceOracleStreamTransformer.streamMarketsCallback(response),
        )
      },
      onEndCallback,
      onStatusCallback,
    )
  }
}
