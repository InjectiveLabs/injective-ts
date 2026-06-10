import { bigIntToNumber } from '../../../utils/helpers.js'
import type * as GoagenApiOraclePb from '@injectivelabs/ws-price-oracle-proto-ts-v2/generated/goagen_api_oracle_pb'
import type {
  WsPriceOracleSlimPrices,
  WsPriceOracleMarketPrice,
  WsPriceOracleResponseMode,
  WsPriceOracleMarketStreamLeg,
  GrpcWsPriceOracleMarketStreamLeg,
  WsPriceOracleStreamMarketsResponse,
  WsPriceOracleMarketStreamRawPayload,
  WsPriceOracleStreamMarketsV2Response,
  GrpcWsPriceOracleMarketStreamMessage,
  WsPriceOracleLightMarketStreamMessage,
  GrpcWsPriceOracleStreamMarketsResponse,
  WsPriceOracleLatestMarketPricesResponse,
  GrpcWsPriceOracleMarketStreamRawPayload,
  GrpcWsPriceOracleStreamMarketsV2Response,
  GrpcWsPriceOracleLightMarketStreamMessage,
  WsPriceOracleLatestMarketPricesV2Response,
  GrpcWsPriceOracleLatestMarketPricesResponse,
  GrpcWsPriceOracleLatestMarketPricesV2Response,
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

  static grpcLightMarketStreamMessageToLightMarketStreamMessage(
    response: GrpcWsPriceOracleLightMarketStreamMessage,
  ): WsPriceOracleLightMarketStreamMessage {
    return {
      type: response.type,
      price: response.price,
      marketId: response.marketId,
      timestamp: response.timestamp,
    }
  }

  static grpcSlimPricesToSlimPrices(
    slimPrices: WsPriceOracleSlimPrices,
  ): WsPriceOracleSlimPrices {
    return { ...slimPrices }
  }

  static grpcMarketStreamMessageToMarketPrice(
    response: GrpcWsPriceOracleMarketStreamMessage,
  ): WsPriceOracleMarketPrice {
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

  static streamMarketsResponseToStreamMarkets(
    response: GrpcWsPriceOracleStreamMarketsResponse,
  ): WsPriceOracleStreamMarketsResponse {
    return IndexerWsPriceOracleStreamTransformer.grpcMarketStreamMessageToMarketPrice(
      response,
    )
  }

  static streamMarketsV2ResponseToStreamMarketsV2(
    response: GrpcWsPriceOracleStreamMarketsV2Response,
  ): WsPriceOracleStreamMarketsV2Response {
    return {
      mode: response.mode as WsPriceOracleResponseMode,
      message: response.message
        ? IndexerWsPriceOracleStreamTransformer.grpcMarketStreamMessageToMarketPrice(
            response.message,
          )
        : undefined,
      light: response.light
        ? IndexerWsPriceOracleStreamTransformer.grpcLightMarketStreamMessageToLightMarketStreamMessage(
            response.light,
          )
        : undefined,
      slim: IndexerWsPriceOracleStreamTransformer.grpcSlimPricesToSlimPrices(
        response.slim,
      ),
    }
  }

  static latestMarketPricesResponseToLatestMarketPrices(
    response: GrpcWsPriceOracleLatestMarketPricesResponse,
  ): WsPriceOracleLatestMarketPricesResponse {
    return {
      prices: response.prices.map(
        IndexerWsPriceOracleStreamTransformer.grpcMarketStreamMessageToMarketPrice,
      ),
    }
  }

  static latestMarketPricesV2ResponseToLatestMarketPricesV2(
    response: GrpcWsPriceOracleLatestMarketPricesV2Response,
  ): WsPriceOracleLatestMarketPricesV2Response {
    return {
      mode: response.mode as WsPriceOracleResponseMode,
      prices: response.prices.map(
        IndexerWsPriceOracleStreamTransformer.grpcMarketStreamMessageToMarketPrice,
      ),
      lightPrices: response.lightPrices.map(
        IndexerWsPriceOracleStreamTransformer.grpcLightMarketStreamMessageToLightMarketStreamMessage,
      ),
      slimPrices:
        IndexerWsPriceOracleStreamTransformer.grpcSlimPricesToSlimPrices(
          response.slimPrices,
        ),
    }
  }

  static streamMarketsCallback = (
    response: GoagenApiOraclePb.StreamMarketsResponse,
  ) =>
    IndexerWsPriceOracleStreamTransformer.streamMarketsResponseToStreamMarkets(
      response,
    )

  static streamMarketsV2Callback = (
    response: GoagenApiOraclePb.StreamMarketsV2Response,
  ) =>
    IndexerWsPriceOracleStreamTransformer.streamMarketsV2ResponseToStreamMarketsV2(
      response,
    )
}
