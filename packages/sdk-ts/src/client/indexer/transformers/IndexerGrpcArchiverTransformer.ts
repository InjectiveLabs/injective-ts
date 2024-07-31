import {
  HistoricalRPNL,
  HistoricalBalance,
  HistoricalVolumes,
} from '../types/archiver'
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
}
