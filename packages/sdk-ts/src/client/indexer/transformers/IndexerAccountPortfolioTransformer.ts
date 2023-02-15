import { AccountPortfolioResponse } from '@injectivelabs/indexer-api/injective_portfolio_rpc_pb'
import { Coin } from '@injectivelabs/ts-types'
import { GrpcCoin } from '../../../types/index'
import {
  AccountPortfolioV2,
  GrpcPortfolioSubaccountBalanceV2,
  PortfolioSubaccountBalanceV2,
} from '../types/accountPortfolio'

export class IndexerGrpcAccountPortfolioTransformer {
  static accountPortfolioResponseToAccountPortfolio(
    response: AccountPortfolioResponse,
  ): AccountPortfolioV2 | undefined {
    const portfolio = response.getPortfolio()!
    const bankBalancesList = portfolio?.getBankBalancesList() || []
    const subaccountList = portfolio?.getSubaccountsList() || []

    return {
      accountAddress: portfolio.getAccountAddress(),
      bankBalancesList: bankBalancesList.map(
        IndexerGrpcAccountPortfolioTransformer.grpcCoinToCoin,
      ),
      subaccountsList: subaccountList.map(
        IndexerGrpcAccountPortfolioTransformer.grpcSubaccountsListToSubaccountsList,
      ),
    }
  }

  static grpcCoinToCoin(coin: GrpcCoin): Coin {
    return {
      amount: coin.getAmount(),
      denom: coin.getDenom(),
    }
  }

  static grpcSubaccountsListToSubaccountsList(
    subaccountsList: GrpcPortfolioSubaccountBalanceV2,
  ): PortfolioSubaccountBalanceV2 {
    return {
      subaccountId: subaccountsList.getSubaccountId(),
      availableBalancesList: subaccountsList
        .getAvailableBalancesList()
        .map(IndexerGrpcAccountPortfolioTransformer.grpcCoinToCoin),
      marginHoldList: subaccountsList
        .getMarginHoldList()
        .map(IndexerGrpcAccountPortfolioTransformer.grpcCoinToCoin),
      unrealizedPnlList: subaccountsList
        .getUnrealizedPnlList()
        .map(IndexerGrpcAccountPortfolioTransformer.grpcCoinToCoin),
    }
  }
}
