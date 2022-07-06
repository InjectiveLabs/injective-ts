export enum TokenType {
  IBC = 'ibc',
  CW20 = 'cw20',
  ERC20 = 'erc20',
}

export interface TokenMeta {
  name: string
  logo: string
  icon?: string
  symbol: string
  decimals: number
  address: string
  coinGeckoId: string
  updatedAt?: number
}

export interface Token extends TokenMeta {
  denom: string
  isIbc?: boolean
}

export interface IbcToken extends Token {
  baseDenom: string
  channelId: string
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
