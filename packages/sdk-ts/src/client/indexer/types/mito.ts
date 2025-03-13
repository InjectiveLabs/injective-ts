import { Coin } from '@injectivelabs/ts-types'
import { MitoApi } from '@injectivelabs/mito-proto-ts'

export enum MitoGaugeStatus {
  Active = 'active',
  Live = 'live',
}

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

export type GrpcMitoIDO = MitoApi.IDO
export type GrpcMitoVault = MitoApi.Vault
export type GrpcMitoMission = MitoApi.Mission
export type GrpcMitoChanges = MitoApi.Changes
export type GrpcMitoHolders = MitoApi.Holders
export type GrpcMitoStakingGauge = MitoApi.Gauge
export type GrpcMitoTokenInfo = MitoApi.TokenInfo
export type GrpcMitoPagination = MitoApi.Pagination
export type GrpcMitoIDOProgress = MitoApi.IDOProgress
export type GrpcMitoStakingPool = MitoApi.StakingPool
export type GrpcMitoDenomBalance = MitoApi.DenomBalance
export type GrpcMitoSubscription = MitoApi.Subscription
export type GrpcMitoPriceSnapshot = MitoApi.PriceSnapshot
export type GrpcMitoIDOSubscriber = MitoApi.IDOSubscriber
export type GrpcMitoClaimReference = MitoApi.ClaimReference
export type GrpcMitoIDOClaimedCoins = MitoApi.IDOClaimedCoins
export type GrpcMitoIDOSubscription = MitoApi.IDOSubscription
export type GrpcMitoLeaderboardEntry = MitoApi.LeaderboardEntry
export type GrpcMitoLeaderboardEpoch = MitoApi.LeaderboardEpoch
export type GrpcMitoStakingStakingReward = MitoApi.StakingReward
export type GrpcMitoSubaccountBalance = MitoApi.SubaccountBalance
export type GrpcMitoWhitelistAccount = MitoApi.WhitelistAccount
export type GrpcMitoStakingStakingActivity = MitoApi.StakingActivity
export type GrpcMitoMissionLeaderboardEntry = MitoApi.MissionLeaderboardEntry
export type GrpcMitoIDOSubscriptionActivity = MitoApi.IDOSubscriptionActivity
