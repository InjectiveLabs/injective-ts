import { TokenMeta } from '../../types'
import {
  devnetSymbolToAddressMap,
  devnet1SymbolToAddressMap,
  devnet2SymbolToAddressMap,
  testnetSymbolToErc20AddressMap,
  testnetSymbolToCw20AddressMap,
} from '../helpers/testnetMap'
import tokens from '../tokens'

export const tokensBySymbolForTestnet = (
  Object.keys(tokens) as Array<keyof typeof tokens>
).reduce((result, token) => {
  const tokenKey = token as keyof typeof testnetSymbolToErc20AddressMap
  const testnetAddressFromMap = testnetSymbolToErc20AddressMap[tokenKey]
  const testnetAddress = (testnetAddressFromMap ||
    tokens[token].erc20Address) as string

  const c20TokenKey = token as keyof typeof testnetSymbolToCw20AddressMap
  const cw20TestnetAddressFromMap = testnetSymbolToCw20AddressMap[c20TokenKey]
  const cw20TestnetAddress = (cw20TestnetAddressFromMap ||
    tokens[token].cw20Address) as string

  return {
    ...result,
    [token.toUpperCase()]: {
      ...tokens[token],
      erc20Address: testnetAddress,
      cw20Address: cw20TestnetAddress,
    },
  }
}, {}) as Record<string, TokenMeta>

export const tokensBySymbolForDevnet = (
  Object.keys(tokens) as Array<keyof typeof tokens>
).reduce((result, token) => {
  const tokenKey = token as keyof typeof devnetSymbolToAddressMap
  const testnetAddressFromMap = devnetSymbolToAddressMap[tokenKey]
  const testnetAddress = (testnetAddressFromMap ||
    tokens[token].erc20Address) as string

  return {
    ...result,
    [token.toUpperCase()]: { ...tokens[token], erc20Address: testnetAddress },
  }
}, {}) as Record<string, TokenMeta>

export const tokensBySymbolForDevnet1 = (
  Object.keys(tokens) as Array<keyof typeof tokens>
).reduce((result, token) => {
  const tokenKey = token as keyof typeof devnet1SymbolToAddressMap
  const testnetAddressFromMap = devnet1SymbolToAddressMap[tokenKey]
  const testnetAddress = (testnetAddressFromMap ||
    tokens[token].erc20Address) as string

  return {
    ...result,
    [token.toUpperCase()]: { ...tokens[token], erc20Address: testnetAddress },
  }
}, {}) as Record<string, TokenMeta>

export const tokensBySymbolForDevnet2 = (
  Object.keys(tokens) as Array<keyof typeof tokens>
).reduce((result, token) => {
  const tokenKey = token as keyof typeof devnet2SymbolToAddressMap
  const testnetAddressFromMap = devnet2SymbolToAddressMap[tokenKey]
  const testnetAddress = (testnetAddressFromMap ||
    tokens[token].erc20Address) as string

  return {
    ...result,
    [token.toUpperCase()]: { ...tokens[token], erc20Address: testnetAddress },
  }
}, {}) as Record<string, TokenMeta>
