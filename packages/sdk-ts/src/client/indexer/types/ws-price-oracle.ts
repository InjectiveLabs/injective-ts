import type * as GoagenApiOraclePb from '@injectivelabs/ws-price-oracle-proto-ts-v2/generated/goagen_api_oracle_pb'

export type GrpcWsPriceOracleMarketStreamLeg = GoagenApiOraclePb.MarketStreamLeg

export type GrpcWsPriceOracleMarketStreamRawPayload =
  GoagenApiOraclePb.MarketStreamRawPayload

export type GrpcWsPriceOracleStreamMarketsResponse =
  GoagenApiOraclePb.StreamMarketsResponse

export type GrpcWsPriceOracleStreamMarketsV2Response =
  GoagenApiOraclePb.StreamMarketsV2Response

export type GrpcWsPriceOracleMarketStreamMessage =
  GoagenApiOraclePb.MarketStreamMessage

export type GrpcWsPriceOracleLightMarketStreamMessage =
  GoagenApiOraclePb.LightMarketStreamMessage

export type GrpcWsPriceOracleLatestMarketPricesResponse =
  GoagenApiOraclePb.LatestMarketPricesResponse

export type GrpcWsPriceOracleLatestMarketPricesV2Response =
  GoagenApiOraclePb.LatestMarketPricesV2Response

export type WsPriceOracleResponseMode = 'full' | 'light' | 'slim'

export type WsPriceOracleSlimPrices = Record<string, string>

export interface WsPriceOracleLatestMarketPricesParams {
  marketIds?: string[]
  oracleTypes?: string[]
  includeInactive?: boolean
}

export interface WsPriceOracleLatestMarketPricesV2Params extends WsPriceOracleLatestMarketPricesParams {
  mode?: WsPriceOracleResponseMode
}

export interface WsPriceOracleMarketStreamLeg {
  oracleType?: string
  base?: string
  quote?: string
  price?: string
  timestamp?: string
  source?: string
}

export interface WsPriceOracleMarketStreamRawPayload {
  provider?: string
  feedId?: string
  encoding?: string
  data?: string
}

export interface WsPriceOracleLightMarketStreamMessage {
  marketId: string
  price: string
  timestamp: string
  type: string
}

export interface WsPriceOracleStreamMarketsResponse {
  type: string
  marketId?: string
  marketTicker?: string
  oracleBase?: string
  oracleQuote?: string
  oracleType?: string
  oracleScaleFactor?: number
  active?: boolean
  price?: string
  timestamp?: string
  receivedAt?: string
  sequence?: number
  legs: WsPriceOracleMarketStreamLeg[]
  verificationStatus?: string
  raw?: WsPriceOracleMarketStreamRawPayload
}

export type WsPriceOracleMarketPrice = WsPriceOracleStreamMarketsResponse

export interface WsPriceOracleStreamMarketsV2Response {
  mode: WsPriceOracleResponseMode
  message?: WsPriceOracleMarketPrice
  light?: WsPriceOracleLightMarketStreamMessage
  slim: WsPriceOracleSlimPrices
}

export interface WsPriceOracleLatestMarketPricesResponse {
  prices: WsPriceOracleMarketPrice[]
}

export interface WsPriceOracleLatestMarketPricesV2Response {
  mode: WsPriceOracleResponseMode
  prices: WsPriceOracleMarketPrice[]
  lightPrices: WsPriceOracleLightMarketStreamMessage[]
  slimPrices: WsPriceOracleSlimPrices
}
