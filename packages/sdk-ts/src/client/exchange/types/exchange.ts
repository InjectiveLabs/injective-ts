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

export enum OracleType {
  UNSPECIFIED = 0,
  BAND = 1,
  PRICEFEED = 2,
  COINBASE = 3,
  CHAINLINK = 4,
  RAZOR = 5,
  DIA = 6,
  API3 = 7,
  UMA = 8,
  PYTH = 9,
  BANDIBC = 10,
}

export { GrpcTokenMeta, GrpcPriceLevel }
