export enum TokenType {
  Ibc = 'ibc',
  Cw20 = 'cw20',
  Spl = 'spl',
  Erc20 = 'erc20',
  Lp = 'lp',
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
  marketIds?: string[]
}

export interface TokenMeta {
  name: string
  logo: string
  symbol: string
  decimals: number
  tokenType: TokenType
  coinGeckoId: string
}
