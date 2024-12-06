import { InjectiveAbacusRpc } from '@injectivelabs/abacus-proto-ts'

export class AbacusGrpcTransformer {
  static grpcPointsStatsDailyToPointsStatsDaily(
    response: InjectiveAbacusRpc.PointsStatsDailyForAccountResponse,
  ) {
    return response.field
  }

  static grpcPointsStatsWeeklyToPointsStatsWeekly(
    response: InjectiveAbacusRpc.PointsStatsWeeklyForAccountResponse,
  ) {
    return response.field
  }

  static grpcPointsLatestToPointsLatest(
    response: InjectiveAbacusRpc.PointsLatestForAccountResponse,
  ) {
    return response
  }
}
