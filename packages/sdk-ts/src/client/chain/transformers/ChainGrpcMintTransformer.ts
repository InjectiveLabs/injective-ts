import { QueryParamsResponse } from '@injectivelabs/core-proto-ts/cosmos/mint/v1beta1/query'
import { MinModuleParams } from '../types/mint'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcMintTransformer {
  static moduleParamsResponseToModuleParams(
    response: QueryParamsResponse,
  ): MinModuleParams {
    const params = response.params!

    return params
  }
}
