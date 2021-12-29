import { TokenMeta } from '../../types'
import { testnetSymbolToAddressMap } from '../helpers/testnetMap'
import tokens from '../tokens'

const mappedTokens = (Object.keys(tokens) as Array<keyof typeof tokens>).reduce(
  (result, token) => {
    const tokenKey = token as keyof typeof testnetSymbolToAddressMap
    const testnetAddressFromMap = testnetSymbolToAddressMap[tokenKey]
    const testnetAddress = (testnetAddressFromMap ||
      tokens[token].address) as string

    return {
      ...result,
      [token.toUpperCase()]: { ...tokens[token], address: testnetAddress },
    }
  },
  {},
) as Record<string, TokenMeta>

export default mappedTokens as Record<string, TokenMeta>
