import { InjectiveMegaVaultRpc } from '@injectivelabs/indexer-proto-ts'

export interface MegaVaultOperator {
  address: string
  totalAmount: string
  totalLiquidAmount: string
  updatedHeight: string
  updatedAt: string
}

export interface MegaVault {
  contractAddress: string
  contractName: string
  contractVersion: string
  admin: string
  lpDenom: string
  quoteDenom: string
  operators: MegaVaultOperator[]
  stats: MegaVaultStats | undefined
  createdHeight: string
  createdAt: string
  updatedHeight: string
  updatedAt: string
}

export interface MegaVaultStats {
  totalSubscribedAmount: string
  totalRedeemedAmount: string
  currentAmount: string
  currentLpAmount: string
  currentLpPrice: string
  pnl: MegaVaultPnlStats | undefined
  volatility: MegaVaultVolatilityStats | undefined
  apr: MegaVaultAprStats | undefined
  maxDrawdown: MegaVaultMaxDrawdown | undefined
}

export interface MegaVaultPnlStats {
  unrealized: MegaVaultUnrealizedPnl | undefined
  allTime: MegaVaultPnl | undefined
}

export interface MegaVaultUnrealizedPnl {
  value: string
  percentage: string
}

export interface MegaVaultPnl {
  value: string
  percentage: string
  totalAmountSubscribed: string
  totalAmountRedeemed: string
  currentAmount: string
}
export interface MegaVaultMaxDrawdown {
  value: string
  latestPnLPeak: string
}

export interface MegaVaultVolatilityStats {
  thirtyDays: MegaVaultVolatility | undefined
}

export interface MegaVaultVolatility {
  value: string
}

export interface MegaVaultAprStats {
  thirtyDays: MegaVaultApr | undefined
}

export interface MegaVaultApr {
  value: string
  originalLpPrice: string
  currentLpPrice: string
}

export interface MegaVaultUser {
  address: string
  contractAddress: string
  stats: MegaVaultUserStats | undefined
  updatedHeight: string
  updatedAt: string
}

export interface MegaVaultUserStats {
  currentAmount: string
  currentLpAmount: string
  pnl: MegaVaultPnlStats | undefined
}

export interface MegaVaultSubscription {
  contractAddress: string
  user: string
  index: string
  lpAmount: string
  amount: string
  status: string
  createdHeight: string
  createdAt: string
  executedHeight: string
  executedAt: string
}

export interface MegaVaultRedemption {
  contractAddress: string
  user: string
  index: string
  lpAmount: string
  amount: string
  status: string
  dueAt: string
  createdHeight: string
  createdAt: string
  executedHeight: string
  executedAt: string
}

export interface MegaVaultOperatorRedemptionBucket {
  bucket: string
  lpAmountToRedeem: string
  neededAmount: string
  missingLiquidity: string
}

export interface MegaVaultHistoricalTVL {
  t: number
  v: string
}

export interface MegaVaultHistoricalPnL {
  t: number
  v: string
}

export type GrpcUser = InjectiveMegaVaultRpc.User
export type GrpcVault = InjectiveMegaVaultRpc.Vault
export type GrpcRedemption = InjectiveMegaVaultRpc.Redemption
export type GrpcSubscription = InjectiveMegaVaultRpc.Subscription
export type GrpcHistoricalPnL = InjectiveMegaVaultRpc.HistoricalPnL
export type GrpcHistoricalTVL = InjectiveMegaVaultRpc.HistoricalTVL
export type GrpcOperatorRedemptionBucket =
  InjectiveMegaVaultRpc.RedemptionBucket
