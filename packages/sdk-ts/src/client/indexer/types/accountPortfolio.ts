import {
  Portfolio as GrpcAccountPortfolioV2,
  DerivativePosition as GrpcPositionV2,
  PositionsWithUPNL as GrpcPositionsWithUPNL,
  SubaccountDeposit as GrpcSubaccountDepositV2,
  SubaccountBalanceV2 as GrpcPortfolioSubaccountBalanceV2,
} from '@injectivelabs/indexer-api/injective_portfolio_rpc_pb'
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
  positionsWithUpnlList: PositionsWithUPNL[]
}

export {
  GrpcPositionV2,
  GrpcPositionsWithUPNL,
  GrpcAccountPortfolioV2,
  GrpcSubaccountDepositV2,
  GrpcPortfolioSubaccountBalanceV2,
}
