import type * as TcAbacusPb from '@injectivelabs/tc-abacus-proto-ts-v2/generated/injective_tc_abacus_rpc_pb'
import type {
  Referrer,
  ReferrerCode,
  SnapshotPoints,
  ReferrerInvitee,
  InviteeReferrer,
  HealthCheckResponse,
  CurrentEpochResponse,
  AccountStatsResponse,
  AccountPointsResponse,
  ListReferrersResponse,
  AccountInviteesResponse,
  ListReferrerCodesResponse,
  ReferrerEligibilityResponse,
} from '../../types/index.js'

export class TcAbacusGrpcTransformer {
  static grpcCurrentEpochToCurrentEpoch(
    response: TcAbacusPb.GetCurrentEpochResponse,
  ): CurrentEpochResponse {
    return {
      epochEnd: response.epochEnd,
      epochPoints: response.epochPoints,
      epochPointsDistributedAt: response.epochPointsDistributedAt,
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
      code: response.code,
      address: response.address,
      isKol: response.isKol,
      last7DVolume: response.last7DVolume,
      inviteeCount: response.inviteeCount,
      allTimeVolume: response.allTimeVolume,
      creatorAddress: response.creatorAddress,
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
      isKol: referrer.isKol,
      status: referrer.status,
      inviteeCount: referrer.inviteeCount,
      creatorAddress: referrer.creatorAddress,
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
      allTimeVolume: invitee.allTimeVolume,
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

  static grpcReferrerEligibilityToReferrerEligibility(
    response: TcAbacusPb.GetReferrerElegibilityResponse,
  ): ReferrerEligibilityResponse {
    return {
      volume: response.volume,
      isEligible: response.isEligible,
      volumeThreshold: response.volumeThreshold,
    }
  }

  static grpcReferrerCodeToReferrerCode(
    code: TcAbacusPb.ReferrerCode,
  ): ReferrerCode {
    return {
      cap: code.cap,
      code: code.code,
      invitees: code.invitees,
      createdAt: code.createdAt,
    }
  }

  static grpcListReferrerCodesToListReferrerCodes(
    response: TcAbacusPb.ListReferrerCodesResponse,
  ): ListReferrerCodesResponse {
    return {
      nextCursor: response.nextCursor,
      codes: response.codes.map((code) =>
        TcAbacusGrpcTransformer.grpcReferrerCodeToReferrerCode(code),
      ),
    }
  }

  static grpcInviteeReferrerToInviteeReferrer(
    response: TcAbacusPb.GetInviteeReferrerResponse,
  ): InviteeReferrer {
    return {
      code: response.code,
      address: response.address,
      createdAt: response.createdAt,
      height: response.height.toString(),
      referrerAddress: response.referrerAddress,
    }
  }
}
