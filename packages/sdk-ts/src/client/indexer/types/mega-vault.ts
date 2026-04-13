import type * as InjectiveMegavaultRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_megavault_rpc_pb'

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
  depositedValue: string
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
  t: string
  v: string
}

export interface MegaVaultHistoricalPnL {
  t: string
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

export type GrpcMegaVaultApr = InjectiveMegavaultRpcPb.Apr
export type GrpcMegaVaultPnl = InjectiveMegavaultRpcPb.Pnl
export type GrpcMegaVaultAprStats = InjectiveMegavaultRpcPb.AprStats
export type GrpcMegaVaultPnlStats = InjectiveMegavaultRpcPb.PnlStats
export type GrpcMegaVaultOperator = InjectiveMegavaultRpcPb.Operator
export type GrpcMegaVaultTargetApr = InjectiveMegavaultRpcPb.TargetApr
export type GrpcMegaVaultUserStats = InjectiveMegavaultRpcPb.UserStats
export type GrpcMegaVaultIncentives = InjectiveMegavaultRpcPb.Incentives
export type GrpcMegaVaultVaultStats = InjectiveMegavaultRpcPb.VaultStats
export type GrpcMegaVaultVolatility = InjectiveMegavaultRpcPb.Volatility
export type GrpcMegaVaultRedemption = InjectiveMegavaultRpcPb.Redemption
export type GrpcMegaVaultMaxDrawdown = InjectiveMegavaultRpcPb.MaxDrawdown
export type GrpcMegaVaultSubscription = InjectiveMegavaultRpcPb.Subscription
export type GrpcMegaVaultHistoricalPnL = InjectiveMegavaultRpcPb.HistoricalPnL
export type GrpcMegaVaultHistoricalTVL = InjectiveMegavaultRpcPb.HistoricalTVL
export type GrpcMegaVaultUnrealizedPnl = InjectiveMegavaultRpcPb.UnrealizedPnl
export type GrpcMegaVaultVolatilityStats =
  InjectiveMegavaultRpcPb.VolatilityStats

export type GrpcMegaVaultOperatorRedemptionBucket =
  InjectiveMegavaultRpcPb.RedemptionBucket
export type GrpcMegaVaultOperationStatusLogEntry =
  InjectiveMegavaultRpcPb.OperationStatusLogEntry
