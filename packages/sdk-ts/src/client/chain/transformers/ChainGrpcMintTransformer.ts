import { QueryParamsResponse } from '@injectivelabs/chain-api/cosmos/mint/v1beta1/query_pb'
import { MinModuleParams } from '../types/mint'

export class ChainGrpcMintTransformer {
  static moduleParamsResponseToModuleParams(
    response: QueryParamsResponse,
  ): MinModuleParams {
    const params = response.getParams()!

    return params.toObject()
  }
}
