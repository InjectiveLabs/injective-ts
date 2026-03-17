export interface HealthCheckResponse {
  uptime: string
  uptimeSeconds: number
}

export interface SnapshotPoints {
  rank: string
  points: string
  endTime: string
  startTime: string
  snapshotId: string
}

export interface AccountPointsResponse {
  rank: string
  address: string
  updatedAt: string
  totalPoints: string
  nextCursor?: string
  snapshots: SnapshotPoints[]
}

export interface AccountStatsResponse {
  cap: number
  address: string
  last7DVolume: string
  inviteeCount: number
  allTimeVolume: string
  activeInviteeCount: number
}

export interface Referrer {
  cap: number
  code: string
  height: string
  address: string
  createdAt: string
}

export interface ListReferrersResponse {
  nextCursor?: string
  referrers: Referrer[]
}

export interface ReferrerInvitee {
  height: string
  address: string
  createdAt: string
  referralPoints: string
}

export interface AccountInviteesResponse {
  address: string
  nextCursor?: string
  invitees: ReferrerInvitee[]
}
