import { InjectiveAbacusRpc } from '@injectivelabs/abacus-proto-ts'

export class AbacusGrpcTransformer {
  static grpcPointsStatsDailyToPointsStatsDaily(
    response: InjectiveAbacusRpc.HistoricalPointsStatsRowCollection,
  ) {
    return response.rows
  }

  static grpcPointsStatsWeeklyToPointsStatsWeekly(
    response: InjectiveAbacusRpc.HistoricalPointsStatsRowCollection,
  ) {
    return response.rows
  }

  static grpcPointsLatestToPointsLatest(
    response: InjectiveAbacusRpc.PointsLatestForAccountResponse,
  ) {
    return response
  }
}
