import { ContractStateWithPagination } from '@injectivelabs/sdk-ts'
import { TokenType, type Token } from '@injectivelabs/token-metadata'

export const getTokenFromContractStateResponse = (
  denom: string,
  response: ContractStateWithPagination,
): Token => {
  const { tokenInfo } = response

  return {
    denom,
    name: tokenInfo.name || 'Unknown',
    symbol: tokenInfo.symbol || tokenInfo.name || 'Unknown',
    decimals: tokenInfo.decimals || 18,
    logo: 'untracked.svg',
    coinGeckoId: '',
    tokenType: TokenType.Erc20,

    cw20: {
      decimals: tokenInfo.decimals || 18,
      address: denom.replace('peggy', ''),
      symbol: tokenInfo.symbol || tokenInfo.name || 'Unknown',
      tokenType: TokenType.Cw20,
    },
  } as Token
}
