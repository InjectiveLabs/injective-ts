import { OracleListResponse } from '@injectivelabs/exchange-api/injective_oracle_rpc_pb'
import { GrpcOracle, Oracle } from '../types/oracle'

/**
 * @category Exchange Grpc Transformer
 */
export class ExchangeGrpcOracleTransformer {
  static oraclesResponseToOracles(response: OracleListResponse): Oracle[] {
    const oracles = response.getOraclesList()

    return oracles.map((o) =>
      ExchangeGrpcOracleTransformer.grpcOracleToOracle(o),
    )
  }

  static grpcOracleToOracle(grpcOracle: GrpcOracle): Oracle {
    return grpcOracle.toObject()
  }
}
