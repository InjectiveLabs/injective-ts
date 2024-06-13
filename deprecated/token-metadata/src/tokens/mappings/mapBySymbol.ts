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
      const existingKeys = Object.keys(result)

      let ibcResults = {} as Record<string, TokenMetaBase>
      let cw20Results = {} as Record<string, TokenMetaBase>
      let splResults = {} as Record<string, TokenMetaBase>
      let evmResults = {} as Record<string, TokenMetaBase>
      let erc20Results = {} as Record<string, TokenMetaBase>
      let cw20sResults = {} as Record<string, TokenMetaBase>

      if (tokenMeta.ibcs) {
        tokenMeta.ibcs.forEach(ibc => {
          if (ibc.baseDenom && !existingKeys.includes(ibc.baseDenom.toUpperCase())) {
            ibcResults[ibc.baseDenom.toUpperCase()] = tokenMeta;
          }
          if (ibc.symbol && !existingKeys.includes(ibc.symbol.toUpperCase())) {
            ibcResults[ibc.symbol.toUpperCase()] = tokenMeta;
          }
        });
      }

      if (tokenMeta.cw20s) {
        const cw20Maps = tokenMeta.cw20s.reduce((result, cw20) => {
          if (existingKeys.includes(cw20.symbol.toUpperCase())) {
            return result
          }

          return {
            ...result,
            [cw20.symbol.toUpperCase()]: tokenMeta,
          }
        }, {} as Record<string, TokenMetaBase>)

        cw20sResults = {
          ...cw20Maps,
        }
      }

      if (
        tokenMeta.evm &&
        tokenMeta.evm.symbol &&
        !existingKeys.includes(tokenMeta.evm.symbol.toUpperCase())
      ) {
        evmResults = {
          [tokenMeta.evm.symbol.toUpperCase()]: tokenMeta,
        }
      }

      if (
        tokenMeta.erc20 &&
        tokenMeta.erc20.symbol &&
        !existingKeys.includes(tokenMeta.erc20.symbol.toUpperCase())
      ) {
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
