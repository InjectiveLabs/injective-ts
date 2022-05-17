import { Coin } from '@injectivelabs/ts-types'
import { GrpcCoin } from '../types/index'
import {
  GrpcSubaccountBalance,
  GrpcSubaccountBalanceTransfer,
  GrpcSubaccountDeposit,
  GrpcAccountPortfolio,
  GrpcSubaccountPortfolio,
  TransferType,
  SubaccountBalance,
  SubaccountDeposit,
  SubaccountTransfer,
  AccountPortfolio,
  SubaccountPortfolio,
  TradingReward,
  GrpcTradingReward,
} from '../types/account'

export class AccountGrpcTransformer {
  static grpcSubaccountPortfolioToSubaccountPortfolio(
    subaccountPortfolio: GrpcSubaccountPortfolio,
  ): SubaccountPortfolio {
    return {
      subaccountId: subaccountPortfolio.getSubaccountId(),
      availableBalance: subaccountPortfolio.getAvailableBalance(),
      lockedBalance: subaccountPortfolio.getLockedBalance(),
      unrealizedPnl: subaccountPortfolio.getUnrealizedPnl(),
    }
  }

  static grpcAccountPortfolioToAccountPortfolio(
    portfolio: GrpcAccountPortfolio,
  ): AccountPortfolio {
    return {
      portfolioValue: portfolio.getPortfolioValue(),
      availableBalance: portfolio.getAvailableBalance(),
      lockedBalance: portfolio.getLockedBalance(),
      unrealizedPnl: portfolio.getUnrealizedPnl(),
      subaccountsList: portfolio
        .getSubaccountsList()
        .map(
          AccountGrpcTransformer.grpcSubaccountPortfolioToSubaccountPortfolio,
        ),
    }
  }

  static grpcAmountToAmount(amount: GrpcCoin): Coin {
    return {
      amount: amount.getAmount(),
      denom: amount.getDenom(),
    }
  }

  static grpcDepositToDeposit(
    deposit: GrpcSubaccountDeposit,
  ): SubaccountDeposit {
    return {
      totalBalance: deposit.getTotalBalance(),
      availableBalance: deposit.getAvailableBalance(),
    }
  }

  static grpcBalanceToBalance(
    balance: GrpcSubaccountBalance,
  ): SubaccountBalance {
    const deposit = balance.getDeposit()

    return {
      subaccountId: balance.getSubaccountId(),
      accountAddress: balance.getAccountAddress(),
      denom: balance.getDenom(),
      deposit: deposit
        ? AccountGrpcTransformer.grpcDepositToDeposit(deposit)
        : undefined,
    }
  }

  static grpcBalancesToBalances(
    balances: GrpcSubaccountBalance[],
  ): SubaccountBalance[] {
    return balances.map((balance) =>
      AccountGrpcTransformer.grpcBalanceToBalance(balance),
    )
  }

  static grpcTransferHistoryEntryToTransferHistoryEntry(
    transfer: GrpcSubaccountBalanceTransfer,
  ): SubaccountTransfer {
    const amount = transfer.getAmount()

    return {
      transferType: transfer.getTransferType() as TransferType,
      srcSubaccountId: transfer.getSrcSubaccountId(),
      srcSubaccountAddress: transfer.getSrcAccountAddress(),
      dstSubaccountId: transfer.getDstSubaccountId(),
      dstSubaccountAddress: transfer.getDstAccountAddress(),
      executedAt: transfer.getExecutedAt(),
      amount: amount
        ? AccountGrpcTransformer.grpcAmountToAmount(amount)
        : undefined,
    }
  }

  static grpcTradingRewardsToTradingRewards(
    rewards: GrpcTradingReward[],
  ): TradingReward[] {
    return rewards.map(AccountGrpcTransformer.grpcTradingRewardToTradingReward)
  }

  static grpcTradingRewardToTradingReward(
    reward: GrpcTradingReward,
  ): TradingReward {
    return {
      accountAddress: reward.getAccountAddress(),
      rewards: reward
        .getRewardsList()
        .map((r) => ({ amount: r.getAmount(), denom: r.getDenom() })),
      distributedAt: reward.getDistributedAt(),
    }
  }

  static grpcTransferHistoryToTransferHistory(
    transfers: GrpcSubaccountBalanceTransfer[],
  ): SubaccountTransfer[] {
    return transfers.map((transfer) =>
      AccountGrpcTransformer.grpcTransferHistoryEntryToTransferHistoryEntry(
        transfer,
      ),
    )
  }
}
