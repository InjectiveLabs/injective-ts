import type { InjectiveOracleRpcPb } from '@injectivelabs/indexer-proto-ts-v2'

export type GrpcOracle = InjectiveOracleRpcPb.Oracle

export interface Oracle extends GrpcOracle {
  //
}
