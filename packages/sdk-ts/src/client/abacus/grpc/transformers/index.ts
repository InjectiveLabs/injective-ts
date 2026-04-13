import type * as PointsSvcPb from '@injectivelabs/abacus-proto-ts-v2/generated/points_svc_pb'
import type { PointsStatsRow, PointsLatestResponse } from '../../types/index.js'
type HistoricalPointsStatsRow = PointsSvcPb.HistoricalPointsStatsRow
type PointsLatestForAccountResponse = PointsSvcPb.PointsLatestForAccountResponse
type HistoricalPointsStatsRowCollection =
  PointsSvcPb.HistoricalPointsStatsRowCollection

export class AbacusGrpcTransformer {
  static grpcPointsStatsDailyToPointsStatsDaily(
    response: HistoricalPointsStatsRowCollection,
  ): PointsStatsRow[] {
    return response.rows.map((row: HistoricalPointsStatsRow) => ({
      day: row.day,
      week: row.week,
      volume: row.volume,
      points: row.points.toString(),
      pointsPrecise: row.pointsPrecise,
    }))
  }

  static grpcPointsStatsWeeklyToPointsStatsWeekly(
    response: HistoricalPointsStatsRowCollection,
  ): PointsStatsRow[] {
    return response.rows.map((row: HistoricalPointsStatsRow) => ({
      day: row.day,
      week: row.week,
      volume: row.volume,
      points: row.points.toString(),
      pointsPrecise: row.pointsPrecise,
    }))
  }

  static grpcPointsLatestToPointsLatest(
    response: PointsLatestForAccountResponse,
  ): PointsLatestResponse {
    return {
      league: response.league,
      updatedAt: response.updatedAt,
      rank: response.rank.toString(),
      pointsBonus: response.pointsBonus,
      pointsSeason1: response.pointsSeason1,
      totalPoints: response.totalPoints.toString(),
      totalPointsPrecise: response.totalPointsPrecise,
    }
  }
}
