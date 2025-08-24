import { InjectiveMegaVaultRpc } from '@injectivelabs/indexer-proto-ts'
import type {
  MegaVault,
  MegaVaultUser,
  MegaVaultRedemption,
  MegaVaultSubscription,
  MegaVaultHistoricalPnL,
  MegaVaultHistoricalTVL,
  MegaVaultOperatorRedemptionBucket,
} from '../types/index.js'

export class IndexerGrpcMegaVaultTransformer {
  static getVaultResponseToVault(
    response: InjectiveMegaVaultRpc.GetVaultResponse,
  ): MegaVault | undefined {
    const vault = response.vault
    if (!vault) return undefined

    return {
      contractAddress: vault.contractAddress,
      contractName: vault.contractName,
      contractVersion: vault.contractVersion,
      admin: vault.admin,
      lpDenom: vault.lpDenom,
      quoteDenom: vault.quoteDenom,
      operators: vault.operators,
      stats: vault.stats,
      createdHeight: vault.createdHeight,
      createdAt: vault.createdAt,
      updatedHeight: vault.updatedHeight,
      updatedAt: vault.updatedAt,
    }
  }

  static getUserResponseToUser(
    response: InjectiveMegaVaultRpc.GetUserResponse,
  ): MegaVaultUser | undefined {
    const user = response.user
    if (!user) return undefined

    return {
      address: user.address,
      contractAddress: user.contractAddress,
      stats: user.stats,
      updatedHeight: user.updatedHeight,
      updatedAt: user.updatedAt,
    }
  }

  static listSubscriptionsResponseToSubscriptions(
    response: InjectiveMegaVaultRpc.ListSubscriptionsResponse,
  ): MegaVaultSubscription[] {
    return response.subscriptions.map((subscription) => ({
      contractAddress: subscription.contractAddress,
      user: subscription.user,
      index: subscription.index,
      lpAmount: subscription.lpAmount,
      amount: subscription.amount,
      status: subscription.status,
      createdHeight: subscription.createdHeight,
      createdAt: subscription.createdAt,
      executedHeight: subscription.executedHeight,
      executedAt: subscription.executedAt,
    }))
  }

  static listRedemptionsResponseToRedemptions(
    response: InjectiveMegaVaultRpc.ListRedemptionsResponse,
  ): MegaVaultRedemption[] {
    return response.redemptions.map((redemption) => ({
      contractAddress: redemption.contractAddress,
      user: redemption.user,
      index: redemption.index,
      lpAmount: redemption.lpAmount,
      amount: redemption.amount,
      status: redemption.status,
      dueAt: redemption.dueAt,
      createdHeight: redemption.createdHeight,
      createdAt: redemption.createdAt,
      executedHeight: redemption.executedHeight,
      executedAt: redemption.executedAt,
    }))
  }

  static getOperatorRedemptionBucketsResponseToOperatorRedemptionBuckets(
    response: InjectiveMegaVaultRpc.GetOperatorRedemptionBucketsResponse,
  ): MegaVaultOperatorRedemptionBucket[] {
    return response.buckets.map((bucket) => ({
      bucket: bucket.bucket,
      lpAmountToRedeem: bucket.lpAmountToRedeem,
      neededAmount: bucket.neededAmount,
      missingLiquidity: bucket.missingLiquidity,
    }))
  }

  static tvlHistoryResponseToTvlHistory(
    response: InjectiveMegaVaultRpc.TvlHistoryResponse,
  ): MegaVaultHistoricalTVL[] {
    return response.history.map((history) => ({
      t: history.t,
      v: history.v,
    }))
  }

  static pnlHistoryResponseToPnlHistory(
    response: InjectiveMegaVaultRpc.PnlHistoryResponse,
  ): MegaVaultHistoricalPnL[] {
    return response.history.map((history) => ({
      t: history.t,
      v: history.v,
    }))
  }
}
