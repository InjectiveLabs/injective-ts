import { TokenMeta } from '../../types'
import {
  devnetSymbolToAddressMap,
  devnet1SymbolToAddressMap,
  devnet2SymbolToAddressMap,
  testnetSymbolToAddressMap,
  testnetSymbolToCw20AddressMap,
} from '../helpers/testnetMap'
import tokens from '../tokens'

export const tokensBySymbolForTestnet = (
  Object.keys(tokens) as Array<keyof typeof tokens>
).reduce((result, token) => {
  const tokenKey = token as keyof typeof testnetSymbolToAddressMap
  const tokenCw20Key = token as keyof typeof testnetSymbolToCw20AddressMap
  const testnetAddressFromMap = testnetSymbolToAddressMap[tokenKey]
  const testnetCw20AddressFromMap = testnetSymbolToCw20AddressMap[tokenCw20Key]
  const testnetAddress = (testnetAddressFromMap ||
    testnetCw20AddressFromMap ||
    tokens[token].erc20address) as string

  return {
    ...result,
    [token.toUpperCase()]: { ...tokens[token], erc20address: testnetAddress },
  }
}, {}) as Record<string, TokenMeta>

export const tokensBySymbolForDevnet = (
  Object.keys(tokens) as Array<keyof typeof tokens>
).reduce((result, token) => {
  const tokenKey = token as keyof typeof devnetSymbolToAddressMap
  const testnetAddressFromMap = devnetSymbolToAddressMap[tokenKey]
  const testnetAddress = (testnetAddressFromMap ||
    tokens[token].erc20address) as string

  return {
    ...result,
    [token.toUpperCase()]: { ...tokens[token], erc20address: testnetAddress },
  }
}, {}) as Record<string, TokenMeta>

export const tokensBySymbolForDevnet1 = (
  Object.keys(tokens) as Array<keyof typeof tokens>
).reduce((result, token) => {
  const tokenKey = token as keyof typeof devnet1SymbolToAddressMap
  const testnetAddressFromMap = devnet1SymbolToAddressMap[tokenKey]
  const testnetAddress = (testnetAddressFromMap ||
    tokens[token].erc20address) as string

  return {
    ...result,
    [token.toUpperCase()]: { ...tokens[token], erc20address: testnetAddress },
  }
}, {}) as Record<string, TokenMeta>

export const tokensBySymbolForDevnet2 = (
  Object.keys(tokens) as Array<keyof typeof tokens>
).reduce((result, token) => {
  const tokenKey = token as keyof typeof devnet2SymbolToAddressMap
  const testnetAddressFromMap = devnet2SymbolToAddressMap[tokenKey]
  const testnetAddress = (testnetAddressFromMap ||
    tokens[token].erc20address) as string

  return {
    ...result,
    [token.toUpperCase()]: { ...tokens[token], erc20address: testnetAddress },
  }
}, {}) as Record<string, TokenMeta>
