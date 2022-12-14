import {
  Vault as GrpcNinjaVault,
  Profits as GrpcNinjaProfits,
  SubaccountBalance as GrpcNinjaSubaccountBalance,
  DenomBalance as GrpcNinjaDenomBalance,
  Pagination as GrpcNinjaPagination,
  PriceSnapshot as GrpcNinjaPriceSnapshot,
  Subscription as GrpcNinjaSubscription,
  Holders as GrpcNinjaHolders,
  LeaderboardEntry as GrpcNinjaLeaderboardEntry,
} from '@injectivelabs/ninja-api/goadesign_goagen_ninja_api_pb'

export interface NinjaHolders {
  holderAddress: string
  vaultAddress: string
  amount: string
  updatedAt: number
  lpAmountPercentage: number
  redemptionLockTime: number
}

export interface NinjaPriceSnapshot {
  price: number
  updatedAt: number
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
  codeId: number
  vaultName: string
  marketId: string
  currentTvl: number
  profits?: NinjaProfits
  updatedAt: number
  vaultType: string
  lpTokenPrice: number
  subaccountInfo?: NinjaSubaccountBalance
  masterContractAddress: string
  totalLpAmount: string
  redemptionLockTimeDuration: number
}

export interface NinjaSubscription {
  vaultInfo?: NinjaVault
  lpAmount: string
  lpAmountPercentage: number
  holderAddress: string
  redemptionLockTime: number
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
  snapshotBlock: number
  updatedAt: number
}

export {
  GrpcNinjaVault,
  GrpcNinjaProfits,
  GrpcNinjaSubaccountBalance,
  GrpcNinjaDenomBalance,
  GrpcNinjaPagination,
  GrpcNinjaPriceSnapshot,
  GrpcNinjaSubscription,
  GrpcNinjaHolders,
  GrpcNinjaLeaderboardEntry,
}
