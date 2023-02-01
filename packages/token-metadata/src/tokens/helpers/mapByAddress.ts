import { TokenMeta } from '../../types'

export const getMappedTokensByErc20Address = (
  tokens: Record<string, TokenMeta>,
) =>
  (Object.keys(tokens) as Array<keyof typeof tokens>)
    .filter((token) => !!tokens[token].erc20Address)
    .reduce(
      (result, token) => ({
        ...result,
        [tokens[token].erc20Address!.toLowerCase()]: tokens[token],
      }),
      {},
    ) as Record<string, TokenMeta>

export const getMappedTokensByCw20Address = (
  tokens: Record<string, TokenMeta>,
) =>
  (Object.keys(tokens) as Array<keyof typeof tokens>)
    .filter((token) => !!tokens[token].cw20Address)
    .reduce(
      (result, token) => ({
        ...result,
        [tokens[token].cw20Address!.toLowerCase()]: tokens[token],
      }),
      {},
    ) as Record<string, TokenMeta>
