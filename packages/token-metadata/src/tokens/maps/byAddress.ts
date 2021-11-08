import { TokenMeta } from '../../types'
import tokens from '../tokens'

const mappedTokens = (Object.keys(tokens) as Array<keyof typeof tokens>).reduce(
  (result, token) => ({
    ...result,
    [tokens[token].address.toLowerCase()]: tokens[token],
  }),
  {},
) as Record<string, TokenMeta>

export default mappedTokens
