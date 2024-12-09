import {
  TokenType,
  TokenSource,
  TokenStatic,
  TokenVerification,
} from './../types/index.js'

export class TokenFactoryStatic {
  public registry: TokenStatic[]
  public tokensByDenom: Record<string, TokenStatic>
  public tokensBySymbol: Record<string, TokenStatic[]>
  public tokensByAddress: Record<string, TokenStatic[]>

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

    this.tokensByAddress = registry.reduce((list, token) => {
      const address = token.address.toLowerCase()

      if (!address) {
        return list
      }

      return { ...list, [address]: [...(list[address] || []), token] }
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

  getMetaByDenomOrAddress(denomOrAddress: string): TokenStatic | undefined {
    const formattedDenom = denomOrAddress.toLowerCase()

    if (this.tokensByDenom[formattedDenom]) {
      return this.tokensByDenom[formattedDenom]
    }

    if (this.tokensByAddress[formattedDenom]) {
      const verifiedToken = this.tokensByAddress[formattedDenom].find(
        ({ tokenVerification }) =>
          tokenVerification === TokenVerification.Verified,
      )

      return verifiedToken || this.tokensByAddress[formattedDenom][0]
    }
  }
}
