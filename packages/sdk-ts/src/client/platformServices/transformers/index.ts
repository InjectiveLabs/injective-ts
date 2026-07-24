import type * as PlatformServicesPositionsPb from '@injectivelabs/platform-services-proto-ts-v2/generated/goagen_api_positions_service_pb'
import type {
  PlatformServicesPosition,
  PlatformServicesDailyPNL,
  PlatformServicesAccountPositionStats,
  PlatformServicesListPositionsResponse,
  PlatformServicesGetAccountDailyPNLResponse,
  PlatformServicesListAccountPositionStatsResponse,
} from '../types/index'

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
      netPnl: position.netPnl,
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

  static grpcAccountPositionStatsToAccountPositionStats(
    stats: PlatformServicesPositionsPb.AccountPositionStats,
  ): PlatformServicesAccountPositionStats {
    return {
      pnl: stats.pnl,
      winRate: stats.winRate,
      leverage: stats.leverage,
      wins: stats.wins.toString(),
      maxDrawdown: stats.maxDrawdown,
      equityCurve: stats.equityCurve,
      losses: stats.losses.toString(),
      pnlPercentage: stats.pnlPercentage,
      accountAddress: stats.accountAddress,
      tradeCount: stats.tradeCount.toString(),
      closedPositions: stats.closedPositions.toString(),
    }
  }

  static grpcGetAccountPositionStatsToAccountPositionStats(
    response: PlatformServicesPositionsPb.GetAccountPositionStatsResponse,
  ): PlatformServicesAccountPositionStats {
    return {
      pnl: response.pnl,
      winRate: response.winRate,
      leverage: response.leverage,
      wins: response.wins.toString(),
      maxDrawdown: response.maxDrawdown,
      equityCurve: response.equityCurve,
      losses: response.losses.toString(),
      pnlPercentage: response.pnlPercentage,
      accountAddress: response.accountAddress,
      tradeCount: response.tradeCount.toString(),
      closedPositions: response.closedPositions.toString(),
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
