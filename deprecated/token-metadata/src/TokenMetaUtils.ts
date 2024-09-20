import {
  getMappedTokensByCw20Address,
  getMappedTokensByErc20Address,
} from './tokens/mappings/mapByAddress'
import { getMappedTokensByHash } from './tokens/mappings/mapByHash'
import { getMappedTokensBySymbol } from './tokens/mappings/mapBySymbol'
import { TokenMetaBase, TokenVerification, TokenType } from './types'

export class TokenMetaUtils {
  protected tokens: Record<string, TokenMetaBase>

  protected tokensByErc20Address: Record<string, TokenMetaBase>

  protected tokensByCw20Address: Record<string, TokenMetaBase>

  protected tokensByHash: Record<string, TokenMetaBase>

  constructor(tokens: Record<string, TokenMetaBase>) {
    this.tokens = getMappedTokensBySymbol(tokens)
    this.tokensByHash = getMappedTokensByHash(this.tokens)
    this.tokensByErc20Address = getMappedTokensByErc20Address(this.tokens)
    this.tokensByCw20Address = getMappedTokensByCw20Address(this.tokens)
  }

  /**
   * Symbol can be:
   * - Main symbol of the token meta,
   * - BaseDenom based on the ibc hash
   * - Variation of a symbol for multiple versions of the same token (ex: USDC, USDCet, USDCso)
   */
  getMetaBySymbol(symbol: string): TokenMetaBase | undefined {
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

  getMetaByFactory(denom: string): TokenMetaBase | undefined {
    const [symbol, creatorAddress] = denom.split('/').reverse()
    const tokenMeta = this.getMetaBySymbol(symbol)

    if (!tokenMeta) {
      return
    }

    if (!tokenMeta.tokenFactories) {
      return
    }

    const tokenFactory = tokenMeta.tokenFactories.find(
      (tokenFactory) => tokenFactory.creator === creatorAddress,
    )

    if (!tokenFactory) {
      return
    }

    return {
      ...tokenMeta,
      tokenType: TokenType.TokenFactory,
      tokenVerification: TokenVerification.Verified,
    }
  }

  getMetaByAddress(address: string): TokenMetaBase | undefined {
    return address.startsWith('0x')
      ? this.getMetaByErc20Address(address)
      : this.getMetaByCw20Address(address)
  }

  getMetaByCw20Address(address: string): TokenMetaBase | undefined {
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
          tokenVerification: TokenVerification.Verified,
        }
      : undefined
  }

  getMetaByErc20Address(address: string): TokenMetaBase | undefined {
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

        if (tokenMeta.erc20) {
          return {
            ...tokenMeta,
            tokenType: TokenType.Erc20,
            tokenVerification: TokenVerification.Verified,
          }
        }

        return {
          ...tokenMeta,
          tokenType: TokenType.Evm,
          tokenVerification: TokenVerification.Verified,
        }
      }

      return
    }

    const tokenMeta =
      tokensByErc20Address[contractAddress] || tokensByErc20Address[address]

    if (!tokenMeta) {
      return undefined
    }

    if (tokenMeta.erc20) {
      return {
        ...tokenMeta,
        tokenType: TokenType.Erc20,
        tokenVerification: TokenVerification.Verified,
      }
    }

    return {
      ...tokenMeta,
      tokenType: TokenType.Evm,
      tokenVerification: TokenVerification.Verified,
    }
  }

  getMetaByHash(hash: string): TokenMetaBase | undefined {
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
          tokenType: TokenType.Ibc,
          tokenVerification: TokenVerification.Verified,
        }
      : undefined
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
