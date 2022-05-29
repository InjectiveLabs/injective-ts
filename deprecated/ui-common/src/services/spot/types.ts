import {
  SpotMarket as BaseUiSpotMarket,
  SpotTrade,
  SpotLimitOrder as UiSpotLimitOrder,
  Orderbook as UiSpotOrderbook,
  ChronosSpotMarketSummary,
  SpotOrderSide,
  AllChronosSpotMarketSummary,
} from '@injectivelabs/spot-consumer'
import { Token } from '../token/types'
import { Change, MarketBase, MarketType } from '../../types/common'

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
  type: MarketType
  subType: MarketType
  marketBase?: MarketBase
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

export enum SpotMarketMap {
  UNSPECIFIED = 0,
  BUY = 1,
  SELL = 2,
  STOP_BUY = 3,
  STOP_SELL = 4,
  TAKE_BUY = 5,
  TAKE_SELL = 6,
}

export {
  UiSpotLimitOrder,
  SpotOrderSide,
  BaseUiSpotMarket,
  ChronosSpotMarketSummary,
  AllChronosSpotMarketSummary,
  UiSpotOrderbook,
}
