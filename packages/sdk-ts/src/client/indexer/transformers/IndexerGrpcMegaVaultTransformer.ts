import { InjectiveMegaVaultRpc } from '@injectivelabs/indexer-proto-ts'
import type {
  MVInformation,
  MVOperatorRedemptionBucket,
  MVRedemption,
  MVSubscription,
  MVUser,
  MVHistoricalTVL,
  MVHistoricalPnL,
} from '../types/index.js'

export class IndexerGrpcMegaVaultTransformer {
  static getVaultResponseToVault(
    response: InjectiveMegaVaultRpc.GetVaultResponse,
  ): MVInformation | undefined {
    return response.vault
  }

  static getUserResponseToUser(
    response: InjectiveMegaVaultRpc.GetUserResponse,
  ): MVUser | undefined {
    return response.user
  }

  static listSubscriptionsResponseToSubscriptions(
    response: InjectiveMegaVaultRpc.ListSubscriptionsResponse,
  ): MVSubscription[] {
    return response.subscriptions
  }

  static listRedemptionsResponseToRedemptions(
    response: InjectiveMegaVaultRpc.ListRedemptionsResponse,
  ): MVRedemption[] {
    return response.redemptions
  }

  static getOperatorRedemptionBucketsResponseToOperatorRedemptionBuckets(
    response: InjectiveMegaVaultRpc.GetOperatorRedemptionBucketsResponse,
  ): MVOperatorRedemptionBucket[] {
    return response.buckets
  }

  static tvlHistoryResponseToTvlHistory(
    response: InjectiveMegaVaultRpc.TvlHistoryResponse,
  ): MVHistoricalTVL[] {
    return response.history
  }

  static pnlHistoryResponseToPnlHistory(
    response: InjectiveMegaVaultRpc.PnlHistoryResponse,
  ): MVHistoricalPnL[] {
    return response.history
  }
}
