import { TokenMeta } from '../../types'

export const getMappedTokensByHash = (tokens: Record<string, TokenMeta>) =>
  (Object.keys(tokens) as Array<keyof typeof tokens>).reduce(
    (result, token) => {
      if (!tokens[token].ibc) {
        return result
      }

      return {
        ...result,
        [tokens[token].ibc!.hash.toUpperCase()]: tokens[token],
      }
    },
    {},
  ) as Record<string, TokenMeta>
