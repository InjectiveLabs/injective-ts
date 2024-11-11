import { MitoApi } from '@injectivelabs/mito-proto-ts'
import { IndexerGrpcMitoTransformer } from './IndexerGrpcMitoTransformer.js'
import { StreamOperation } from '../../../types/index.js'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerGrpcMitoStreamTransformer {
  static transfersStreamCallback = (
    response: MitoApi.StreamTransfersResponse,
  ) => ({
    transfer: response.data
      ? IndexerGrpcMitoTransformer.mitoTransferHistoryToTransferHistory(
          response.data,
        )
      : undefined,
    opType: response.opType as StreamOperation,
  })

  static vaultStreamCallback = (response: MitoApi.StreamVaultResponse) => ({
    vault: response.data
      ? IndexerGrpcMitoTransformer.mitoVaultToVault(response.data)
      : undefined,
    opType: response.opType as StreamOperation,
  })

  static vaultHolderSubscriptionStreamCallback = (
    response: MitoApi.StreamHolderSubscriptionResponse,
  ) => ({
    subscription: response.data
      ? IndexerGrpcMitoTransformer.mitoSubscriptionToSubscription(response.data)
      : undefined,
    opType: response.opType as StreamOperation,
  })

  static stakingRewardByAccountStreamCallback = (
    response: MitoApi.StreamStakingRewardByAccountResponse,
  ) => ({
    stakingReward: response.data
      ? IndexerGrpcMitoTransformer.mitoStakingRewardToStakingReward(
          response.data,
        )
      : undefined,
    opType: response.opType as StreamOperation,
  })

  static historicalStakingStreamCallback = (
    response: MitoApi.StreamHistoricalStakingResponse,
  ) => ({
    historicalStaking: response.data
      ? IndexerGrpcMitoTransformer.mitoStakingActivityToStakingActivity(
          response.data,
        )
      : undefined,
    opType: response.opType as StreamOperation,
  })
}
