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

export type PlatformServicesPositionsSortDirection = 'asc' | 'desc'

export interface PlatformServicesListPositionsParams {
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
  pageSize?: number
  nextToken?: string
  accountAddress?: string[]
  sortBy?: PlatformServicesPositionsSortBy
  window?: PlatformServicesPositionsStatsWindow
  sortDirection?: PlatformServicesPositionsSortDirection
}

export interface PlatformServicesPosition {
  id: string
  pnl: string
  side: string
  fees: string
  state: string
  netPnl: string
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

export interface PlatformServicesAccountPositionStats {
  pnl: string
  wins: string
  losses: string
  winRate: string
  leverage: string
  tradeCount: string
  maxDrawdown: string
  pnlPercentage: string
  equityCurve: string[]
  accountAddress: string
  closedPositions: string
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

export type GrpcPlatformServicesPosition = PlatformServicesPositionsPb.Position

export type GrpcPlatformServicesAccountPositionStats =
  PlatformServicesPositionsPb.AccountPositionStats

export type GrpcPlatformServicesDailyPNL = PlatformServicesPositionsPb.DailyPNL
