import { BinaryOptionsMarketInfo as GrpcBinaryOptionsMarketInfo } from '@injectivelabs/exchange-api/injective_binary_options_exchange_rpc_pb'
import { TokenMeta } from '@injectivelabs/token-metadata'

export interface BinaryOptionsMarket {
  marketId: string
  marketStatus: string
  ticker: string
  oracleSymbol: string
  oracleProvider: string
  oracleType: string
  oracleScaleFactor: number
  expirationTimestamp: number
  settlementTimestamp: number
  quoteDenom: string
  quoteToken: TokenMeta | undefined
  makerFeeRate: string
  takerFeeRate: string
  serviceProviderFee: string
  minPriceTickSize: string
  minQuantityTickSize: string
  settlementPrice: string
}

export { GrpcBinaryOptionsMarketInfo }
