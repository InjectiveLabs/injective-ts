import { TokenMeta } from '../../types'
import { kovanSymbolToAddressMap } from '../helpers/kovanMap'
import tokens from '../tokens'

const mappedTokens = (Object.keys(tokens) as Array<keyof typeof tokens>).reduce(
  (result, token) => {
    // @ts-ignore
    const kovanAddress = kovanSymbolToAddressMap[token] || tokens[token].address

    return {
      ...result,
      [token.toUpperCase()]: { ...tokens[token], address: kovanAddress },
    }
  },
  {},
) as Record<string, TokenMeta>

export default mappedTokens as Record<string, TokenMeta>
