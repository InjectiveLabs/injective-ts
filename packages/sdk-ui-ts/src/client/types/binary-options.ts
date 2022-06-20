import { BinaryOptionsMarket as BaseUiBinaryOptionsMarket } from '@injectivelabs/sdk-ts/dist/client/exchange/types/binary-options'
import { Token } from '@injectivelabs/token-metadata'
import { MarketBase, MarketType } from './common'

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

export { BaseUiBinaryOptionsMarket }
