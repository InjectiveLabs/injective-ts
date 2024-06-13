import {
  SpotTrade,
  Orderbook as UiSpotOrderbook,
  SpotMarket as BaseUiSpotMarket,
  SpotLimitOrder as UiSpotLimitOrder,
  SpotOrderHistory as UiSpotOrderHistory,
} from '@injectivelabs/sdk-ts'
import {
  ChronosSpotMarketSummary,
  AllChronosSpotMarketSummary,
} from '@injectivelabs/sdk-ts'
import { Token } from '@injectivelabs/token-metadata'
import { Change, MarketType } from './common'

export interface UiBaseSpotMarket
  extends Omit<BaseUiSpotMarket, 'quoteToken' | 'baseToken'> {}

export interface UiBaseSpotMarketWithToken extends UiBaseSpotMarket {
  quoteToken: Token
  baseToken: Token
  slug: string
}

export interface UiSpotMarketWithToken extends UiBaseSpotMarketWithToken {
  priceDecimals: number
  quantityDecimals: number
  priceTensMultiplier: number
  quantityTensMultiplier: number
  type: MarketType
  subType: MarketType
  upcoming?: boolean
}

export interface UiSpotTrade extends SpotTrade {
  ticker?: string
}

export interface UiSpotMarketSummary extends ChronosSpotMarketSummary {
  marketId: string
  lastPrice?: number
  lastPriceChange?: Change
}

export interface UiSpotMarketAndSummary {
  marketId: string
  summary: UiSpotMarketSummary
}

export {
  UiSpotOrderbook,
  BaseUiSpotMarket,
  UiSpotLimitOrder,
  UiSpotOrderHistory,
  ChronosSpotMarketSummary,
  AllChronosSpotMarketSummary,
}
