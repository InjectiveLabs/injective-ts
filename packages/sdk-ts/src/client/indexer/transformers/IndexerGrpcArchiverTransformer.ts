import {
  DenomHolders,
  HistoricalRPNL,
  LeaderboardRow,
  PnlLeaderboard,
  VolLeaderboard,
  HistoricalBalance,
  HistoricalVolumes,
} from '../types/archiver.js'
import { InjectiveArchiverRpc } from '@injectivelabs/indexer-proto-ts'

/**
 * @category Indexer Grpc Transformer
 */
export class IndexerGrpcArchiverTransformer {
  static grpcHistoricalBalanceToHistoricalBalance(
    historicalBalance: InjectiveArchiverRpc.HistoricalBalance,
  ): HistoricalBalance {
    return {
      t: historicalBalance.t,
      v: historicalBalance.v,
    }
  }

  static grpcHistoricalRPNLToHistoricalRPNL(
    historicalRPNL: InjectiveArchiverRpc.HistoricalRPNL,
  ): HistoricalRPNL {
    return {
      t: historicalRPNL.t,
      v: historicalRPNL.v,
    }
  }

  static grpcHistoricalVolumesToHistoricalVolumes(
    historicalVolumes: InjectiveArchiverRpc.HistoricalVolumes,
  ): HistoricalVolumes {
    return {
      t: historicalVolumes.t,
      v: historicalVolumes.v,
    }
  }

  static grpcLeaderboardRowToLeaderboardRow(
    leaderboardRow: InjectiveArchiverRpc.LeaderboardRow,
  ): LeaderboardRow {
    return {
      account: leaderboardRow.account,
      pnl: leaderboardRow.pnl,
      volume: leaderboardRow.volume,
      rank: leaderboardRow.rank,
    }
  }

  static grpcHistoricalBalanceResponseToHistoricalBalances(
    response: InjectiveArchiverRpc.BalanceResponse,
  ): HistoricalBalance {
    if (!response.historicalBalance) {
      return { t: [], v: [] }
    }

    return IndexerGrpcArchiverTransformer.grpcHistoricalBalanceToHistoricalBalance(
      response.historicalBalance,
    )
  }

  static grpcHistoricalRPNLResponseToHistoricalRPNL(
    response: InjectiveArchiverRpc.RpnlResponse,
  ): HistoricalRPNL {
    if (!response.historicalRpnl) {
      return { t: [], v: [] }
    }

    return IndexerGrpcArchiverTransformer.grpcHistoricalRPNLToHistoricalRPNL(
      response.historicalRpnl,
    )
  }

  static grpcHistoricalVolumesResponseToHistoricalVolumes(
    response: InjectiveArchiverRpc.VolumesResponse,
  ): HistoricalVolumes {
    if (!response.historicalVolumes) {
      return { t: [], v: [] }
    }

    return IndexerGrpcArchiverTransformer.grpcHistoricalVolumesToHistoricalVolumes(
      response.historicalVolumes,
    )
  }

  static grpcPnlLeaderboardResponseToPnlLeaderboard(
    response: InjectiveArchiverRpc.PnlLeaderboardResponse,
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
    response: InjectiveArchiverRpc.VolLeaderboardResponse,
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
    response: InjectiveArchiverRpc.PnlLeaderboardFixedResolutionResponse,
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
    response: InjectiveArchiverRpc.VolLeaderboardFixedResolutionResponse,
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
    response: InjectiveArchiverRpc.DenomHoldersResponse,
  ): DenomHolders {
    return {
      holders: response.holders.map((holder) => ({
        accountAddress: holder.accountAddress,
        balance: holder.balance,
      })),
      next: response.next,
    }
  }
}
