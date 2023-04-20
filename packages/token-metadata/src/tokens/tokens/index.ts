import { TokenMeta } from '../../types'
import testnetCw20Tokens from './testnet-cw20-tokens'
import cw20Tokens from './cw20-tokens'
import ibcTokens from './ibc'
import tokens from './tokens'

const allTokens = { ...tokens, ...cw20Tokens }

export const ibcBaseDenoms = Object.keys(allTokens)
  .filter((token) => allTokens[token].ibc)
  .map((token) => allTokens[token].ibc!.baseDenom)

export default allTokens as Record<string, TokenMeta>

export { ibcTokens, testnetCw20Tokens }
