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
} from '../types/account-portfolio'
import { InjectivePortfolioRpc } from '@injectivelabs/indexer-proto-ts'

export class IndexerGrpcAccountPortfolioTransformer {
  static accountPortfolioResponseToAccountPortfolio(
    response: InjectivePortfolioRpc.AccountPortfolioResponse,
    address: string,
  ): AccountPortfolioV2 {
    const portfolio = response.portfolio!
    const bankBalancesList = portfolio?.bankBalances || []
    const subaccountList = portfolio?.subaccounts || []
    const positionsWithUpnlList = portfolio?.positionsWithUpnl || []

    if (!portfolio) {
      return {
        accountAddress: address || '',
        bankBalancesList: [],
        subaccountsList: [],
        positionsWithUpnlList: [],
      }
    }

    return {
      accountAddress: portfolio.accountAddress,
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
      amount: coin.amount,
      denom: coin.denom,
    }
  }

  static grpcPositionWithUPNLToPositionWithUPNL(
    positionsWithUPNL: GrpcPositionsWithUPNL,
  ): PositionsWithUPNL {
    const grpcPosition = positionsWithUPNL.position

    return {
      position: grpcPosition
        ? IndexerGrpcAccountPortfolioTransformer.grpcPositionToGrpcPosition(
            grpcPosition,
          )
        : undefined,
      unrealizedPnl: positionsWithUPNL.unrealizedPnl,
    }
  }

  static grpcPositionToGrpcPosition(position: GrpcPositionV2): PositionV2 {
    return {
      ticker: position.ticker,
      marketId: position.marketId,
      subaccountId: position.subaccountId,
      direction: position.direction,
      quantity: position.quantity,
      entryPrice: position.entryPrice,
      margin: position.margin,
      liquidationPrice: position.liquidationPrice,
      markPrice: position.markPrice,
      aggregateReduceOnlyQuantity: position.aggregateReduceOnlyQuantity,
      updatedAt: parseInt(position.updatedAt, 10),
      createdAt: parseInt(position.createdAt, 10),
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
