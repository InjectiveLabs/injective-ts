import { TokenMeta } from '../../types'

export const getMappedTokensByAddress = (tokens: Record<string, TokenMeta>) =>
  (Object.keys(tokens) as Array<keyof typeof tokens>).reduce(
    (result, token) => ({
      ...result,
      [tokens[token].address.toLowerCase()]: tokens[token],
    }),
    {},
  ) as Record<string, TokenMeta>
