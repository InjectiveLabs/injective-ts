import type { InjectiveSpotExchangeRpcPb } from '@injectivelabs/indexer-proto-ts-v2'
import type { TokenType } from './../../../types/token.js'

export interface PriceLevel {
  price: string
  quantity: string
  timestamp: number
}

export interface Orderbook {
  buys: PriceLevel[]
  sells: PriceLevel[]
}

export interface OrderbookWithSequence {
  sequence: number
  buys: PriceLevel[]
  sells: PriceLevel[]
}

export type GrpcTokenMeta = InjectiveSpotExchangeRpcPb.TokenMeta
export type GrpcPriceLevel = InjectiveSpotExchangeRpcPb.PriceLevel

export interface IndexerTokenMeta extends Omit<GrpcTokenMeta, 'updatedAt'> {
  coinGeckoId: string
  tokenType: TokenType
  updatedAt: number
}
