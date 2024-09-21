import { Token, TokenType, TokenSource } from '../types'

export const SYMBOLS_WITH_MULTIPLE_VARIATIONS = ['INJ', 'USDT', 'USDC']

export const checkAndGetCanonical = (
  token: Token,
): { tokenType: TokenType; source: TokenSource } | undefined => {
  const symbol = token.symbol.toUpperCase()

  if (!SYMBOLS_WITH_MULTIPLE_VARIATIONS.some((s) => s.includes(symbol))) {
    return
  }

  if (symbol.includes('INJ') && token.tokenType !== TokenType.Native) {
    return { tokenType: TokenType.Erc20, source: TokenSource.Ethereum }
  }

  if (
    symbol.includes('USDT') &&
    ![TokenType.Erc20, TokenType.Ibc].includes(token.tokenType)
  ) {
    return { tokenType: TokenType.Erc20, source: TokenSource.Ethereum }
  }

  if (
    symbol.includes('USDC') &&
    ![TokenType.Erc20, TokenType.Ibc].includes(token.tokenType)
  ) {
    return { tokenType: TokenType.Erc20, source: TokenSource.Ethereum }
  }

  return
}
