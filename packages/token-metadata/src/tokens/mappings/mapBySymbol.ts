import { TokenMeta } from '../../types'

export const getMappedTokensBySymbol = (tokens: Record<string, TokenMeta>) =>
  (Object.keys(tokens) as Array<keyof typeof tokens>)
    .filter((token) => !!tokens[token].erc20)
    .reduce((result, token) => {
      const tokenMeta = tokens[token]

      if (tokenMeta.ibc) {
        return {
          ...result,
          [tokenMeta.ibc.hash]: tokenMeta,
        }
      }

      if (tokenMeta.cw20 && Array.isArray(tokenMeta.cw20)) {
        const cw20Maps = tokenMeta.cw20.reduce(
          (result, cw20) => ({
            ...result,
            [cw20.symbol.toLowerCase()]: tokenMeta,
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
