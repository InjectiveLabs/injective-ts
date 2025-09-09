export type TokenType =
  | 'ibc'
  | 'cw20'
  | 'spl'
  | 'erc20'
  | 'lp'
  | 'evm'
  | 'native'
  | 'symbol'
  | 'tokenFactory'
  | 'insuranceFund'
  | 'unknown'

export const TokenType = {
  Ibc: 'ibc',
  Cw20: 'cw20',
  Spl: 'spl',
  Erc20: 'erc20',
  Lp: 'lp',
  Evm: 'evm',
  Native: 'native',
  Symbol: 'symbol',
  TokenFactory: 'tokenFactory',
  InsuranceFund: 'insuranceFund',
  Unknown: 'unknown',
} as const

export type TokenVerification =
  | 'verified'
  | 'submitted'
  | 'internal'
  | 'external'
  | 'unverified'

export const TokenVerification = {
  Verified: 'verified',
  Submitted: 'submitted',
  Internal: 'internal',
  External: 'external',
  Unverified: 'unverified',
} as const

export type TokenSource =
  | 'aptos'
  | 'solana'
  | 'cosmos'
  | 'ethereum'
  | 'ethereum-wormhole'
  | 'polygon'
  | 'klaytn'
  | 'arbitrum'
  | 'sui'
  | 'ibc'
  | 'binance-smart-chain'
  | 'axelar'

export const TokenSource = {
  Aptos: 'aptos',
  Solana: 'solana',
  Cosmos: 'cosmos',
  Ethereum: 'ethereum',
  EthereumWh: 'ethereum-wormhole',
  Polygon: 'polygon',
  Klaytn: 'klaytn',
  Arbitrum: 'arbitrum',
  Sui: 'sui',
  Ibc: 'ibc',
  BinanceSmartChain: 'binance-smart-chain',
  Axelar: 'axelar',
} as const

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
  overrideSymbol?: string
}

export interface TokenMeta {
  name: string
  logo: string
  symbol: string
  decimals: number
  tokenType: TokenType
  coinGeckoId: string
}
