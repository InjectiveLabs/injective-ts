import { AccountPortfolioResponse } from '@injectivelabs/indexer-api/injective_portfolio_rpc_pb'
import { Coin } from '@injectivelabs/ts-types'
import { GrpcCoin } from '../../../types/index'
import {
  PositionV2,
  GrpcPositionV2,
  PositionsWithUPNL,
  AccountPortfolioV2,
  SubaccountDepositV2,
  GrpcPositionsWithUPNL,
  GrpcSubaccountDepositV2,
  PortfolioSubaccountBalanceV2,
  GrpcPortfolioSubaccountBalanceV2,
} from '../types/accountPortfolio'

export class IndexerGrpcAccountPortfolioTransformer {
  static accountPortfolioResponseToAccountPortfolio(
    response: AccountPortfolioResponse,
    address?: string,
  ): AccountPortfolioV2 {
    const portfolio = response.getPortfolio()

    if (!portfolio) {
      return {
        accountAddress: address || '',
        bankBalancesList: [],
        subaccountsList: [],
        positionsWithUpnlList: [],
      }
    }

    const bankBalancesList = portfolio?.getBankBalancesList() || []
    const subaccountList = portfolio?.getSubaccountsList() || []
    const positionsWithUpnlList = portfolio?.getPositionsWithUpnlList() || []

    return {
      accountAddress: portfolio.getAccountAddress(),
      bankBalancesList: bankBalancesList.map(
        IndexerGrpcAccountPortfolioTransformer.grpcCoinToCoin,
      ),
      subaccountsList: subaccountList.map(
        IndexerGrpcAccountPortfolioTransformer.grpcSubaccountBalanceToSubaccountBalance,
      ),
      positionsWithUpnlList: positionsWithUpnlList.map(
        IndexerGrpcAccountPortfolioTransformer.grpcPositionWithUPNLToPositionWithUPNL,
      ),
    }
  }

  static grpcCoinToCoin(coin: GrpcCoin): Coin {
    return {
      amount: coin.getAmount(),
      denom: coin.getDenom(),
    }
  }

  static grpcPositionWithUPNLToPositionWithUPNL(
    positionsWithUPNL: GrpcPositionsWithUPNL,
  ): PositionsWithUPNL {
    const grpcPosition = positionsWithUPNL.getPosition()

    return {
      position: grpcPosition
        ? IndexerGrpcAccountPortfolioTransformer.grpcPositionToGrpcPosition(
            grpcPosition,
          )
        : undefined,
      unrealizedPnl: positionsWithUPNL.getUnrealizedPnl(),
    }
  }

  static grpcPositionToGrpcPosition(position: GrpcPositionV2): PositionV2 {
    return {
      ticker: position.getTicker(),
      marketId: position.getMarketId(),
      subaccountId: position.getSubaccountId(),
      direction: position.getDirection(),
      quantity: position.getQuantity(),
      entryPrice: position.getEntryPrice(),
      margin: position.getMargin(),
      liquidationPrice: position.getLiquidationPrice(),
      markPrice: position.getMarkPrice(),
      aggregateReduceOnlyQuantity: position.getAggregateReduceOnlyQuantity(),
      updatedAt: position.getUpdatedAt(),
      createdAt: position.getCreatedAt(),
    }
  }

  static grpcSubaccountDepositToSubaccountDeposit(
    subaccountDeposit: GrpcSubaccountDepositV2,
  ): SubaccountDepositV2 {
    return {
      totalBalance: subaccountDeposit.getTotalBalance(),
      availableBalance: subaccountDeposit.getAvailableBalance(),
    }
  }

  static grpcSubaccountBalanceToSubaccountBalance(
    subaccountBalance: GrpcPortfolioSubaccountBalanceV2,
  ): PortfolioSubaccountBalanceV2 {
    const deposit = subaccountBalance.getDeposit()

    return {
      subaccountId: subaccountBalance.getSubaccountId(),
      denom: subaccountBalance.getDenom(),
      deposit: deposit
        ? IndexerGrpcAccountPortfolioTransformer.grpcSubaccountDepositToSubaccountDeposit(
            deposit,
          )
        : undefined,
    }
  }
}
