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
import { GrpcCoin } from '../../../types/index'

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
      notionalValueCap: vault.notionalValueCap,
      tvlChanges: IndexerGrpcMitoTransformer.changesResponseToChanges(
        vault.tvlChanges,
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

  static LPTokenPriceChartResponseToLPTokenPriceChart(
    response: MitoApi.LPTokenPriceChartResponse,
  ): MitoPriceSnapshot[] {
    return response.prices.map(
      IndexerGrpcMitoTransformer.mitoPriceSnapshotToPriceSnapshot,
    )
  }

  static VaultsByHolderAddressResponseToVaultsByHolderAddress(
    response: MitoApi.VaultsByHolderAddressResponse,
  ): MitoSubscription[] {
    return response.subscriptions.map((subscription) => {
      const vaultInfo = subscription.vaultInfo
        ? IndexerGrpcMitoTransformer.mitoVaultToVault(subscription.vaultInfo)
        : undefined

      return {
        vaultInfo,
        lpAmount: subscription.lpAmount,
        lpAmountPercentage: subscription.lpAmountPercentage,
        holderAddress: subscription.holderAddress,
      }
    })
  }

  static LPHoldersResponseToLPHolders(
    response: MitoApi.LPHoldersResponse,
  ): MitoHolders[] {
    return response.holders.map((holder) => ({
      holderAddress: holder.holderAddress,
      vaultAddress: holder.vaultAddress,
      amount: holder.amount,
      updatedAt: parseInt(holder.updatedAt, 10),
      lpAmountPercentage: holder.lpAmountPercentage,
      redemptionLockTime: holder.redemptionLockTime,
    }))
  }

  static PortfolioResponseToPortfolio(
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

  static LeaderboardResponseToLeaderboard(
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

  static TransferHistoryResponseToTransfer(
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

  static LeaderboardEpochsResponseToLeaderboardEpochs(
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
}
