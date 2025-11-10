import type { InjectiveOracleRpcPb } from '@injectivelabs/indexer-proto-ts-v2'
import type { Oracle, GrpcOracle } from '../types/oracle.js'

export class IndexerGrpcOracleTransformer {
  static oraclesResponseToOracles(
    response: InjectiveOracleRpcPb.OracleListResponse,
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
