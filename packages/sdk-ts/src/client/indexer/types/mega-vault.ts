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

export type GrpcMegaVaultApr = InjectiveMegaVaultRpc.Apr
export type GrpcMegaVaultPnl = InjectiveMegaVaultRpc.Pnl
export type GrpcMegaVaultAprStats = InjectiveMegaVaultRpc.AprStats
export type GrpcMegaVaultPnlStats = InjectiveMegaVaultRpc.PnlStats
export type GrpcMegaVaultOperator = InjectiveMegaVaultRpc.Operator
export type GrpcMegaVaultUserStats = InjectiveMegaVaultRpc.UserStats
export type GrpcMegaVaultVaultStats = InjectiveMegaVaultRpc.VaultStats
export type GrpcMegaVaultVolatility = InjectiveMegaVaultRpc.Volatility
export type GrpcMegaVaultRedemption = InjectiveMegaVaultRpc.Redemption
export type GrpcMegaVaultMaxDrawdown = InjectiveMegaVaultRpc.MaxDrawdown
export type GrpcMegaVaultSubscription = InjectiveMegaVaultRpc.Subscription
export type GrpcMegaVaultHistoricalPnL = InjectiveMegaVaultRpc.HistoricalPnL
export type GrpcMegaVaultHistoricalTVL = InjectiveMegaVaultRpc.HistoricalTVL
export type GrpcMegaVaultUnrealizedPnl = InjectiveMegaVaultRpc.UnrealizedPnl
export type GrpcMegaVaultVolatilityStats = InjectiveMegaVaultRpc.VolatilityStats
export type GrpcMegaVaultOperatorRedemptionBucket =
  InjectiveMegaVaultRpc.RedemptionBucket
