import { TokenMeta } from '../../types'

export const getMappedTokensByErc20Address = (
  tokens: Record<string, TokenMeta>,
) =>
  (Object.keys(tokens) as Array<keyof typeof tokens>)
    .filter((token) => !!(tokens[token].erc20 || tokens[token].evm))
    .reduce((result, token) => {
      if (!tokens[token].erc20 && !tokens[token].evm) {
        return result
      }

      if (tokens[token].erc20) {
        return {
          ...result,
          [tokens[token].erc20!.address]: tokens[token],
        }
      }

      if (tokens[token].evm) {
        return {
          ...result,
          [tokens[token].evm!.address]: tokens[token],
        }
      }

      return result
    }, {}) as Record<string, TokenMeta>

export const getMappedTokensByCw20Address = (
  tokens: Record<string, TokenMeta>,
) =>
  (Object.keys(tokens) as Array<keyof typeof tokens>)
    .filter((token) => tokens[token].cw20 || tokens[token].cw20s)
    .reduce((result, token) => {
      if (!tokens[token].cw20 && !tokens[token].cw20s) {
        return result
      }

      const tokenMeta = tokens[token]

      if (tokenMeta.cw20) {
        return {
          ...result,
          [tokenMeta.cw20.address]: tokens[token],
        }
      }

      if (tokenMeta.cw20s) {
        const cw20Maps = tokenMeta.cw20s.reduce(
          (result, cw20) => ({
            ...result,
            [cw20.address]: tokens[token],
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
