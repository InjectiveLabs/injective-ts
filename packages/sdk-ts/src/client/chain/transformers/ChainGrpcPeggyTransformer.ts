import { QueryParamsResponse } from '@injectivelabs/chain-api/injective/peggy/v1/query_pb'
import { PeggyModuleParams } from '../types/peggy'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcPeggyTransformer {
  static moduleParamsResponseToModuleParams(
    response: QueryParamsResponse,
  ): PeggyModuleParams {
    const params = response.getParams()!
    const valsetReward = params.getValsetReward()

    return {
      peggyId: params.getPeggyId(),
      contractSourceHash: params.getContractSourceHash(),
      bridgeEthereumAddress: params.getBridgeEthereumAddress(),
      bridgeChainId: params.getBridgeChainId(),
      signedValsetsWindow: params.getSignedValsetsWindow(),
      signedBatchesWindow: params.getSignedBatchesWindow(),
      signedClaimsWindow: params.getSignedClaimsWindow(),
      targetBatchTimeout: params.getTargetBatchTimeout(),
      averageBlockTime: params.getAverageBlockTime(),
      averageEthereumBlockTime: params.getAverageEthereumBlockTime(),
      slashFractionValset: params.getSlashFractionValset(),
      slashFractionBatch: params.getSlashFractionBatch(),
      slashFractionClaim: params.getSlashFractionClaim(),
      slashFractionConflictingClaim: params.getSlashFractionConflictingClaim(),
      unbondSlashingValsetsWindow: params.getUnbondSlashingValsetsWindow(),
      slashFractionBadEthSignature: params.getSlashFractionBadEthSignature(),
      cosmosCoinDenom: params.getCosmosCoinDenom(),
      cosmosCoinErc20Contract: params.getCosmosCoinErc20Contract(),
      claimSlashingEnabled: params.getClaimSlashingEnabled(),
      bridgeContractStartHeight: params.getBridgeContractStartHeight(),
      valsetReward: {
        denom: valsetReward!.getDenom(),
        amount: valsetReward!.getAmount(),
      },
    }
  }
}
