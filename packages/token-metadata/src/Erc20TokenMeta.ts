import {
  tokensByAddress,
  tokensByKovanAddress,
  tokensBySymbol,
  tokensBySymbolForKovan,
  tokensBySymbolToCoinGeckoId,
} from './tokens'
import { TokenMeta } from './types'

export class Erc20TokenMeta {
  static getMetaBySymbol(symbol: string): TokenMeta | undefined {
    const erc20Symbol = symbol.toUpperCase() as keyof typeof tokensBySymbol

    if (!tokensBySymbol[erc20Symbol]) {
      return
    }

    return tokensBySymbol[erc20Symbol]
  }

  static getMetaBySymbolForKovan(symbol: string): TokenMeta | undefined {
    const erc20Symbol = symbol.toUpperCase() as keyof typeof tokensBySymbol

    if (!tokensBySymbolForKovan[erc20Symbol]) {
      return
    }

    return tokensBySymbolForKovan[erc20Symbol]
  }

  static getMetaByAddress(address: string): TokenMeta | undefined {
    const erc20Address = address.toLowerCase() as keyof typeof tokensByAddress

    if (!tokensByAddress[erc20Address]) {
      return
    }

    return tokensByAddress[erc20Address]
  }

  static getMetaByKovanAddress(address: string): TokenMeta | undefined {
    const erc20Address =
      address.toLowerCase() as keyof typeof tokensByKovanAddress

    if (!tokensByKovanAddress[erc20Address]) {
      return
    }

    return tokensByKovanAddress[erc20Address]
  }

  static getCoinGeckoIdFromSymbol(symbol: string): string {
    const symbolToLowerCase =
      symbol.toLowerCase() as keyof typeof tokensByKovanAddress

    if (!tokensBySymbolToCoinGeckoId[symbolToLowerCase]) {
      return ''
    }

    return tokensBySymbolToCoinGeckoId[symbolToLowerCase]
  }
}
