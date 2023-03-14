import { InjectiveAccountRpc } from '@injectivelabs/indexer-proto-ts'
import { Coin } from '@injectivelabs/ts-types'

export enum TransferType {
  Internal = 'internal',
  External = 'external',
  Withdraw = 'withdraw',
  Deposit = 'deposit',
}

export interface SubaccountTransfer {
  transferType: TransferType
  srcSubaccountId: string
  srcSubaccountAddress: string
  dstSubaccountId: string
  dstSubaccountAddress: string
  amount?: Coin
  executedAt: number
}

export interface SubaccountDeposit {
  totalBalance: string
  availableBalance: string
}

export interface SubaccountBalance {
  subaccountId: string
  accountAddress: string
  denom: string
  deposit?: SubaccountDeposit
}

export interface SubaccountPortfolio {
  subaccountId: string
  availableBalance: string
  lockedBalance: string
  unrealizedPnl: string
}

export interface AccountPortfolio {
  portfolioValue: string
  availableBalance: string
  lockedBalance: string
  unrealizedPnl: string
  subaccountsList: Array<SubaccountPortfolio>
}

export interface TradingReward {
  accountAddress: string
  rewards: {
    amount: string
    denom: string
  }[]
  distributedAt: number
}

export type GrpcTradingReward = InjectiveAccountRpc.Reward
export type GrpcAccountPortfolio = InjectiveAccountRpc.AccountPortfolio
export type GrpcSubaccountDeposit = InjectiveAccountRpc.SubaccountDeposit
export type GrpcSubaccountBalance = InjectiveAccountRpc.SubaccountBalance
export type GrpcSubaccountPortfolio = InjectiveAccountRpc.SubaccountPortfolio
export type GrpcSubaccountBalanceTransfer =
  InjectiveAccountRpc.SubaccountBalanceTransfer
