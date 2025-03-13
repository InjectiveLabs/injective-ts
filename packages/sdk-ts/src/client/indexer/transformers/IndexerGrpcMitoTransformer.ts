import { MitoApi } from '@injectivelabs/mito-proto-ts'
import { IndexerCommonTransformer } from './IndexerCommonTransformer.js'
import {
  MitoIDO,
  MitoGauge,
  MitoVault,
  MitoHolders,
  MitoChanges,
  MitoMission,
  MitoTransfer,
  MitoTokenInfo,
  MitoPortfolio,
  MitoPagination,
  MitoIDOProgress,
  MitoStakingPool,
  MitoGaugeStatus,
  MitoLeaderboard,
  MitoVestingConfig,
  MitoDenomBalance,
  MitoSubscription,
  MitoIDOSubscriber,
  MitoPriceSnapshot,
  MitoClaimReference,
  MitoIDOSubscription,
  MitoVestingConfigMap,
  MitoWhitelistAccount,
  MitoLeaderboardEpoch,
  MitoSubaccountBalance,
  MitoMissionLeaderboard,
  MitoStakeToSubscription,
  MitoIDOSubscriptionActivity,
  MitoMissionLeaderboardEntry,
  MitoIDOClaimedCoins,
} from '../types/mito.js'

/**
 * @category Indexer Grpc Transformer
 */
export class IndexerGrpcMitoTransformer {
  static grpcTokenInfoToTokenInfo(tokenInfo: MitoApi.TokenInfo): MitoTokenInfo {
    return {
      denom: tokenInfo.denom,
      supply: tokenInfo.supply,
      symbol: tokenInfo.symbol,
      decimal: tokenInfo.decimal,
      logoUrl: tokenInfo.logoUrl,
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
      slug: vault.slug,
      codeId: vault.codeId,
      marketId: vault.marketId,
      vaultName: vault.vaultName,
      vaultType: vault.vaultType,
      currentTvl: vault.currentTvl,
      lpTokenPrice: vault.lpTokenPrice,
      totalLpAmount: vault.totalLpAmount,
      contractAddress: vault.contractAddress,
      notionalValueCap: vault.notionalValueCap,
      masterContractAddress: vault.masterContractAddress,
      updatedAt: parseInt(vault.updatedAt, 10),
      createdAt: parseInt(vault.createdAt, 10),
      apy: vault.apy,
      apyue: vault.apyue,
      apy7D: vault.apy7D,
      apy7DFq: vault.apy7DFq,
      apyV3: vault.apyV3,
      registrationMode: vault.registrationMode,
      profits: IndexerGrpcMitoTransformer.changesResponseToChanges(
        vault.profits,
      ),
      tvlChanges: IndexerGrpcMitoTransformer.changesResponseToChanges(
        vault.tvlChanges,
      ),
      subaccountInfo:
        IndexerGrpcMitoTransformer.mitoSubaccountInfoToSubaccountInfo(
          vault.subaccountInfo,
        ),
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
      pnl: portfolio.pnl,
      totalValue: portfolio.totalValue,
      updatedAt: parseInt(portfolio.pnlUpdatedAt, 10),
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
      epochId: leaderboard.epochId,
      snapshotBlock: leaderboard.snapshotBlock,
      updatedAt: parseInt(leaderboard.updatedAt, 10),
      entriesList: leaderboard.entries.map((entry) => ({
        address: entry.address,
        pnl: entry.pnl,
      })),
    }
  }

  static mitoTransferHistoryToTransferHistory(
    transfer: MitoApi.Transfer,
  ): MitoTransfer {
    return {
      vault: transfer.vault,
      txHash: transfer.txHash,
      account: transfer.account,
      lpAmount: transfer.lpAmount,
      usdValue: transfer.usdValue,
      isDeposit: transfer.isDeposit,
      tidByVault: transfer.tidByVault,
      tidByAccount: transfer.tidByAccount,
      executedAt: parseInt(transfer.executedAt, 10),
      coins: transfer.coins.map(IndexerCommonTransformer.grpcCoinToCoin),
    }
  }

  static mitoLeaderboardEpochToLeaderboardEpoch(
    leaderboardEpoch: MitoApi.LeaderboardEpoch,
  ): MitoLeaderboardEpoch {
    return {
      isLive: leaderboardEpoch.isLive,
      epochId: leaderboardEpoch.epochId,
      startAt: parseInt(leaderboardEpoch.startAt, 10),
      endAt: parseInt(leaderboardEpoch.endAt, 10),
    }
  }

  static mitoStakingRewardToStakingReward(
    stakingReward: MitoApi.StakingReward,
  ) {
    return {
      apr: stakingReward.apr,
      vaultName: stakingReward.vaultName,
      vaultAddress: stakingReward.vaultAddress,
      lockTimestamp: parseInt(stakingReward.lockTimestamp, 10),
      claimableRewards: stakingReward.claimableRewards.map(
        IndexerCommonTransformer.grpcCoinToCoin,
      ),
      stakedAmount: stakingReward.stakedAmount
        ? IndexerCommonTransformer.grpcCoinToCoin(stakingReward.stakedAmount)
        : undefined,
      lockedAmount: stakingReward.lockedAmount
        ? IndexerCommonTransformer.grpcCoinToCoin(stakingReward.lockedAmount)
        : undefined,
    }
  }

  static mitoGaugeToGauge(gauge: MitoApi.Gauge): MitoGauge {
    return {
      id: gauge.id,
      owner: gauge.owner,
      status: gauge.status as MitoGaugeStatus,
      lastDistribution: gauge.lastDistribution,
      endTimestamp: parseInt(gauge.endTimestamp, 10),
      startTimestamp: parseInt(gauge.startTimestamp, 10),
      rewardTokens: gauge.rewardTokens.map(
        IndexerCommonTransformer.grpcCoinToCoin,
      ),
    }
  }

  static mitoStakingPoolToStakingPool(
    stakingPool: MitoApi.StakingPool,
  ): MitoStakingPool {
    return {
      apr: stakingPool.apr,
      vaultName: stakingPool.vaultName,
      stakeDenom: stakingPool.stakeDenom,
      vaultAddress: stakingPool.vaultAddress,
      aprBreakdown: stakingPool.aprBreakdown,
      totalLiquidity: stakingPool.totalLiquidity,
      stakingAddress: stakingPool.stakingAddress,
      gauges: stakingPool.gauges.map(
        IndexerGrpcMitoTransformer.mitoGaugeToGauge,
      ),
    }
  }

  static mitoStakingActivityToStakingActivity(
    stakingActivity: MitoApi.StakingActivity,
  ) {
    return {
      action: stakingActivity.action,
      txHash: stakingActivity.txHash,
      staker: stakingActivity.staker,
      vaultAddress: stakingActivity.vaultAddress,
      numberByAccount: stakingActivity.numberByAccount,
      timestamp: parseInt(stakingActivity.timestamp, 10),
      rewardedTokens: stakingActivity.rewardedTokens.map(
        IndexerCommonTransformer.grpcCoinToCoin,
      ),
      stakeAmount: stakingActivity.stakeAmount
        ? IndexerCommonTransformer.grpcCoinToCoin(stakingActivity.stakeAmount)
        : undefined,
    }
  }

  static mitoSubscriptionToSubscription(
    subscription: MitoApi.Subscription,
  ): MitoSubscription {
    const vaultInfo = subscription.vaultInfo
      ? IndexerGrpcMitoTransformer.mitoVaultToVault(subscription.vaultInfo)
      : undefined

    return {
      vaultInfo,
      lpAmount: subscription.lpAmount,
      holderAddress: subscription.holderAddress,
      lpAmountPercentage: subscription.lpAmountPercentage,
    }
  }

  static mitoLpHolderToLPHolder(holder: MitoApi.Holders): MitoHolders {
    return {
      amount: holder.amount,
      vaultAddress: holder.vaultAddress,
      stakedAmount: holder.stakedAmount,
      holderAddress: holder.holderAddress,
      lpAmountPercentage: holder.lpAmountPercentage,
      redemptionLockTime: holder.redemptionLockTime,
      updatedAt: parseInt(holder.updatedAt, 10),
    }
  }

  static mitoMissionToMission(mission: MitoApi.Mission): MitoMission {
    return {
      id: mission.id,
      points: mission.points,
      progress: mission.progress,
      expected: mission.expected,
      completed: mission.completed,
      accruedPoints: mission.accruedPoints,
      updatedAt: parseInt(mission.updatedAt, 10),
    }
  }

  static mitoMissionLeaderboardEntryToMissionLeaderboardEntry(
    entry: MitoApi.MissionLeaderboardEntry,
  ): MitoMissionLeaderboardEntry {
    return {
      address: entry.address,
      accruedPoints: entry.accruedPoints,
    }
  }

  static mitoIDOProgressToIDOProgress(
    progress: MitoApi.IDOProgress,
  ): MitoIDOProgress {
    return {
      status: progress.status,
      timestamp: parseInt(progress.timestamp, 10),
    }
  }

  static mitoStakedToSubscriptionToStakedToSubscription(
    data: MitoApi.ArrayOfString,
  ): MitoStakeToSubscription {
    return {
      stakedAmount: data.field[0],
      subscribableAmount: data.field[1],
    }
  }

  static mitoIDOToIDO(IDO: MitoApi.IDO): MitoIDO {
    return {
      name: IDO.name,
      owner: IDO.owner,
      status: IDO.status,
      marketId: IDO.marketId,
      tokenPrice: IDO.tokenPrice,
      quoteDenom: IDO.quoteDenom,
      useWhitelist: IDO.useWhitelist,
      vaultAddress: IDO.vaultAddress,
      capPerAddress: IDO.capPerAddress,
      contractAddress: IDO.contractAddress,
      subscribedAmount: IDO.subscribedAmount,
      isPermissionless: IDO.isPermissionless,
      isLaunchWithVault: IDO.isLaunchWithVault,
      targetAmountInUsd: IDO.targetAmountInUsd,
      projectTokenAmount: IDO.projectTokenAmount,
      projectDescription: IDO.projectDescription,
      isAccountWhiteListed: IDO.isAccountWhiteListed,
      isVestingScheduleEnabled: IDO.isVestingScheduleEnabled,
      targetAmountInQuoteDenom: IDO.targetAmountInQuoteDenom,
      endTime: parseInt(IDO.endTime, 10),
      startTime: parseInt(IDO.startTime, 10),
      secondBeforeStartToSetQuotePrice: parseInt(
        IDO.secondBeforeStartToSetQuotePrice,
        10,
      ),
      progress: IDO.progress.map(
        IndexerGrpcMitoTransformer.mitoIDOProgressToIDOProgress,
      ),
      tokenInfo: IDO.tokenInfo
        ? IndexerGrpcMitoTransformer.grpcTokenInfoToTokenInfo(IDO.tokenInfo)
        : undefined,
      stakeToSubscription: IDO.stakeToSubscription.map(
        IndexerGrpcMitoTransformer.mitoStakedToSubscriptionToStakedToSubscription,
      ),
      vestingConfig:
        IndexerGrpcMitoTransformer.mitoIDOInitParamsToIDOVestingConfig(
          IDO.initParams,
        ),
    }
  }

  static mitoIDOSubscriberToIDOSubscriber(
    IDOSubscriber: MitoApi.IDOSubscriber,
  ): MitoIDOSubscriber {
    return {
      address: IDOSubscriber.address,
      lastSubscribeTime: parseInt(IDOSubscriber.lastSubscribeTime, 10),
      subscribedCoin: IDOSubscriber.subscribedCoin
        ? IndexerCommonTransformer.grpcCoinToCoin(IDOSubscriber.subscribedCoin)
        : undefined,
      estimateLpAmount: IDOSubscriber.estimateLpAmount
        ? IndexerCommonTransformer.grpcCoinToCoin(
            IDOSubscriber.estimateLpAmount,
          )
        : undefined,
      estimateRefundAmount: IDOSubscriber.estimateRefundAmount
        ? IndexerCommonTransformer.grpcCoinToCoin(
            IDOSubscriber.estimateRefundAmount,
          )
        : undefined,
      estimateTokenReceived: IDOSubscriber.estimateTokenReceived
        ? IndexerCommonTransformer.grpcCoinToCoin(
            IDOSubscriber.estimateTokenReceived,
          )
        : undefined,
      createdAt: parseInt(IDOSubscriber.createdAt, 10),
    }
  }

  static mitoIDOClaimedCoinsToIDOClaimedCoins(
    claimedCoins: MitoApi.IDOClaimedCoins,
  ): MitoIDOClaimedCoins {
    return {
      claimedCoins: claimedCoins.claimedCoins.map(
        IndexerCommonTransformer.grpcCoinToCoin,
      ),
      updatedAt: parseInt(claimedCoins.updatedAt, 10),
    }
  }

  static mitoIDOSubscriptionToIDOSubscription(
    subscription: MitoApi.IDOSubscription,
  ): MitoIDOSubscription {
    return {
      price: subscription.price,
      marketId: subscription.marketId,
      quoteDenom: subscription.quoteDenom,
      stakedAmount: subscription.stakedAmount,
      rewardClaimed: subscription.rewardClaimed,
      committedAmount: subscription.committedAmount,
      updatedAt: parseInt(subscription.updatedAt, 10),
      claimableCoins: subscription.claimableCoins.map(
        IndexerCommonTransformer.grpcCoinToCoin,
      ),
      ownerClaimableCoins: subscription.ownerClaimableCoins.map(
        IndexerCommonTransformer.grpcCoinToCoin,
      ),
      claimTxHash: subscription.claimTxHash,
      maxSubscriptionCoin: subscription.maxSubscriptionCoin
        ? IndexerCommonTransformer.grpcCoinToCoin(
            subscription.maxSubscriptionCoin,
          )
        : undefined,
      tokenInfo: subscription.tokenInfo
        ? IndexerGrpcMitoTransformer.grpcTokenInfoToTokenInfo(
            subscription.tokenInfo,
          )
        : undefined,
      claimedCoins: subscription.claimedCoins
        ? IndexerGrpcMitoTransformer.mitoIDOClaimedCoinsToIDOClaimedCoins(
            subscription.claimedCoins,
          )
        : undefined,
    }
  }

  static mitoIDOSubscriptionActivityToIDOSubscriptionActivity(
    IDOSubscriptionActivity: MitoApi.IDOSubscriptionActivity,
  ): MitoIDOSubscriptionActivity {
    return {
      txHash: IDOSubscriptionActivity.txHash,
      address: IDOSubscriptionActivity.address,
      usdValue: IDOSubscriptionActivity.usdValue,
      timestamp: parseInt(IDOSubscriptionActivity.timestamp, 10),
      subscribedCoin: IDOSubscriptionActivity.subscribedCoin
        ? IndexerCommonTransformer.grpcCoinToCoin(
            IDOSubscriptionActivity.subscribedCoin,
          )
        : undefined,
    }
  }

  static mitoWhitelistAccountToWhitelistAccount(
    account: MitoApi.WhitelistAccount,
  ): MitoWhitelistAccount {
    return {
      weight: account.weight,
      accountAddress: account.accountAddress,
      updatedAt: parseInt(account.updatedAt, 10),
    }
  }

  static mitoClaimReferenceToClaimReference(
    claimReference: MitoApi.ClaimReference,
  ): MitoClaimReference {
    return {
      denom: claimReference.denom,
      claimedAmount: claimReference.claimedAmount,
      accountAddress: claimReference.accountAddress,
      claimableAmount: claimReference.claimableAmount,
      cwContractAddress: claimReference.cwContractAddress,
      idoContractAddress: claimReference.idoContractAddress,
      vestingDurationSeconds: parseInt(
        claimReference.vestingDurationSeconds,
        10,
      ),
      updatedAt: parseInt(claimReference.updatedAt, 10),
      startVestingTime: parseInt(claimReference.startVestingTime, 10),
    }
  }

  static mitoVestingCOonfigToVestingConfig(
    config?: MitoApi.VestingConfig,
  ): MitoVestingConfig {
    return {
      schedule: config?.schedule || '',
      vestingDurationSeconds: parseInt(
        config?.vestingDurationSeconds || '0',
        10,
      ),
      vestingStartDelaySeconds: parseInt(
        config?.vestingDurationSeconds || '0',
        10,
      ),
    }
  }

  static mitoIDOInitParamsToIDOVestingConfig(
    initParams?: MitoApi.InitParams,
  ): MitoVestingConfigMap | undefined {
    if (!initParams || !initParams.vestingConfig) {
      return
    }

    return {
      projectOwnerQuote:
        IndexerGrpcMitoTransformer.mitoVestingCOonfigToVestingConfig(
          initParams.vestingConfig.projectOwnerQuote,
        ),
      usersProjectToken:
        IndexerGrpcMitoTransformer.mitoVestingCOonfigToVestingConfig(
          initParams.vestingConfig.usersProjectToken,
        ),
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
  ) {
    return {
      subscriptions: response.subscriptions.map(
        IndexerGrpcMitoTransformer.mitoSubscriptionToSubscription,
      ),
      pagination: IndexerGrpcMitoTransformer.mitoPaginationToPagination(
        response.pagination,
      ),
    }
  }

  static lpHoldersResponseToLPHolders(response: MitoApi.LPHoldersResponse) {
    return {
      holders: response.holders.map(
        IndexerGrpcMitoTransformer.mitoLpHolderToLPHolder,
      ),
      pagination: IndexerGrpcMitoTransformer.mitoPaginationToPagination(
        response.pagination,
      ),
    }
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

  static mitoMissionsResponseMissions(response: MitoApi.MissionsResponse) {
    return response.data.map(IndexerGrpcMitoTransformer.mitoMissionToMission)
  }

  static mitoMissionLeaderboardResponseToMissionLeaderboard(
    response: MitoApi.MissionLeaderboardResponse,
  ): MitoMissionLeaderboard {
    return {
      entries: response.data.map(
        IndexerGrpcMitoTransformer.mitoMissionLeaderboardEntryToMissionLeaderboardEntry,
      ),
      updatedAt: parseInt(response.updatedAt, 10),
      rank: response.userRank,
    }
  }

  static mitoListIDOsResponseToIDOs(response: MitoApi.ListIDOsResponse) {
    return {
      idos: response.idos.map(IndexerGrpcMitoTransformer.mitoIDOToIDO),
      pagination: IndexerGrpcMitoTransformer.mitoPaginationToPagination(
        response.pagination,
      ),
    }
  }

  static mitoIDOResponseToIDO(response: MitoApi.GetIDOResponse) {
    return {
      ido: response.ido
        ? IndexerGrpcMitoTransformer.mitoIDOToIDO(response.ido)
        : undefined,
    }
  }

  static mitoIDOSubscribersResponseToIDOSubscribers(
    response: MitoApi.GetIDOSubscribersResponse,
  ) {
    return {
      marketId: response.marketId,
      quoteDenom: response.quoteDenom,
      subscribers: response.subscribers.map(
        IndexerGrpcMitoTransformer.mitoIDOSubscriberToIDOSubscriber,
      ),
      pagination: IndexerGrpcMitoTransformer.mitoPaginationToPagination(
        response.pagination,
      ),
      tokenInfo: response.tokenInfo
        ? IndexerGrpcMitoTransformer.grpcTokenInfoToTokenInfo(
            response.tokenInfo,
          )
        : undefined,
    }
  }

  static mitoIDOSubscriptionResponseToIDOSubscription(
    response: MitoApi.GetIDOSubscriptionResponse,
  ) {
    return {
      subscription: response.subscription
        ? IndexerGrpcMitoTransformer.mitoIDOSubscriptionToIDOSubscription(
            response.subscription,
          )
        : undefined,
    }
  }

  static mitoIDOActivitiesResponseToIDOActivities(
    response: MitoApi.GetIDOActivitiesResponse,
  ) {
    return {
      activities: response.activities.map(
        IndexerGrpcMitoTransformer.mitoIDOSubscriptionActivityToIDOSubscriptionActivity,
      ),
      pagination: IndexerGrpcMitoTransformer.mitoPaginationToPagination(
        response.pagination,
      ),
    }
  }

  static mitoWhitelistAccountResponseToWhitelistAccount(
    response: MitoApi.GetWhitelistResponse,
  ) {
    return {
      idoAddress: response.idoAddress,
      accounts: response.accounts.map(
        IndexerGrpcMitoTransformer.mitoWhitelistAccountToWhitelistAccount,
      ),
      pagination: IndexerGrpcMitoTransformer.mitoPaginationToPagination(
        response.pagination,
      ),
    }
  }

  static claimReferencesResponseToClaimReferences(
    response: MitoApi.GetClaimReferencesResponse,
  ): {
    claimReferences: MitoClaimReference[]
    pagination?: MitoPagination
  } {
    return {
      claimReferences: response.claimReferences
        ? response.claimReferences.map(
            IndexerGrpcMitoTransformer.mitoClaimReferenceToClaimReference,
          )
        : [],
      pagination: IndexerGrpcMitoTransformer.mitoPaginationToPagination(
        response.pagination,
      ),
    }
  }
}
