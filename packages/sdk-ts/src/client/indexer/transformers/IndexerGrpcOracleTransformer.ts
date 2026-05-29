import type * as InjectiveOracleRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_oracle_rpc_pb'
import type {
  Oracle,
  GrpcOracle,
  OraclePriceV2,
  GrpcOraclePriceV2,
} from '../types/oracle.js'

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

  static priceV2ResponseToPriceV2(
    response: InjectiveOracleRpcPb.PriceV2Response,
  ): OraclePriceV2[] {
    return response.prices.map((price) =>
      IndexerGrpcOracleTransformer.grpcOraclePriceV2ToOraclePriceV2(price),
    )
  }

  static grpcOraclePriceV2ToOraclePriceV2(
    grpcOraclePriceV2: GrpcOraclePriceV2,
  ): OraclePriceV2 {
    return grpcOraclePriceV2
  }
}
