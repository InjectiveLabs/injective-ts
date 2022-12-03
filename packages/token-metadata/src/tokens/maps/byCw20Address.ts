import { TokenMeta } from '../../types'
import { testnetCw20ToAddressMap } from '../helpers/testnetMap'
import tokens from '../tokens'

export const tokensByCW20AddressForTestnet = (
  Object.keys(tokens) as Array<keyof typeof tokens>
).reduce((result, token) => {
  const tokenKey = token as keyof typeof testnetCw20ToAddressMap
  const testnetAddressFromMap = testnetCw20ToAddressMap[tokenKey]
  const testnetAddress = (testnetAddressFromMap ||
    tokens[token].address) as string

  return {
    ...result,
    [token.toUpperCase()]: { ...tokens[token], address: testnetAddress },
  }
}, {}) as Record<string, TokenMeta>
