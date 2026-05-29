import type * as GoagenApiOraclePb from '@injectivelabs/ws-price-oracle-proto-ts-v2/generated/goagen_api_oracle_pb'

export type GrpcWsPriceOracleMarketStreamLeg = GoagenApiOraclePb.MarketStreamLeg

export type GrpcWsPriceOracleMarketStreamRawPayload =
  GoagenApiOraclePb.MarketStreamRawPayload

export type GrpcWsPriceOracleStreamMarketsResponse =
  GoagenApiOraclePb.StreamMarketsResponse

export type GrpcWsPriceOracleMarketStreamMessage =
  GoagenApiOraclePb.MarketStreamMessage

export type GrpcWsPriceOracleLatestMarketPricesResponse =
  GoagenApiOraclePb.LatestMarketPricesResponse

export interface WsPriceOracleLatestMarketPricesParams {
  marketIds?: string[]
  oracleTypes?: string[]
  includeInactive?: boolean
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

export interface WsPriceOracleLatestMarketPricesResponse {
  prices: WsPriceOracleMarketPrice[]
}
