export enum TokenType {
  Native = 'native',
  Erc20 = 'erc20',
  Ibc = 'ibc',
  Cw20 = 'cw20',
  InsuranceFund = 'insuranceFund',
  TokenFactory = 'tokenFactory',
}

export interface TokenMeta {
  name: string
  logo: string
  symbol: string
  decimals: number
  // Decimals on the origin chain in case they are different
  nativeDecimals?: number
  erc20Address?: string
  cw20Address?: string
  coinGeckoId: string
}

export type BaseToken = TokenMeta & {
  denom: string
  tokenType: TokenType
}

export interface NativeToken extends TokenMeta {
  denom: string
}

export interface Erc20Token extends BaseToken {
  erc20Address: string
}

export interface IbcToken extends BaseToken {
  baseDenom: string
  channelId: string
  isCanonical: boolean
}

export interface Cw20Token extends BaseToken {
  cw20Address: string
}

export interface InsuranceFundToken extends BaseToken {
  //
}

export type Token = Erc20Token | IbcToken | Cw20Token | InsuranceFundToken

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
