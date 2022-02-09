import {
  DerivativeMarket as BaseUiDerivativeMarket,
  DerivativeTrade,
  Position as UiPosition,
  DerivativeLimitOrder as UiDerivativeLimitOrder,
  Orderbook as UiDerivativeOrderbook,
  ChronosDerivativeMarketSummary,
  DerivativeOrderSide,
  AllChronosDerivativeMarketSummary,
} from '@injectivelabs/derivatives-consumer'
import { TradeDirection, TradeExecutionType } from '@injectivelabs/ts-types'
import { Token } from '../token'
import { Change, MarketBase, MarketType } from '../types'

export interface UiBaseDerivativeMarket
  extends Omit<BaseUiDerivativeMarket, 'quoteToken'> {}

export interface UiBaseDerivativeMarketWithTokenMeta
  extends UiBaseDerivativeMarket {
  quoteToken: Token
  baseToken: Token
}

export interface UiDerivativeMarketWithTokenMeta
  extends UiBaseDerivativeMarketWithTokenMeta {
  priceDecimals: number
  quantityDecimals: number
  type: MarketType
  subType: MarketType
  marketBase?: MarketBase
}

export interface UiDerivativeTrade extends DerivativeTrade {
  ticker?: string
}

export interface UiDerivativeMarketSummary
  extends ChronosDerivativeMarketSummary {
  marketId: string
  lastPrice?: number
  lastPriceChange?: Change
}

export interface UiDerivativeMarketAndSummary {
  marketId: string
  summary: UiDerivativeMarketSummary
}

export enum DerivativeMarketMap {
  UNSPECIFIED = 0,
  BUY = 1,
  SELL = 2,
  STOP_BUY = 3,
  STOP_SELL = 4,
  TAKE_BUY = 5,
  TAKE_SELL = 6,
}

export {
  UiPosition,
  UiDerivativeLimitOrder,
  TradeDirection,
  DerivativeOrderSide,
  TradeExecutionType,
  BaseUiDerivativeMarket,
  ChronosDerivativeMarketSummary,
  AllChronosDerivativeMarketSummary,
  UiDerivativeOrderbook,
}
