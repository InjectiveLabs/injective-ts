import type * as TcAbacusPb from '@injectivelabs/tc-abacus-proto-ts-v2/generated/injective_tc_abacus_rpc_pb'
import type {
  Referrer,
  SnapshotPoints,
  ReferrerInvitee,
  HealthCheckResponse,
  CurrentEpochResponse,
  AccountStatsResponse,
  AccountPointsResponse,
  ListReferrersResponse,
  AccountInviteesResponse,
} from '../../types/index.js'

export class TcAbacusGrpcTransformer {
  static grpcCurrentEpochToCurrentEpoch(
    response: TcAbacusPb.GetCurrentEpochResponse,
  ): CurrentEpochResponse {
    return {
      epochEnd: response.epochEnd,
      epochPoints: response.epochPoints,
    }
  }

  static grpcHealthCheckToHealthCheck(
    response: TcAbacusPb.HealthCheckResponse,
  ): HealthCheckResponse {
    return {
      uptime: response.uptime,
      uptimeSeconds: response.uptimeSeconds,
    }
  }

  static grpcSnapshotPointsToSnapshotPoints(
    snapshot: TcAbacusPb.SnapshotPoints,
  ): SnapshotPoints {
    return {
      rank: snapshot.rank,
      points: snapshot.points,
      endTime: snapshot.endTime,
      startTime: snapshot.startTime,
      snapshotId: snapshot.snapshotId,
    }
  }

  static grpcAccountPointsToAccountPoints(
    response: TcAbacusPb.GetAccountPointsResponse,
  ): AccountPointsResponse {
    return {
      rank: response.rank,
      address: response.address,
      updatedAt: response.updatedAt,
      nextCursor: response.nextCursor,
      totalPoints: response.totalPoints,
      totalReferralPoints: response.totalReferralPoints,
      snapshots: response.snapshots.map((snapshot) =>
        TcAbacusGrpcTransformer.grpcSnapshotPointsToSnapshotPoints(snapshot),
      ),
    }
  }

  static grpcAccountStatsToAccountStats(
    response: TcAbacusPb.GetAccountStatsResponse,
  ): AccountStatsResponse {
    return {
      cap: response.cap,
      address: response.address,
      last7DVolume: response.last7DVolume,
      inviteeCount: response.inviteeCount,
      allTimeVolume: response.allTimeVolume,
      activeInviteeCount: response.activeInviteeCount,
    }
  }

  static grpcReferrerToReferrer(referrer: TcAbacusPb.Referrer): Referrer {
    return {
      cap: referrer.cap,
      code: referrer.code,
      address: referrer.address,
      createdAt: referrer.createdAt,
      height: referrer.height.toString(),
    }
  }

  static grpcListReferrersToListReferrers(
    response: TcAbacusPb.ListReferrersResponse,
  ): ListReferrersResponse {
    return {
      nextCursor: response.nextCursor,
      referrers: response.referrers.map((referrer) =>
        TcAbacusGrpcTransformer.grpcReferrerToReferrer(referrer),
      ),
    }
  }

  static grpcReferrerInviteeToReferrerInvitee(
    invitee: TcAbacusPb.ReferrerInvitee,
  ): ReferrerInvitee {
    return {
      address: invitee.address,
      createdAt: invitee.createdAt,
      height: invitee.height.toString(),
      referralPoints: invitee.referralPoints,
    }
  }

  static grpcAccountInviteesToAccountInvitees(
    response: TcAbacusPb.GetAccountInviteesResponse,
  ): AccountInviteesResponse {
    return {
      address: response.address,
      nextCursor: response.nextCursor,
      invitees: response.invitees.map((invitee) =>
        TcAbacusGrpcTransformer.grpcReferrerInviteeToReferrerInvitee(invitee),
      ),
    }
  }
}
