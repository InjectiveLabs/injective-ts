import { TokenMeta } from '../../types'

export const getMappedTokensBySymbol = (tokens: Record<string, TokenMeta>) =>
  (Object.keys(tokens) as Array<keyof typeof tokens>).reduce(
    (result, token) => {
      const tokenMeta = tokens[token]

      if (tokenMeta.ibc && tokenMeta.ibc.baseDenom) {
        return {
          ...result,
          [tokenMeta.ibc.baseDenom.toUpperCase()]: tokenMeta,
          [tokenMeta.symbol.toUpperCase()]: tokenMeta,
        }
      }

      if (tokenMeta.cw20 && tokenMeta.cw20.address) {
        return {
          ...result,
          [tokenMeta.cw20.address.toUpperCase()]: tokenMeta,
          [tokenMeta.symbol.toUpperCase()]: tokenMeta,
        }
      }

      if (tokenMeta.spl && tokenMeta.spl.address) {
        return {
          ...result,
          [tokenMeta.spl.address.toUpperCase()]: tokenMeta,
          [tokenMeta.symbol.toUpperCase()]: tokenMeta,
        }
      }

      if (tokenMeta.cw20s) {
        const cw20Maps = tokenMeta.cw20s.reduce(
          (result, cw20) => ({
            ...result,
            [cw20.symbol.toUpperCase()]: tokenMeta,
          }),
          {} as Record<string, TokenMeta>,
        )

        return {
          ...result,
          ...cw20Maps,
          [tokenMeta.symbol.toUpperCase()]: tokenMeta,
        }
      }

      return {
        ...result,
        [tokenMeta.symbol.toUpperCase()]: tokenMeta,
      }
    },
    {},
  ) as Record<string, TokenMeta>
