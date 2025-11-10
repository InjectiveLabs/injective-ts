import { IndexerGrpcMitoTransformer } from './IndexerGrpcMitoTransformer.js'
import type { GoadesignGoagenMitoApiPb } from '@injectivelabs/mito-proto-ts-v2'
import type { StreamOperation } from '../../../types/index.js'

/**
 * @category Indexer Stream Transformer
 */
export class IndexerGrpcMitoStreamTransformer {
  static transfersStreamCallback = (
    response: GoadesignGoagenMitoApiPb.StreamTransfersResponse,
  ) => ({
    transfer: response.data
      ? IndexerGrpcMitoTransformer.mitoTransferHistoryToTransferHistory(
          response.data,
        )
      : undefined,
    opType: response.opType as StreamOperation,
  })

  static vaultStreamCallback = (
    response: GoadesignGoagenMitoApiPb.StreamVaultResponse,
  ) => ({
    vault: response.data
      ? IndexerGrpcMitoTransformer.mitoVaultToVault(response.data)
      : undefined,
    opType: response.opType as StreamOperation,
  })

  static vaultHolderSubscriptionStreamCallback = (
    response: GoadesignGoagenMitoApiPb.StreamHolderSubscriptionResponse,
  ) => ({
    subscription: response.data
      ? IndexerGrpcMitoTransformer.mitoSubscriptionToSubscription(response.data)
      : undefined,
    opType: response.opType as StreamOperation,
  })

  static stakingRewardByAccountStreamCallback = (
    response: GoadesignGoagenMitoApiPb.StreamStakingRewardByAccountResponse,
  ) => ({
    stakingReward: response.data
      ? IndexerGrpcMitoTransformer.mitoStakingRewardToStakingReward(
          response.data,
        )
      : undefined,
    opType: response.opType as StreamOperation,
  })

  static historicalStakingStreamCallback = (
    response: GoadesignGoagenMitoApiPb.StreamHistoricalStakingResponse,
  ) => ({
    historicalStaking: response.data
      ? IndexerGrpcMitoTransformer.mitoStakingActivityToStakingActivity(
          response.data,
        )
      : undefined,
    opType: response.opType as StreamOperation,
  })
}
