import { grpcPagingToPagingV2 } from '../../..//utils/pagination.js'
import type { Coin } from '@injectivelabs/ts-types'
import type * as InjectiveAccountsRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_accounts_rpc_pb'
import type { GrpcCoin } from '../../../types/index.js'
import type {
  TransferType,
  TradingReward,
  AccountPortfolio,
  SubaccountBalance,
  SubaccountDeposit,
  GrpcTradingReward,
  SubaccountTransfer,
  SubaccountPortfolio,
  GrpcAccountPortfolio,
  GrpcSubaccountBalance,
  GrpcSubaccountDeposit,
  GrpcSubaccountPortfolio,
  GrpcSubaccountBalanceTransfer,
} from '../types/account.js'

/**
 * @category Indexer Grpc Transformer
 *
 */
export class IndexerGrpcAccountTransformer {
  /**
   *
   * @deprecated - use IndexerGrpcAccountPortfolioApi.accountPortfolioResponseToAccountPortfolio
   */
  static accountPortfolioResponseToAccountPortfolio(
    response: InjectiveAccountsRpcPb.PortfolioResponse,
  ): AccountPortfolio {
    const portfolio = response.portfolio!
    const subaccounts = portfolio.subaccounts || []

    return {
      portfolioValue: portfolio.portfolioValue,
      availableBalance: portfolio.availableBalance,
      lockedBalance: portfolio.lockedBalance,
      unrealizedPnl: portfolio.unrealizedPnl,
      subaccountsList: subaccounts.map(
        IndexerGrpcAccountTransformer.grpcSubaccountPortfolioToSubaccountPortfolio,
      ),
    }
  }

  static grpcSubaccountPortfolioToSubaccountPortfolio(
    subaccountPortfolio: GrpcSubaccountPortfolio,
  ): SubaccountPortfolio {
    return {
      subaccountId: subaccountPortfolio.subaccountId,
      availableBalance: subaccountPortfolio.availableBalance,
      lockedBalance: subaccountPortfolio.lockedBalance,
      unrealizedPnl: subaccountPortfolio.unrealizedPnl,
    }
  }

  static grpcAccountPortfolioToAccountPortfolio(
    portfolio: GrpcAccountPortfolio,
  ): AccountPortfolio {
    return {
      portfolioValue: portfolio.portfolioValue,
      availableBalance: portfolio.availableBalance,
      lockedBalance: portfolio.lockedBalance,
      unrealizedPnl: portfolio.unrealizedPnl,
      subaccountsList: portfolio.subaccounts.map(
        IndexerGrpcAccountTransformer.grpcSubaccountPortfolioToSubaccountPortfolio,
      ),
    }
  }

  static grpcAmountToAmount(amount: GrpcCoin): Coin {
    return {
      amount: amount.amount,
      denom: amount.denom,
    }
  }

  static grpcDepositToDeposit(
    deposit: GrpcSubaccountDeposit,
  ): SubaccountDeposit {
    return {
      totalBalance: deposit.totalBalance,
      availableBalance: deposit.availableBalance,
    }
  }

  static balancesResponseToBalances(
    response: InjectiveAccountsRpcPb.SubaccountBalancesListResponse,
  ): SubaccountBalance[] {
    return response.balances.map((b) =>
      IndexerGrpcAccountTransformer.grpcBalanceToBalance(b),
    )
  }

  static balanceResponseToBalance(
    response: InjectiveAccountsRpcPb.SubaccountBalanceEndpointResponse,
  ): SubaccountBalance {
    return IndexerGrpcAccountTransformer.grpcBalanceToBalance(response.balance!)
  }

  static grpcBalanceToBalance(
    balance: GrpcSubaccountBalance,
  ): SubaccountBalance {
    const deposit = balance.deposit

    return {
      subaccountId: balance.subaccountId,
      accountAddress: balance.accountAddress,
      denom: balance.denom,
      deposit: deposit
        ? IndexerGrpcAccountTransformer.grpcDepositToDeposit(deposit)
        : undefined,
    }
  }

  static grpcBalancesToBalances(
    balances: GrpcSubaccountBalance[],
  ): SubaccountBalance[] {
    return balances.map((balance) =>
      IndexerGrpcAccountTransformer.grpcBalanceToBalance(balance),
    )
  }

  static grpcTransferHistoryEntryToTransferHistoryEntry(
    transfer: GrpcSubaccountBalanceTransfer,
  ): SubaccountTransfer {
    const amount = transfer.amount

    return {
      transferType: transfer.transferType as TransferType,
      srcSubaccountId: transfer.srcSubaccountId,
      srcSubaccountAddress: transfer.srcAccountAddress,
      dstSubaccountId: transfer.dstSubaccountId,
      dstSubaccountAddress: transfer.dstAccountAddress,
      executedAt: Number(transfer.executedAt),
      amount: amount
        ? IndexerGrpcAccountTransformer.grpcAmountToAmount(amount)
        : undefined,
    }
  }

  static tradingRewardsResponseToTradingRewards(
    response: InjectiveAccountsRpcPb.RewardsResponse,
  ): TradingReward[] {
    const rewards = response.rewards

    return rewards.map(
      IndexerGrpcAccountTransformer.grpcTradingRewardToTradingReward,
    )
  }

  static grpcTradingRewardsToTradingRewards(
    rewards: GrpcTradingReward[],
  ): TradingReward[] {
    return rewards.map(
      IndexerGrpcAccountTransformer.grpcTradingRewardToTradingReward,
    )
  }

  static grpcTradingRewardToTradingReward(
    reward: GrpcTradingReward,
  ): TradingReward {
    return {
      accountAddress: reward.accountAddress,
      rewards: reward.rewards.map((r) => ({
        amount: r.amount,
        denom: r.denom,
      })),
      distributedAt: Number(reward.distributedAt),
    }
  }

  static transferHistoryResponseToTransferHistory(
    response: InjectiveAccountsRpcPb.SubaccountHistoryResponse,
  ) {
    const transfers = response.transfers
    const pagination = response.paging

    return {
      transfers: transfers.map((transfer) =>
        IndexerGrpcAccountTransformer.grpcTransferHistoryEntryToTransferHistoryEntry(
          transfer,
        ),
      ),
      pagination: grpcPagingToPagingV2(pagination),
    }
  }

  static grpcTransferHistoryToTransferHistory(
    transfers: GrpcSubaccountBalanceTransfer[],
  ): SubaccountTransfer[] {
    return transfers.map((transfer) =>
      IndexerGrpcAccountTransformer.grpcTransferHistoryEntryToTransferHistoryEntry(
        transfer,
      ),
    )
  }
}
