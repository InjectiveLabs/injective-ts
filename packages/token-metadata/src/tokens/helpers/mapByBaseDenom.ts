import { TokenMeta } from '../../types'

export const getMappedTokensByBaseDenom = (tokens: Record<string, TokenMeta>) =>
  (Object.keys(tokens) as Array<keyof typeof tokens>).reduce(
    (result, token) => {
      if (tokens[token].baseDenom) {
        return result
      }

      return {
        ...result,
        [tokens[token].baseDenom!.toUpperCase()]: tokens[token],
      }
    },
    {},
  ) as Record<string, TokenMeta>
