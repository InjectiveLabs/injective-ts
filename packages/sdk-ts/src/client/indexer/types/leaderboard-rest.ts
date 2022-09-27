export type ChronosLeaderboardEntry = {
  accountID: string
  perc: string
  volume: string
}

export type ChronosLeaderboard = {
  entries: Array<ChronosLeaderboardEntry>
  resolution: string
  updatedAt: number
}

export interface ChronosLeaderboardResponse {
  data: ChronosLeaderboard
}
