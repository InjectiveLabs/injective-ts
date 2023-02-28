import {
  Reward as GrpcTradingReward,
  AccountPortfolio as GrpcAccountPortfolio,
  SubaccountDeposit as GrpcSubaccountDeposit,
  SubaccountBalance as GrpcSubaccountBalance,
  SubaccountPortfolio as GrpcSubaccountPortfolio,
  SubaccountBalanceTransfer as GrpcSubaccountBalanceTransfer,
} from '@injectivelabs/indexer-proto-ts/injective_accounts_rpc'
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

export {
  GrpcTradingReward,
  GrpcAccountPortfolio,
  GrpcSubaccountDeposit,
  GrpcSubaccountBalance,
  GrpcSubaccountPortfolio,
  GrpcSubaccountBalanceTransfer,
}
