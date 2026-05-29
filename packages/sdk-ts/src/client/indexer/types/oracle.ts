import type * as InjectiveOracleRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_oracle_rpc_pb'

export type GrpcOracle = InjectiveOracleRpcPb.Oracle

export type GrpcOraclePriceV2 = InjectiveOracleRpcPb.PriceV2Result

export interface Oracle extends GrpcOracle {
  //
}

export interface OraclePriceV2Filter {
  baseSymbol: string
  quoteSymbol: string
  oracleType: string
  oracleScaleFactor: number
}

export interface OraclePriceV2 extends GrpcOraclePriceV2 {
  //
}
