export enum TokenType {
  Ibc = 'ibc',
  Cw20 = 'cw20',
  Spl = 'spl',
  Erc20 = 'erc20',
  Evm = 'evm',
  Native = 'native',
  Symbol = 'symbol',
  TokenFactory = 'tokenFactory',
  InsuranceFund = 'insuranceFund',
  Unknown = 'unknown',
}

export enum TokenVerification {
  Verified = 'verified' /** verified on token-metadata package */,
  Submitted = 'submitted' /** submitted on token-metadata package but not verified */,
  Internal = 'internal' /** verified from on-chain data */,
  External = 'external' /** verified on external source */,
  Unverified = 'unverified' /** unverified on any source */,
}

export enum TokenSource {
  Aptos = 'aptos',
  Solana = 'solana',
  Cosmos = 'cosmos',
  Ethereum = 'ethereum',
  EthereumWh = 'ethereum-wormhole',
  Polygon = 'polygon',
  Klaytn = 'klaytn',
  Arbitrum = 'arbitrum',
  Sui = 'sui',
  Ibc = 'ibc',
  BinanceSmartChain = 'binance-smart-chain',
  Axelar = 'axelar',
}

/** natively created denoms - not derived from a CW20 */
export interface NativeTokenFactoryMeta {
  creator: string
  symbol: string
  name?: string
  logo?: string
  description?: string
  decimals: number
  coinGeckoId?: string
}

export interface IbcTokenMeta {
  hash: string
  path: string
  name?: string
  logo?: string
  channelId: string
  decimals: number
  symbol: string
  isNative: boolean
  baseDenom: string
  coinGeckoId?: string
}

export interface SplTokenMeta {
  address: string
  decimals: number
  symbol: string
  name?: string
  logo?: string
  isNative?: boolean
  coinGeckoId?: string
}

export interface Erc20TokenMeta {
  address: string
  decimals: number
  symbol: string
  name?: string
  logo?: string
  isNative?: boolean
  coinGeckoId?: string
}

export interface EvmTokenMeta {
  address: string
  decimals: number
  symbol: string
  name?: string
  logo?: string
  isNative?: boolean
  coinGeckoId?: string
}

export interface Cw20TokenMeta {
  address: string
  decimals: number
  symbol: string
  name?: string
  logo?: string
  coinGeckoId?: string
}

export interface Cw20TokenMetaWithSource extends Cw20TokenMeta {
  source?: TokenSource
}

export interface IbcTokenMetaWithSource extends IbcTokenMeta {
  source?: TokenSource
}

export interface TokenMetaBase {
  name?: string
  logo?: string
  symbol?: string
  decimals?: number
  tokenType?: TokenType // primary token type
  tokenVerification?: TokenVerification
  coinGeckoId?: string

  ibcs?: Array<Omit<IbcTokenMetaWithSource, 'tokenType'>>
  spl?: Omit<SplTokenMeta, 'tokenType'>
  cw20s?: Array<Omit<Cw20TokenMetaWithSource, 'tokenType'>>
  erc20?: Omit<Erc20TokenMeta, 'tokenType'>
  evm?: Omit<EvmTokenMeta, 'tokenType'>
  tokenFactories?: Array<Omit<NativeTokenFactoryMeta, 'tokenType'>>
}

export interface TokenMeta {
  name: string
  logo: string
  symbol: string
  decimals: number
  tokenType: TokenType
  tokenVerification?: TokenVerification
  coinGeckoId: string

  ibc?: IbcTokenMeta
  spl?: SplTokenMeta
  cw20?: Cw20TokenMeta
  erc20?: Erc20TokenMeta
  evm?: EvmTokenMeta
  tokenFactory?: NativeTokenFactoryMeta
}

export type TokenBase = TokenMetaBase & {
  denom: string
}

export type BaseToken = TokenMeta & {
  denom: string
}

// Insurance fund tokens, token factory tokens, etc
export interface NativeToken extends TokenMeta {
  denom: string
}

export interface Erc20Token extends BaseToken {
  erc20: Erc20TokenMeta
}

export interface EvmToken extends BaseToken {
  evm: EvmTokenMeta
}

export interface IbcToken extends BaseToken {
  ibc: IbcTokenMeta
}

export interface Cw20TokenSingle extends BaseToken {
  cw20: Cw20TokenMeta
}

export interface Cw20TokenMultiple extends BaseToken {
  cw20s: Cw20TokenMetaWithSource[]
}

export interface IbcTokenMultiple extends BaseToken {
  ibcs: IbcTokenMetaWithSource[]
}

export interface Cw20Token extends BaseToken {
  cw20: Cw20TokenMeta
}

export interface SplToken extends BaseToken {
  spl: SplTokenMeta
}

/** @deprecated - use  TokenFactoryToken */
export interface FactoryToken extends BaseToken {
  display: string
  description: string
}

export interface TokenFactoryToken extends BaseToken {
  tokenFactory: NativeTokenFactoryMeta
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
  | FactoryToken
  | TokenFactoryToken

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

export interface TokenStatic {
  name: string
  logo: string
  symbol: string
  decimals: number
  coinGeckoId: string
  denom: string
  address: string
  tokenType: TokenType
  tokenVerification: TokenVerification
  isNative?: boolean
  source?: TokenSource
  hash?: string
  path?: string
  channelId?: string
  baseDenom?: string
  externalLogo?: string
}
