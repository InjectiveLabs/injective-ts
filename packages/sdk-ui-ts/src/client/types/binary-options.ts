import {
  BinaryOptionsMarket as BaseUiBinaryOptionsMarket,
  BinaryOptionsTrade,
  BinaryOptionsLimitOrder as UiBinaryOptionsLimitOrder,
  BinaryOptionsOrderSide,
} from '@injectivelabs/sdk-ts/dist/client/exchange/types/binary-options'
import { Orderbook as UiBinaryOptionsOrderbook } from '@injectivelabs/sdk-ts/dist/client/exchange/types/exchange'
import {
  ChronosBinaryOptionsMarketSummary,
  AllChronosBinaryOptionsMarketSummary,
} from '@injectivelabs/sdk-ts/dist/client/exchange/types/binary-options-rest'
import { Token } from '@injectivelabs/token-metadata'
import { Change, MarketBase, MarketType } from './common'

export interface UiBaseBinaryOptionsMarket
  extends Omit<BaseUiBinaryOptionsMarket, 'quoteToken'> {}

export interface UiBaseBinaryOptionsMarketWithToken
  extends UiBaseBinaryOptionsMarket {
  slug: string
  quoteToken: Token
  baseToken: Token
}

export interface UiBinaryOptionsMarketWithToken
  extends UiBaseBinaryOptionsMarketWithToken {
  priceDecimals: number
  quantityDecimals: number
  type: MarketType
  subType: MarketType
  marketBase?: MarketBase
  upcoming?: boolean
}

export interface UiBinaryOptionsTrade extends BinaryOptionsTrade {
  ticker?: string
}

export interface UiBinaryOptionsMarketSummary
  extends ChronosBinaryOptionsMarketSummary {
  marketId: string
  lastPrice?: number
  lastPriceChange?: Change
}

export interface UiBinaryOptionsMarketAndSummary {
  marketId: string
  summary: UiBinaryOptionsMarketSummary
}

export enum BinaryOptionsOrderMap {
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
  UiBinaryOptionsLimitOrder,
  BinaryOptionsOrderSide,
  BaseUiBinaryOptionsMarket,
  ChronosBinaryOptionsMarketSummary,
  AllChronosBinaryOptionsMarketSummary,
  UiBinaryOptionsOrderbook,
}
