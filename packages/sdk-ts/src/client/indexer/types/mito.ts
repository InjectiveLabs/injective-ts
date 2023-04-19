import { Coin } from '@injectivelabs/ts-types'
import { MitoApi } from '@injectivelabs/mito-proto-ts'

export interface MitoHolders {
  holderAddress: string
  vaultAddress: string
  amount: string
  updatedAt: string
  lpAmountPercentage: number
  redemptionLockTime: string
}

export interface MitoPriceSnapshot {
  price: number
  updatedAt: string
}

export interface MitoChanges {
  allTimeChange: number
  threeMonthsChange?: number
  oneMonthChange?: number
  oneDayChange?: number
  oneWeekChange?: number
  oneYearChange?: number
  threeYearsChange?: number
  sixMonthsChange?: number
}

export interface MitoDenomBalance {
  denom: string
  totalBalance: string
}

export interface MitoSubaccountBalance {
  subaccountId: string
  balancesList: MitoDenomBalance[]
}

export interface MitoVault {
  contractAddress: string
  codeId: string
  vaultName: string
  marketId: string
  currentTvl: number
  profits?: MitoChanges
  tvlChanges?: MitoChanges
  updatedAt: string
  vaultType: string
  lpTokenPrice: number
  subaccountInfo?: MitoSubaccountBalance
  masterContractAddress: string
  totalLpAmount: string
  notionalValueCap: string
}

export interface MitoSubscription {
  vaultInfo?: MitoVault
  lpAmount: string
  holderAddress: string
  lpAmountPercentage: number
}

export interface MitoPagination {
  total: Number
}

export interface MitoPortfolio {
  totalValue: number
  pnl: number
  totalValueChartList: MitoPriceSnapshot[]
  pnlChartList: MitoPriceSnapshot[]
}

export interface MitoLeaderboardEntry {
  address: string
  pnl: number
}

export interface MitoLeaderboard {
  entriesList: MitoLeaderboardEntry[]
  snapshotBlock: string
  updatedAt: string
  epochId: number
}

export interface MitoTransfer {
  lpAmount: string
  coins: Coin[]
  usdValue: string
  isDeposit: boolean
  executedAt: number
  account: string
  vault: string
  txHash: string
  tidByVault: number
  tidByAccount: number
}

export type GrpcMitoVault = MitoApi.Vault
export type GrpcMitoChanges = MitoApi.Changes
export type GrpcMitoSubaccountBalance = MitoApi.SubaccountBalance
export type GrpcMitoDenomBalance = MitoApi.DenomBalance
export type GrpcMitoPagination = MitoApi.Pagination
export type GrpcMitoPriceSnapshot = MitoApi.PriceSnapshot
export type GrpcMitoSubscription = MitoApi.Subscription
export type GrpcMitoHolders = MitoApi.Holders
export type GrpcMitoLeaderboardEntry = MitoApi.LeaderboardEntry
