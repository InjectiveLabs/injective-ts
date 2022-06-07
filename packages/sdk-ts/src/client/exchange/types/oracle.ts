import { Oracle as GrpcOracle } from '@injectivelabs/exchange-api/injective_oracle_rpc_pb'

export interface Oracle extends GrpcOracle.AsObject {
  //
}

export { GrpcOracle }
