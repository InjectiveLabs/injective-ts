import {
  DerivativeMarket as BaseUiDerivativeMarket,
  DerivativeTrade,
  Position as UiPosition,
  DerivativeLimitOrder as UiDerivativeLimitOrder,
  DerivativeOrderSide,
} from '@injectivelabs/sdk-ts/dist/client/exchange/types/derivatives'
import { Orderbook as UiDerivativeOrderbook } from '@injectivelabs/sdk-ts/dist/client/exchange/types/exchange'
import {
  ChronosDerivativeMarketSummary,
  AllChronosDerivativeMarketSummary,
} from '@injectivelabs/sdk-ts/dist/client/exchange/types/derivatives-rest'
import { Token } from './../../types/token'
import { Change, MarketBase, MarketType } from './common'

export interface UiBaseDerivativeMarket
  extends Omit<BaseUiDerivativeMarket, 'quoteToken'> {}

export interface UiBaseDerivativeMarketWithToken
  extends UiBaseDerivativeMarket {
  slug: string
  quoteToken: Token
  baseToken: Token
}

export interface UiDerivativeMarketWithToken
  extends UiBaseDerivativeMarketWithToken {
  priceDecimals: number
  quantityDecimals: number
  type: MarketType
  subType: MarketType
  marketBase?: MarketBase
  upcoming?: boolean
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
  BUY_PO = 7,
  SELL_PO = 8,
}

export {
  UiPosition,
  UiDerivativeLimitOrder,
  DerivativeOrderSide,
  BaseUiDerivativeMarket,
  ChronosDerivativeMarketSummary,
  AllChronosDerivativeMarketSummary,
  UiDerivativeOrderbook,
}
