import { Metadata } from '@injectivelabs/sdk-ts'
import {
  TokenType,
  TokenVerification,
  type Token,
} from '@injectivelabs/token-metadata'

export const getTokenFromDenomsMetadata = (
  denom: string,
  response: Metadata,
): Token => {
  const [denomUnit] = response.denomUnits.reverse()

  return {
    denom,
    name: response.name || response.symbol || denom,
    symbol: response.symbol || response.name || 'Unknown',
    decimals: denomUnit.exponent || 0,
    logo: response.uri || 'unknown.svg',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
    tokenVerification: TokenVerification.Internal,
  } as Token
}
