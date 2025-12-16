import type { Coin } from '@injectivelabs/ts-types'
import type * as InjectivePortfolioRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_portfolio_rpc_pb'
import type { Position } from './derivatives.js'

export interface SubaccountDepositV2 {
  totalBalance: string
  availableBalance: string
}

export interface PortfolioSubaccountBalanceV2 {
  subaccountId: string
  denom: string
  deposit?: SubaccountDepositV2
}

export interface PositionsWithUPNL {
  position?: Position
  unrealizedPnl: string
}

export interface AccountPortfolioV2 {
  accountAddress: string
  bankBalancesList: Coin[]
  subaccountsList: PortfolioSubaccountBalanceV2[]
  positionsWithUpnlList: PositionsWithUPNL[]
}

export interface AccountPortfolioBalances {
  accountAddress: string
  bankBalancesList: Coin[]
  subaccountsList: PortfolioSubaccountBalanceV2[]
}

export type GrpcPositionV2 = InjectivePortfolioRpcPb.DerivativePosition
export type GrpcAccountPortfolioV2 = InjectivePortfolioRpcPb.Portfolio
export type GrpcSubaccountDepositV2 = InjectivePortfolioRpcPb.SubaccountDeposit
export type GrpcPositionsWithUPNL = InjectivePortfolioRpcPb.PositionsWithUPNL
export type GrpcPortfolioSubaccountBalanceV2 =
  InjectivePortfolioRpcPb.SubaccountBalanceV2
