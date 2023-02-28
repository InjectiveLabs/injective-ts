import { AccountPortfolioResponse } from '@injectivelabs/indexer-proto-ts/injective_portfolio_rpc'
import { Coin } from '@injectivelabs/ts-types'
import { GrpcCoin } from '../../../types/index'
import {
  AccountPortfolioV2,
  SubaccountDepositV2,
  GrpcSubaccountDepositV2,
  PortfolioSubaccountBalanceV2,
  GrpcPortfolioSubaccountBalanceV2,
} from '../types/account-portfolio'

export class IndexerGrpcAccountPortfolioTransformer {
  static accountPortfolioResponseToAccountPortfolio(
    response: AccountPortfolioResponse,
  ): AccountPortfolioV2 | undefined {
    const portfolio = response.portfolio!
    const bankBalancesList = portfolio?.bankBalances || []
    const subaccountList = portfolio?.subaccounts || []

    return {
      accountAddress: portfolio.accountAddress,
      bankBalancesList: bankBalancesList.map(
        IndexerGrpcAccountPortfolioTransformer.grpcCoinToCoin,
      ),
      subaccountsList: subaccountList.map(
        IndexerGrpcAccountPortfolioTransformer.grpcSubaccountBalanceToSubaccountBalance,
      ),
    }
  }

  static grpcCoinToCoin(coin: GrpcCoin): Coin {
    return {
      amount: coin.amount,
      denom: coin.denom,
    }
  }

  static grpcSubaccountDepositToSubaccountDeposit(
    subaccountDeposit: GrpcSubaccountDepositV2,
  ): SubaccountDepositV2 {
    return {
      totalBalance: subaccountDeposit.totalBalance,
      availableBalance: subaccountDeposit.availableBalance,
    }
  }

  static grpcSubaccountBalanceToSubaccountBalance(
    subaccountBalance: GrpcPortfolioSubaccountBalanceV2,
  ): PortfolioSubaccountBalanceV2 {
    const deposit = subaccountBalance.deposit

    return {
      subaccountId: subaccountBalance.subaccountId,
      denom: subaccountBalance.denom,
      deposit: deposit
        ? IndexerGrpcAccountPortfolioTransformer.grpcSubaccountDepositToSubaccountDeposit(
            deposit,
          )
        : undefined,
    }
  }
}
