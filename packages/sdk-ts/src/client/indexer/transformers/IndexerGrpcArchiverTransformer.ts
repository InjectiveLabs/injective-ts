import type { InjectiveArchiverRpcPb } from '@injectivelabs/indexer-proto-ts-v2'
import type {
  AccountStats,
  DenomHolders,
  HistoricalRPNL,
  LeaderboardRow,
  PnlLeaderboard,
  VolLeaderboard,
  SpotAverageEntry,
  HistoricalBalance,
  HistoricalVolumes,
} from '../types/archiver.js'

/**
 * @category Indexer Grpc Transformer
 */
export class IndexerGrpcArchiverTransformer {
  static grpcHistoricalBalanceToHistoricalBalance(
    historicalBalance: InjectiveArchiverRpcPb.HistoricalBalance,
  ): HistoricalBalance {
    return {
      t: historicalBalance.t,
      v: historicalBalance.v,
    }
  }

  static grpcHistoricalRPNLToHistoricalRPNL(
    historicalRPNL: InjectiveArchiverRpcPb.HistoricalRPNL,
  ): HistoricalRPNL {
    return {
      t: historicalRPNL.t,
      v: historicalRPNL.v,
    }
  }

  static grpcHistoricalVolumesToHistoricalVolumes(
    historicalVolumes: InjectiveArchiverRpcPb.HistoricalVolumes,
  ): HistoricalVolumes {
    return {
      t: historicalVolumes.t,
      v: historicalVolumes.v,
    }
  }

  static grpcLeaderboardRowToLeaderboardRow(
    leaderboardRow: InjectiveArchiverRpcPb.LeaderboardRow,
  ): LeaderboardRow {
    return {
      account: leaderboardRow.account,
      pnl: leaderboardRow.pnl,
      volume: leaderboardRow.volume,
      rank: leaderboardRow.rank,
    }
  }

  static grpcHistoricalBalanceResponseToHistoricalBalances(
    response: InjectiveArchiverRpcPb.BalanceResponse,
  ): HistoricalBalance {
    if (!response.historicalBalance) {
      return { t: [], v: [] }
    }

    return IndexerGrpcArchiverTransformer.grpcHistoricalBalanceToHistoricalBalance(
      response.historicalBalance,
    )
  }

  static grpcHistoricalRPNLResponseToHistoricalRPNL(
    response: InjectiveArchiverRpcPb.RpnlResponse,
  ): HistoricalRPNL {
    if (!response.historicalRpnl) {
      return { t: [], v: [] }
    }

    return IndexerGrpcArchiverTransformer.grpcHistoricalRPNLToHistoricalRPNL(
      response.historicalRpnl,
    )
  }

  static grpcHistoricalVolumesResponseToHistoricalVolumes(
    response: InjectiveArchiverRpcPb.VolumesResponse,
  ): HistoricalVolumes {
    if (!response.historicalVolumes) {
      return { t: [], v: [] }
    }

    return IndexerGrpcArchiverTransformer.grpcHistoricalVolumesToHistoricalVolumes(
      response.historicalVolumes,
    )
  }

  static grpcPnlLeaderboardResponseToPnlLeaderboard(
    response: InjectiveArchiverRpcPb.PnlLeaderboardResponse,
  ): PnlLeaderboard {
    return {
      firstDate: response.firstDate,
      lastDate: response.lastDate,
      leaders: response.leaders.map(
        IndexerGrpcArchiverTransformer.grpcLeaderboardRowToLeaderboardRow,
      ),
      accountRow: response.accountRow
        ? IndexerGrpcArchiverTransformer.grpcLeaderboardRowToLeaderboardRow(
            response.accountRow,
          )
        : undefined,
    }
  }

  static grpcVolLeaderboardResponseToVolLeaderboard(
    response: InjectiveArchiverRpcPb.VolLeaderboardResponse,
  ): VolLeaderboard {
    return {
      firstDate: response.firstDate,
      lastDate: response.lastDate,
      leaders: response.leaders.map(
        IndexerGrpcArchiverTransformer.grpcLeaderboardRowToLeaderboardRow,
      ),
      accountRow: response.accountRow
        ? IndexerGrpcArchiverTransformer.grpcLeaderboardRowToLeaderboardRow(
            response.accountRow,
          )
        : undefined,
    }
  }

  static grpcPnlLeaderboardFixedResolutionResponseToPnlLeaderboard(
    response: InjectiveArchiverRpcPb.PnlLeaderboardFixedResolutionResponse,
  ): PnlLeaderboard {
    return {
      firstDate: response.firstDate,
      lastDate: response.lastDate,
      leaders: response.leaders.map(
        IndexerGrpcArchiverTransformer.grpcLeaderboardRowToLeaderboardRow,
      ),
      accountRow: response.accountRow
        ? IndexerGrpcArchiverTransformer.grpcLeaderboardRowToLeaderboardRow(
            response.accountRow,
          )
        : undefined,
    }
  }

  static grpcVolLeaderboardFixedResolutionResponseToVolLeaderboard(
    response: InjectiveArchiverRpcPb.VolLeaderboardFixedResolutionResponse,
  ): VolLeaderboard {
    return {
      firstDate: response.firstDate,
      lastDate: response.lastDate,
      leaders: response.leaders.map(
        IndexerGrpcArchiverTransformer.grpcLeaderboardRowToLeaderboardRow,
      ),
      accountRow: response.accountRow
        ? IndexerGrpcArchiverTransformer.grpcLeaderboardRowToLeaderboardRow(
            response.accountRow,
          )
        : undefined,
    }
  }

  static grpcDenomHoldersResponseToDenomHolders(
    response: InjectiveArchiverRpcPb.DenomHoldersResponse,
  ): DenomHolders {
    return {
      holders: response.holders.map((holder) => ({
        accountAddress: holder.accountAddress,
        balance: holder.balance,
      })),
      next: response.next,
      total: response.total,
    }
  }

  static grpcAccountStatsResponseToAccountStats(
    response: InjectiveArchiverRpcPb.AccountStatsResponse,
  ): AccountStats {
    return {
      pnl: response.pnl,
      volume: response.volume,
    }
  }

  static grpcSpotAverageEntryToSpotAverageEntry(
    averageEntry: InjectiveArchiverRpcPb.SpotAverageEntry,
  ): SpotAverageEntry {
    return {
      marketId: averageEntry.marketId,
      averageEntryPrice: averageEntry.averageEntryPrice,
      quantity: averageEntry.quantity,
      usdValue: averageEntry.usdValue,
    }
  }
}
