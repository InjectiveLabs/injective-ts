import { InjectiveSpotExchangeRpc } from '@injectivelabs/indexer-proto-ts'
import { TokenType } from './../../../types/token.js'

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

export type GrpcTokenMeta = InjectiveSpotExchangeRpc.TokenMeta
export type GrpcPriceLevel = InjectiveSpotExchangeRpc.PriceLevel

export interface IndexerTokenMeta extends GrpcTokenMeta {
  coinGeckoId: string
  tokenType: TokenType
}
