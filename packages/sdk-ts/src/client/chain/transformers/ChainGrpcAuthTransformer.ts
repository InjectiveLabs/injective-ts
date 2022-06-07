import {
  // QueryAccountsResponse,
  // QueryAccountResponse,
  QueryParamsResponse,
} from '@injectivelabs/chain-api/cosmos/auth/v1beta1/query_pb'
import { AuthModuleParams } from '../types/auth'

export class ChainGrpcAuthTransformer {
  static moduleParamsResponseToModuleParams(
    response: QueryParamsResponse,
  ): AuthModuleParams {
    const params = response.getParams()!

    return {
      maxMemoCharacters: params.getMaxMemoCharacters(),
      txSigLimit: params.getTxSigLimit(),
      txSizeCostPerByte: params.getTxSizeCostPerByte(),
      sigVerifyCostEd25519: params.getSigVerifyCostEd25519(),
      sigVerifyCostSecp256k1: params.getSigVerifyCostSecp256k1(),
    }
  }
}
