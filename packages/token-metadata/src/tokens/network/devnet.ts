import { TokenMeta } from '../../types'
import tokens, { devnetTokens } from '../tokens'

export const getTokensBySymbolForDevnet = () =>
  (Object.keys(tokens) as Array<keyof typeof tokens>).reduce(
    (result, symbol) => {
      const tokenSymbolToUpperCase = symbol.toUpperCase()
      const tokenMeta = devnetTokens()[symbol] || tokens[symbol]

      return {
        ...result,
        [tokenSymbolToUpperCase]: tokenMeta,
      }
    },
    {},
  ) as Record<string, TokenMeta>

export const getTokensBySymbolForDevnet1 = () =>
  (Object.keys(tokens) as Array<keyof typeof tokens>).reduce(
    (result, symbol) => {
      const tokenSymbolToUpperCase = symbol.toUpperCase()
      const tokenMeta = devnetTokens()[symbol] || tokens[symbol]

      return {
        ...result,
        [tokenSymbolToUpperCase]: tokenMeta,
      }
    },
    {},
  ) as Record<string, TokenMeta>

export const getTokensBySymbolForDevnet2 = () =>
  (Object.keys(tokens) as Array<keyof typeof tokens>).reduce(
    (result, symbol) => {
      const tokenSymbolToUpperCase = symbol.toUpperCase()
      const tokenMeta = devnetTokens()[symbol] || tokens[symbol]

      return {
        ...result,
        [tokenSymbolToUpperCase]: tokenMeta,
      }
    },
    {},
  ) as Record<string, TokenMeta>
