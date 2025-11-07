import type * as CosmosMintV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/cosmos/mint/v1beta1/query_pb.mjs'
import type { MinModuleParams } from '../types/mint.js'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcMintTransformer {
  static moduleParamsResponseToModuleParams(
    response: CosmosMintV1Beta1QueryPb.QueryParamsResponse,
  ): MinModuleParams {
    const params = response.params!

    return params
  }
}
