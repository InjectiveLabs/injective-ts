import { TokenMeta } from '../../types'

export const getMappedTokensByName = (tokens: Record<string, TokenMeta>) =>
  (Object.keys(tokens) as Array<keyof typeof tokens>).reduce(
    (result, token) => ({
      ...result,
      [tokens[token].name!.toLowerCase()]: tokens[token],
    }),
    {},
  ) as Record<string, TokenMeta>
