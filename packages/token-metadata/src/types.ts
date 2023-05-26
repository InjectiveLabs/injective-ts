export enum TokenType {
  Ibc = 'ibc',
  Cw20 = 'cw20',
  Spl = 'spl',
  Erc20 = 'erc20',
  Evm = 'evm',
  Native = 'native',
  TokenFactory = 'tokenFactory',
  InsuranceFund = 'insuranceFund',
  Unknown = 'unknown',
}

export enum Cw20TokenSource {
  Solana = 'solana',
  Cosmos = 'cosmos',
  Ethereum = 'ethereum',
  EthereumWh = 'ethereum-wormhole',
  Polygon = 'polygon',
  Klaytn = 'klaytn',
  Arbitrum = 'arbitrum',
  Sui = 'sui',
}

export interface IbcTokenMeta {
  hash: string
  path: string
  channelId: string
  decimals: number
  symbol?: string
  isNative: boolean
  baseDenom: string
}

export interface SplTokenMeta {
  address: string
  decimals: number
  symbol?: string
  isNative?: boolean
}

export interface Erc20TokenMeta {
  address: string
  decimals: number
  symbol?: string
  isNative?: boolean
}

export interface EvmTokenMeta {
  address: string
  decimals: number
  symbol?: string
  isNative?: boolean
}

export interface Cw20TokenMeta {
  address: string
  decimals: number
  tokenType: TokenType.Cw20
}

export interface Cw20TokenMetaWithSource extends Cw20TokenMeta {
  symbol: string
  source: Cw20TokenSource
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
  cw20?: Cw20TokenMeta
  cw20s?: Cw20TokenMetaWithSource[] // When there are multiple variations of the same CW20 token
  erc20?: Erc20TokenMeta
  evm?: EvmTokenMeta
}

export type BaseToken = TokenMeta & {
  denom: string
}

// Insurance fund tokens, token factory tokens, etc
export interface NativeToken extends TokenMeta {
  denom: string
  tokenType: TokenType
}

export interface Erc20Token extends BaseToken {
  erc20: Erc20TokenMeta
  tokenType: TokenType
}

export interface EvmToken extends BaseToken {
  evm: EvmTokenMeta
  tokenType: TokenType
}

export interface IbcToken extends BaseToken {
  ibc: IbcTokenMeta
  tokenType: TokenType
}

export interface Cw20TokenSingle extends BaseToken {
  cw20: Cw20TokenMeta
  tokenType: TokenType
}

export interface Cw20TokenMultiple extends BaseToken {
  cw20s: Cw20TokenMetaWithSource[]
  tokenType: TokenType
}

export interface Cw20Token extends BaseToken {
  cw20: Cw20TokenMeta
  cw20s: Cw20TokenMetaWithSource[]
  tokenType: TokenType
}

export interface SplToken extends BaseToken {
  spl: SplTokenMeta
  tokenType: TokenType
}

export type Token =
  | Erc20Token
  | EvmToken
  | IbcToken
  | Cw20Token
  | Cw20TokenSingle
  | Cw20TokenMultiple
  | NativeToken
  | SplToken

export type TokenWithPrice = Token & { usdPrice: number }

export interface GrpcTokenMeta {
  name: string
  logo: string
  icon?: string
  symbol: string
  address: string
  decimals: number
  updatedAt: number
}
