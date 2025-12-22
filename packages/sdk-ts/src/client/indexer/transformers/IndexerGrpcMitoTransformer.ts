import { IndexerCommonTransformer } from './IndexerCommonTransformer.js'
import { bigIntToNumber, bigIntToString } from '../../../utils/helpers.js'
import type * as GoadesignGoagenMitoApiPb from '@injectivelabs/mito-proto-ts-v2/generated/goadesign_goagen_mito_api_pb'
import type {
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
  MitoDenomBalance,
  MitoSubscription,
  MitoVestingConfig,
  MitoIDOSubscriber,
  MitoPriceSnapshot,
  MitoClaimReference,
  MitoIDOSubscription,
  MitoIDOClaimedCoins,
  MitoVestingConfigMap,
  MitoWhitelistAccount,
  MitoLeaderboardEpoch,
  MitoSubaccountBalance,
  MitoMissionLeaderboard,
  MitoStakeToSubscription,
  MitoIDOSubscriptionActivity,
  MitoMissionLeaderboardEntry,
} from '../types/mito.js'

/**
 * @category Indexer Grpc Transformer
 */
export class IndexerGrpcMitoTransformer {
  static grpcTokenInfoToTokenInfo(
    tokenInfo: GoadesignGoagenMitoApiPb.TokenInfo,
  ): MitoTokenInfo {
    return {
      denom: tokenInfo.denom,
      supply: tokenInfo.supply,
      symbol: tokenInfo.symbol,
      decimal: tokenInfo.decimal,
      logoUrl: tokenInfo.logoUrl,
    }
  }

  static mitoPaginationToPagination(
    pagination?: GoadesignGoagenMitoApiPb.Pagination,
  ): MitoPagination | undefined {
    if (!pagination) {
      return undefined
    }

    return {
      total: pagination.total,
    }
  }

  static mitoDenomBalanceToDenomBalance(
    denomBalance: GoadesignGoagenMitoApiPb.DenomBalance,
  ): MitoDenomBalance {
    return {
      denom: denomBalance.denom,
      totalBalance: denomBalance.totalBalance,
    }
  }

  static changesResponseToChanges(
    changes?: GoadesignGoagenMitoApiPb.Changes,
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
    mitoSubaccountInfo?: GoadesignGoagenMitoApiPb.SubaccountBalance,
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

  static mitoVaultToVault(vault: GoadesignGoagenMitoApiPb.Vault): MitoVault {
    return {
      slug: vault.slug,
      codeId: vault.codeId.toString(),
      marketId: vault.marketId,
      vaultName: vault.vaultName,
      vaultType: vault.vaultType,
      currentTvl: vault.currentTvl,
      lpTokenPrice: vault.lpTokenPrice,
      totalLpAmount: vault.totalLpAmount,
      contractAddress: vault.contractAddress,
      notionalValueCap: vault.notionalValueCap,
      masterContractAddress: vault.masterContractAddress,
      updatedAt: Number(vault.updatedAt),
      createdAt: Number(vault.createdAt),
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
    snapshot: GoadesignGoagenMitoApiPb.PriceSnapshot,
  ): MitoPriceSnapshot {
    return {
      price: snapshot.price,
      updatedAt: Number(snapshot.updatedAt),
    }
  }

  static portfolioResponseToPortfolio(
    portfolio: GoadesignGoagenMitoApiPb.PortfolioResponse,
  ): MitoPortfolio {
    return {
      pnl: portfolio.pnl,
      totalValue: bigIntToNumber(portfolio.totalValue),
      updatedAt: Number(portfolio.pnlUpdatedAt),
      totalValueChartList: portfolio.totalValueChart.map(
        IndexerGrpcMitoTransformer.mitoPriceSnapshotToPriceSnapshot,
      ),
      pnlChartList: portfolio.pnlChart.map(
        IndexerGrpcMitoTransformer.mitoPriceSnapshotToPriceSnapshot,
      ),
    }
  }

  static leaderboardResponseToLeaderboard(
    leaderboard: GoadesignGoagenMitoApiPb.LeaderboardResponse,
  ): MitoLeaderboard {
    return {
      epochId: leaderboard.epochId,
      snapshotBlock: bigIntToString(leaderboard.snapshotBlock),
      updatedAt: Number(leaderboard.updatedAt),
      entriesList: leaderboard.entries.map(
        (entry: GoadesignGoagenMitoApiPb.LeaderboardEntry) => ({
          address: entry.address,
          pnl: entry.pnl,
        }),
      ),
    }
  }

  static mitoTransferHistoryToTransferHistory(
    transfer: GoadesignGoagenMitoApiPb.Transfer,
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
      executedAt: Number(transfer.executedAt),
      coins: transfer.coins.map(IndexerCommonTransformer.grpcCoinToCoin),
    }
  }

  static mitoLeaderboardEpochToLeaderboardEpoch(
    leaderboardEpoch: GoadesignGoagenMitoApiPb.LeaderboardEpoch,
  ): MitoLeaderboardEpoch {
    return {
      isLive: leaderboardEpoch.isLive,
      epochId: leaderboardEpoch.epochId,
      startAt: Number(leaderboardEpoch.startAt),
      endAt: Number(leaderboardEpoch.endAt),
    }
  }

  static mitoStakingRewardToStakingReward(
    stakingReward: GoadesignGoagenMitoApiPb.StakingReward,
  ) {
    return {
      apr: stakingReward.apr,
      vaultName: stakingReward.vaultName,
      vaultAddress: stakingReward.vaultAddress,
      lockTimestamp: Number(stakingReward.lockTimestamp),
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

  static mitoGaugeToGauge(gauge: GoadesignGoagenMitoApiPb.Gauge): MitoGauge {
    return {
      id: gauge.id,
      owner: gauge.owner,
      status: gauge.status as MitoGaugeStatus,
      lastDistribution: gauge.lastDistribution,
      endTimestamp: Number(gauge.endTimestamp),
      startTimestamp: Number(gauge.startTimestamp),
      rewardTokens: gauge.rewardTokens.map(
        IndexerCommonTransformer.grpcCoinToCoin,
      ),
    }
  }

  static mitoStakingPoolToStakingPool(
    stakingPool: GoadesignGoagenMitoApiPb.StakingPool,
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
    stakingActivity: GoadesignGoagenMitoApiPb.StakingActivity,
  ) {
    return {
      action: stakingActivity.action,
      txHash: stakingActivity.txHash,
      staker: stakingActivity.staker,
      vaultAddress: stakingActivity.vaultAddress,
      numberByAccount: stakingActivity.numberByAccount,
      timestamp: Number(stakingActivity.timestamp),
      rewardedTokens: stakingActivity.rewardedTokens.map(
        IndexerCommonTransformer.grpcCoinToCoin,
      ),
      stakeAmount: stakingActivity.stakeAmount
        ? IndexerCommonTransformer.grpcCoinToCoin(stakingActivity.stakeAmount)
        : undefined,
    }
  }

  static mitoSubscriptionToSubscription(
    subscription: GoadesignGoagenMitoApiPb.Subscription,
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

  static mitoLpHolderToLPHolder(
    holder: GoadesignGoagenMitoApiPb.Holders,
  ): MitoHolders {
    return {
      amount: holder.amount,
      vaultAddress: holder.vaultAddress,
      stakedAmount: holder.stakedAmount,
      holderAddress: holder.holderAddress,
      lpAmountPercentage: holder.lpAmountPercentage,
      redemptionLockTime: bigIntToString(holder.redemptionLockTime),
      updatedAt: Number(holder.updatedAt),
    }
  }

  static mitoMissionToMission(
    mission: GoadesignGoagenMitoApiPb.Mission,
  ): MitoMission {
    return {
      id: mission.id,
      points: bigIntToString(mission.points),
      progress: mission.progress,
      expected: mission.expected,
      completed: mission.completed,
      accruedPoints: bigIntToString(mission.accruedPoints),
      updatedAt: Number(mission.updatedAt),
    }
  }

  static mitoMissionLeaderboardEntryToMissionLeaderboardEntry(
    entry: GoadesignGoagenMitoApiPb.MissionLeaderboardEntry,
  ): MitoMissionLeaderboardEntry {
    return {
      address: entry.address,
      accruedPoints: bigIntToString(entry.accruedPoints),
    }
  }

  static mitoIDOProgressToIDOProgress(
    progress: GoadesignGoagenMitoApiPb.IDOProgress,
  ): MitoIDOProgress {
    return {
      status: progress.status,
      timestamp: Number(progress.timestamp),
    }
  }

  static mitoStakedToSubscriptionToStakedToSubscription(
    data: GoadesignGoagenMitoApiPb.ArrayOfString,
  ): MitoStakeToSubscription {
    return {
      stakedAmount: data.field[0],
      subscribableAmount: data.field[1],
    }
  }

  static mitoIDOToIDO(IDO: GoadesignGoagenMitoApiPb.IDO): MitoIDO {
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
      endTime: Number(IDO.endTime),
      startTime: Number(IDO.startTime),
      secondBeforeStartToSetQuotePrice: Number(
        IDO.secondBeforeStartToSetQuotePrice,
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
    IDOSubscriber: GoadesignGoagenMitoApiPb.IDOSubscriber,
  ): MitoIDOSubscriber {
    return {
      address: IDOSubscriber.address,
      lastSubscribeTime: Number(IDOSubscriber.lastSubscribeTime),
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
      createdAt: Number(IDOSubscriber.createdAt),
    }
  }

  static mitoIDOClaimedCoinsToIDOClaimedCoins(
    claimedCoins: GoadesignGoagenMitoApiPb.IDOClaimedCoins,
  ): MitoIDOClaimedCoins {
    return {
      claimedCoins: claimedCoins.claimedCoins.map(
        IndexerCommonTransformer.grpcCoinToCoin,
      ),
      updatedAt: Number(claimedCoins.updatedAt),
    }
  }

  static mitoIDOSubscriptionToIDOSubscription(
    subscription: GoadesignGoagenMitoApiPb.IDOSubscription,
  ): MitoIDOSubscription {
    return {
      price: subscription.price,
      marketId: subscription.marketId,
      quoteDenom: subscription.quoteDenom,
      stakedAmount: subscription.stakedAmount,
      rewardClaimed: subscription.rewardClaimed,
      committedAmount: subscription.committedAmount,
      updatedAt: Number(subscription.updatedAt),
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
    IDOSubscriptionActivity: GoadesignGoagenMitoApiPb.IDOSubscriptionActivity,
  ): MitoIDOSubscriptionActivity {
    return {
      txHash: IDOSubscriptionActivity.txHash,
      address: IDOSubscriptionActivity.address,
      usdValue: IDOSubscriptionActivity.usdValue,
      timestamp: Number(IDOSubscriptionActivity.timestamp),
      subscribedCoin: IDOSubscriptionActivity.subscribedCoin
        ? IndexerCommonTransformer.grpcCoinToCoin(
            IDOSubscriptionActivity.subscribedCoin,
          )
        : undefined,
    }
  }

  static mitoWhitelistAccountToWhitelistAccount(
    account: GoadesignGoagenMitoApiPb.WhitelistAccount,
  ): MitoWhitelistAccount {
    return {
      weight: account.weight,
      accountAddress: account.accountAddress,
      updatedAt: Number(account.updatedAt),
    }
  }

  static mitoClaimReferenceToClaimReference(
    claimReference: GoadesignGoagenMitoApiPb.ClaimReference,
  ): MitoClaimReference {
    return {
      denom: claimReference.denom,
      claimedAmount: claimReference.claimedAmount,
      accountAddress: claimReference.accountAddress,
      claimableAmount: claimReference.claimableAmount,
      cwContractAddress: claimReference.cwContractAddress,
      idoContractAddress: claimReference.idoContractAddress,
      vestingDurationSeconds: Number(claimReference.vestingDurationSeconds),
      updatedAt: Number(claimReference.updatedAt),
      startVestingTime: Number(claimReference.startVestingTime),
    }
  }

  static mitoVestingCOonfigToVestingConfig(
    config?: GoadesignGoagenMitoApiPb.VestingConfig,
  ): MitoVestingConfig {
    return {
      schedule: config?.schedule || '',
      vestingDurationSeconds: Number(config?.vestingDurationSeconds || 0n),
      vestingStartDelaySeconds: Number(config?.vestingStartDelaySeconds || 0n),
    }
  }

  static mitoIDOInitParamsToIDOVestingConfig(
    initParams?: GoadesignGoagenMitoApiPb.InitParams,
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

  static vaultResponseToVault(
    response: GoadesignGoagenMitoApiPb.GetVaultResponse,
  ): MitoVault {
    const [vault] = response.vault

    return IndexerGrpcMitoTransformer.mitoVaultToVault(vault)
  }

  static vaultsResponseToVaults(
    response: GoadesignGoagenMitoApiPb.GetVaultsResponse,
  ): {
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
    response: GoadesignGoagenMitoApiPb.LPTokenPriceChartResponse,
  ): MitoPriceSnapshot[] {
    return response.prices.map(
      IndexerGrpcMitoTransformer.mitoPriceSnapshotToPriceSnapshot,
    )
  }

  static vaultsByHolderAddressResponseToVaultsByHolderAddress(
    response: GoadesignGoagenMitoApiPb.VaultsByHolderAddressResponse,
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

  static lpHoldersResponseToLPHolders(
    response: GoadesignGoagenMitoApiPb.LPHoldersResponse,
  ) {
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
    response: GoadesignGoagenMitoApiPb.TransfersHistoryResponse,
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
    response: GoadesignGoagenMitoApiPb.LeaderboardEpochsResponse,
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
    response: GoadesignGoagenMitoApiPb.GetStakingPoolsResponse,
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
    response: GoadesignGoagenMitoApiPb.StakingRewardByAccountResponse,
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
    response: GoadesignGoagenMitoApiPb.StakingHistoryResponse,
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

  static mitoMissionsResponseMissions(
    response: GoadesignGoagenMitoApiPb.MissionsResponse,
  ) {
    return response.data.map(IndexerGrpcMitoTransformer.mitoMissionToMission)
  }

  static mitoMissionLeaderboardResponseToMissionLeaderboard(
    response: GoadesignGoagenMitoApiPb.MissionLeaderboardResponse,
  ): MitoMissionLeaderboard {
    return {
      entries: response.data.map(
        IndexerGrpcMitoTransformer.mitoMissionLeaderboardEntryToMissionLeaderboardEntry,
      ),
      updatedAt: Number(response.updatedAt),
      rank: response.userRank?.toString(),
    }
  }

  static mitoListIDOsResponseToIDOs(
    response: GoadesignGoagenMitoApiPb.ListIDOsResponse,
  ) {
    return {
      idos: response.idos.map(IndexerGrpcMitoTransformer.mitoIDOToIDO),
      pagination: IndexerGrpcMitoTransformer.mitoPaginationToPagination(
        response.pagination,
      ),
    }
  }

  static mitoIDOResponseToIDO(
    response: GoadesignGoagenMitoApiPb.GetIDOResponse,
  ) {
    return {
      ido: response.ido
        ? IndexerGrpcMitoTransformer.mitoIDOToIDO(response.ido)
        : undefined,
    }
  }

  static mitoIDOSubscribersResponseToIDOSubscribers(
    response: GoadesignGoagenMitoApiPb.GetIDOSubscribersResponse,
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
    response: GoadesignGoagenMitoApiPb.GetIDOSubscriptionResponse,
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
    response: GoadesignGoagenMitoApiPb.GetIDOActivitiesResponse,
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
    response: GoadesignGoagenMitoApiPb.GetWhitelistResponse,
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
    response: GoadesignGoagenMitoApiPb.GetClaimReferencesResponse,
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
