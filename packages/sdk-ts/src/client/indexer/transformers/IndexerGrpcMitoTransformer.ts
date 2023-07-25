import { Coin } from '@injectivelabs/ts-types'
import { MitoApi } from '@injectivelabs/mito-proto-ts'
import {
  MitoVault,
  MitoHolders,
  MitoChanges,
  MitoTransfer,
  MitoPortfolio,
  MitoPagination,
  MitoLeaderboard,
  MitoDenomBalance,
  MitoSubscription,
  MitoPriceSnapshot,
  MitoSubaccountBalance,
  MitoLeaderboardEpoch,
} from '../types/mito'
import { GrpcCoin } from '../../../types'

/**
 * @category Indexer Grpc Transformer
 */
export class IndexerGrpcMitoTransformer {
  static grpcCoinToCoin(coin: GrpcCoin): Coin {
    return {
      denom: coin.denom,
      amount: coin.amount,
    }
  }

  static mitoPaginationToPagination(
    pagination?: MitoApi.Pagination,
  ): MitoPagination | undefined {
    if (!pagination) {
      return undefined
    }

    return {
      total: pagination.total,
    }
  }

  static mitoDenomBalanceToDenomBalance(
    denomBalance: MitoApi.DenomBalance,
  ): MitoDenomBalance {
    return {
      denom: denomBalance.denom,
      totalBalance: denomBalance.totalBalance,
    }
  }

  static changesResponseToChanges(
    changes?: MitoApi.Changes,
  ): MitoChanges | undefined {
    if (!changes) {
      return undefined
    }

    return {
      allTimeChange: changes.allTimeChange,
      threeMonthsChange: changes.threeMonthsChange,
      oneMonthChange: changes.oneMonthChange,
      oneDayChange: changes.oneDayChange,
      oneWeekChange: changes.oneWeekChange,
      oneYearChange: changes.oneYearChange,
      threeYearsChange: changes.threeYearsChange,
      sixMonthsChange: changes.sixMonthsChange,
    }
  }

  static mitoSubaccountInfoToSubaccountInfo(
    mitoSubaccountInfo?: MitoApi.SubaccountBalance,
  ): MitoSubaccountBalance | undefined {
    if (!mitoSubaccountInfo) {
      return
    }

    return {
      subaccountId: mitoSubaccountInfo.subaccountId,
      balancesList: mitoSubaccountInfo.balances.map(
        IndexerGrpcMitoTransformer.mitoDenomBalanceToDenomBalance,
      ),
    }
  }

  static mitoVaultToVault(vault: MitoApi.Vault): MitoVault {
    return {
      contractAddress: vault.contractAddress,
      codeId: vault.codeId,
      vaultName: vault.vaultName,
      marketId: vault.marketId,
      currentTvl: vault.currentTvl,
      profits: IndexerGrpcMitoTransformer.changesResponseToChanges(
        vault.profits,
      ),
      updatedAt: parseInt(vault.updatedAt, 10),
      vaultType: vault.vaultType,
      lpTokenPrice: vault.lpTokenPrice,
      subaccountInfo:
        IndexerGrpcMitoTransformer.mitoSubaccountInfoToSubaccountInfo(
          vault.subaccountInfo,
        ),
      masterContractAddress: vault.masterContractAddress,
      totalLpAmount: vault.totalLpAmount,
      slug: vault.slug,
      createdAt: parseInt(vault.createdAt, 10),
      notionalValueCap: vault.notionalValueCap,
      tvlChanges: IndexerGrpcMitoTransformer.changesResponseToChanges(
        vault.tvlChanges,
      ),
      apy: vault.apy,
    }
  }

  static mitoPriceSnapshotToPriceSnapshot(
    snapshot: MitoApi.PriceSnapshot,
  ): MitoPriceSnapshot {
    return {
      price: snapshot.price,
      updatedAt: parseInt(snapshot.updatedAt, 10),
    }
  }

  static portfolioResponseToPortfolio(
    portfolio: MitoApi.PortfolioResponse,
  ): MitoPortfolio {
    return {
      totalValue: portfolio.totalValue,
      pnl: portfolio.pnl,
      totalValueChartList: portfolio.totalValueChart.map(
        IndexerGrpcMitoTransformer.mitoPriceSnapshotToPriceSnapshot,
      ),
      pnlChartList: portfolio.pnlChart.map(
        IndexerGrpcMitoTransformer.mitoPriceSnapshotToPriceSnapshot,
      ),
    }
  }

  static leaderboardResponseToLeaderboard(
    leaderboard: MitoApi.LeaderboardResponse,
  ): MitoLeaderboard {
    return {
      entriesList: leaderboard.entries.map((entry) => ({
        address: entry.address,
        pnl: entry.pnl,
      })),
      snapshotBlock: leaderboard.snapshotBlock,
      updatedAt: parseInt(leaderboard.updatedAt, 10),
      epochId: leaderboard.epochId,
    }
  }

  static mitoTransferHistoryToTransferHistory(
    transfer: MitoApi.Transfer,
  ): MitoTransfer {
    return {
      lpAmount: transfer.lpAmount,
      coins: transfer.coins.map(IndexerGrpcMitoTransformer.grpcCoinToCoin),
      usdValue: transfer.usdValue,
      isDeposit: transfer.isDeposit,
      executedAt: parseInt(transfer.executedAt, 10),
      account: transfer.account,
      vault: transfer.vault,
      txHash: transfer.txHash,
      tidByVault: transfer.tidByVault,
      tidByAccount: transfer.tidByAccount,
    }
  }

  static mitoLeaderboardEpochToLeaderboardEpoch(
    leaderboardEpoch: MitoApi.LeaderboardEpoch,
  ): MitoLeaderboardEpoch {
    return {
      epochId: leaderboardEpoch.epochId,
      startAt: parseInt(leaderboardEpoch.startAt, 10),
      endAt: parseInt(leaderboardEpoch.endAt, 10),
      isLive: leaderboardEpoch.isLive,
    }
  }

  static mitoStakingRewardToStakingReward(
    stakingReward: MitoApi.StakingReward,
  ) {
    return {
      vaultName: stakingReward.vaultName,
      vaultAddress: stakingReward.vaultAddress,
      stakedAmount: stakingReward.stakedAmount
        ? IndexerGrpcMitoTransformer.grpcCoinToCoin(stakingReward.stakedAmount)
        : undefined,
      apr: stakingReward.apr,
      claimableRewards: stakingReward.claimableRewards.map(
        IndexerGrpcMitoTransformer.grpcCoinToCoin,
      ),
      lockTimestamp: parseInt(stakingReward.lockTimestamp, 10),
      lockedAmount: stakingReward.lockedAmount
        ? IndexerGrpcMitoTransformer.grpcCoinToCoin(stakingReward.lockedAmount)
        : undefined,
    }
  }

  static mitoGaugeToGauge(gauge: MitoApi.Gauge) {
    return {
      id: gauge.id,
      owner: gauge.owner,
      startTimestamp: parseInt(gauge.startTimestamp, 10),
      endTimestamp: parseInt(gauge.endTimestamp, 10),
      rewardTokens: gauge.rewardTokens.map(
        IndexerGrpcMitoTransformer.grpcCoinToCoin,
      ),
      lastDistribution: gauge.lastDistribution,
    }
  }

  static mitoStakingPoolToStakingPool(stakingPool: MitoApi.StakingPool) {
    return {
      vaultName: stakingPool.vaultName,
      vaultAddress: stakingPool.vaultAddress,
      stakeDenom: stakingPool.stakeDenom,
      gauges: stakingPool.gauges.map(
        IndexerGrpcMitoTransformer.mitoGaugeToGauge,
      ),
      apr: stakingPool.apr,
      totalLiquidity: stakingPool.totalLiquidity,
      stakingAddress: stakingPool.stakingAddress,
      aprBreakdown: stakingPool.aprBreakdown,
    }
  }

  static mitoStakingActivityToStakingActivity(
    stakingActivity: MitoApi.StakingActivity,
  ) {
    return {
      stakeAmount: stakingActivity.stakeAmount
        ? IndexerGrpcMitoTransformer.grpcCoinToCoin(stakingActivity.stakeAmount)
        : undefined,
      vaultAddress: stakingActivity.vaultAddress,
      action: stakingActivity.action,
      txHash: stakingActivity.txHash,
      rewardedTokens: stakingActivity.rewardedTokens.map(
        IndexerGrpcMitoTransformer.grpcCoinToCoin,
      ),
      timestamp: parseInt(stakingActivity.timestamp, 10),
      staker: stakingActivity.staker,
      numberByAccount: stakingActivity.numberByAccount,
    }
  }

  static mitoSubscriptionToSubscription(subscription: MitoApi.Subscription) {
    const vaultInfo = subscription.vaultInfo
      ? IndexerGrpcMitoTransformer.mitoVaultToVault(subscription.vaultInfo)
      : undefined

    return {
      vaultInfo,
      lpAmount: subscription.lpAmount,
      lpAmountPercentage: subscription.lpAmountPercentage,
      holderAddress: subscription.holderAddress,
    }
  }

  static vaultResponseToVault(response: MitoApi.GetVaultResponse): MitoVault {
    const [vault] = response.vault

    return IndexerGrpcMitoTransformer.mitoVaultToVault(vault)
  }

  static vaultsResponseToVaults(response: MitoApi.GetVaultsResponse): {
    vaults: MitoVault[]
    pagination?: MitoPagination
  } {
    return {
      vaults: response.vaults.map(IndexerGrpcMitoTransformer.mitoVaultToVault),
      pagination: IndexerGrpcMitoTransformer.mitoPaginationToPagination(
        response.pagination,
      ),
    }
  }

  static lpTokenPriceChartResponseToLPTokenPriceChart(
    response: MitoApi.LPTokenPriceChartResponse,
  ): MitoPriceSnapshot[] {
    return response.prices.map(
      IndexerGrpcMitoTransformer.mitoPriceSnapshotToPriceSnapshot,
    )
  }

  static vaultsByHolderAddressResponseToVaultsByHolderAddress(
    response: MitoApi.VaultsByHolderAddressResponse,
  ): MitoSubscription[] {
    return response.subscriptions.map(
      IndexerGrpcMitoTransformer.mitoSubscriptionToSubscription,
    )
  }

  static lpHoldersResponseToLPHolders(
    response: MitoApi.LPHoldersResponse,
  ): MitoHolders[] {
    return response.holders.map((holder) => ({
      holderAddress: holder.holderAddress,
      vaultAddress: holder.vaultAddress,
      amount: holder.amount,
      updatedAt: parseInt(holder.updatedAt, 10),
      lpAmountPercentage: holder.lpAmountPercentage,
      redemptionLockTime: holder.redemptionLockTime,
      stakedAmount: holder.stakedAmount,
    }))
  }

  static transferHistoryResponseToTransfer(
    response: MitoApi.TransfersHistoryResponse,
  ) {
    return {
      transfers: response.transfers.map(
        IndexerGrpcMitoTransformer.mitoTransferHistoryToTransferHistory,
      ),
      pagination: IndexerGrpcMitoTransformer.mitoPaginationToPagination(
        response.pagination,
      ),
    }
  }

  static leaderboardEpochsResponseToLeaderboardEpochs(
    response: MitoApi.LeaderboardEpochsResponse,
  ) {
    return {
      epochs: response.epochs.map(
        IndexerGrpcMitoTransformer.mitoLeaderboardEpochToLeaderboardEpoch,
      ),
      pagination: IndexerGrpcMitoTransformer.mitoPaginationToPagination(
        response.pagination,
      ),
    }
  }

  static stakingPoolsResponseToStakingPools(
    response: MitoApi.GetStakingPoolsResponse,
  ) {
    return {
      pools: response.pools.map(
        IndexerGrpcMitoTransformer.mitoStakingPoolToStakingPool,
      ),
      pagination: IndexerGrpcMitoTransformer.mitoPaginationToPagination(
        response.pagination,
      ),
    }
  }

  static stakingRewardByAccountResponseToStakingRewardByAccount(
    response: MitoApi.StakingRewardByAccountResponse,
  ) {
    return {
      rewards: response.rewards.map(
        IndexerGrpcMitoTransformer.mitoStakingRewardToStakingReward,
      ),
      pagination: IndexerGrpcMitoTransformer.mitoPaginationToPagination(
        response.pagination,
      ),
    }
  }

  static mitoStakingHistoryResponseTpStakingHistory(
    response: MitoApi.StakingHistoryResponse,
  ) {
    return {
      activities: response.activities.map(
        IndexerGrpcMitoTransformer.mitoStakingActivityToStakingActivity,
      ),
      pagination: IndexerGrpcMitoTransformer.mitoPaginationToPagination(
        response.pagination,
      ),
    }
  }
}
