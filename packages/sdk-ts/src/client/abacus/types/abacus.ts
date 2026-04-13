export interface PointsLatestResponse {
  rank: string
  totalPoints: string
  totalPointsPrecise: number
  league: string
  updatedAt: string
  pointsSeason1: number
  pointsBonus: number
}

export interface PointsStatsRow {
  week: string
  day?: string
  points: string
  pointsPrecise: number
  volume: number
}
