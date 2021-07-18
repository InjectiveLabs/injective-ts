import { tokens } from './tokens'
import { TokenMeta } from './types'

export class Erc20TokenMeta {
  static getMeta(symbol: string): TokenMeta {
    const erc20Symbol = symbol.toUpperCase() as keyof typeof tokens

    if (!tokens[erc20Symbol]) {
      throw new Error(`Meta data for ${symbol} not found`)
    }

    const token = tokens[erc20Symbol]

    return {
      ...token,
      logo: `${__dirname}/images/${token.logo}`,
    }
  }

  static getMetaNoThrow(symbol: string): TokenMeta | undefined {
    const erc20Symbol = symbol.toUpperCase() as keyof typeof tokens

    if (!tokens[erc20Symbol]) {
      return
    }

    const token = tokens[erc20Symbol]

    return {
      ...token,
      logo: `${__dirname}/images/${token.logo}`,
    }
  }
}
