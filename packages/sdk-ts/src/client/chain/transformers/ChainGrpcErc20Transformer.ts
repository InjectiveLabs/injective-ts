import { ChainGrpcCommonTransformer } from './ChainGrpcCommonTransformer.js'
import type { GrpcTokenPair, TokenPair, Params } from '../types/erc20.js'
import type { InjectiveErc20V1Beta1Query } from '@injectivelabs/core-proto-ts'

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
    response: InjectiveErc20V1Beta1Query.QueryParamsResponse,
  ): Params {
    const params = response.params!

    return {
      denomCreationFee: params?.denomCreationFee,
    }
  }

  static tokenPairsResponseToTokenPairs(
    response: InjectiveErc20V1Beta1Query.QueryAllTokenPairsResponse,
  ) {
    return {
      tokenPairs: response.tokenPairs.map((tokenPair) => ({
        bankDenom: tokenPair.bankDenom,
        erc20Address: tokenPair.erc20Address,
      })),
      pagination: ChainGrpcCommonTransformer.grpcPaginationToPagination(
        response.pagination,
      ),
    }
  }
  // static eipBaseFeeResponseToEipBaseFee(
  //   response: InjectiveTxFeesV1Beta1Query.QueryEipBaseFeeResponse,
  // ): TxFeesEipBaseFee {
  //   return {
  //     baseFee: response.baseFee
  //       ? denomAmountFromGrpcChainDenomAmount(
  //           response.baseFee.baseFee,
  //         ).toFixed()
  //       : undefined,
  //   }
  // }
}
