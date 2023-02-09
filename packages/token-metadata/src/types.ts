export enum TokenType {
  Ibc = 'ibc',
  Cw20 = 'cw20',
  Spl = 'spl',
  Erc20 = 'erc20',
  Native = 'native',
  TokenFactory = 'tokenFactory',
  InsuranceFund = 'insuranceFund',
}

export enum TokenSource {
  Solana = 'solana',
  Cosmos = 'cosmos',
  Ethereum = 'ethereum',
  EthereumWh = 'ethereum-wormhole',
}

export interface IbcTokenMeta {
  hash: string
  path: string
  channelId: string
  decimals: number
  isNative: boolean
  baseDenom: string
}

export interface SplTokenMeta {
  address: string
  decimals: number
  isNative?: boolean
}

export interface Erc20TokenMeta {
  address: string
  decimals: number
  isNative?: boolean
}

export interface Cw20TokenMeta {
  address: string
  decimals: number
  tokenType: TokenType.Cw20
}

export interface Cw20TokenMetaMultiple extends Cw20TokenMeta {
  symbol: string
  source: TokenSource
}

export interface TokenMeta {
  name: string
  logo: string
  symbol: string
  decimals: number
  tokenType?: TokenType
  coinGeckoId: string

  ibc?: IbcTokenMeta
  spl?: SplTokenMeta
  cw20?: Cw20TokenMeta | Cw20TokenMetaMultiple[]
  erc20?: Erc20TokenMeta
}

export type BaseToken = TokenMeta & {
  denom: string
}

// Insurance fund tokens, token factory tokens, etc
export interface NativeToken extends TokenMeta {
  denom: string
  tokenType:
    | TokenType.Native
    | TokenType.InsuranceFund
    | TokenType.Native
    | TokenType.TokenFactory
}

export interface Erc20Token extends BaseToken {
  erc20: Erc20TokenMeta
  tokenType: TokenType.Erc20
}

export interface IbcToken extends BaseToken {
  ibc: IbcTokenMeta
  tokenType: TokenType.Ibc
}

export interface Cw20Token extends BaseToken {
  cw20?: Cw20TokenMeta | Cw20TokenMetaMultiple[]
}

export interface SplToken extends BaseToken {
  spl: SplTokenMeta
  tokenType: TokenType.Spl
}

export type Token = Erc20Token | IbcToken | Cw20Token | NativeToken | SplToken

export interface GrpcTokenMeta {
  name: string
  logo: string
  icon?: string
  symbol: string
  address: string
  decimals: number
  updatedAt: number
}
