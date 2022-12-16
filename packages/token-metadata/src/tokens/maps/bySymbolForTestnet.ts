import { TokenMeta } from '../../types'
import {
  devnetSymbolToAddressMap,
  devnet1SymbolToAddressMap,
  testnetSymbolToAddressMap,
  testnetSymbolToCw20AddressMap,
} from '../helpers/testnetMap'
import cw20Tokens from '../cw20-tokens'
import nativeTokens from '../native-tokens'
import erc20Tokens from '../tokens'

const tokens = { ...erc20Tokens, ...cw20Tokens, ...nativeTokens } as Record<
  string,
  TokenMeta
>

export const tokensBySymbolForTestnet = (
  Object.keys(tokens) as Array<keyof typeof tokens>
).reduce((result, token) => {
  const tokenKey = token as keyof typeof testnetSymbolToAddressMap
  const tokenCw20Key = token as keyof typeof testnetSymbolToCw20AddressMap
  const testnetAddressFromMap = testnetSymbolToAddressMap[tokenKey]
  const testnetCw20AddressFromMap = testnetSymbolToCw20AddressMap[tokenCw20Key]
  const testnetAddress = (testnetAddressFromMap ||
    testnetCw20AddressFromMap ||
    tokens[token].address) as string

  return {
    ...result,
    [token.toUpperCase()]: { ...tokens[token], address: testnetAddress },
  }
}, {}) as Record<string, TokenMeta>

export const tokensBySymbolForDevnet = (
  Object.keys(tokens) as Array<keyof typeof tokens>
).reduce((result, token) => {
  const tokenKey = token as keyof typeof devnetSymbolToAddressMap
  const testnetAddressFromMap = devnetSymbolToAddressMap[tokenKey]
  const testnetAddress = (testnetAddressFromMap ||
    tokens[token].address) as string

  return {
    ...result,
    [token.toUpperCase()]: { ...tokens[token], address: testnetAddress },
  }
}, {}) as Record<string, TokenMeta>

export const tokensBySymbolForDevnet1 = (
  Object.keys(tokens) as Array<keyof typeof tokens>
).reduce((result, token) => {
  const tokenKey = token as keyof typeof devnet1SymbolToAddressMap
  const testnetAddressFromMap = devnet1SymbolToAddressMap[tokenKey]
  const testnetAddress = (testnetAddressFromMap ||
    tokens[token].address) as string

  return {
    ...result,
    [token.toUpperCase()]: { ...tokens[token], address: testnetAddress },
  }
}, {}) as Record<string, TokenMeta>
