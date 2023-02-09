import { TokenMeta } from '../../types'
import tokens from '../tokens'

export const devnetSymbolToAddressMap = {
  INJ: '0xBe8d71D26525440A03311cc7fa372262c5354A3c',
}

export const devnet1SymbolToAddressMap = {
  INJ: '0x87aB3B4C8661e07D6372361211B96ed4Dc36B1B5',
}

export const devnet2SymbolToAddressMap = {
  INJ: '0x87aB3B4C8661e07D6372361211B96ed4Dc36B1B5',
}

export const tokensBySymbolForDevnet = (
  Object.keys(tokens) as Array<keyof typeof tokens>
).reduce((result, token) => {
  const tokenSymbol = token as keyof typeof devnetSymbolToAddressMap
  const testnetAddressFromMap = devnetSymbolToAddressMap[tokenSymbol]

  if (!testnetAddressFromMap) {
    return result
  }

  if (!tokens[token].erc20) {
    return result
  }

  return {
    ...result,
    [token.toUpperCase()]: {
      ...tokens[token],
      erc20: {
        ...tokens[token].erc20,
        address: testnetAddressFromMap,
      },
    },
  }
}, {}) as Record<string, TokenMeta>

export const tokensBySymbolForDevnet1 = (
  Object.keys(tokens) as Array<keyof typeof tokens>
).reduce((result, token) => {
  const tokenSymbol = token as keyof typeof devnet1SymbolToAddressMap
  const testnetAddressFromMap = devnet1SymbolToAddressMap[tokenSymbol]

  if (!testnetAddressFromMap) {
    return result
  }

  if (!tokens[token].erc20) {
    return result
  }

  return {
    ...result,
    [token.toUpperCase()]: {
      ...tokens[token],
      erc20: {
        ...tokens[token].erc20,
        address: testnetAddressFromMap,
      },
    },
  }
}, {}) as Record<string, TokenMeta>

export const tokensBySymbolForDevnet2 = (
  Object.keys(tokens) as Array<keyof typeof tokens>
).reduce((result, token) => {
  const tokenSymbol = token as keyof typeof devnet2SymbolToAddressMap
  const testnetAddressFromMap = devnet2SymbolToAddressMap[tokenSymbol]

  if (!testnetAddressFromMap) {
    return result
  }

  if (!tokens[token].erc20) {
    return result
  }

  return {
    ...result,
    [token.toUpperCase()]: {
      ...tokens[token],
      erc20: {
        ...tokens[token].erc20,
        address: testnetAddressFromMap,
      },
    },
  }
}, {}) as Record<string, TokenMeta>
