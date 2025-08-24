import { InjectiveMegaVaultRpc } from '@injectivelabs/indexer-proto-ts'
import type {
  MegaVault,
  MegaVaultApr,
  MegaVaultPnl,
  MegaVaultUser,
  MegaVaultStats,
  GrpcMegaVaultApr,
  GrpcMegaVaultPnl,
  MegaVaultAprStats,
  MegaVaultOperator,
  MegaVaultPnlStats,
  MegaVaultTargetApr,
  MegaVaultUserStats,
  MegaVaultIncentives,
  MegaVaultRedemption,
  MegaVaultVolatility,
  MegaVaultMaxDrawdown,
  GrpcMegaVaultAprStats,
  GrpcMegaVaultPnlStats,
  GrpcMegaVaultOperator,
  MegaVaultSubscription,
  GrpcMegaVaultTargetApr,
  GrpcMegaVaultUserStats,
  MegaVaultHistoricalPnL,
  MegaVaultHistoricalTVL,
  MegaVaultUnrealizedPnl,
  GrpcMegaVaultIncentives,
  GrpcMegaVaultRedemption,
  GrpcMegaVaultVaultStats,
  GrpcMegaVaultVolatility,
  GrpcMegaVaultMaxDrawdown,
  MegaVaultVolatilityStats,
  GrpcMegaVaultSubscription,
  GrpcMegaVaultHistoricalPnL,
  GrpcMegaVaultHistoricalTVL,
  GrpcMegaVaultUnrealizedPnl,
  GrpcMegaVaultVolatilityStats,
  MegaVaultOperatorRedemptionBucket,
  GrpcMegaVaultOperatorRedemptionBucket,
} from '../types/mega-vault.js'

export class IndexerGrpcMegaVaultTransformer {
  static vaultResponseToVault(
    response: InjectiveMegaVaultRpc.GetVaultResponse,
  ): MegaVault | undefined {
    const vault = response.vault
    if (!vault) {
      return
    }

    return {
      contractAddress: vault.contractAddress,
      contractName: vault.contractName,
      contractVersion: vault.contractVersion,
      admin: vault.admin,
      lpDenom: vault.lpDenom,
      quoteDenom: vault.quoteDenom,
      operators: vault.operators.map(
        IndexerGrpcMegaVaultTransformer.grpcOperatorToOperator,
      ),
      incentives: vault.incentives
        ? IndexerGrpcMegaVaultTransformer.grpcIncentiveToIncentive(
            vault.incentives,
          )
        : undefined,
      targetApr: vault.targetApr
        ? IndexerGrpcMegaVaultTransformer.grpcTargetAprToTargetApr(
            vault.targetApr,
          )
        : undefined,
      stats: vault.stats
        ? IndexerGrpcMegaVaultTransformer.grpcVaultStatsToVaultStats(
            vault.stats,
          )
        : undefined,
      createdHeight: vault.createdHeight,
      createdAt: vault.createdAt,
      updatedHeight: vault.updatedHeight,
      updatedAt: vault.updatedAt,
    }
  }

  static userResponseToUser(
    response: InjectiveMegaVaultRpc.GetUserResponse,
  ): MegaVaultUser | undefined {
    const user = response.user
    if (!user) {
      return
    }

    return {
      address: user.address,
      contractAddress: user.contractAddress,
      stats: user.stats
        ? IndexerGrpcMegaVaultTransformer.grpcUserStatsToUserStats(user.stats)
        : undefined,
      updatedHeight: user.updatedHeight,
      updatedAt: user.updatedAt,
    }
  }

  static subscriptionsResponseToSubscriptions(
    response: InjectiveMegaVaultRpc.ListSubscriptionsResponse,
  ): MegaVaultSubscription[] {
    return response.subscriptions.map(
      IndexerGrpcMegaVaultTransformer.grpcSubscriptionToSubscription,
    )
  }

  static redemptionsResponseToRedemptions(
    response: InjectiveMegaVaultRpc.ListRedemptionsResponse,
  ): MegaVaultRedemption[] {
    return response.redemptions.map(
      IndexerGrpcMegaVaultTransformer.grpcRedemptionToRedemption,
    )
  }

  static operatorRedemptionBucketsResponseToOperatorRedemptionBuckets(
    response: InjectiveMegaVaultRpc.GetOperatorRedemptionBucketsResponse,
  ): MegaVaultOperatorRedemptionBucket[] {
    return response.buckets.map(
      IndexerGrpcMegaVaultTransformer.grpcOperatorRedemptionBucketToOperatorRedemptionBucket,
    )
  }

  static tvlHistoryResponseToTvlHistory(
    response: InjectiveMegaVaultRpc.TvlHistoryResponse,
  ): MegaVaultHistoricalTVL[] {
    return response.history.map(
      IndexerGrpcMegaVaultTransformer.grpcHistoricalTVLToHistoricalTVL,
    )
  }

  static pnlHistoryResponseToPnlHistory(
    response: InjectiveMegaVaultRpc.PnlHistoryResponse,
  ): MegaVaultHistoricalPnL[] {
    return response.history.map(
      IndexerGrpcMegaVaultTransformer.grpcHistoricalPnLToHistoricalPnL,
    )
  }

  static grpcOperatorToOperator(
    operator: GrpcMegaVaultOperator,
  ): MegaVaultOperator {
    return {
      address: operator.address,
      totalAmount: operator.totalAmount,
      totalLiquidAmount: operator.totalLiquidAmount,
      updatedAt: operator.updatedAt,
      updatedHeight: operator.updatedHeight,
    }
  }

  static grpcIncentiveToIncentive(
    incentive: GrpcMegaVaultIncentives,
  ): MegaVaultIncentives {
    return {
      address: incentive.address,
      amount: incentive.amount,
      updatedAt: incentive.updatedAt,
      updatedHeight: incentive.updatedHeight,
    }
  }

  static grpcTargetAprToTargetApr(
    targetApr: GrpcMegaVaultTargetApr,
  ): MegaVaultTargetApr {
    return {
      apr: targetApr.apr,
      upperThreshold: targetApr.upperThreshold,
      lowerThreshold: targetApr.lowerThreshold,
      updatedHeight: targetApr.updatedHeight,
      updatedAt: targetApr.updatedAt,
    }
  }

  static grpcVaultStatsToVaultStats(
    stats: GrpcMegaVaultVaultStats,
  ): MegaVaultStats {
    return {
      totalSubscribedAmount: stats.totalSubscribedAmount,
      totalRedeemedAmount: stats.totalRedeemedAmount,
      currentAmount: stats.currentAmount,
      currentAmountWithoutIncentives: stats.currentAmountWithoutIncentives,
      currentLpAmount: stats.currentLpAmount,
      currentLpPrice: stats.currentLpPrice,
      pnl: stats.pnl
        ? IndexerGrpcMegaVaultTransformer.grpcPnlStatsToPnlStats(stats.pnl)
        : undefined,
      volatility: stats.volatility
        ? IndexerGrpcMegaVaultTransformer.grpcVolatilityStatsToVolatilityStats(
            stats.volatility,
          )
        : undefined,
      apr: stats.apr
        ? IndexerGrpcMegaVaultTransformer.grpcAprStatsToAprStats(stats.apr)
        : undefined,
      maxDrawdown: stats.maxDrawdown
        ? IndexerGrpcMegaVaultTransformer.grpcMaxDrawdownToMaxDrawdown(
            stats.maxDrawdown,
          )
        : undefined,
    }
  }

  static grpcPnlStatsToPnlStats(pnl: GrpcMegaVaultPnlStats): MegaVaultPnlStats {
    return {
      unrealized: pnl.unrealized
        ? IndexerGrpcMegaVaultTransformer.grpcUnrealizedPnlToUnrealizedPnl(
            pnl.unrealized,
          )
        : undefined,
      allTime: pnl.allTime
        ? IndexerGrpcMegaVaultTransformer.grpcPnlToPnl(pnl.allTime)
        : undefined,
    }
  }

  static grpcUnrealizedPnlToUnrealizedPnl(
    pnl: GrpcMegaVaultUnrealizedPnl,
  ): MegaVaultUnrealizedPnl {
    return {
      value: pnl.value,
      percentage: pnl.percentage,
    }
  }

  static grpcPnlToPnl(pnl: GrpcMegaVaultPnl): MegaVaultPnl {
    return {
      value: pnl.value,
      percentage: pnl.percentage,
      totalAmountSubscribed: pnl.totalAmountSubscribed,
      totalAmountRedeemed: pnl.totalAmountRedeemed,
      currentAmount: pnl.currentAmount,
    }
  }

  static grpcMaxDrawdownToMaxDrawdown(
    maxDrawdown: GrpcMegaVaultMaxDrawdown,
  ): MegaVaultMaxDrawdown {
    return {
      value: maxDrawdown.value,
      latestPnLPeak: maxDrawdown.latestPnLPeak,
    }
  }

  static grpcVolatilityStatsToVolatilityStats(
    volatility: GrpcMegaVaultVolatilityStats,
  ): MegaVaultVolatilityStats {
    return {
      thirtyDays: volatility.thirtyDays
        ? IndexerGrpcMegaVaultTransformer.grpcVolatilityToVolatility(
            volatility.thirtyDays,
          )
        : undefined,
    }
  }

  static grpcVolatilityToVolatility(
    volatility: GrpcMegaVaultVolatility,
  ): MegaVaultVolatility {
    return {
      value: volatility.value,
    }
  }

  static grpcAprStatsToAprStats(apr: GrpcMegaVaultAprStats): MegaVaultAprStats {
    return {
      thirtyDays: apr.thirtyDays
        ? IndexerGrpcMegaVaultTransformer.grpcAprToApr(apr.thirtyDays)
        : undefined,
    }
  }

  static grpcAprToApr(apr: GrpcMegaVaultApr): MegaVaultApr {
    return {
      value: apr.value,
      originalLpPrice: apr.originalLpPrice,
      currentLpPrice: apr.currentLpPrice,
    }
  }

  static grpcUserStatsToUserStats(
    stats: GrpcMegaVaultUserStats,
  ): MegaVaultUserStats {
    return {
      currentAmount: stats.currentAmount,
      currentLpAmount: stats.currentLpAmount,
      pnl: stats.pnl
        ? IndexerGrpcMegaVaultTransformer.grpcPnlStatsToPnlStats(stats.pnl)
        : undefined,
    }
  }

  static grpcSubscriptionsToSubscriptions(
    subscriptions: GrpcMegaVaultSubscription[],
  ): MegaVaultSubscription[] {
    return subscriptions.map(
      IndexerGrpcMegaVaultTransformer.grpcSubscriptionToSubscription,
    )
  }

  static grpcSubscriptionToSubscription(
    subscription: GrpcMegaVaultSubscription,
  ): MegaVaultSubscription {
    return {
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
    }
  }

  static grpcRedemptionToRedemption(
    redemption: GrpcMegaVaultRedemption,
  ): MegaVaultRedemption {
    return {
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
    }
  }

  static grpcOperatorRedemptionBucketToOperatorRedemptionBucket(
    bucket: GrpcMegaVaultOperatorRedemptionBucket,
  ): MegaVaultOperatorRedemptionBucket {
    return {
      bucket: bucket.bucket,
      lpAmountToRedeem: bucket.lpAmountToRedeem,
      neededAmount: bucket.neededAmount,
      missingLiquidity: bucket.missingLiquidity,
    }
  }

  static grpcHistoricalTVLToHistoricalTVL(
    history: GrpcMegaVaultHistoricalTVL,
  ): MegaVaultHistoricalTVL {
    return {
      t: history.t,
      v: history.v,
    }
  }

  static grpcHistoricalPnLToHistoricalPnL(
    history: GrpcMegaVaultHistoricalPnL,
  ): MegaVaultHistoricalPnL {
    return {
      t: history.t,
      v: history.v,
    }
  }
}
