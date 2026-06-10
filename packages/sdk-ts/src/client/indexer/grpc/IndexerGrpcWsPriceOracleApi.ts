import * as GoagenApiOraclePb from '@injectivelabs/ws-price-oracle-proto-ts-v2/generated/goagen_api_oracle_pb'
import { OracleClient } from '@injectivelabs/ws-price-oracle-proto-ts-v2/generated/goagen_api_oracle_pb.client'
import { IndexerModule } from '../types/index.js'
import BaseIndexerGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import { IndexerWsPriceOracleStreamTransformer } from '../transformers/index.js'
import type {
  WsPriceOracleLatestMarketPricesParams,
  WsPriceOracleLatestMarketPricesV2Params,
} from '../types/index.js'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcWsPriceOracleApi extends BaseIndexerGrpcConsumer {
  protected module: string = IndexerModule.Oracle

  private get client() {
    return this.initClient(OracleClient)
  }

  /**
   * Returns latest stored derivative market index price snapshots.
   */
  async fetchLatestMarketPrices(
    params?: WsPriceOracleLatestMarketPricesParams,
  ) {
    const { marketIds, oracleTypes, includeInactive } = params || {}
    const request = GoagenApiOraclePb.LatestMarketPricesRequest.create()

    if (marketIds && marketIds.length > 0) {
      request.marketIds = marketIds
    }

    if (oracleTypes && oracleTypes.length > 0) {
      request.oracleTypes = oracleTypes
    }

    if (includeInactive !== undefined) {
      request.includeInactive = includeInactive
    }

    const response = await this.executeGrpcCall<
      GoagenApiOraclePb.LatestMarketPricesRequest,
      GoagenApiOraclePb.LatestMarketPricesResponse
    >(request, this.client.latestMarketPrices.bind(this.client))

    return IndexerWsPriceOracleStreamTransformer.latestMarketPricesResponseToLatestMarketPrices(
      response,
    )
  }

  /**
   * Returns latest stored derivative market index price snapshots with selectable response modes.
   */
  async fetchLatestMarketPricesV2(
    params?: WsPriceOracleLatestMarketPricesV2Params,
  ) {
    const { marketIds, oracleTypes, includeInactive, mode } = params || {}
    const request = GoagenApiOraclePb.LatestMarketPricesV2Request.create()

    if (marketIds && marketIds.length > 0) {
      request.marketIds = marketIds
    }

    if (oracleTypes && oracleTypes.length > 0) {
      request.oracleTypes = oracleTypes
    }

    if (includeInactive !== undefined) {
      request.includeInactive = includeInactive
    }

    if (mode) {
      request.mode = mode
    }

    const response = await this.executeGrpcCall<
      GoagenApiOraclePb.LatestMarketPricesV2Request,
      GoagenApiOraclePb.LatestMarketPricesV2Response
    >(request, this.client.latestMarketPricesV2.bind(this.client))

    return IndexerWsPriceOracleStreamTransformer.latestMarketPricesV2ResponseToLatestMarketPricesV2(
      response,
    )
  }
}
