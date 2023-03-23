import { InjectiveOracleRpc } from '@injectivelabs/indexer-proto-ts'

export type GrpcOracle = InjectiveOracleRpc.Oracle

export interface Oracle extends GrpcOracle {
  //
}
