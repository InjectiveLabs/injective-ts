import { MinModuleParams } from '../types/mint.js'
import { CosmosMintV1Beta1Query } from '@injectivelabs/core-proto-ts'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcMintTransformer {
  static moduleParamsResponseToModuleParams(
    response: CosmosMintV1Beta1Query.QueryParamsResponse,
  ): MinModuleParams {
    const params = response.params!

    return params
  }
}
