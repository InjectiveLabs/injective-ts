import { TokenPriceType, TokenPriceUtilOptions } from './types'
import CoinGeckoPriceUtil from './CoinGeckoPriceUtil'

export class TokenPriceUtilFactory {
  static make(type: TokenPriceType, options: TokenPriceUtilOptions) {
    switch (type) {
      case TokenPriceType.CoinGecko:
        return new CoinGeckoPriceUtil(options)
      default:
        return new CoinGeckoPriceUtil(options)
    }
  }
}
