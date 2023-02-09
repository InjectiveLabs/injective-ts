import {
  SpotTrade,
  SpotOrderSide,
  SpotMarket as BaseUiSpotMarket,
  SpotLimitOrder as UiSpotLimitOrder,
  SpotOrderHistory as UiSpotOrderHistory,
} from '@injectivelabs/sdk-ts/dist/client/indexer/types/spot'
import { Orderbook as UiSpotOrderbook } from '@injectivelabs/sdk-ts/dist/client/indexer/types/exchange'
import {
  ChronosSpotMarketSummary,
  AllChronosSpotMarketSummary,
} from '@injectivelabs/sdk-ts/dist/client/indexer/types/spot-rest'
import { Token } from '@injectivelabs/token-metadata'
import { Change, MarketBase, MarketType } from './common'

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

export enum SpotOrderMap {
  UNSPECIFIED = 0,
  BUY = 1,
  SELL = 2,
  STOP_BUY = 3,
  STOP_SELL = 4,
  TAKE_BUY = 5,
  TAKE_SELL = 6,
  BUY_PO = 7,
  SELL_PO = 8,
}

export {
  UiSpotLimitOrder,
  UiSpotOrderHistory,
  SpotOrderSide,
  BaseUiSpotMarket,
  ChronosSpotMarketSummary,
  AllChronosSpotMarketSummary,
  UiSpotOrderbook,
}
