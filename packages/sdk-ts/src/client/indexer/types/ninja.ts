import { NinjaApi } from '@injectivelabs/ninja-proto-ts'

export interface NinjaHolders {
  holderAddress: string
  vaultAddress: string
  amount: string
  updatedAt: string
  lpAmountPercentage: number
  redemptionLockTime: string
}

export interface NinjaPriceSnapshot {
  price: number
  updatedAt: string
}

export interface NinjaProfits {
  allTimeChange: number
  threeMonthsChange: number
  oneMonthChange: number
  oneDayChange: number
  oneWeekChange: number
  oneYearChange: number
  threeYearsChange: number
  sixMonthsChange: number
}

export interface NinjaDenomBalance {
  denom: string
  totalBalance: string
}

export interface NinjaSubaccountBalance {
  subaccountId: string
  balancesList: NinjaDenomBalance[]
}

export interface NinjaVault {
  contractAddress: string
  codeId: string
  vaultName: string
  marketId: string
  currentTvl: number
  profits?: NinjaProfits
  updatedAt: string
  vaultType: string
  lpTokenPrice: number
  subaccountInfo?: NinjaSubaccountBalance
  masterContractAddress: string
  totalLpAmount: string
  redemptionLockTimeDuration: string
  redemptionUnlockTimeExpiration: string
}

export interface NinjaSubscription {
  vaultInfo?: NinjaVault
  lpAmount: string
  holderAddress: string
  lpAmountPercentage: number
  redemptionLockTime: string
  lockedAmount: string
}

export interface NinjaPagination {
  total: Number
}

export interface NinjaPortfolio {
  totalValue: number
  pnl: number
  totalValueChartList: NinjaPriceSnapshot[]
  pnlChartList: NinjaPriceSnapshot[]
}

export interface NinjaLeaderboardEntry {
  address: string
  pnl: number
}

export interface NinjaLeaderboard {
  entriesList: NinjaLeaderboardEntry[]
  snapshotBlock: string
  updatedAt: string
}

export type GrpcNinjaVault = NinjaApi.Vault
export type GrpcNinjaProfits = NinjaApi.Profits
export type GrpcNinjaSubaccountBalance = NinjaApi.SubaccountBalance
export type GrpcNinjaDenomBalance = NinjaApi.DenomBalance
export type GrpcNinjaPagination = NinjaApi.Pagination
export type GrpcNinjaPriceSnapshot = NinjaApi.PriceSnapshot
export type GrpcNinjaSubscription = NinjaApi.Subscription
export type GrpcNinjaHolders = NinjaApi.Holders
export type GrpcNinjaLeaderboardEntry = NinjaApi.LeaderboardEntry
