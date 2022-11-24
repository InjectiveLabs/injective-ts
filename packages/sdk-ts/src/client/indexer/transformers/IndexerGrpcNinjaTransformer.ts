import {
  VaultDenomBalance,
  GrpcVaultDenomBalance,
  GrpcHolders,
  GrpcVaultPagination,
  GrpcPriceSnapshot,
  GrpcProfits,
  GrpcSubscription,
  GrpcVault,
  GrpcVaultSubaccountBalance,
  Holders,
  PriceSnapshot,
  Profits,
  Subscription,
  Vault,
  VaultSubaccountBalance,
} from '../types/ninja'

/**
 * @category Indexer Grpc Transformer
 */
export class IndexerGrpcNinjaTransformer {
  static grpcPaginationToPagination(grpcPagination?: GrpcVaultPagination) {
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
    grpcDenomBalance: GrpcVaultDenomBalance,
  ): VaultDenomBalance {
    return {
      denom: grpcDenomBalance.getDenom(),
      totalBalance: grpcDenomBalance.getTotalBalance(),
    }
  }

  static grpcProfitsToProfits(grpcProfits?: GrpcProfits): Profits | undefined {
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
    grpcSubaccountInfo?: GrpcVaultSubaccountBalance,
  ): VaultSubaccountBalance | undefined {
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

  static grpcVaultToVault(grpcVault?: GrpcVault): Vault | undefined {
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
    }
  }

  static grpcPriceSnapShotToPriceSnapShot(
    grpcPriceSnapshot: GrpcPriceSnapshot,
  ): PriceSnapshot {
    return {
      price: grpcPriceSnapshot.getPrice(),
      updatedAt: grpcPriceSnapshot.getUpdatedAt(),
    }
  }

  static grpcSubscriptionToSubscription(
    grpcSubscription: GrpcSubscription,
  ): Subscription {
    return {
      vaultInfo: IndexerGrpcNinjaTransformer.grpcVaultToVault(
        grpcSubscription.getVaultInfo(),
      ),
      lpAmount: grpcSubscription.getLpAmount(),
      lpAmountPercentage: grpcSubscription.getLpAmountPercentage(),
      holderAddress: grpcSubscription.getHolderAddress(),
    }
  }

  static grpcHoldersToHolders(grpcHolders: GrpcHolders): Holders {
    return {
      holderAddress: grpcHolders.getHolderAddress(),
      vaultAddress: grpcHolders.getVaultAddress(),
      amount: grpcHolders.getAmount(),
      updatedAt: grpcHolders.getUpdatedAt(),
      lpAmountPercentage: grpcHolders.getLpAmountPercentage(),
    }
  }
}
