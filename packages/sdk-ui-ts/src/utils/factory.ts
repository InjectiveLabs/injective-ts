import { Metadata } from '@injectivelabs/sdk-ts'
import {
  TokenType,
  TokenVerification,
  type FactoryToken,
} from '@injectivelabs/token-metadata'

export const getTokenFromDenomsMetadata = (
  denom: string,
  response: Metadata,
): FactoryToken => {
  const [denomUnit] = response.denomUnits.reverse()

  return {
    denom,
    name: response.name || response.symbol || denom,
    display: response.display,
    description: response.description,
    symbol: response.symbol || response.name || 'Unknown',
    decimals: denomUnit.exponent || 0,
    logo: response.uri || 'unknown.svg',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
    tokenVerification: TokenVerification.Internal,
  } as FactoryToken
}
