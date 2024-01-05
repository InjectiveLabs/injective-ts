import { TokenMeta } from '../../types'
import tokens, { testnetTokens } from '../tokens'

export const getTokensBySymbolForTestnet = () =>
  (Object.keys(tokens) as Array<keyof typeof tokens>).reduce(
    (result, symbol) => {
      const tokenSymbolToUpperCase = symbol.toUpperCase()
      const tokenMeta = testnetTokens()[symbol] || tokens[symbol]

      return {
        ...result,
        [tokenSymbolToUpperCase]: tokenMeta,
      }
    },
    {},
  ) as Record<string, TokenMeta>
