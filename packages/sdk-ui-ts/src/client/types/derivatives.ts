import {
  BaseDerivativeMarket as BaseUiDerivativeMarket,
  PerpetualMarket as BaseUiPerpetualMarket,
  ExpiryFuturesMarket as BaseUiExpiryFuturesMarket,
  BinaryOptionsMarket as BaseUiBinaryOptionsMarket,
  DerivativeTrade,
  Position as UiPosition,
  DerivativeLimitOrder as UiDerivativeLimitOrder,
  DerivativeOrderHistory as UiDerivativeOrderHistory,
  DerivativeOrderSide,
} from '@injectivelabs/sdk-ts/dist/client/indexer/types/derivatives'
import { Orderbook as UiDerivativeOrderbook } from '@injectivelabs/sdk-ts/dist/client/indexer/types/exchange'
import {
  ChronosDerivativeMarketSummary,
  AllChronosDerivativeMarketSummary,
} from '@injectivelabs/sdk-ts/dist/client/indexer/types/derivatives-rest'
import { Token } from '@injectivelabs/token-metadata'
import { Change, MarketBase, MarketType } from './common'

export interface BaseDerivativeMarket
  extends Omit<BaseUiDerivativeMarket, 'quoteToken'> {}

export interface DerivativeMarketWithTokenAndSlug extends BaseDerivativeMarket {
  slug: string
  quoteToken: Token
  baseToken: Token
}

export interface BaseDerivativeMarketWithToken
  extends DerivativeMarketWithTokenAndSlug {
  priceDecimals: number
  quantityDecimals: number
  type: MarketType
  subType: MarketType
  marketBase?: MarketBase
  upcoming?: boolean
}

export interface UiBasePerpetualMarket
  extends Omit<BaseUiPerpetualMarket, 'quoteToken'> {}

export interface UiBaseExpiryFuturesMarket
  extends Omit<BaseUiExpiryFuturesMarket, 'quoteToken'> {}

export interface UiBaseBinaryOptionsMarket
  extends Omit<BaseUiBinaryOptionsMarket, 'quoteToken'> {}

export type PerpetualMarketWithTokenAndSlug = BaseUiPerpetualMarket &
  DerivativeMarketWithTokenAndSlug

export type ExpiryFuturesMarketWithTokenAndSlug = BaseUiExpiryFuturesMarket &
  DerivativeMarketWithTokenAndSlug

export type BinaryOptionsMarketWithTokenAndSlug = BaseUiBinaryOptionsMarket &
  DerivativeMarketWithTokenAndSlug

export type UiPerpetualMarketWithToken = PerpetualMarketWithTokenAndSlug &
  BaseDerivativeMarketWithToken

export type UiExpiryFuturesMarketWithToken =
  ExpiryFuturesMarketWithTokenAndSlug & BaseDerivativeMarketWithToken

export type UiBinaryOptionsMarketWithToken =
  BinaryOptionsMarketWithTokenAndSlug & BaseDerivativeMarketWithToken

export type UiBaseDerivativeMarketWithTokenAndSlug =
  | PerpetualMarketWithTokenAndSlug
  | ExpiryFuturesMarketWithTokenAndSlug
  | BinaryOptionsMarketWithTokenAndSlug

export type UiDerivativeMarketWithToken =
  | UiPerpetualMarketWithToken
  | UiExpiryFuturesMarketWithToken
  | UiBinaryOptionsMarketWithToken

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

export enum DerivativeOrderMap {
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
  UiDerivativeOrderHistory,
  DerivativeOrderSide,
  BaseUiDerivativeMarket,
  ChronosDerivativeMarketSummary,
  AllChronosDerivativeMarketSummary,
  UiDerivativeOrderbook,
}
