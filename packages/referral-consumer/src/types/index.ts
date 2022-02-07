import {
  GetFeeRecipientResp as GrpcFeeRecipient,
  GetReferralInfoResp as GrpcReferralInfo,
  RefereeInfo as GrpcRefereeInfo,
  ReferrerInfo as GrpcReferrerInfo,
} from '@injectivelabs/referral-api/injective-referral-rpc_pb'

export enum ReferrerStatus {
  REFERRER_STATUS_UNSPECIFIED = 0,
  REFERRER_STATUS_ACTIVE = 1,
  REFERRER_STATUS_FROZEN = 2,
}

export interface RefereeInfo {
  referralCode: string
  referredTimeMs: number
  status: ReferrerStatus
  totalKickbackUsd: string
  receivedKickbackUsd: string
}

export interface ReferrerInfo {
  referralCode: string
  issuedTimeMs: number
  status: ReferrerStatus
  referredNum: number
  totalCommissionUsd: string
  claimedCommissionUsd: string
  lastClaimTimeMs: number
}

export interface FeeRecipient {
  feeRecipient: string
}

export interface ReferralInfo {
  referrerInfo?: ReferrerInfo
  refereeInfo?: RefereeInfo
}

export { GrpcFeeRecipient, GrpcReferralInfo, GrpcRefereeInfo, GrpcReferrerInfo }
