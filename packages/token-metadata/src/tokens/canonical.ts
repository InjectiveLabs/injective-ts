import { Token, TokenType, TokenSource } from '../types'

export const SYMBOLS_WITH_MULTIPLE_VARIATIONS = ['INJ', 'USDT', 'USDC']

export const checkAndGetCanonical = (
  token: Token,
): { tokenType: TokenType; source: TokenSource } | undefined => {
  const symbol = token.symbol.toUpperCase()

  if (!SYMBOLS_WITH_MULTIPLE_VARIATIONS.includes(symbol)) {
    return
  }

  if (symbol === 'USDT') {
    return { tokenType: TokenType.Erc20, source: TokenSource.Ethereum }
  }

  if (symbol === 'INJ') {
    return { tokenType: TokenType.Erc20, source: TokenSource.Ethereum }
  }

  if (symbol === 'USDC') {
    return { tokenType: TokenType.Erc20, source: TokenSource.Ethereum }
  }

  return
}
