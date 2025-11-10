import type { Coin } from '@injectivelabs/ts-types'
import type { GoadesignGoagenMitoApiPb } from '@injectivelabs/mito-proto-ts-v2'

export type MitoGaugeStatus = 'active' | 'live'

export const MitoGaugeStatus = {
  Active: 'active',
  Live: 'live',
} as const

export interface MitoHolders {
  holderAddress: string
  vaultAddress: string
  amount: string
  updatedAt: number
  lpAmountPercentage: number
  redemptionLockTime: string
  stakedAmount: string
}

export interface MitoPriceSnapshot {
  price: number
  updatedAt: number
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
  updatedAt: number
  vaultType: string
  lpTokenPrice: number
  subaccountInfo?: MitoSubaccountBalance
  masterContractAddress: string
  totalLpAmount: string
  slug: string
  createdAt: number
  notionalValueCap: string
  tvlChanges?: MitoChanges
  apy: number
  apy7D: number
  apy7DFq: number
  apyue: number
  apyV3: number
  registrationMode: string
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
  updatedAt: number
}

export interface MitoLeaderboardEntry {
  address: string
  pnl: number
}

export interface MitoLeaderboard {
  entriesList: MitoLeaderboardEntry[]
  snapshotBlock: string
  updatedAt: number
  epochId: number
}

export interface MitoLeaderboardEpoch {
  epochId: number
  startAt: number
  endAt: number
  isLive: boolean
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

export interface MitoGauge {
  id: string
  owner: string
  startTimestamp: number
  endTimestamp: number
  rewardTokens: Coin[]
  lastDistribution: number
  status: MitoGaugeStatus
}

export interface MitoStakingPool {
  vaultName: string
  vaultAddress: string
  stakeDenom: string
  gauges: MitoGauge[]
  apr: number
  totalLiquidity: number
  stakingAddress: string
  aprBreakdown: Record<string, number>
}

export interface MitoStakingReward {
  vaultName: string
  vaultAddress: string
  stakedAmount: Coin | undefined
  apr: number
  claimableRewards: Coin[]
  lockTimestamp: number
  lockedAmount: Coin | undefined
}

export interface MitoStakingActivity {
  stakeAmount: Coin | undefined
  vaultAddress: string
  action: string
  txHash: string
  rewardedTokens: Coin[]
  timestamp: number
  staker: string
  numberByAccount: number
}

export interface MitoMission {
  id: string
  points: string
  completed: boolean
  accruedPoints: string
  updatedAt: number
  progress: number
  expected: number
}

export interface MitoMissionLeaderboardEntry {
  address: string
  accruedPoints: string
}

export interface MitoMissionLeaderboard {
  entries: MitoMissionLeaderboardEntry[]
  updatedAt: number
  rank?: string
}

export interface MitoTokenInfo {
  denom: string
  supply: string
  symbol: string
  decimal: number
  logoUrl: string
}

export interface MitoIDOProgress {
  status: string
  timestamp: number
}

export interface MitoStakeToSubscription {
  stakedAmount: string
  subscribableAmount: string
}

export interface MitoVestingConfig {
  vestingDurationSeconds?: number
  vestingStartDelaySeconds?: number
  schedule?: string
}

export interface MitoVestingConfigMap {
  projectOwnerQuote?: MitoVestingConfig
  projectOwnerLpTokens?: MitoVestingConfig
  usersProjectToken?: MitoVestingConfig
}

export interface MitoIDOInitParams {
  vestingConfig?: MitoVestingConfigMap
}

export interface MitoIDO {
  startTime: number
  endTime: number
  owner: string
  status: string
  tokenInfo?: MitoTokenInfo
  capPerAddress: string
  contractAddress: string
  subscribedAmount: string
  projectTokenAmount: string
  targetAmountInQuoteDenom: string
  secondBeforeStartToSetQuotePrice: number
  targetAmountInUsd: string
  tokenPrice: number
  isAccountWhiteListed: boolean
  isLaunchWithVault: boolean
  isVestingScheduleEnabled: boolean
  name: string
  progress: MitoIDOProgress[]
  quoteDenom: string
  stakeToSubscription: MitoStakeToSubscription[]
  useWhitelist: boolean
  marketId: string
  vaultAddress: string
  vestingConfig?: MitoVestingConfigMap
  projectDescription: string
  isPermissionless: boolean
}

export interface MitoIDOSubscriber {
  address: string
  subscribedCoin?: Coin
  lastSubscribeTime: number
  estimateTokenReceived?: Coin
  estimateLpAmount?: Coin | undefined
  estimateRefundAmount?: Coin | undefined
  createdAt: number
}

export interface MitoIDOSubscriptionActivity {
  address: string
  subscribedCoin?: Coin
  usdValue: number
  timestamp: number
  txHash: string
}

export interface MitoIDOClaimedCoins {
  claimedCoins: Coin[]
  updatedAt: number
}

export interface MitoIDOSubscription {
  maxSubscriptionCoin?: Coin
  committedAmount: string
  price: number
  claimableCoins: Coin[]
  rewardClaimed: boolean
  tokenInfo?: MitoTokenInfo
  quoteDenom: string
  updatedAt: number
  stakedAmount: string
  claimTxHash?: string
  ownerClaimableCoins: Coin[]
  marketId: string
  claimedCoins?: MitoIDOClaimedCoins
}

export interface MitoWhitelistAccount {
  accountAddress: string
  updatedAt: number
  weight: string
}

export interface MitoClaimReference {
  denom: string
  updatedAt: number
  claimedAmount: string
  claimableAmount: string
  accountAddress: string
  cwContractAddress: string
  idoContractAddress: string
  startVestingTime: number
  vestingDurationSeconds: number
}

export type GrpcMitoIDO = GoadesignGoagenMitoApiPb.IDO
export type GrpcMitoVault = GoadesignGoagenMitoApiPb.Vault
export type GrpcMitoMission = GoadesignGoagenMitoApiPb.Mission
export type GrpcMitoChanges = GoadesignGoagenMitoApiPb.Changes
export type GrpcMitoHolders = GoadesignGoagenMitoApiPb.Holders
export type GrpcMitoStakingGauge = GoadesignGoagenMitoApiPb.Gauge
export type GrpcMitoTokenInfo = GoadesignGoagenMitoApiPb.TokenInfo
export type GrpcMitoPagination = GoadesignGoagenMitoApiPb.Pagination
export type GrpcMitoIDOProgress = GoadesignGoagenMitoApiPb.IDOProgress
export type GrpcMitoStakingPool = GoadesignGoagenMitoApiPb.StakingPool
export type GrpcMitoDenomBalance = GoadesignGoagenMitoApiPb.DenomBalance
export type GrpcMitoSubscription = GoadesignGoagenMitoApiPb.Subscription
export type GrpcMitoPriceSnapshot = GoadesignGoagenMitoApiPb.PriceSnapshot
export type GrpcMitoIDOSubscriber = GoadesignGoagenMitoApiPb.IDOSubscriber
export type GrpcMitoClaimReference = GoadesignGoagenMitoApiPb.ClaimReference
export type GrpcMitoIDOClaimedCoins = GoadesignGoagenMitoApiPb.IDOClaimedCoins
export type GrpcMitoIDOSubscription = GoadesignGoagenMitoApiPb.IDOSubscription
export type GrpcMitoLeaderboardEntry = GoadesignGoagenMitoApiPb.LeaderboardEntry
export type GrpcMitoLeaderboardEpoch = GoadesignGoagenMitoApiPb.LeaderboardEpoch
export type GrpcMitoStakingStakingReward =
  GoadesignGoagenMitoApiPb.StakingReward

export type GrpcMitoSubaccountBalance =
  GoadesignGoagenMitoApiPb.SubaccountBalance

export type GrpcMitoWhitelistAccount = GoadesignGoagenMitoApiPb.WhitelistAccount

export type GrpcMitoStakingStakingActivity =
  GoadesignGoagenMitoApiPb.StakingActivity

export type GrpcMitoMissionLeaderboardEntry =
  GoadesignGoagenMitoApiPb.MissionLeaderboardEntry

export type GrpcMitoIDOSubscriptionActivity =
  GoadesignGoagenMitoApiPb.IDOSubscriptionActivity
