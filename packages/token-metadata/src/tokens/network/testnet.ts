import { TokenMeta } from '../../types'
import tokens, { testnetTokens } from '../tokens'

export const getTokensBySymbolForTestnet = () =>
  (Object.keys(tokens) as Array<keyof typeof tokens>).reduce(
    (result, symbol) => {
      const tokenSymbolToUpperCase = symbol.toUpperCase()
      const tokenMeta =
        testnetTokens[tokenSymbolToUpperCase] || tokens[tokenSymbolToUpperCase]

      return {
        ...result,
        [tokenSymbolToUpperCase]: tokenMeta,
      }
    },
    {},
  ) as Record<string, TokenMeta>
