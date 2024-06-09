import type { Token } from '@injectivelabs/token-metadata'
import { TokenType, TokenVerification } from '@injectivelabs/token-metadata'
import { TokenMetadataResponse } from 'alchemy-sdk'

export const getKeyFromRpcUrl = (rpcUrl: string) => {
  if (!rpcUrl.includes('alchemyapi.io') && !rpcUrl.includes('alchemy.com')) {
    return rpcUrl
  }

  const [key] = rpcUrl.split('/').reverse()

  return key
}

export const getTokenFromAlchemyTokenMetaResponse = (
  denom: string,
  response: TokenMetadataResponse,
): Token => {
  return {
    denom,
    name: response.name || 'Unknown',
    symbol: response.symbol || response.name || 'Unknown',
    decimals: response.decimals || 18,
    logo: response.logo || 'unknown.png',
    coinGeckoId: '',
    tokenType: TokenType.Erc20,
    tokenVerification: TokenVerification.External,

    erc20: {
      decimals: response.decimals || 18,
      address: denom.replace('peggy', ''),
      symbol: response.symbol || response.name || 'Unknown',
    },
  } as Token
}
