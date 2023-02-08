import {
  getMappedTokensByErc20Address,
  getMappedTokensByCw20Address,
} from './tokens/helpers/mapByAddress'
import { getMappedTokensByName } from './tokens/helpers/mapByName'
import { getMappedTokensByBaseDenom } from './tokens/helpers/mapByBaseDenom'
import { TokenMeta } from './types'

export class TokenMetaUtil {
  protected tokens: Record<string, TokenMeta>

  protected tokensByErc20Address: Record<string, TokenMeta>

  protected tokensByCw20Address: Record<string, TokenMeta>

  protected tokensByName: Record<string, TokenMeta>

  protected tokensByBaseDenom: Record<string, TokenMeta>

  constructor(tokens: Record<string, TokenMeta>) {
    this.tokens = tokens
    this.tokensByErc20Address = getMappedTokensByErc20Address(tokens)
    this.tokensByCw20Address = getMappedTokensByCw20Address(tokens)
    this.tokensByName = getMappedTokensByName(tokens)
    this.tokensByBaseDenom = getMappedTokensByBaseDenom(tokens)
  }

  getMetaBySymbol(symbol: string): TokenMeta | undefined {
    const { tokens: tokensBySymbol, tokensByBaseDenom } = this
    const tokenSymbol = symbol.toUpperCase() as keyof typeof tokensBySymbol

    if (!tokensBySymbol[tokenSymbol] && !tokensBySymbol[symbol]) {
      if (!tokensByBaseDenom[tokenSymbol] || !tokensByBaseDenom[symbol]) {
        return
      }

      return tokensByBaseDenom[tokenSymbol] || tokensByBaseDenom[symbol]
    }

    return tokensBySymbol[tokenSymbol] || tokensBySymbol[symbol]
  }

  getMetaByAddress(address: string): TokenMeta | undefined {
    return address.startsWith('0x')
      ? this.getMetaByErc20Address(address)
      : this.getMetaByCw20Address(address)
  }

  getMetaByCw20Address(address: string): TokenMeta | undefined {
    const { tokensByCw20Address } = this
    const contractAddress =
      address.toLowerCase() as keyof typeof tokensByCw20Address

    if (!tokensByCw20Address[contractAddress]) {
      return
    }

    return tokensByCw20Address[contractAddress]
  }

  getMetaByErc20Address(address: string): TokenMeta | undefined {
    const { tokensByErc20Address } = this
    const contractAddress =
      address.toLowerCase() as keyof typeof tokensByErc20Address

    if (!tokensByErc20Address[contractAddress]) {
      return
    }

    return tokensByErc20Address[contractAddress]
  }

  getCw20MetaByErc20Address(address: string): TokenMeta | undefined {
    const { tokensByErc20Address, tokens } = this
    const contractAddress =
      address.toLowerCase() as keyof typeof tokensByErc20Address

    if (!tokensByErc20Address[contractAddress]) {
      return
    }

    const tokenMeta = tokensByErc20Address[contractAddress]

    if (!tokenMeta) {
      return
    }

    const tokenMetaSymbol = Object.keys(tokens).find(
      (symbol: keyof typeof tokens) => {
        const symbolsMatch =
          symbol.toLowerCase() === tokenMeta.symbol.toLowerCase() ||
          symbol.startsWith(tokenMeta.symbol) ||
          tokenMeta.symbol.startsWith(symbol)

        if (!symbolsMatch) {
          return undefined
        }

        const tokenMetaFromSymbol = tokens[symbol]

        return tokenMetaFromSymbol && tokenMetaFromSymbol.cw20Address
      },
    )

    if (!tokenMetaSymbol) {
      return
    }

    return tokens[tokenMetaSymbol]
  }

  getErc20MetaByCw20Address(address: string): TokenMeta | undefined {
    const { tokensByCw20Address, tokens } = this
    const contractAddress =
      address.toLowerCase() as keyof typeof tokensByCw20Address

    if (!tokensByCw20Address[contractAddress]) {
      return
    }

    const tokenMeta = tokensByCw20Address[contractAddress]

    if (!tokenMeta) {
      return
    }

    const tokenMetaSymbol = Object.keys(tokens).find(
      (symbol: keyof typeof tokens) => {
        const symbolsMatch =
          symbol.toLowerCase() === tokenMeta.symbol.toLowerCase() ||
          symbol.startsWith(tokenMeta.symbol) ||
          tokenMeta.symbol.startsWith(symbol)

        if (!symbolsMatch) {
          return undefined
        }

        const tokenMetaFromSymbol = tokens[symbol]

        return tokenMetaFromSymbol && tokenMetaFromSymbol.erc20Address
      },
    )

    if (!tokenMetaSymbol) {
      return
    }

    return tokens[tokenMetaSymbol]
  }

  getMetaByName(name: string): TokenMeta | undefined {
    const { tokensByName } = this
    const tokenName = name.toLowerCase() as keyof typeof tokensByName

    if (!tokensByName[tokenName] && !tokensByName[name]) {
      return
    }

    return tokensByName[tokenName] || tokensByName[name]
  }

  getCoinGeckoIdFromSymbol(symbol: string): string {
    const { tokens: tokensBySymbol } = this
    const symbolToUppercase =
      symbol.toUpperCase() as keyof typeof tokensBySymbol

    if (!tokensBySymbol[symbolToUppercase]) {
      return ''
    }

    return tokensBySymbol[symbolToUppercase].coinGeckoId || ''
  }
}
