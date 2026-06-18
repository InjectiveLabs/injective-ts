export { TokenType, TokenVerification } from './light.js'
import type { TokenType, TokenVerification } from './light.js'

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

export type TokenSource = (typeof TokenSource)[keyof typeof TokenSource]

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
  description?: string
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
