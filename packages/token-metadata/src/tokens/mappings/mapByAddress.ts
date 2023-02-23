import { Cw20TokenMeta, TokenMeta } from '../../types'

export const getMappedTokensByErc20Address = (
  tokens: Record<string, TokenMeta>,
) =>
  (Object.keys(tokens) as Array<keyof typeof tokens>)
    .filter((token) => !!tokens[token].erc20)
    .reduce((result, token) => {
      if (!tokens[token].erc20) {
        return result
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
    .filter((token) => tokens[token].cw20s)
    .reduce((result, token) => {
      if (!tokens[token].cw20s) {
        return result
      }

      const tokenMeta = tokens[token]

      if (tokenMeta.cw20s) {
        const cw20Maps = (tokenMeta.cw20s as Cw20TokenMeta[]).reduce(
          (result, cw20) => ({
            ...result,
            [cw20.address.toLowerCase()]: { ...tokens[token], cw20 },
          }),
          {} as Record<string, TokenMeta>,
        )

        return {
          ...result,
          ...cw20Maps,
        }
      }

      return result
    }, {}) as Record<string, TokenMeta>
