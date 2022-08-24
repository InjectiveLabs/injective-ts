import {
  PortfolioResponse,
  RewardsResponse,
  SubaccountBalanceResponse,
  SubaccountHistoryResponse,
  SubaccountBalancesListResponse,
} from '@injectivelabs/exchange-api/injective_accounts_rpc_pb'
import { Coin } from '@injectivelabs/ts-types'
import { GrpcCoin } from '../../../types/index'
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

/**
 * @category Exchange Grpc Transformer
 */
export class ExchangeGrpcAccountTransformer {
  static accountPortfolioResponseToAccountPortfolio(
    response: PortfolioResponse,
  ): AccountPortfolio {
    const portfolio = response.getPortfolio()!
    const subaccounts = portfolio?.getSubaccountsList() || []

    return {
      portfolioValue: portfolio.getPortfolioValue(),
      availableBalance: portfolio.getAvailableBalance(),
      lockedBalance: portfolio.getLockedBalance(),
      unrealizedPnl: portfolio.getUnrealizedPnl(),
      subaccountsList: subaccounts.map(
        ExchangeGrpcAccountTransformer.grpcSubaccountPortfolioToSubaccountPortfolio,
      ),
    }
  }

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
          ExchangeGrpcAccountTransformer.grpcSubaccountPortfolioToSubaccountPortfolio,
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

  static balancesResponseToBalances(
    response: SubaccountBalancesListResponse,
  ): SubaccountBalance[] {
    return response
      .getBalancesList()
      .map((b) => ExchangeGrpcAccountTransformer.grpcBalanceToBalance(b))
  }

  static balanceResponseToBalance(
    response: SubaccountBalanceResponse,
  ): SubaccountBalance {
    return ExchangeGrpcAccountTransformer.grpcBalanceToBalance(
      response.getBalance()!,
    )
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
        ? ExchangeGrpcAccountTransformer.grpcDepositToDeposit(deposit)
        : undefined,
    }
  }

  static grpcBalancesToBalances(
    balances: GrpcSubaccountBalance[],
  ): SubaccountBalance[] {
    return balances.map((balance) =>
      ExchangeGrpcAccountTransformer.grpcBalanceToBalance(balance),
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
        ? ExchangeGrpcAccountTransformer.grpcAmountToAmount(amount)
        : undefined,
    }
  }

  static tradingRewardsResponseToTradingRewards(
    response: RewardsResponse,
  ): TradingReward[] {
    const rewards = response.getRewardsList()

    return rewards.map(
      ExchangeGrpcAccountTransformer.grpcTradingRewardToTradingReward,
    )
  }

  static grpcTradingRewardsToTradingRewards(
    rewards: GrpcTradingReward[],
  ): TradingReward[] {
    return rewards.map(
      ExchangeGrpcAccountTransformer.grpcTradingRewardToTradingReward,
    )
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

  static transferHistoryResponseToTransferHistory(
    response: SubaccountHistoryResponse,
  ) {
    return response
      .getTransfersList()
      .map((transfer) =>
        ExchangeGrpcAccountTransformer.grpcTransferHistoryEntryToTransferHistoryEntry(
          transfer,
        ),
      )
  }

  static grpcTransferHistoryToTransferHistory(
    transfers: GrpcSubaccountBalanceTransfer[],
  ): SubaccountTransfer[] {
    return transfers.map((transfer) =>
      ExchangeGrpcAccountTransformer.grpcTransferHistoryEntryToTransferHistoryEntry(
        transfer,
      ),
    )
  }
}
