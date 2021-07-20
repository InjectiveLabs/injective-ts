import { tokensByAddress, tokensByKovanAddress, tokensBySymbol } from './tokens'
import { TokenMeta } from './types'

export class Erc20TokenMeta {
  static getMetaBySymbol(symbol: string): TokenMeta | undefined {
    const erc20Symbol = symbol.toUpperCase() as keyof typeof tokensBySymbol

    if (!tokensBySymbol[erc20Symbol]) {
      return
    }

    const token = tokensBySymbol[erc20Symbol]

    return {
      ...token,
      logo: `${__dirname}/images/${token.logo}`,
    }
  }

  static getMetaByAddress(address: string): TokenMeta | undefined {
    const erc20Address = address.toLowerCase() as keyof typeof tokensByAddress

    if (!tokensByAddress[erc20Address]) {
      return
    }

    const token = tokensByAddress[erc20Address]

    return {
      ...token,
      logo: `${__dirname}/images/${token.logo}`,
    }
  }

  static getMetaByKovanAddress(address: string): TokenMeta | undefined {
    const erc20Address = address.toLowerCase() as keyof typeof tokensByKovanAddress

    if (!tokensByKovanAddress[erc20Address]) {
      return
    }

    const token = tokensByKovanAddress[erc20Address]

    return {
      ...token,
      logo: `${__dirname}/images/${token.logo}`,
    }
  }
}
