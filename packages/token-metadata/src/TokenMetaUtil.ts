import { getMappedTokensByAddress } from './tokens/helpers/mapByAddress'
import { getMappedTokensByName } from './tokens/helpers/mapByName'
import { wormholeCw20Contracts } from './tokens/helpers'
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

    if (!tokensBySymbol[tokenSymbol]) {
      return
    }

    return tokensBySymbol[tokenSymbol]
  }

  getMetaByAddress(address: string): TokenMeta | undefined {
    const { tokensByAddress } = this
    const contractAddress =
      address.toLowerCase() as keyof typeof tokensByAddress

    if (!tokensByAddress[contractAddress]) {
      return
    }

    const tokenMeta = tokensByAddress[contractAddress]

    /** Wormhole CW20 versions can't have more than 8 decimals */
    if (wormholeCw20Contracts.includes(contractAddress)) {
      return {
        ...tokenMeta,
        decimals: Math.max(0, Math.min(tokenMeta.decimals, 8)),
      }
    }

    return tokensByAddress[contractAddress]
  }

  getMetaByName(name: string): TokenMeta | undefined {
    const { tokensByName } = this
    const tokenName = name.toLowerCase() as keyof typeof tokensByName

    if (!tokensByName[tokenName]) {
      return
    }

    const tokenMeta = tokensByName[tokenName]

    /** Wormhole CW20 versions can't have more than 8 decimals */
    if (wormholeCw20Contracts.includes(tokenMeta.address || '')) {
      return {
        ...tokenMeta,
        decimals: Math.max(0, Math.min(tokenMeta.decimals, 8)),
      }
    }

    return tokensByName[tokenName]
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
