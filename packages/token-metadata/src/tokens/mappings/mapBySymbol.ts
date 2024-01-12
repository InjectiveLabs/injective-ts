import { TokenMetaBase } from '../../types'

export const getMappedTokensBySymbol = (
  tokens: Record<string, TokenMetaBase>,
) =>
  (Object.keys(tokens) as Array<keyof typeof tokens>).reduce(
    (result, token) => {
      const tokenMeta = tokens[token]
      const symbolKey = token.toUpperCase()
      const symbol = tokenMeta.symbol?.toUpperCase()
      const symbolDiffs = symbol !== symbolKey

      let ibcResults = {}
      let cw20Results = {}
      let splResults = {}
      let evmResults = {}
      let erc20Results = {}
      let cw20sResults = {}

      if (tokenMeta.ibc && tokenMeta.ibc.baseDenom) {
        ibcResults = {
          [tokenMeta.ibc.baseDenom.toUpperCase()]: tokenMeta,
          ...(tokenMeta.ibc.symbol && {
            [tokenMeta.ibc.symbol.toUpperCase()]: tokenMeta,
          }),
        }
      }

      if (tokenMeta.cw20s) {
        const cw20Maps = tokenMeta.cw20s.reduce(
          (result, cw20) => ({
            ...result,
            [cw20.symbol.toUpperCase()]: tokenMeta,
          }),
          {} as Record<string, TokenMetaBase>,
        )

        cw20sResults = {
          ...cw20Maps,
        }
      }

      if (tokenMeta.evm && tokenMeta.evm.symbol) {
        evmResults = {
          [tokenMeta.evm.symbol.toUpperCase()]: tokenMeta,
        }
      }

      if (tokenMeta.erc20 && tokenMeta.erc20.symbol) {
        erc20Results = {
          [tokenMeta.erc20.symbol.toUpperCase()]: tokenMeta,
        }
      }

      return {
        ...result,
        ...splResults,
        ...evmResults,
        ...ibcResults,
        ...cw20Results,
        ...cw20sResults,
        ...erc20Results,
        ...(symbol && {
          [symbol.toUpperCase()]: tokenMeta,
        }),
        ...(symbolDiffs && {
          [symbolKey.toUpperCase()]: tokenMeta,
        }),
      }
    },
    {},
  ) as Record<string, TokenMetaBase>
