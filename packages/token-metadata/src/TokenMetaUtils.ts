import {
  getMappedTokensByErc20Address,
  getMappedTokensByCw20Address,
} from './tokens/mappings/mapByAddress'
import { getMappedTokensByName } from './tokens/mappings/mapByName'
import { getMappedTokensByHash } from './tokens/mappings/mapByHash'
import { getMappedTokensBySymbol } from './tokens/mappings/mapBySymbol'
import { TokenMeta, TokenVerification, TokenType } from './types'

export class TokenMetaUtils {
  protected tokens: Record<string, TokenMeta>

  protected tokensByErc20Address: Record<string, TokenMeta>

  protected tokensByCw20Address: Record<string, TokenMeta>

  protected tokensByHash: Record<string, TokenMeta>

  protected tokensByName: Record<string, TokenMeta>

  constructor(tokens: Record<string, TokenMeta>) {
    this.tokens = getMappedTokensBySymbol(tokens)
    this.tokensByErc20Address = getMappedTokensByErc20Address(this.tokens)
    this.tokensByCw20Address = getMappedTokensByCw20Address(this.tokens)
    this.tokensByHash = getMappedTokensByHash(this.tokens)
    this.tokensByName = getMappedTokensByName(this.tokens)
  }

  /**
   * Symbol can be:
   * - Main symbol of the token meta,
   * - BaseDenom based on the ibc hash
   * - Variation of a symbol for multiple versions of the same token (ex: USDC, USDCet, USDCso)
   */
  getMetaBySymbol(symbol: string): TokenMeta | undefined {
    const { tokens: tokensBySymbol } = this
    const tokenSymbol = symbol.toUpperCase() as keyof typeof tokensBySymbol

    if (!tokensBySymbol[tokenSymbol] && !tokensBySymbol[symbol]) {
      return
    }

    const tokenMeta = tokensBySymbol[tokenSymbol] || tokensBySymbol[symbol]

    return {
      ...tokenMeta,
      tokenVerification: TokenVerification.Verified,
    }
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

    if (
      !tokensByCw20Address[contractAddress] &&
      !tokensByCw20Address[address]
    ) {
      return
    }

    const tokenMeta =
      tokensByCw20Address[contractAddress] || tokensByCw20Address[address]

    return tokenMeta
      ? {
          ...tokenMeta,
          tokenType: TokenType.Cw20,
          name: tokenMeta.cw20?.name || tokenMeta.name,
          tokenVerification: TokenVerification.Verified,
        }
      : undefined
  }

  getMetaByErc20Address(address: string): TokenMeta | undefined {
    const { tokensByErc20Address } = this
    const contractAddress =
      address.toLowerCase() as keyof typeof tokensByErc20Address

    if (
      !tokensByErc20Address[contractAddress] &&
      !tokensByErc20Address[address]
    ) {
      const checksumAddress = Object.keys(tokensByErc20Address).find(
        (checksumAddress) =>
          checksumAddress.toLowerCase() === address ||
          checksumAddress.toLowerCase() === contractAddress,
      )

      if (checksumAddress) {
        const tokenMeta = tokensByErc20Address[checksumAddress]

        return {
          ...tokenMeta,
          name: tokenMeta.erc20?.name || tokenMeta.name,
          tokenType: tokenMeta.erc20 ? TokenType.Erc20 : TokenType.Evm,
          tokenVerification: TokenVerification.Verified,
        }
      }

      return
    }

    const tokenMeta =
      tokensByErc20Address[contractAddress] || tokensByErc20Address[address]

    return tokenMeta
      ? {
          ...tokenMeta,
          name: tokenMeta.erc20?.name || tokenMeta.name,
          tokenType: tokenMeta.erc20 ? TokenType.Erc20 : TokenType.Evm,
          tokenVerification: TokenVerification.Verified,
        }
      : undefined
  }

  getMetaByHash(hash: string): TokenMeta | undefined {
    const { tokensByHash } = this
    const ibcHash = hash
      .toUpperCase()
      .replace('IBC/', '') as keyof typeof tokensByHash

    if (!tokensByHash[ibcHash] && !tokensByHash[hash]) {
      return
    }

    const tokenMeta = tokensByHash[ibcHash] || tokensByHash[hash]

    return tokenMeta
      ? {
          ...tokenMeta,
          name: tokenMeta.ibc?.name || tokenMeta.name,
          tokenType: TokenType.Ibc,
          tokenVerification: TokenVerification.Verified,
        }
      : undefined
  }

  getMetaByName(name: string): TokenMeta | undefined {
    const { tokensByName } = this
    const tokenName = name.toLowerCase() as keyof typeof tokensByName

    if (!tokensByName[tokenName] && !tokensByName[name]) {
      return
    }

    const tokenMeta = tokensByName[tokenName] || tokensByName[name]

    return {
      ...tokenMeta,
      tokenVerification: TokenVerification.Verified,
    }
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
