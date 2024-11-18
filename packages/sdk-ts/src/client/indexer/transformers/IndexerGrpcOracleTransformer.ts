import { GrpcOracle, Oracle } from '../types/oracle.js'
import { InjectiveOracleRpc } from '@injectivelabs/indexer-proto-ts'

export class IndexerGrpcOracleTransformer {
  static oraclesResponseToOracles(
    response: InjectiveOracleRpc.OracleListResponse,
  ): Oracle[] {
    const oracles = response.oracles

    return oracles.map((o) =>
      IndexerGrpcOracleTransformer.grpcOracleToOracle(o),
    )
  }

  static grpcOracleToOracle(grpcOracle: GrpcOracle): Oracle {
    return grpcOracle
  }
}
