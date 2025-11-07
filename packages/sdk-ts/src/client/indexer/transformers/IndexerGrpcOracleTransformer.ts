import type { InjectiveOracleRpc } from '@injectivelabs/indexer-proto-ts'
import type { Oracle, GrpcOracle } from '../types/oracle.js'

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
