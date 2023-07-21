import { Metadata } from '@injectivelabs/sdk-ts'
import { TokenType, type Token } from '@injectivelabs/token-metadata'

export const getTokenFromDenomsMetadata = (
  denom: string,
  response: Metadata,
): Token => {
  const [denomUnit] = response.denomUnits.reverse()

  return {
    denom,
    name: response.name || 'Unknown',
    symbol: response.symbol || response.name || 'Unknown',
    decimals: denomUnit.exponent || 18,
    logo: 'injective-v3.svg',
    coinGeckoId: '',
    tokenType: TokenType.TokenFactory,
  } as Token
}
