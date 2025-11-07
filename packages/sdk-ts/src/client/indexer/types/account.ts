import type { Coin } from '@injectivelabs/ts-types'
import type { InjectiveAccountsRpcPb } from '@injectivelabs/indexer-proto-ts-v2'

export const TransferType = {
  Internal: 'internal',
  External: 'external',
  Withdraw: 'withdraw',
  Deposit: 'deposit',
} as const

export type TransferType = (typeof TransferType)[keyof typeof TransferType]

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

export type GrpcTradingReward = InjectiveAccountsRpcPb.Reward
export type GrpcAccountPortfolio = InjectiveAccountsRpcPb.AccountPortfolio
export type GrpcSubaccountDeposit = InjectiveAccountsRpcPb.SubaccountDeposit
export type GrpcSubaccountBalance = InjectiveAccountsRpcPb.SubaccountBalance
export type GrpcSubaccountPortfolio = InjectiveAccountsRpcPb.SubaccountPortfolio
export type GrpcSubaccountBalanceTransfer =
  InjectiveAccountsRpcPb.SubaccountBalanceTransfer
