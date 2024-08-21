import { Coin } from '@injectivelabs/ts-types'
import { GrpcCoin } from '../../../types'
import {
  TokenHolders,
  PositionsWithUPNL,
  AccountPortfolioV2,
  SubaccountDepositV2,
  GrpcPositionsWithUPNL,
  GrpcSubaccountDepositV2,
  AccountPortfolioBalances,
  PortfolioSubaccountBalanceV2,
  GrpcPortfolioSubaccountBalanceV2,
} from '../types/account-portfolio'
import { InjectivePortfolioRpc } from '@injectivelabs/indexer-proto-ts'
import { IndexerGrpcDerivativeTransformer } from './IndexerGrpcDerivativeTransformer'

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

  static accountPortfolioBalancesResponseToAccountPortfolioBalances(
    response: InjectivePortfolioRpc.AccountPortfolioBalancesResponse,
    address: string,
  ): AccountPortfolioBalances {
    const portfolio = response.portfolio!
    const bankBalancesList = portfolio?.bankBalances || []
    const subaccountList = portfolio?.subaccounts || []

    if (!portfolio) {
      return {
        accountAddress: address || '',
        bankBalancesList: [],
        subaccountsList: [],
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
        ? IndexerGrpcDerivativeTransformer.grpcPositionToPosition(grpcPosition)
        : undefined,
      unrealizedPnl: positionsWithUPNL.unrealizedPnl,
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

  static tokenHoldersResponseToTokenHolders(
    response: InjectivePortfolioRpc.TokenHoldersResponse,
  ): TokenHolders {
    return {
      holders: response.holders.map((holder) => ({
        accountAddress: holder.accountAddress,
        balance: holder.balance,
      })),
      nextCursors: response.nextCursors,
    }
  }
}
