import { InjectivePortfolioRpc } from '@injectivelabs/indexer-proto-ts'
import { Coin } from '@injectivelabs/ts-types'
import { Position } from './derivatives'

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

export type GrpcPositionV2 = InjectivePortfolioRpc.DerivativePosition
export type GrpcAccountPortfolioV2 = InjectivePortfolioRpc.Portfolio
export type GrpcSubaccountDepositV2 = InjectivePortfolioRpc.SubaccountDeposit
export type GrpcPositionsWithUPNL = InjectivePortfolioRpc.PositionsWithUPNL
export type GrpcPortfolioSubaccountBalanceV2 =
  InjectivePortfolioRpc.SubaccountBalanceV2
