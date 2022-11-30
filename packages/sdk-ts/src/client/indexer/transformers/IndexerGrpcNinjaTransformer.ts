import {
  GrpcNinjaDenomBalance,
  GrpcNinjaHolders,
  GrpcNinjaLeaderboardEntry,
  GrpcNinjaPagination,
  GrpcNinjaPriceSnapshot,
  GrpcNinjaProfits,
  GrpcNinjaSubaccountBalance,
  GrpcNinjaSubscription,
  GrpcNinjaVault,
  NinjaDenomBalance,
  NinjaHolders,
  NinjaLeaderboard,
  NinjaLeaderboardEntry,
  NinjaPortfolio,
  NinjaPriceSnapshot,
  NinjaProfits,
  NinjaSubaccountBalance,
  NinjaSubscription,
  NinjaVault,
} from '../types/ninja'
import {
  LeaderboardResponse,
  PortfolioResponse,
} from '@injectivelabs/ninja-api/goadesign_goagen_ninja_api_pb'

/**
 * @category Indexer Grpc Transformer
 */
export class IndexerGrpcNinjaTransformer {
  static grpcPaginationToPagination(grpcPagination?: GrpcNinjaPagination) {
    if (!grpcPagination) {
      return {
        total: 0,
      }
    }

    return {
      total: grpcPagination.getTotal(),
    }
  }

  static grpcDenomBalanceToDenomBalance(
    grpcDenomBalance: GrpcNinjaDenomBalance,
  ): NinjaDenomBalance {
    return {
      denom: grpcDenomBalance.getDenom(),
      totalBalance: grpcDenomBalance.getTotalBalance(),
    }
  }

  static grpcProfitsToProfits(
    grpcProfits?: GrpcNinjaProfits,
  ): NinjaProfits | undefined {
    if (!grpcProfits) {
      return undefined
    }

    return {
      allTimeChange: grpcProfits.getAllTimeChange(),
      threeMonthsChange: grpcProfits.getThreeMonthsChange(),
      oneMonthChange: grpcProfits.getOneMonthChange(),
      oneDayChange: grpcProfits.getOneDayChange(),
      oneWeekChange: grpcProfits.getOneWeekChange(),
      oneYearChange: grpcProfits.getOneYearChange(),
      threeYearsChange: grpcProfits.getThreeYearsChange(),
      sixMonthsChange: grpcProfits.getSixMonthsChange(),
    }
  }

  static grpcVaultSubaccountInfoToVaultSubaccountInfo(
    grpcSubaccountInfo?: GrpcNinjaSubaccountBalance,
  ): NinjaSubaccountBalance | undefined {
    if (!grpcSubaccountInfo) {
      return
    }

    return {
      subaccountId: grpcSubaccountInfo.getSubaccountId(),
      balancesList: grpcSubaccountInfo
        .getBalancesList()
        .map(IndexerGrpcNinjaTransformer.grpcDenomBalanceToDenomBalance),
    }
  }

  static grpcVaultToVault(grpcVault?: GrpcNinjaVault): NinjaVault | undefined {
    if (!grpcVault) {
      return
    }

    return {
      contractAddress: grpcVault.getContractAddress(),
      codeId: grpcVault.getCodeId(),
      vaultName: grpcVault.getVaultName(),
      marketId: grpcVault.getMarketId(),
      currentTvl: grpcVault.getCurrentTvl(),
      profits: IndexerGrpcNinjaTransformer.grpcProfitsToProfits(
        grpcVault.getProfits(),
      ),
      updatedAt: grpcVault.getUpdatedAt(),
      vaultType: grpcVault.getVaultType(),
      lpTokenPrice: grpcVault.getLpTokenPrice(),
      subaccountInfo:
        IndexerGrpcNinjaTransformer.grpcVaultSubaccountInfoToVaultSubaccountInfo(
          grpcVault.getSubaccountInfo(),
        ),
      masterContractAddress: grpcVault.getMasterContractAddress(),
      totalLpAmount: grpcVault.getTotalLpAmount(),
    }
  }

  static grpcPriceSnapShotToPriceSnapShot(
    grpcPriceSnapshot: GrpcNinjaPriceSnapshot,
  ): NinjaPriceSnapshot {
    return {
      price: grpcPriceSnapshot.getPrice(),
      updatedAt: grpcPriceSnapshot.getUpdatedAt(),
    }
  }

  static grpcSubscriptionToSubscription(
    grpcSubscription: GrpcNinjaSubscription,
  ): NinjaSubscription {
    return {
      vaultInfo: IndexerGrpcNinjaTransformer.grpcVaultToVault(
        grpcSubscription.getVaultInfo(),
      ),
      lpAmount: grpcSubscription.getLpAmount(),
      lpAmountPercentage: grpcSubscription.getLpAmountPercentage(),
      holderAddress: grpcSubscription.getHolderAddress(),
    }
  }

  static grpcHoldersToHolders(grpcHolders: GrpcNinjaHolders): NinjaHolders {
    return {
      holderAddress: grpcHolders.getHolderAddress(),
      vaultAddress: grpcHolders.getVaultAddress(),
      amount: grpcHolders.getAmount(),
      updatedAt: grpcHolders.getUpdatedAt(),
      lpAmountPercentage: grpcHolders.getLpAmountPercentage(),
    }
  }

  static grpcPortfolioToPortfolio(
    grpcPortfolioResponse: PortfolioResponse,
  ): NinjaPortfolio {
    return {
      totalValue: grpcPortfolioResponse.getTotalValue(),
      pnl: grpcPortfolioResponse.getPnl(),
      totalValueChartList: grpcPortfolioResponse
        .getTotalValueChartList()
        .map(IndexerGrpcNinjaTransformer.grpcPriceSnapShotToPriceSnapShot),
      pnlChartList: grpcPortfolioResponse
        .getPnlChartList()
        .map(IndexerGrpcNinjaTransformer.grpcPriceSnapShotToPriceSnapShot),
    }
  }

  static grpcLeaderboardEntryToLeaderboardEntry(
    grpcNinjaLeaderboardEntry: GrpcNinjaLeaderboardEntry,
  ): NinjaLeaderboardEntry {
    return {
      address: grpcNinjaLeaderboardEntry.getAddress(),
      pnl: grpcNinjaLeaderboardEntry.getPnl(),
    }
  }

  static grpcLeaderboardToLeaderboard(
    grpcLeaderboardResponse: LeaderboardResponse,
  ): NinjaLeaderboard {
    return {
      entriesList: grpcLeaderboardResponse
        .getEntriesList()
        .map(
          IndexerGrpcNinjaTransformer.grpcLeaderboardEntryToLeaderboardEntry,
        ),
      snapshotBlock: grpcLeaderboardResponse.getSnapshotBlock(),
      updatedAt: grpcLeaderboardResponse.getUpdatedAt(),
    }
  }
}
