import {
  TokenMeta as GrpcTokenMeta,
  PriceLevel as GrpcPriceLevel,
} from '@injectivelabs/exchange-api/injective_spot_exchange_rpc_pb'

export interface PriceLevel {
  price: string
  quantity: string
  timestamp: number
}

export interface Orderbook {
  buys: PriceLevel[]
  sells: PriceLevel[]
}

export interface TokenMeta {
  name: string
  address: string
  symbol: string
  logo: string
  decimals: number
  updatedAt: number
}

export { GrpcTokenMeta, GrpcPriceLevel }
