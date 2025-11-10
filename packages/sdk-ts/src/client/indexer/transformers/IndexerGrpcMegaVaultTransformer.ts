import type * as InjectiveMegavaultRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_megavault_rpc_pb'
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
  OperationStatusLogEntry,
  GrpcMegaVaultMaxDrawdown,
  MegaVaultVolatilityStats,
  GrpcMegaVaultSubscription,
  GrpcMegaVaultHistoricalPnL,
  GrpcMegaVaultHistoricalTVL,
  GrpcMegaVaultUnrealizedPnl,
  GrpcMegaVaultVolatilityStats,
  MegaVaultOperatorRedemptionBucket,
  GrpcMegaVaultOperationStatusLogEntry,
  GrpcMegaVaultOperatorRedemptionBucket,
} from '../types/mega-vault.js'

export class IndexerGrpcMegaVaultTransformer {
  static vaultResponseToVault(
    response: InjectiveMegavaultRpcPb.GetVaultResponse,
  ): MegaVault | undefined {
    const vault = response.vault

    if (!vault) {
      return
    }

    return {
      admin: vault.admin,
      lpDenom: vault.lpDenom,
      createdAt: vault.createdAt.toString(),
      updatedAt: vault.updatedAt.toString(),
      quoteDenom: vault.quoteDenom,
      contractName: vault.contractName,
      createdHeight: vault.createdHeight.toString(),
      updatedHeight: vault.updatedHeight.toString(),
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
    response: InjectiveMegavaultRpcPb.GetUserResponse,
  ): MegaVaultUser | undefined {
    const user = response.user
    if (!user) {
      return
    }

    return {
      address: user.address,
      updatedAt: user.updatedAt.toString(),
      updatedHeight: user.updatedHeight.toString(),
      contractAddress: user.contractAddress,
      stats: user.stats
        ? IndexerGrpcMegaVaultTransformer.grpcUserStatsToUserStats(user.stats)
        : undefined,
    }
  }

  static subscriptionsResponseToSubscriptions(
    response: InjectiveMegavaultRpcPb.ListSubscriptionsResponse,
  ): MegaVaultSubscription[] {
    return response.subscriptions.map(
      IndexerGrpcMegaVaultTransformer.grpcSubscriptionToSubscription,
    )
  }

  static redemptionsResponseToRedemptions(
    response: InjectiveMegavaultRpcPb.ListRedemptionsResponse,
  ): MegaVaultRedemption[] {
    return response.redemptions.map(
      IndexerGrpcMegaVaultTransformer.grpcRedemptionToRedemption,
    )
  }

  static operatorRedemptionBucketsResponseToOperatorRedemptionBuckets(
    response: InjectiveMegavaultRpcPb.GetOperatorRedemptionBucketsResponse,
  ): MegaVaultOperatorRedemptionBucket[] {
    return response.buckets.map(
      IndexerGrpcMegaVaultTransformer.grpcOperatorRedemptionBucketToOperatorRedemptionBucket,
    )
  }

  static tvlHistoryResponseToTvlHistory(
    response: InjectiveMegavaultRpcPb.TvlHistoryResponse,
  ): MegaVaultHistoricalTVL[] {
    return response.history.map(
      IndexerGrpcMegaVaultTransformer.grpcHistoricalTVLToHistoricalTVL,
    )
  }

  static pnlHistoryResponseToPnlHistory(
    response: InjectiveMegavaultRpcPb.PnlHistoryResponse,
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
      updatedAt: operator.updatedAt.toString(),
      percentage: operator.percentage,
      totalAmount: operator.totalAmount,
      subaccountId: operator.subaccountId,
      updatedHeight: operator.updatedHeight.toString(),
      totalLiquidAmount: operator.totalLiquidAmount,
    }
  }

  static grpcIncentiveToIncentive(
    incentive: GrpcMegaVaultIncentives,
  ): MegaVaultIncentives {
    return {
      address: incentive.address,
      amount: incentive.amount,
      updatedAt: incentive.updatedAt.toString(),
      updatedHeight: incentive.updatedHeight.toString(),
    }
  }

  static grpcTargetAprToTargetApr(
    targetApr: GrpcMegaVaultTargetApr,
  ): MegaVaultTargetApr {
    return {
      apr: targetApr.apr,
      updatedAt: targetApr.updatedAt.toString(),
      upperThreshold: targetApr.upperThreshold,
      lowerThreshold: targetApr.lowerThreshold,
      updatedHeight: targetApr.updatedHeight.toString(),
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
      depositedValue: stats.depositedValue,
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
      index: subscription.index.toString(),
      amount: subscription.amount,
      status: subscription.status,
      lpAmount: subscription.lpAmount,
      createdAt: subscription.createdAt.toString(),
      executedAt: subscription.executedAt.toString(),
      createdHeight: subscription.createdHeight.toString(),
      executedHeight: subscription.executedHeight.toString(),
      contractAddress: subscription.contractAddress,
      log: subscription.log.map(
        IndexerGrpcMegaVaultTransformer.grpcOperationStatusLogEntryToOperationStatusLogEntry,
      ),
    }
  }

  static grpcRedemptionToRedemption(
    redemption: GrpcMegaVaultRedemption,
  ): MegaVaultRedemption {
    return {
      user: redemption.user,
      dueAt: redemption.dueAt.toString(),
      index: redemption.index.toString(),
      amount: redemption.amount,
      status: redemption.status,
      lpAmount: redemption.lpAmount,
      createdAt: redemption.createdAt.toString(),
      executedAt: redemption.executedAt.toString(),
      createdHeight: redemption.createdHeight.toString(),
      executedHeight: redemption.executedHeight.toString(),
      contractAddress: redemption.contractAddress,
      log: redemption.log.map(
        IndexerGrpcMegaVaultTransformer.grpcOperationStatusLogEntryToOperationStatusLogEntry,
      ),
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

  static grpcOperationStatusLogEntryToOperationStatusLogEntry(
    log: GrpcMegaVaultOperationStatusLogEntry,
  ): OperationStatusLogEntry {
    return {
      status: log.status,
      txHash: log.txHash,
      blockTime: log.blockTime,
      blockHeight: log.blockHeight,
    }
  }
}
