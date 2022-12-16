import { getMappedTokensByAddress } from './tokens/helpers/mapByAddress'
import { getMappedTokensByName } from './tokens/helpers/mapByName'
import { TokenMeta } from './types'

export class TokenMetaUtil {
  protected tokens: Record<string, TokenMeta>

  protected tokensByAddress: Record<string, TokenMeta>

  protected tokensByName: Record<string, TokenMeta>

  constructor(tokens: Record<string, TokenMeta>) {
    this.tokens = tokens
    this.tokensByAddress = getMappedTokensByAddress(tokens)
    this.tokensByName = getMappedTokensByName(tokens)
  }

  getMetaBySymbol(symbol: string): TokenMeta | undefined {
    const { tokens: tokensBySymbol } = this
    const tokenSymbol = symbol.toUpperCase() as keyof typeof tokensBySymbol

    if (!tokensBySymbol[tokenSymbol] || !tokensBySymbol[symbol]) {
      return
    }

    return tokensBySymbol[tokenSymbol] || tokensBySymbol[symbol]
  }

  getMetaByAddress(address: string): TokenMeta | undefined {
    const { tokensByAddress } = this
    const contractAddress =
      address.toLowerCase() as keyof typeof tokensByAddress

    if (!tokensByAddress[contractAddress]) {
      return
    }

    return tokensByAddress[contractAddress]
  }

  getMetaByName(name: string): TokenMeta | undefined {
    const { tokensByName } = this
    const tokenName = name.toLowerCase() as keyof typeof tokensByName

    if (!tokensByName[tokenName] || !tokensByName[name]) {
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
