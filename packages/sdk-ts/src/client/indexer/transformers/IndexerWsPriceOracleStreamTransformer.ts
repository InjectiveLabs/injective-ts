import { bigIntToNumber } from '../../../utils/helpers.js'
import type * as GoagenApiOraclePb from '@injectivelabs/ws-price-oracle-proto-ts-v2/generated/goagen_api_oracle_pb'
import type {
  WsPriceOracleMarketStreamLeg,
  GrpcWsPriceOracleMarketStreamLeg,
  WsPriceOracleStreamMarketsResponse,
  WsPriceOracleMarketStreamRawPayload,
  GrpcWsPriceOracleStreamMarketsResponse,
  GrpcWsPriceOracleMarketStreamRawPayload,
} from '../types/ws-price-oracle.js'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerWsPriceOracleStreamTransformer {
  static grpcMarketStreamLegToMarketStreamLeg(
    leg: GrpcWsPriceOracleMarketStreamLeg,
  ): WsPriceOracleMarketStreamLeg {
    return {
      oracleType: leg.oracleType,
      base: leg.base,
      quote: leg.quote,
      price: leg.price,
      timestamp: leg.timestamp,
      source: leg.source,
    }
  }

  static grpcMarketStreamRawPayloadToMarketStreamRawPayload(
    raw?: GrpcWsPriceOracleMarketStreamRawPayload,
  ): WsPriceOracleMarketStreamRawPayload | undefined {
    if (!raw) {
      return undefined
    }

    return {
      provider: raw.provider,
      feedId: raw.feedId,
      encoding: raw.encoding,
      data: raw.data,
    }
  }

  static streamMarketsResponseToStreamMarkets(
    response: GrpcWsPriceOracleStreamMarketsResponse,
  ): WsPriceOracleStreamMarketsResponse {
    return {
      type: response.type,
      marketId: response.marketId,
      marketTicker: response.marketTicker,
      oracleBase: response.oracleBase,
      oracleQuote: response.oracleQuote,
      oracleType: response.oracleType,
      oracleScaleFactor: response.oracleScaleFactor,
      active: response.active,
      price: response.price,
      timestamp: response.timestamp,
      receivedAt: response.receivedAt,
      sequence:
        response.sequence === undefined
          ? undefined
          : bigIntToNumber(response.sequence),
      legs: response.legs.map(
        IndexerWsPriceOracleStreamTransformer.grpcMarketStreamLegToMarketStreamLeg,
      ),
      verificationStatus: response.verificationStatus,
      raw: IndexerWsPriceOracleStreamTransformer.grpcMarketStreamRawPayloadToMarketStreamRawPayload(
        response.raw,
      ),
    }
  }

  static streamMarketsCallback = (
    response: GoagenApiOraclePb.StreamMarketsResponse,
  ) =>
    IndexerWsPriceOracleStreamTransformer.streamMarketsResponseToStreamMarkets(
      response,
    )
}
