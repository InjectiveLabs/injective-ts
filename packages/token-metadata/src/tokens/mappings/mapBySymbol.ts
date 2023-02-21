import { TokenMeta } from '../../types'

export const getMappedTokensBySymbol = (tokens: Record<string, TokenMeta>) =>
  (Object.keys(tokens) as Array<keyof typeof tokens>).reduce(
    (result, token) => {
      const tokenMeta = tokens[token]
      if (tokenMeta.ibcs) {
        const ibcMaps = tokenMeta.ibcs.reduce(
          (result, ibc20) => ({
            ...result,
            [ibc20.baseDenom.toUpperCase()]: tokenMeta,
          }),
          {} as Record<string, TokenMeta>,
        )

        return {
          ...result,
          ...ibcMaps,
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
        const cw20Maps = tokenMeta.cw20s.reduce((result, cw20) => {
          const symbol = cw20.symbol || tokenMeta.symbol

          return {
            ...result,
            [symbol.toUpperCase()]: tokenMeta,
          }
        }, {} as Record<string, TokenMeta>)

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
