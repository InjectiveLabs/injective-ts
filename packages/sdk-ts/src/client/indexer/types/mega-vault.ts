import type { InjectiveMegaVaultRpc } from '@injectivelabs/indexer-proto-ts'

export interface OperationStatusLogEntry {
  status: string
  txHash: string
  blockTime: string
  blockHeight: string
}

export interface MegaVaultOperator {
  address: string
  updatedAt: string
  percentage: string
  totalAmount: string
  subaccountId: string
  updatedHeight: string
  totalLiquidAmount: string
}

export interface MegaVault {
  admin: string
  lpDenom: string
  createdAt: string
  updatedAt: string
  quoteDenom: string
  contractName: string
  createdHeight: string
  updatedHeight: string
  contractAddress: string
  contractVersion: string
  operators: MegaVaultOperator[]
  stats: MegaVaultStats | undefined
  incentives: MegaVaultIncentives | undefined
  targetApr: MegaVaultTargetApr | undefined
}

export interface MegaVaultIncentives {
  amount: string
  address: string
  updatedAt: string
  updatedHeight: string
}

export interface MegaVaultStats {
  currentAmount: string
  currentLpPrice: string
  currentLpAmount: string
  totalRedeemedAmount: string
  totalSubscribedAmount: string
  apr: MegaVaultAprStats | undefined
  pnl: MegaVaultPnlStats | undefined
  currentAmountWithoutIncentives: string
  maxDrawdown: MegaVaultMaxDrawdown | undefined
  volatility: MegaVaultVolatilityStats | undefined
}

export interface MegaVaultPnlStats {
  allTime: MegaVaultPnl | undefined
  unrealized: MegaVaultUnrealizedPnl | undefined
}

export interface MegaVaultUnrealizedPnl {
  value: string
  percentage: string
}

export interface MegaVaultPnl {
  value: string
  percentage: string
  currentAmount: string
  totalAmountRedeemed: string
  totalAmountSubscribed: string
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
  currentLpPrice: string
  originalLpPrice: string
}

export interface MegaVaultUser {
  address: string
  updatedAt: string
  updatedHeight: string
  contractAddress: string
  stats: MegaVaultUserStats | undefined
}

export interface MegaVaultUserStats {
  currentAmount: string
  currentLpAmount: string
  pnl: MegaVaultPnlStats | undefined
}

export interface MegaVaultSubscription {
  user: string
  index: string
  amount: string
  status: string
  lpAmount: string
  createdAt: string
  executedAt: string
  createdHeight: string
  executedHeight: string
  contractAddress: string
  log: OperationStatusLogEntry[]
}

export interface MegaVaultRedemption {
  user: string
  index: string
  dueAt: string
  amount: string
  status: string
  lpAmount: string
  createdAt: string
  executedAt: string
  createdHeight: string
  executedHeight: string
  contractAddress: string
  log: OperationStatusLogEntry[]
}

export interface MegaVaultOperatorRedemptionBucket {
  bucket: string
  neededAmount: string
  lpAmountToRedeem: string
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

export interface MegaVaultTargetApr {
  apr: string
  updatedAt: string
  updatedHeight: string
  upperThreshold: string
  lowerThreshold: string
}

export type MegaVaultRedemptionStatus = 'pending' | 'executed' | 'executing'

export const MegaVaultRedemptionStatus = {
  Pending: 'pending',
  Executed: 'executed',
  Executing: 'executing',
} as const

export type MegaVaultSubscriptionStatus = 'pending' | 'executed' | 'executing'

export const MegaVaultSubscriptionStatus = {
  Pending: 'pending',
  Executed: 'executed',
  Executing: 'executing',
} as const

export type GrpcMegaVaultApr = InjectiveMegaVaultRpc.Apr
export type GrpcMegaVaultPnl = InjectiveMegaVaultRpc.Pnl
export type GrpcMegaVaultAprStats = InjectiveMegaVaultRpc.AprStats
export type GrpcMegaVaultPnlStats = InjectiveMegaVaultRpc.PnlStats
export type GrpcMegaVaultOperator = InjectiveMegaVaultRpc.Operator
export type GrpcMegaVaultTargetApr = InjectiveMegaVaultRpc.TargetApr
export type GrpcMegaVaultUserStats = InjectiveMegaVaultRpc.UserStats
export type GrpcMegaVaultIncentives = InjectiveMegaVaultRpc.Incentives
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
export type GrpcMegaVaultOperationStatusLogEntry =
  InjectiveMegaVaultRpc.OperationStatusLogEntry
