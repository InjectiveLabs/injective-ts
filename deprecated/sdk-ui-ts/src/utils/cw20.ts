import { Contract, ContractStateWithPagination } from '@injectivelabs/sdk-ts'
import {
  TokenType,
  TokenVerification,
  type Token,
} from '@injectivelabs/token-metadata'

export const getTokenFromContractStateResponse = (
  denom: string,
  response: ContractStateWithPagination,
): Token => {
  const { tokenInfo, contractInfo } = response
  const contractAddress = denom.startsWith('factory')
    ? denom.split('/')[2]
    : denom

  return {
    denom,
    name: tokenInfo.name || contractInfo.label || 'Unknown',
    symbol: tokenInfo.symbol || tokenInfo.name || 'Unknown',
    decimals: tokenInfo.decimals || 18,
    logo: 'unknown.png',
    coinGeckoId: '',
    tokenType: TokenType.Cw20,
    tokenVerification: TokenVerification.Internal,

    cw20: {
      decimals: tokenInfo.decimals || 18,
      address: contractAddress,
      symbol: tokenInfo.symbol || tokenInfo.name || 'Unknown',
    },
  } as Token
}

export const getTokenFromCw20ContractInfo = (
  denom: string,
  response: Contract & { cw20_metadata: { token_info: any } },
): Token => {
  const contractAddress = denom.startsWith('factory')
    ? denom.split('/')[2]
    : denom

  return {
    denom,
    name: response.cw20_metadata.token_info.name || response.label || 'Unknown',
    symbol:
      response.cw20_metadata.token_info.symbol ||
      response.cw20_metadata.token_info.name ||
      'Unknown',
    decimals: response.cw20_metadata.token_info.decimals || 18,
    logo: 'unknown.png',
    coinGeckoId: '',
    tokenType: TokenType.Cw20,
    tokenVerification: TokenVerification.Internal,

    cw20: {
      decimals: response.cw20_metadata.token_info.decimals || 18,
      address: contractAddress,
      symbol:
        response.cw20_metadata.token_info.symbol ||
        response.cw20_metadata.token_info.name ||
        'Unknown',
    },
  } as Token
}
