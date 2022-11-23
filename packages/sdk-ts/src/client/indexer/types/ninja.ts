import {
  Vault as GrpcVault,
  Profits as GrpcProfits,
  SubaccountBalance as GrpcVaultSubaccountBalance,
  DenomBalance as GrpcVaultDenomBalance,
  Pagination as GrpcVaultPagination,
  PriceSnapshot as GrpcPriceSnapshot,
  Subscription as GrpcSubscription,
  Holders as GrpcHolders,
} from '@injectivelabs/ninja-api/goadesign_goagen_ninja_api_pb'

export enum RedemptionType {
  BaseOnly = 'BaseOnly',
  QuoteOnly = 'QuoteOnly',
  BaseAndQuote = 'BaseAndQuote',
}
export interface Holders {
  holderAddress: string
  vaultAddress: string
  amount: string
  updatedAt: number
}

export interface PriceSnapshot {
  price: number
  updatedAt: number
}

export interface Profits {
  allTimeChange: number
  threeMonthsChange: number
  oneMonthChange: number
  oneDayChange: number
  oneWeekChange: number
  oneYearChange: number
  threeYearsChange: number
}

export interface VaultDenomBalance {
  denom: string
  totalBalance: string
}

export interface VaultSubaccountBalance {
  subaccountId: string
  balancesList: VaultDenomBalance[]
}

export interface Vault {
  contractAddress: string
  codeId: number
  vaultName: string
  marketId: string
  currentTvl: number
  profits?: Profits
  updatedAt: number
  vaultType: string
  lpTokenPrice: number
  subaccountInfo?: VaultSubaccountBalance
  masterContractAddress: string
}

export interface Subscription {
  vaultInfo?: Vault
  lpAmount: string
  holderAddress: string
}

export interface NinjaPagination {
  total: Number
}

export {
  GrpcVault,
  GrpcProfits,
  GrpcVaultSubaccountBalance,
  GrpcVaultDenomBalance,
  GrpcVaultPagination,
  GrpcPriceSnapshot,
  GrpcSubscription,
  GrpcHolders,
}
