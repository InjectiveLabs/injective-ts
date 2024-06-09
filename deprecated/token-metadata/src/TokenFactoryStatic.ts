import { TokenType, TokenSource, TokenStatic, TokenVerification } from './types'

export class TokenFactoryStatic {
  public registry: TokenStatic[]
  public tokensByDenom: Record<string, TokenStatic>
  public tokensBySymbol: Record<string, TokenStatic[]>

  constructor(registry: TokenStatic[]) {
    this.registry = registry
    this.tokensByDenom = registry.reduce((list, token) => {
      const denom = token.denom.toLowerCase()

      if (list[denom]) {
        return list
      }

      return { ...list, [denom]: token }
    }, {} as Record<string, TokenStatic>)

    this.tokensBySymbol = registry.reduce((list, token) => {
      const symbol = token.symbol.toLowerCase()

      return { ...list, [symbol]: [...(list[symbol] || []), token] }
    }, {} as Record<string, TokenStatic[]>)
  }

  toToken(denom: string): TokenStatic | undefined {
    return this.getMetaByDenomOrAddress(denom) || this.getMetaBySymbol(denom)
  }

  getMetaBySymbol(
    symbol: string,
    {
      type,
      source,
      verification,
    }: {
      source?: TokenSource
      type?: TokenType
      verification?: TokenVerification
    } = {},
  ): TokenStatic | undefined {
    const tokensBySymbol = this.tokensBySymbol[symbol.toLowerCase()]

    if (!tokensBySymbol) {
      return
    }

    const token = tokensBySymbol.find((token: TokenStatic) => {
      const isType = !type || token.tokenType === type
      const isSource = !source || token.source === source
      const isVerification =
        !verification || token.tokenVerification === verification

      return isType && isSource && isVerification
    })

    const sortedTokens = tokensBySymbol.sort((t1, t2) => {
      const t1IsVerified = t1.tokenVerification === TokenVerification.Verified
      const t2IsVerified = t2.tokenVerification === TokenVerification.Verified

      return t1IsVerified && !t2IsVerified ? -1 : 1
    })

    return token || sortedTokens[0]
  }

  getMetaByDenomOrAddress(denom: string): TokenStatic | undefined {
    const formattedDenom = denom.toLowerCase()

    return this.tokensByDenom[formattedDenom]
  }
}
