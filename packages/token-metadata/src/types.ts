export enum TokenType {
  IBC = 'ibc',
  CW20 = 'cw20',
  ERC20 = 'erc20',
  Native = 'native',
  InsuranceFund = 'InsuranceFund',
}

export interface TokenMeta {
  name: string
  logo: string
  symbol: string
  decimals: number
  address: string
  coinGeckoId: string
  updatedAt?: number
}

export interface Token extends TokenMeta {
  denom: string
  tokenType: TokenType
}

export interface IbcToken extends Token {
  baseDenom: string
  channelId: string
  isCanonical?: boolean
}

export type TokenAddress = string
export type TokenAssetData = string
export type TokenSymbol = string

export interface GrpcTokenMeta {
  name: string
  address: string
  symbol: string
  logo: string
  icon?: string
  decimals: number
  updatedAt: number
}
