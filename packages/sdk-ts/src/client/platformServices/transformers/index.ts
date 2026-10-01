import type * as PlatformServicesPositionsPb from '@injectivelabs/platform-services-proto-ts-v2/generated/goagen_api_positions_service_pb'
import type * as PlatformServicesArchiverPb from '@injectivelabs/platform-services-proto-ts-v2/generated/goagen_api_injective_archiver_rpc_pb'
import type * as PlatformServicesChartsPb from '@injectivelabs/platform-services-proto-ts-v2/generated/goagen_api_charts_trading_view_service_pb'
import type {
  PlatformServicesPosition,
  PlatformServicesDailyPNL,
  PlatformServicesRpnlResponse,
  PlatformServicesPositionTrade,
  PlatformServicesMarketHistory,
  PlatformServicesHistoricalRpnl,
  PlatformServicesBalanceResponse,
  PlatformServicesHistoricalTrade,
  PlatformServicesHistoricalBalance,
  PlatformServicesSpotMarketSummary,
  PlatformServicesArchiverPriceLevel,
  PlatformServicesAccountPositionStats,
  PlatformServicesArchiverAccountStats,
  PlatformServicesListPositionsResponse,
  PlatformServicesHistoricalDetailedPnl,
  PlatformServicesGetAccountCountResponse,
  PlatformServicesListAccountTagsResponse,
  PlatformServicesHistoricalTradesResponse,
  PlatformServicesHistoricalDetailedBalance,
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
      pnlUsd: position.pnlUsd,
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
      pnlUsd: trade.pnlUsd,
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
      pnlUsd: stats.pnlUsd,
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
      pnlUsd: response.pnlUsd,
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
      pnlUsd: dailyPnl.pnlUsd,
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

export class PlatformServicesGrpcChartsTransformer {
  static grpcMarketHistoryToMarketHistory(
    response:
      | PlatformServicesChartsPb.DerivativeMarketHistoryResponse
      | PlatformServicesChartsPb.SpotMarketHistoryResponse,
  ): PlatformServicesMarketHistory {
    return {
      s: response.s,
      t: response.t,
      o: response.o,
      h: response.h,
      l: response.l,
      c: response.c,
      v: response.v,
    }
  }

  static grpcMarketSummaryToMarketSummary(
    summary:
      | PlatformServicesChartsPb.MarketSummaryResp
      | PlatformServicesChartsPb.SpotMarketSummaryResponse,
  ): PlatformServicesSpotMarketSummary {
    return {
      open: summary.open,
      high: summary.high,
      low: summary.low,
      volume: summary.volume,
      price: summary.price,
      change: summary.change,
      marketId: summary.marketId,
    }
  }
}

export class PlatformServicesGrpcArchiverTransformer {
  static grpcHistoricalDetailedBalanceToHistoricalDetailedBalance(
    balance: PlatformServicesArchiverPb.HistoricalDetailedBalance,
  ): PlatformServicesHistoricalDetailedBalance {
    return {
      spot: balance.spot,
      perp: balance.perp,
      staking: balance.staking,
    }
  }

  static grpcHistoricalBalanceToHistoricalBalance(
    balance: PlatformServicesArchiverPb.HistoricalBalance,
  ): PlatformServicesHistoricalBalance {
    return {
      t: balance.t,
      v: balance.v,
      dv: balance.dv.map(
        PlatformServicesGrpcArchiverTransformer.grpcHistoricalDetailedBalanceToHistoricalDetailedBalance,
      ),
    }
  }

  static grpcBalanceToBalance(
    response: PlatformServicesArchiverPb.BalanceResponse,
  ): PlatformServicesBalanceResponse {
    return {
      historicalBalance: response.historicalBalance
        ? PlatformServicesGrpcArchiverTransformer.grpcHistoricalBalanceToHistoricalBalance(
            response.historicalBalance,
          )
        : undefined,
    }
  }

  static grpcAccountStatsToAccountStats(
    response: PlatformServicesArchiverPb.AccountStatsResponse,
  ): PlatformServicesArchiverAccountStats {
    return {
      pnl: response.pnl,
      stake: response.stake,
      volume: response.volume,
      account: response.account,
    }
  }

  static grpcHistoricalDetailedPnlToHistoricalDetailedPnl(
    pnl: PlatformServicesArchiverPb.HistoricalDetailedPNL,
  ): PlatformServicesHistoricalDetailedPnl {
    return {
      rpnl: pnl.rpnl,
      upnl: pnl.upnl,
    }
  }

  static grpcHistoricalRpnlToHistoricalRpnl(
    rpnl: PlatformServicesArchiverPb.HistoricalRPNL,
  ): PlatformServicesHistoricalRpnl {
    return {
      t: rpnl.t,
      v: rpnl.v,
      dv: rpnl.dv.map(
        PlatformServicesGrpcArchiverTransformer.grpcHistoricalDetailedPnlToHistoricalDetailedPnl,
      ),
    }
  }

  static grpcRpnlToRpnl(
    response: PlatformServicesArchiverPb.RpnlResponse,
  ): PlatformServicesRpnlResponse {
    return {
      historicalRpnl: response.historicalRpnl
        ? PlatformServicesGrpcArchiverTransformer.grpcHistoricalRpnlToHistoricalRpnl(
            response.historicalRpnl,
          )
        : undefined,
    }
  }

  static grpcPriceLevelToPriceLevel(
    price: PlatformServicesArchiverPb.PriceLevel,
  ): PlatformServicesArchiverPriceLevel {
    return {
      price: price.price,
      quantity: price.quantity,
      timestamp: price.timestamp.toString(),
    }
  }

  static grpcHistoricalTradeToHistoricalTrade(
    trade: PlatformServicesArchiverPb.HistoricalTrade,
  ): PlatformServicesHistoricalTrade {
    return {
      cid: trade.cid,
      fee: trade.fee,
      flags: trade.flags,
      account: trade.account,
      tradeId: trade.tradeId,
      marketId: trade.marketId,
      usdValue: trade.usdValue,
      fundingRate: trade.fundingRate,
      marketType: trade.marketType,
      executionSide: trade.executionSide,
      feeRecipient: trade.feeRecipient,
      subaccountId: trade.subaccountId,
      tradeDirection: trade.tradeDirection,
      executionType: trade.executionType,
      executedAt: trade.executedAt.toString(),
      executedHeight: trade.executedHeight.toString(),
      price: trade.price
        ? PlatformServicesGrpcArchiverTransformer.grpcPriceLevelToPriceLevel(
            trade.price,
          )
        : undefined,
    }
  }

  static grpcHistoricalTradesToHistoricalTrades(
    response: PlatformServicesArchiverPb.HistoricalTradesResponse,
  ): PlatformServicesHistoricalTradesResponse {
    return {
      next: response.next,
      lastHeight: response.lastHeight.toString(),
      lastTime: response.lastTime.toString(),
      trades: response.trades.map(
        PlatformServicesGrpcArchiverTransformer.grpcHistoricalTradeToHistoricalTrade,
      ),
    }
  }
}
