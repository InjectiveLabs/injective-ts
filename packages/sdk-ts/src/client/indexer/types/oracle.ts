import type * as InjectiveOracleRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_oracle_rpc_pb'

export type GrpcOracle = InjectiveOracleRpcPb.Oracle

export interface Oracle extends GrpcOracle {
  //
}
