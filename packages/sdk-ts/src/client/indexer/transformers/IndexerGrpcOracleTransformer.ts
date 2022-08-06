import { OracleListResponse } from '@injectivelabs/indexer-api/injective_oracle_rpc_pb'
import { GrpcOracle, Oracle } from '../types/oracle'

export class IndexerGrpcOracleTransformer {
  static oraclesResponseToOracles(response: OracleListResponse): Oracle[] {
    const oracles = response.getOraclesList()

    return oracles.map((o) =>
      IndexerGrpcOracleTransformer.grpcOracleToOracle(o),
    )
  }

  static grpcOracleToOracle(grpcOracle: GrpcOracle): Oracle {
    return grpcOracle.toObject()
  }
}
