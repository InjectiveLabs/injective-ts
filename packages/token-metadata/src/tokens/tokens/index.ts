import { TokenMeta } from '../../types'
import cw20Tokens from './cw20-tokens'
import ibcTokens from './ibc'
import tokens from './tokens'

const allTokens = { ...tokens, ...cw20Tokens }

export const ibcBaseDenoms = Object.values(allTokens)
  .filter((token) => token.ibcs)
  .reduce(
    (baseDenoms, ibcTokenMeta) => [
      ...baseDenoms,
      ...(ibcTokenMeta.ibcs || []).map(({ baseDenom }) => baseDenom),
    ],
    [] as string[],
  )

export default allTokens as Record<string, TokenMeta>

export { ibcTokens }
