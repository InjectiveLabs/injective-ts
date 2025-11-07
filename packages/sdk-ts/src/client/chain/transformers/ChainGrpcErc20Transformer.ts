import { ChainGrpcCommonTransformer } from './ChainGrpcCommonTransformer.js'
import type * as InjectiveErc20V1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/erc20/v1beta1/query_pb.mjs'
import type { Params, TokenPair, GrpcTokenPair } from '../types/erc20.js'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcErc20Transformer {
  static grpcTokenPairToTokenPair(grpcTokenPair: GrpcTokenPair): TokenPair {
    return {
      bankDenom: grpcTokenPair.bankDenom,
      erc20Address: grpcTokenPair.erc20Address,
    }
  }

  static paramsResponseToParams(
    response: InjectiveErc20V1Beta1QueryPb.QueryParamsResponse,
  ): Params {
    const params = response.params!

    return {
      denomCreationFee: params?.denomCreationFee,
    }
  }

  static tokenPairsResponseToTokenPairs(
    response: InjectiveErc20V1Beta1QueryPb.QueryAllTokenPairsResponse,
  ) {
    return {
      tokenPairs: response.tokenPairs.map((tokenPair) => ({
        bankDenom: tokenPair.bankDenom,
        erc20Address: tokenPair.erc20Address,
      })),
      pagination: ChainGrpcCommonTransformer.grpcPaginationToPaginationV2(
        response.pagination,
      ),
    }
  }
}
