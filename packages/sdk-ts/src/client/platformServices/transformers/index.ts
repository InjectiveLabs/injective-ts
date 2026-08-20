import type * as PlatformServicesPositionsPb from '@injectivelabs/platform-services-proto-ts-v2/generated/goagen_api_positions_service_pb'
import type {
  PlatformServicesPosition,
  PlatformServicesDailyPNL,
  PlatformServicesPositionTrade,
  PlatformServicesAccountPositionStats,
  PlatformServicesListPositionsResponse,
  PlatformServicesGetAccountCountResponse,
  PlatformServicesListAccountTagsResponse,
  PlatformServicesGetAccountDailyPNLResponse,
  PlatformServicesListPositionTradesResponse,
  PlatformServicesListAccountPositionStatsResponse,
} from '../types/index.js'

export class PlatformServicesGrpcPositionsTransformer {
  static grpcPositionToPosition(
    position: PlatformServicesPositionsPb.Position,
  ): PlatformServicesPosition {
    return {
      id: position.id,
      pnl: position.pnl,
      fees: position.fees,
      side: position.side,
      state: position.state,
      quantity: position.quantity,
      marketId: position.marketId,
      openedAt: position.openedAt,
      closedAt: position.closedAt,
      updatedAt: position.updatedAt,
      sideAtOpen: position.sideAtOpen,
      finalMargin: position.finalMargin,
      maxQuantity: position.maxQuantity,
      minQuantity: position.minQuantity,
      closeReason: position.closeReason,
      subaccountId: position.subaccountId,
      initialMargin: position.initialMargin,
      avgEntryPrice: position.avgEntryPrice,
      accountAddress: position.accountAddress,
      exitPrice: position.exitPrice,
      totalTrades: position.totalTrades.toString(),
      openedHeight: position.openedHeight.toString(),
      closedHeight: position.closedHeight?.toString(),
      updatedHeight: position.updatedHeight.toString(),
      numOfBuyTrades: position.numOfBuyTrades.toString(),
      numOfSellTrades: position.numOfSellTrades.toString(),
      durationInSeconds: position.durationInSeconds.toString(),
    }
  }

  static grpcListPositionsToListPositions(
    response: PlatformServicesPositionsPb.ListPositionsResponse,
  ): PlatformServicesListPositionsResponse {
    return {
      nextToken: response.nextToken,
      positions: response.positions.map((position) =>
        PlatformServicesGrpcPositionsTransformer.grpcPositionToPosition(
          position,
        ),
      ),
    }
  }

  static grpcPositionTradeToPositionTrade(
    trade: PlatformServicesPositionsPb.PositionTrade,
  ): PlatformServicesPositionTrade {
    return {
      pnl: trade.pnl,
      amount: trade.amount,
      timestamp: trade.timestamp,
      eventType: trade.eventType,
      positionId: trade.positionId,
      executionPrice: trade.executionPrice,
    }
  }

  static grpcListPositionTradesToListPositionTrades(
    response: PlatformServicesPositionsPb.ListPositionTradesResponse,
  ): PlatformServicesListPositionTradesResponse {
    return {
      nextToken: response.nextToken,
      trades: response.trades.map((trade) =>
        PlatformServicesGrpcPositionsTransformer.grpcPositionTradeToPositionTrade(
          trade,
        ),
      ),
    }
  }

  static grpcAccountPositionStatsToAccountPositionStats(
    stats: PlatformServicesPositionsPb.AccountPositionStats,
  ): PlatformServicesAccountPositionStats {
    return {
      pnl: stats.pnl,
      tags: stats.tags,
      winRate: stats.winRate,
      leverage: stats.leverage,
      rank: stats.rank?.toString(),
      wins: stats.wins.toString(),
      totalVolume: stats.totalVolume,
      maxDrawdown: stats.maxDrawdown,
      equityCurve: stats.equityCurve,
      losses: stats.losses.toString(),
      pnlPercentage: stats.pnlPercentage,
      accountAddress: stats.accountAddress,
      tradeCount: stats.tradeCount.toString(),
      closedPositions: stats.closedPositions.toString(),
      avgHoldDurationInSeconds: stats.avgHoldDurationInSeconds.toString(),
    }
  }

  static grpcGetAccountPositionStatsToAccountPositionStats(
    response: PlatformServicesPositionsPb.GetAccountPositionStatsResponse,
  ): PlatformServicesAccountPositionStats {
    return {
      pnl: response.pnl,
      tags: response.tags,
      winRate: response.winRate,
      leverage: response.leverage,
      rank: response.rank?.toString(),
      wins: response.wins.toString(),
      totalVolume: response.totalVolume,
      maxDrawdown: response.maxDrawdown,
      equityCurve: response.equityCurve,
      losses: response.losses.toString(),
      pnlPercentage: response.pnlPercentage,
      accountAddress: response.accountAddress,
      tradeCount: response.tradeCount.toString(),
      closedPositions: response.closedPositions.toString(),
      avgHoldDurationInSeconds: response.avgHoldDurationInSeconds.toString(),
    }
  }

  static grpcListAccountTagsToListAccountTags(
    response: PlatformServicesPositionsPb.ListAccountTagsResponse,
  ): PlatformServicesListAccountTagsResponse {
    return {
      tags: response.tags,
    }
  }

  static grpcGetAccountCountToGetAccountCount(
    response: PlatformServicesPositionsPb.GetAccountCountResponse,
  ): PlatformServicesGetAccountCountResponse {
    return {
      totalAccounts: response.totalAccounts.toString(),
    }
  }

  static grpcDailyPNLToDailyPNL(
    dailyPnl: PlatformServicesPositionsPb.DailyPNL,
  ): PlatformServicesDailyPNL {
    return {
      date: dailyPnl.date,
      pnl: dailyPnl.pnl,
    }
  }

  static grpcGetAccountDailyPNLToGetAccountDailyPNL(
    response: PlatformServicesPositionsPb.GetAccountDailyPNLResponse,
  ): PlatformServicesGetAccountDailyPNLResponse {
    return {
      accountAddress: response.accountAddress,
      dailyPnl: response.dailyPnl.map((dailyPnl) =>
        PlatformServicesGrpcPositionsTransformer.grpcDailyPNLToDailyPNL(
          dailyPnl,
        ),
      ),
    }
  }

  static grpcListAccountPositionStatsToListAccountPositionStats(
    response: PlatformServicesPositionsPb.ListAccountPositionStatsResponse,
  ): PlatformServicesListAccountPositionStatsResponse {
    return {
      nextToken: response.nextToken,
      accounts: response.accounts.map((account) =>
        PlatformServicesGrpcPositionsTransformer.grpcAccountPositionStatsToAccountPositionStats(
          account,
        ),
      ),
    }
  }
}
