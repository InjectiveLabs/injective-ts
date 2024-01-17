import { TokenMetaBase } from '../../types'

export const getMappedTokensByHash = (tokens: Record<string, TokenMetaBase>) =>
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
  ) as Record<string, TokenMetaBase>
