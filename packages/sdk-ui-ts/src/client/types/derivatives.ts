import {
  DerivativeTrade,
  Position as UiPosition,
  PerpetualMarket as BaseUiPerpetualMarket,
  DerivativeLimitOrder as UiDerivativeLimitOrder,
  BaseDerivativeMarket as BaseUiDerivativeMarket,
  ExpiryFuturesMarket as BaseUiExpiryFuturesMarket,
  BinaryOptionsMarket as BaseUiBinaryOptionsMarket,
  Orderbook as UiDerivativeOrderbook,
  DerivativeOrderHistory as UiDerivativeOrderHistory,
} from '@injectivelabs/sdk-ts'
import {
  ChronosDerivativeMarketSummary,
  AllChronosDerivativeMarketSummary,
} from '@injectivelabs/sdk-ts'
import { Token } from '@injectivelabs/token-metadata'
import { Change, MarketType } from './common'

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
  priceTensMultiplier: number
  quantityTensMultiplier: number
  type: MarketType
  subType: MarketType
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

export {
  UiPosition,
  UiDerivativeOrderbook,
  BaseUiDerivativeMarket,
  UiDerivativeLimitOrder,
  UiDerivativeOrderHistory,
  ChronosDerivativeMarketSummary,
  AllChronosDerivativeMarketSummary,
}
