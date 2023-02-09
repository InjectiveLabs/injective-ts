import { TokenMeta } from '../../types'

export const getMappedTokensByErc20Address = (
  tokens: Record<string, TokenMeta>,
) =>
  (Object.keys(tokens) as Array<keyof typeof tokens>)
    .filter((token) => !!tokens[token].erc20)
    .reduce((result, token) => {
      if (!tokens[token].erc20) {
        return tokens
      }

      return {
        ...result,
        [tokens[token].erc20!.address.toLowerCase()]: tokens[token],
      }
    }, {}) as Record<string, TokenMeta>

export const getMappedTokensByCw20Address = (
  tokens: Record<string, TokenMeta>,
) =>
  (Object.keys(tokens) as Array<keyof typeof tokens>)
    .filter((token) => !!tokens[token].erc20)
    .reduce((result, token) => {
      if (!tokens[token].cw20) {
        return tokens
      }

      const cw20 = tokens[token].cw20!

      const cw20s = Array.isArray(cw20) ? cw20 : [cw20]
      const cw20Maps = cw20s.reduce(
        (result, cw20) => ({
          ...result,
          [cw20.address.toLowerCase()]: tokens[token],
        }),
        {} as Record<string, TokenMeta>,
      )

      return {
        ...result,
        ...cw20Maps,
      }
    }, {}) as Record<string, TokenMeta>
