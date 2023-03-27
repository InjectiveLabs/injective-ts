import {
  NinjaDenomBalance,
  NinjaHolders,
  NinjaLeaderboard,
  NinjaPortfolio,
  NinjaPagination,
  NinjaPriceSnapshot,
  NinjaProfits,
  NinjaSubaccountBalance,
  NinjaSubscription,
  NinjaVault,
} from '../types/ninja'
import { NinjaApi } from '@injectivelabs/ninja-proto-ts'

/**
 * @category Indexer Grpc Transformer
 */
export class IndexerGrpcNinjaTransformer {
  static ninjaPaginationToPagination(
    pagination?: NinjaApi.Pagination,
  ): NinjaPagination | undefined {
    if (!pagination) {
      return undefined
    }

    return {
      total: pagination.total,
    }
  }

  static ninjaDenomBalanceToDenomBalance(
    denomBalance: NinjaApi.DenomBalance,
  ): NinjaDenomBalance {
    return {
      denom: denomBalance.denom,
      totalBalance: denomBalance.totalBalance,
    }
  }

  static profitsResponseToProfits(
    ninjaProfits?: NinjaApi.Profits,
  ): NinjaProfits | undefined {
    if (!ninjaProfits) {
      return undefined
    }

    return {
      allTimeChange: ninjaProfits.allTimeChange,
      threeMonthsChange: ninjaProfits.threeMonthsChange,
      oneMonthChange: ninjaProfits.oneMonthChange,
      oneDayChange: ninjaProfits.oneDayChange,
      oneWeekChange: ninjaProfits.oneWeekChange,
      oneYearChange: ninjaProfits.oneYearChange,
      threeYearsChange: ninjaProfits.threeYearsChange,
      sixMonthsChange: ninjaProfits.sixMonthsChange,
    }
  }

  static ninjaSubaccountInfoToSubaccountInfo(
    ninjaSubaccountInfo?: NinjaApi.SubaccountBalance,
  ): NinjaSubaccountBalance | undefined {
    if (!ninjaSubaccountInfo) {
      return
    }

    return {
      subaccountId: ninjaSubaccountInfo.subaccountId,
      balancesList: ninjaSubaccountInfo.balances.map(
        IndexerGrpcNinjaTransformer.ninjaDenomBalanceToDenomBalance,
      ),
    }
  }

  static ninjaVaultToVault(vault: NinjaApi.Vault): NinjaVault {
    return {
      contractAddress: vault.contractAddress,
      codeId: vault.codeId,
      vaultName: vault.vaultName,
      marketId: vault.marketId,
      currentTvl: vault.currentTvl,
      profits: IndexerGrpcNinjaTransformer.profitsResponseToProfits(
        vault.profits,
      ),
      updatedAt: vault.updatedAt,
      vaultType: vault.vaultType,
      lpTokenPrice: vault.lpTokenPrice,
      subaccountInfo:
        IndexerGrpcNinjaTransformer.ninjaSubaccountInfoToSubaccountInfo(
          vault.subaccountInfo,
        ),
      masterContractAddress: vault.masterContractAddress,
      totalLpAmount: vault.totalLpAmount,
      redemptionLockTimeDuration: vault.redemptionLockTimeDuration,
      redemptionUnlockTimeExpiration: vault.redemptionUnlockTimeExpiration,
    }
  }

  static ninjaPriceSnapshotToPriceSnapshot(
    snapshot: NinjaApi.PriceSnapshot,
  ): NinjaPriceSnapshot {
    return {
      price: snapshot.price,
      updatedAt: snapshot.updatedAt,
    }
  }

  static vaultResponseToVault(response: NinjaApi.GetVaultResponse): NinjaVault {
    const [vault] = response.vault

    return IndexerGrpcNinjaTransformer.ninjaVaultToVault(vault)
  }

  static vaultsResponseToVaults(response: NinjaApi.GetVaultsResponse): {
    vaults: NinjaVault[]
    pagination?: NinjaPagination
  } {
    return {
      vaults: response.vaults.map(
        IndexerGrpcNinjaTransformer.ninjaVaultToVault,
      ),
      pagination: IndexerGrpcNinjaTransformer.ninjaPaginationToPagination(
        response.pagination,
      ),
    }
  }

  static LPTokenPriceChartResponseToLPTokenPriceChart(
    response: NinjaApi.LPTokenPriceChartResponse,
  ): NinjaPriceSnapshot[] {
    return response.prices.map(
      IndexerGrpcNinjaTransformer.ninjaPriceSnapshotToPriceSnapshot,
    )
  }

  static VaultsByHolderAddressResponseToVaultsByHolderAddress(
    response: NinjaApi.VaultsByHolderAddressResponse,
  ): NinjaSubscription[] {
    return response.subscriptions.map((subscription) => {
      const vaultInfo = subscription.vaultInfo
        ? IndexerGrpcNinjaTransformer.ninjaVaultToVault(subscription.vaultInfo)
        : undefined

      return {
        vaultInfo,
        lpAmount: subscription.lpAmount,
        lpAmountPercentage: subscription.lpAmountPercentage,
        holderAddress: subscription.holderAddress,
        redemptionLockTime: subscription.holderAddress,
        lockedAmount: subscription.lockedAmount,
      }
    })
  }

  static LPHoldersResponseToLPHolders(
    response: NinjaApi.LPHoldersResponse,
  ): NinjaHolders[] {
    return response.holders.map((holder) => ({
      holderAddress: holder.holderAddress,
      vaultAddress: holder.vaultAddress,
      amount: holder.amount,
      updatedAt: holder.updatedAt,
      lpAmountPercentage: holder.lpAmountPercentage,
      redemptionLockTime: holder.redemptionLockTime,
    }))
  }

  static PortfolioResponseToPortfolio(
    response: NinjaApi.PortfolioResponse,
  ): NinjaPortfolio {
    return {
      totalValue: response.totalValue,
      pnl: response.pnl,
      totalValueChartList: response.totalValueChart.map(
        IndexerGrpcNinjaTransformer.ninjaPriceSnapshotToPriceSnapshot,
      ),
      pnlChartList: response.pnlChart.map(
        IndexerGrpcNinjaTransformer.ninjaPriceSnapshotToPriceSnapshot,
      ),
    }
  }

  static LeaderboardResponseToLeaderboard(
    response: NinjaApi.LeaderboardResponse,
  ): NinjaLeaderboard {
    return {
      entriesList: response.entries.map((entry) => ({
        address: entry.address,
        pnl: entry.pnl,
      })),
      snapshotBlock: response.snapshotBlock,
      updatedAt: response.updatedAt,
    }
  }
}
