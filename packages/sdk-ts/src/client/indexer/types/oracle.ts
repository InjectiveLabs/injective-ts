import { Oracle as GrpcOracle } from '@injectivelabs/indexer-api/injective_oracle_rpc_pb'

export interface Oracle extends GrpcOracle.AsObject {
  //
}

export { GrpcOracle }
