import { InjectiveMegaVaultRpc } from '@injectivelabs/indexer-proto-ts'

export interface MVOperator {
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
  operators: MVOperator[]
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
  pnl: MVPnlStats | undefined
  volatility: MVVolatilityStats | undefined
  apr: MVAprStats | undefined
  maxDrawdown: MVMaxDrawdown | undefined
}

export interface MVPnlStats {
  unrealized: MVUnrealizedPnl | undefined
  allTime: MVPnl | undefined
}

export interface MVUnrealizedPnl {
  value: string
  percentage: string
}

export interface MVPnl {
  value: string
  percentage: string
  totalAmountSubscribed: string
  totalAmountRedeemed: string
  currentAmount: string
}
export interface MVMaxDrawdown {
  value: string
  latestPnLPeak: string
}

export interface MVVolatilityStats {
  /** 30-days volatility */
  thirtyDays: MVVolatility | undefined
}

export interface MVVolatility {
  /** Volatility value */
  value: string
}

export interface MVAprStats {
  thirtyDays: MVApr | undefined
}

export interface MVApr {
  value: string
  originalLpPrice: string
  currentLpPrice: string
}

export interface MVUser {
  address: string
  contractAddress: string
  stats: MVUserStats | undefined
  updatedHeight: string
  updatedAt: string
}

export interface MVUserStats {
  currentAmount: string
  currentLpAmount: string
  pnl: MVPnlStats | undefined
}

export interface MVSubscription {
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

export interface MVRedemption {
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

export interface MVOperatorRedemptionBucket {
  bucket: string
  lpAmountToRedeem: string
  neededAmount: string
  missingLiquidity: string
}

export interface MVHistoricalTVL {
  t: number
  v: string
}

export interface MVHistoricalPnL {
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
