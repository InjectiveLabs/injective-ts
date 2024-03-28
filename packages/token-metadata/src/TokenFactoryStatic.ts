import { TokenType, TokenSource, TokenStatic } from './types'

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
    { source, type }: { source?: TokenSource; type?: TokenType } = {},
  ): TokenStatic | undefined {
    const tokensBySymbol = this.tokensBySymbol[symbol.toLowerCase()]

    if (!tokensBySymbol) {
      return
    }

    const token = tokensBySymbol.find((Token) => {
      const isType = !type || Token.tokenType === type
      const isSource = !source || Token.source === source

      return isType && isSource
    })

    return token || tokensBySymbol[0]
  }

  getMetaByDenomOrAddress(denom: string): TokenStatic | undefined {
    const formattedDenom = denom.toLowerCase()

    return this.tokensByDenom[formattedDenom]
  }
}
