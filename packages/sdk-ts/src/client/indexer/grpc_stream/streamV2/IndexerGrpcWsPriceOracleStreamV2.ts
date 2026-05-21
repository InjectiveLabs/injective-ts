import * as GoagenApiOraclePb from '@injectivelabs/ws-price-oracle-proto-ts-v2/generated/goagen_api_oracle_pb'
import { OracleClient } from '@injectivelabs/ws-price-oracle-proto-ts-v2/generated/goagen_api_oracle_pb.client'
import { createStreamSubscriptionV2 } from './streamHelpersV2.js'
import { GrpcWebRpcTransport } from '../../../base/GrpcWebRpcTransport.js'
import { IndexerWsPriceOracleStreamTransformer } from '../../transformers/index.js'
import type { StreamSubscription } from '../../../../types/index.js'

export type WsPriceOracleMarketsStreamCallbackV2 = (
  response: ReturnType<
    typeof IndexerWsPriceOracleStreamTransformer.streamMarketsCallback
  >,
) => void

/**
 * @category Indexer Grpc Stream
 * @description Provides event-based streaming access to market oracle price data from the ws price oracle service
 */
export class IndexerGrpcWsPriceOracleStreamV2 {
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
   * @param params.marketIds - Optional market IDs to filter
   * @param params.oracleTypes - Optional oracle types to filter
   * @param params.includeInactive - Whether inactive markets should be included
   * @param params.callback - Called for each market oracle update
   * @returns StreamSubscription
   */
  streamMarkets({
    marketIds,
    oracleTypes,
    includeInactive,
    callback,
  }: {
    marketIds?: string[]
    oracleTypes?: string[]
    includeInactive?: boolean
    callback: WsPriceOracleMarketsStreamCallbackV2
  }): StreamSubscription {
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

    return createStreamSubscriptionV2(stream, (response) => {
      const transformed =
        IndexerWsPriceOracleStreamTransformer.streamMarketsCallback(response)
      callback(transformed)
    })
  }
}
