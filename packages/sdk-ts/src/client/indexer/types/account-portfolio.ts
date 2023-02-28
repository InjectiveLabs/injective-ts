import {
  Portfolio as GrpcAccountPortfolioV2,
  SubaccountDeposit as GrpcSubaccountDepositV2,
  SubaccountBalanceV2 as GrpcPortfolioSubaccountBalanceV2,
} from '@injectivelabs/indexer-proto-ts/injective_portfolio_rpc'
import { Coin } from '@injectivelabs/ts-types'

export interface SubaccountDepositV2 {
  totalBalance: string
  availableBalance: string
}

export interface PortfolioSubaccountBalanceV2 {
  subaccountId: string
  denom: string
  deposit?: SubaccountDepositV2
}

export interface PositionV2 {
  ticker: string
  marketId: string
  subaccountId: string
  direction: string
  quantity: string
  entryPrice: string
  margin: string
  liquidationPrice: string
  markPrice: string
  aggregateReduceOnlyQuantity: string
  updatedAt: number
  createdAt: number
}

export interface PositionsWithUPNL {
  position?: PositionV2
  unrealizedPnl: string
}

export interface AccountPortfolioV2 {
  accountAddress: string
  bankBalancesList: Coin[]
  subaccountsList: PortfolioSubaccountBalanceV2[]
  // positionsWithUpnlList: PositionsWithUPNL[]
}

export {
  // GrpcPositionV2,
  GrpcAccountPortfolioV2,
  GrpcSubaccountDepositV2,
  // GrpcPositionsWithUPNL,
  GrpcPortfolioSubaccountBalanceV2,
}
