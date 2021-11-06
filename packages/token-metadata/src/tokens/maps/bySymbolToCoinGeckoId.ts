import tokens from '../tokens'

const mappedTokens = (Object.keys(tokens) as Array<keyof typeof tokens>).reduce(
  (result, token) => ({
    ...result,
    [token.toLowerCase()]: tokens[token].coinGeckoId,
  }),
  {},
) as Record<string, string>

export default mappedTokens
