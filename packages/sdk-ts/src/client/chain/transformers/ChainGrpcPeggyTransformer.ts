import { PeggyModuleParams } from '../types/peggy.js'
import { InjectivePeggyV1Beta1Query } from '@injectivelabs/core-proto-ts'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcPeggyTransformer {
  static moduleParamsResponseToModuleParams(
    response: InjectivePeggyV1Beta1Query.QueryParamsResponse,
  ): PeggyModuleParams {
    const params = response.params!
    const valsetReward = params.valsetReward

    return {
      peggyId: params.peggyId,
      contractSourceHash: params.contractSourceHash,
      bridgeEthereumAddress: params.bridgeEthereumAddress,
      bridgeChainId: params.bridgeChainId,
      signedValsetsWindow: params.signedValsetsWindow,
      signedBatchesWindow: params.signedBatchesWindow,
      signedClaimsWindow: params.signedClaimsWindow,
      targetBatchTimeout: params.targetBatchTimeout,
      averageBlockTime: params.averageBlockTime,
      averageEthereumBlockTime: params.averageEthereumBlockTime,
      slashFractionValset: params.slashFractionValset,
      slashFractionBatch: params.slashFractionBatch,
      slashFractionClaim: params.slashFractionClaim,
      slashFractionConflictingClaim: params.slashFractionConflictingClaim,
      unbondSlashingValsetsWindow: params.unbondSlashingValsetsWindow,
      slashFractionBadEthSignature: params.slashFractionBadEthSignature,
      cosmosCoinDenom: params.cosmosCoinDenom,
      cosmosCoinErc20Contract: params.cosmosCoinErc20Contract,
      claimSlashingEnabled: params.claimSlashingEnabled,
      bridgeContractStartHeight: params.bridgeContractStartHeight,
      valsetReward: {
        denom: valsetReward!.denom,
        amount: valsetReward!.amount,
      },
    }
  }
}
