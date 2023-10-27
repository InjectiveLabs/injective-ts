import { TokenMeta } from '../../types'

export const getMappedTokensBySymbol = (tokens: Record<string, TokenMeta>) =>
  (Object.keys(tokens) as Array<keyof typeof tokens>).reduce(
    (result, token) => {
      const tokenMeta = tokens[token]
      const symbolKey = token.toUpperCase()
      const symbol = tokenMeta.symbol.toUpperCase()
      const symbolDiffs = symbol !== symbolKey

      let ibcResults = {}
      let cw20Results = {}
      let splResults = {}
      let cw20sResults = {}

      if (tokenMeta.ibc && tokenMeta.ibc.baseDenom) {
        ibcResults = {
          [tokenMeta.ibc.baseDenom.toUpperCase()]: tokenMeta,
          [symbol.toUpperCase()]: tokenMeta,
          ...(symbolDiffs && {
            [symbolKey.toUpperCase()]: tokenMeta,
          }),
          ...(tokenMeta.ibc.symbol && {
            [tokenMeta.ibc.symbol.toUpperCase()]: tokenMeta,
          }),
        }
      }

      if (tokenMeta.cw20 && tokenMeta.cw20.address) {
        cw20Results = {
          [tokenMeta.cw20.address.toUpperCase()]: tokenMeta,
          [symbol.toUpperCase()]: tokenMeta,
          ...(symbolDiffs && {
            [symbolKey.toUpperCase()]: tokenMeta,
          }),
        }
      }

      if (tokenMeta.spl && tokenMeta.spl.address) {
        splResults = {
          [tokenMeta.spl.address.toUpperCase()]: tokenMeta,
          [symbol.toUpperCase()]: tokenMeta,
          ...(symbolDiffs && {
            [symbolKey.toUpperCase()]: tokenMeta,
          }),
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

        cw20sResults = {
          ...cw20Maps,
          [symbol.toUpperCase()]: tokenMeta,
          ...(symbolDiffs && {
            [symbolKey.toUpperCase()]: tokenMeta,
          }),
        }
      }

      return {
        ...result,
        ...ibcResults,
        ...cw20Results,
        ...splResults,
        ...cw20sResults,
        [symbol.toUpperCase()]: tokenMeta,
        ...(symbolDiffs && {
          [symbolKey.toUpperCase()]: tokenMeta,
        }),
      }
    },
    {},
  ) as Record<string, TokenMeta>
