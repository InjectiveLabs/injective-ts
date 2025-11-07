import type * as InjectivePeggyV1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/peggy/v1/query_pb.mjs'
import type { PeggyModuleParams } from '../types/peggy.js'

/**
 * @category Chain Grpc Transformer
 */
export class ChainGrpcPeggyTransformer {
  static moduleParamsResponseToModuleParams(
    response: InjectivePeggyV1QueryPb.QueryParamsResponse,
  ): PeggyModuleParams {
    const params = response.params!
    const valsetReward = params.valsetReward

    return {
      peggyId: params.peggyId,
      contractSourceHash: params.contractSourceHash,
      bridgeEthereumAddress: params.bridgeEthereumAddress,
      bridgeChainId: params.bridgeChainId.toString(),
      signedValsetsWindow: params.signedValsetsWindow.toString(),
      signedBatchesWindow: params.signedBatchesWindow.toString(),
      signedClaimsWindow: params.signedClaimsWindow.toString(),
      targetBatchTimeout: params.targetBatchTimeout.toString(),
      averageBlockTime: params.averageBlockTime.toString(),
      averageEthereumBlockTime: params.averageEthereumBlockTime.toString(),
      slashFractionValset: params.slashFractionValset,
      slashFractionBatch: params.slashFractionBatch,
      slashFractionClaim: params.slashFractionClaim,
      slashFractionConflictingClaim: params.slashFractionConflictingClaim,
      unbondSlashingValsetsWindow:
        params.unbondSlashingValsetsWindow.toString(),
      slashFractionBadEthSignature: params.slashFractionBadEthSignature,
      cosmosCoinDenom: params.cosmosCoinDenom,
      cosmosCoinErc20Contract: params.cosmosCoinErc20Contract,
      claimSlashingEnabled: params.claimSlashingEnabled,
      bridgeContractStartHeight: params.bridgeContractStartHeight.toString(),
      valsetReward: {
        denom: valsetReward!.denom,
        amount: valsetReward!.amount,
      },
    }
  }
}
