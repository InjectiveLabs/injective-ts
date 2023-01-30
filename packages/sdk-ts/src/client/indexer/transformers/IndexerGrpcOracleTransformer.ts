import { OracleListResponse } from '@injectivelabs/indexer-proto-ts/injective_oracle_rpc'
import { GrpcOracle, Oracle } from '../types/oracle'

export class IndexerGrpcOracleTransformer {
  static oraclesResponseToOracles(response: OracleListResponse): Oracle[] {
    const oracles = response.oracles

    return oracles.map((o) =>
      IndexerGrpcOracleTransformer.grpcOracleToOracle(o),
    )
  }

  static grpcOracleToOracle(grpcOracle: GrpcOracle): Oracle {
    return grpcOracle
  }
}
