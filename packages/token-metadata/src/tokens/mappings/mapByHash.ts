import { TokenMeta } from '../../types'

export const getMappedTokensByHash = (tokens: Record<string, TokenMeta>) =>
  (Object.keys(tokens) as Array<keyof typeof tokens>).reduce(
    (result, token) => {
      if (!tokens[token].ibcs) {
        return result
      }

      const tokenMeta = tokens[token]

      if (tokenMeta.ibcs) {
        const ibcMaps = tokenMeta.ibcs.reduce(
          (result, ibc) => ({
            ...result,
            [ibc.hash.toUpperCase()]: { ...tokens[token], ibc },
          }),
          {} as Record<string, TokenMeta>,
        )

        return {
          ...result,
          ...ibcMaps,
        }
      }

      return result
    },
    {},
  ) as Record<string, TokenMeta>
