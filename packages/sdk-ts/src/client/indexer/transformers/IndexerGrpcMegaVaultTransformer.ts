import type { InjectiveMegaVaultRpc } from '@injectivelabs/indexer-proto-ts'
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
      admin: vault.admin,
      lpDenom: vault.lpDenom,
      createdAt: vault.createdAt,
      updatedAt: vault.updatedAt,
      quoteDenom: vault.quoteDenom,
      contractName: vault.contractName,
      createdHeight: vault.createdHeight,
      updatedHeight: vault.updatedHeight,
      contractAddress: vault.contractAddress,
      contractVersion: vault.contractVersion,
      stats: vault.stats
        ? IndexerGrpcMegaVaultTransformer.grpcVaultStatsToVaultStats(
            vault.stats,
          )
        : undefined,
      operators: vault.operators.map(
        IndexerGrpcMegaVaultTransformer.grpcOperatorToOperator,
      ),
      targetApr: vault.targetApr
        ? IndexerGrpcMegaVaultTransformer.grpcTargetAprToTargetApr(
            vault.targetApr,
          )
        : undefined,

      incentives: vault.incentives
        ? IndexerGrpcMegaVaultTransformer.grpcIncentiveToIncentive(
            vault.incentives,
          )
        : undefined,
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
      updatedAt: user.updatedAt,
      updatedHeight: user.updatedHeight,
      contractAddress: user.contractAddress,
      stats: user.stats
        ? IndexerGrpcMegaVaultTransformer.grpcUserStatsToUserStats(user.stats)
        : undefined,
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
      updatedAt: operator.updatedAt,
      totalAmount: operator.totalAmount,
      updatedHeight: operator.updatedHeight,
      totalLiquidAmount: operator.totalLiquidAmount,
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
      updatedAt: targetApr.updatedAt,
      upperThreshold: targetApr.upperThreshold,
      lowerThreshold: targetApr.lowerThreshold,
      updatedHeight: targetApr.updatedHeight,
    }
  }

  static grpcVaultStatsToVaultStats(
    stats: GrpcMegaVaultVaultStats,
  ): MegaVaultStats {
    return {
      currentAmount: stats.currentAmount,
      currentLpPrice: stats.currentLpPrice,
      currentLpAmount: stats.currentLpAmount,
      totalRedeemedAmount: stats.totalRedeemedAmount,
      totalSubscribedAmount: stats.totalSubscribedAmount,
      currentAmountWithoutIncentives: stats.currentAmountWithoutIncentives,
      apr: stats.apr
        ? IndexerGrpcMegaVaultTransformer.grpcAprStatsToAprStats(stats.apr)
        : undefined,
      pnl: stats.pnl
        ? IndexerGrpcMegaVaultTransformer.grpcPnlStatsToPnlStats(stats.pnl)
        : undefined,
      volatility: stats.volatility
        ? IndexerGrpcMegaVaultTransformer.grpcVolatilityStatsToVolatilityStats(
            stats.volatility,
          )
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
      allTime: pnl.allTime
        ? IndexerGrpcMegaVaultTransformer.grpcPnlToPnl(pnl.allTime)
        : undefined,
      unrealized: pnl.unrealized
        ? IndexerGrpcMegaVaultTransformer.grpcUnrealizedPnlToUnrealizedPnl(
            pnl.unrealized,
          )
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
      currentAmount: pnl.currentAmount,
      totalAmountRedeemed: pnl.totalAmountRedeemed,
      totalAmountSubscribed: pnl.totalAmountSubscribed,
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
      currentLpPrice: apr.currentLpPrice,
      originalLpPrice: apr.originalLpPrice,
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
      user: subscription.user,
      index: subscription.index,
      amount: subscription.amount,
      status: subscription.status,
      lpAmount: subscription.lpAmount,
      createdAt: subscription.createdAt,
      executedAt: subscription.executedAt,
      createdHeight: subscription.createdHeight,
      executedHeight: subscription.executedHeight,
      contractAddress: subscription.contractAddress,
    }
  }

  static grpcRedemptionToRedemption(
    redemption: GrpcMegaVaultRedemption,
  ): MegaVaultRedemption {
    return {
      user: redemption.user,
      dueAt: redemption.dueAt,
      index: redemption.index,
      amount: redemption.amount,
      status: redemption.status,
      lpAmount: redemption.lpAmount,
      createdAt: redemption.createdAt,
      executedAt: redemption.executedAt,
      createdHeight: redemption.createdHeight,
      executedHeight: redemption.executedHeight,
      contractAddress: redemption.contractAddress,
    }
  }

  static grpcOperatorRedemptionBucketToOperatorRedemptionBucket(
    bucket: GrpcMegaVaultOperatorRedemptionBucket,
  ): MegaVaultOperatorRedemptionBucket {
    return {
      bucket: bucket.bucket,
      neededAmount: bucket.neededAmount,
      lpAmountToRedeem: bucket.lpAmountToRedeem,
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
