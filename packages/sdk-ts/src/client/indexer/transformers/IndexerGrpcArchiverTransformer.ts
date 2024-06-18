import {
  HistoricalRPNL,
  HistoricalBalance,
  HistoricalVolumes,
} from '../types/archiver'
import { InjectiveArchiverRPC } from '@injectivelabs/indexer-proto-ts'

/**
 * @category Indexer Grpc Transformer
 */
export class IndexerGrpcArchiverTransformer {
  static grpcHistoricalBalanceToHistoricalBalance(
    historicalBalance: InjectiveArchiverRPC.HistoricalBalance,
  ): HistoricalBalance {
    return {
      t: historicalBalance.t,
      v: historicalBalance.v,
    }
  }

  static grpcHistoricalRPNLToHistoricalRPNL(
    historicalRPNL: InjectiveArchiverRPC.HistoricalRPNL,
  ): HistoricalRPNL {
    return {
      t: historicalRPNL.t,
      v: historicalRPNL.v,
    }
  }

  static grpcHistoricalVolumesToHistoricalVolumes(
    historicalVolumes: InjectiveArchiverRPC.HistoricalVolumes,
  ): HistoricalVolumes {
    return {
      t: historicalVolumes.t,
      v: historicalVolumes.v,
    }
  }

  static grpcHistoricalBalanceResponseToHistoricalBalances(
    response: InjectiveArchiverRPC.BalanceResponse,
  ): HistoricalBalance {
    if (!response.historicalBalance) {
      return { t: [], v: [] }
    }

    return IndexerGrpcArchiverTransformer.grpcHistoricalBalanceToHistoricalBalance(
      response.historicalBalance,
    )
  }

  static grpcHistoricalRPNLResponseToHistoricalRPNL(
    response: InjectiveArchiverRPC.RpnlResponse,
  ): HistoricalRPNL {
    if (!response.historicalRpnl) {
      return { t: [], v: [] }
    }

    return IndexerGrpcArchiverTransformer.grpcHistoricalRPNLToHistoricalRPNL(
      response.historicalRpnl,
    )
  }

  static grpcHistoricalVolumesResponseToHistoricalVolumes(
    response: InjectiveArchiverRPC.VolumesResponse,
  ): HistoricalVolumes {
    if (!response.historicalVolumes) {
      return { t: [], v: [] }
    }

    return IndexerGrpcArchiverTransformer.grpcHistoricalVolumesToHistoricalVolumes(
      response.historicalVolumes,
    )
  }
}
