import type * as PlatformServicesPositionsPb from '@injectivelabs/platform-services-proto-ts-v2/generated/goagen_api_positions_service_pb'

export type PlatformServicesPositionsStatsWindow =
  | '24h'
  | '7d'
  | '30d'
  | 'all_time'

export type PlatformServicesPositionsSortBy =
  | 'pnl'
  | 'trade_count'
  | 'num_trades'
  | 'win_rate'
  | 'avg_duration'
  | 'avg_hold_duration'

export type PlatformServicesPositionsSortDirection = 'asc' | 'desc'

export interface PlatformServicesListPositionsParams {
  to?: string
  from?: string
  pageSize?: number
  nextToken?: string
  accountAddress?: string
}

export interface PlatformServicesGetAccountPositionStatsParams {
  accountAddress: string
  window?: PlatformServicesPositionsStatsWindow
}

export interface PlatformServicesGetAccountDailyPNLParams {
  to: string
  from: string
  accountAddress: string
}

export interface PlatformServicesListAccountPositionStatsParams {
  to?: string
  from?: string
  tag?: string[]
  pageSize?: number
  nextToken?: string
  accountAddress?: string[]
  sortBy?: PlatformServicesPositionsSortBy
  window?: PlatformServicesPositionsStatsWindow
  sortDirection?: PlatformServicesPositionsSortDirection
}

export interface PlatformServicesListPositionTradesParams {
  positionId: string
  pageSize?: number
  nextToken?: string
}

export interface PlatformServicesGetAccountCountParams {
  window?: PlatformServicesPositionsStatsWindow
}

export interface PlatformServicesPosition {
  id: string
  pnl: string
  side: string
  fees: string
  state: string
  marketId: string
  quantity: string
  openedAt: string
  updatedAt: string
  closedAt?: string
  sideAtOpen: string
  totalTrades: string
  maxQuantity: string
  minQuantity: string
  finalMargin: string
  subaccountId: string
  closeReason?: string
  openedHeight: string
  avgEntryPrice: string
  initialMargin: string
  exitPrice: string
  updatedHeight: string
  closedHeight?: string
  accountAddress: string
  numOfBuyTrades: string
  numOfSellTrades: string
  durationInSeconds: string
}

export interface PlatformServicesListPositionsResponse {
  positions: PlatformServicesPosition[]
  nextToken?: string
}

export interface PlatformServicesPositionTrade {
  pnl: string
  amount: string
  timestamp: string
  eventType: string
  positionId: string
  executionPrice: string
}

export interface PlatformServicesListPositionTradesResponse {
  nextToken?: string
  trades: PlatformServicesPositionTrade[]
}

export interface PlatformServicesAccountPositionStats {
  pnl: string
  wins: string
  rank?: string
  tags: string[]
  losses: string
  winRate: string
  leverage: string
  tradeCount: string
  totalVolume: string
  maxDrawdown: string
  pnlPercentage: string
  equityCurve: string[]
  accountAddress: string
  closedPositions: string
  avgHoldDurationInSeconds: string
}

export interface PlatformServicesDailyPNL {
  pnl: string
  date: string
}

export interface PlatformServicesGetAccountDailyPNLResponse {
  accountAddress: string
  dailyPnl: PlatformServicesDailyPNL[]
}

export interface PlatformServicesListAccountPositionStatsResponse {
  nextToken?: string
  accounts: PlatformServicesAccountPositionStats[]
}

export interface PlatformServicesListAccountTagsResponse {
  tags: string[]
}

export interface PlatformServicesGetAccountCountResponse {
  totalAccounts: string
}

export type GrpcPlatformServicesPosition = PlatformServicesPositionsPb.Position

export type GrpcPlatformServicesPositionTrade =
  PlatformServicesPositionsPb.PositionTrade

export type GrpcPlatformServicesAccountPositionStats =
  PlatformServicesPositionsPb.AccountPositionStats

export type GrpcPlatformServicesDailyPNL = PlatformServicesPositionsPb.DailyPNL
