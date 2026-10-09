import type * as PlatformServicesPositionsPb from '@injectivelabs/platform-services-proto-ts-v2/generated/goagen_api_positions_service_pb'
import type * as PlatformServicesArchiverPb from '@injectivelabs/platform-services-proto-ts-v2/generated/goagen_api_injective_archiver_rpc_pb'
import type * as PlatformServicesChartsPb from '@injectivelabs/platform-services-proto-ts-v2/generated/goagen_api_charts_trading_view_service_pb'

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
  /**
   * Position UUID filters. Repeat for multiple IDs, up to 100 supplied values.
   * Duplicates are ignored; unknown or invisible positions are omitted.
   * Cannot be combined with accountAddress, from, to, or txHash.
   * Repeat the same ID set on every page; results remain newest first.
   */
  id?: string[]
  to?: string
  from?: string
  pageSize?: number
  nextToken?: string
  accountAddress?: string
  /**
   * Transaction hash filter. Returns the positions with at least one trade in
   * that transaction, so an RFQ fill resolves to the position it opened or
   * changed. 32-byte hex, with or without 0x, any case. Cannot be combined
   * with accountAddress, from, to, or id. Repeat it on every page; results
   * remain newest first.
   */
  txHash?: string
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
  sortDirection?: PlatformServicesPositionsSortDirection
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
  pnlUsd: string
  funding: string
  marketId: string
  quantity: string
  openedAt: string
  updatedAt: string
  closedAt?: string
  exitPrice: string
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
  liquidationAdjustment: string
}

export interface PlatformServicesListPositionsResponse {
  positions: PlatformServicesPosition[]
  nextToken?: string
}

export interface PlatformServicesPositionTrade {
  pnl: string
  pnlUsd: string
  amount: string
  funding: string
  timestamp: string
  eventType: string
  positionId: string
  executionPrice: string
  liquidationAdjustment: string
}

export interface PlatformServicesListPositionTradesResponse {
  nextToken?: string
  trades: PlatformServicesPositionTrade[]
}

export interface PlatformServicesAccountPositionStats {
  pnl: string
  pnlUsd: string
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
  pnlUsd: string
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

export interface PlatformServicesMarketHistoryParams {
  resolution: string
  to: number
  symbol?: string
  marketId?: string
  from?: number
  countback?: number
}

export interface PlatformServicesSpotMarketHistoryParams extends PlatformServicesMarketHistoryParams {
  fillGaps?: boolean
}

export interface PlatformServicesSpotMarketSummaryParams {
  marketId: string
  resolution?: string
}

export interface PlatformServicesAllSpotMarketSummariesParams {
  resolution?: string
}

export interface PlatformServicesMarketHistory {
  s: string
  t: number[]
  o: number[]
  h: number[]
  l: number[]
  c: number[]
  v: number[]
}

export interface PlatformServicesSpotMarketSummary {
  marketId: string
  open: number
  high: number
  low: number
  volume: number
  price: number
  change: number
}

export interface PlatformServicesArchiverAccountParams {
  account: string
  resolution?: string
}

export interface PlatformServicesArchiverAccountStatsParams {
  account: string
  period?: string
}

export interface PlatformServicesArchiverListAccountStatsParams {
  account: string[]
  period?: string
  pageSize?: number
  nextToken?: string
}

export interface PlatformServicesHistoricalTradesParams {
  fromBlock?: bigint
  endBlock?: bigint
  fromTime?: bigint
  endTime?: bigint
  perPage?: number
  token?: string
  account?: string
  executionTypes?: string[]
}

export interface PlatformServicesHistoricalDetailedBalance {
  spot: number
  perp: number
  staking: number
}

export interface PlatformServicesHistoricalBalance {
  t: number[]
  v: number[]
  dv: PlatformServicesHistoricalDetailedBalance[]
}

export interface PlatformServicesBalanceResponse {
  historicalBalance?: PlatformServicesHistoricalBalance
}

export interface PlatformServicesArchiverAccountStats {
  account: string
  pnl: number
  volume: number
  stake: string
  maxDrawdown: number
  maxDrawdownPercentage: number
}

export interface PlatformServicesArchiverListAccountStatsResponse {
  stats: PlatformServicesArchiverAccountStats[]
  nextToken?: string
}

export interface PlatformServicesHistoricalDetailedPnl {
  rpnl: number
  upnl: number
}

export interface PlatformServicesHistoricalRpnl {
  t: number[]
  v: number[]
  dv: PlatformServicesHistoricalDetailedPnl[]
}

export interface PlatformServicesRpnlResponse {
  historicalRpnl?: PlatformServicesHistoricalRpnl
}

export interface PlatformServicesArchiverPriceLevel {
  price: string
  quantity: string
  timestamp: string
}

export interface PlatformServicesHistoricalTrade {
  account: string
  subaccountId: string
  marketId: string
  tradeDirection: string
  price?: PlatformServicesArchiverPriceLevel
  fee: string
  executedAt: string
  executedHeight: string
  feeRecipient: string
  executionSide: string
  usdValue: string
  flags: string[]
  marketType: string
  tradeId: string
  executionType: string
  cid: string
  fundingRate: string
}

export interface PlatformServicesHistoricalTradesResponse {
  trades: PlatformServicesHistoricalTrade[]
  lastHeight: string
  lastTime: string
  next: string[]
}

export type GrpcPlatformServicesChartMarketHistory =
  PlatformServicesChartsPb.SpotMarketHistoryResponse

export type GrpcPlatformServicesChartMarketSummary =
  PlatformServicesChartsPb.MarketSummaryResp

export type GrpcPlatformServicesHistoricalTrade =
  PlatformServicesArchiverPb.HistoricalTrade
