import { TokenMeta } from '../../types'
import {
  devnetSymbolToAddressMap,
  devnet1SymbolToAddressMap,
  testnetSymbolToAddressMap,
} from '../helpers/testnetMap'
import tokens from '../tokens'

export const tokensBySymbolForTestnet = (
  Object.keys(tokens) as Array<keyof typeof tokens>
).reduce((result, token) => {
  const tokenKey = token as keyof typeof testnetSymbolToAddressMap
  const testnetAddressFromMap = testnetSymbolToAddressMap[tokenKey]
  const testnetAddress = (testnetAddressFromMap ||
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
