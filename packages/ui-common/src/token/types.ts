export type TokenAddress = string
export type TokenAssetData = string
export type TokenSymbol = string

interface Base {
  symbol: string
  name: string
  icon?: string
  decimals: number
}

export interface Token extends Base {
  address: string
  denom: string
  coinGeckoId: string
}

export interface IbcToken extends Token {
  baseDenom: string
  channelId: string
}

export interface TokenWithBalance extends Base {
  address: string
  denom: string
  balance: string // BigNumberInWei
  allowance: string // BigNumberInWei
  coinGeckoId: string
}

export interface TokenWithUsdPrice extends Token {
  usdPrice: number
}

export interface TokenWithBalanceAndPrice extends Base {
  address: string
  denom: string
  isIbc?: boolean
  balance: string // BigNumberInWei
  allowance: string // BigNumberInWei
  usdPrice: number
  coinGeckoId: string
}

export interface GrpcTokenMeta {
  name: string
  address: string
  symbol: string
  logo: string
  decimals: number
  updatedAt: number
}
