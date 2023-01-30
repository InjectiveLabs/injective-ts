import {
  TokenMeta as GrpcTokenMeta,
  PriceLevel as GrpcPriceLevel,
} from '@injectivelabs/indexer-proto-ts/injective_spot_exchange_rpc'

export interface PriceLevel {
  price: string
  quantity: string
  timestamp: number
}

export interface Orderbook {
  buys: PriceLevel[]
  sells: PriceLevel[]
}

export interface IndexerTokenMeta extends GrpcTokenMeta {
  coinGeckoId: string
}

export { GrpcTokenMeta, GrpcPriceLevel }
