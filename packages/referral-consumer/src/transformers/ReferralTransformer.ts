import {
  FeeRecipient,
  ReferralInfo,
  RefereeInfo,
  ReferrerInfo,
  GrpcFeeRecipient,
  GrpcReferralInfo,
  GrpcRefereeInfo,
  GrpcReferrerInfo,
} from '../types/index'

export class ReferralTransformer {
  static grpcRefereeInfoToRefereeInfo(
    refereeInfo: GrpcRefereeInfo,
  ): RefereeInfo {
    return {
      referralCode: refereeInfo.getReferralCode(),
      referredTimeMs: refereeInfo.getReferredTimeMs(),
      status: refereeInfo.getStatus(),
      totalKickbackUsd: refereeInfo.getTotalKickbackUsd(),
      receivedKickbackUsd: refereeInfo.getReceivedKickbackUsd(),
    }
  }

  static grpcReferrerInfoToReferrerInfo(
    referrerInfo: GrpcReferrerInfo,
  ): ReferrerInfo {
    return {
      referralCode: referrerInfo.getReferralCode(),
      issuedTimeMs: referrerInfo.getIssuedTimeMs(),
      status: referrerInfo.getStatus(),
      referredNum: referrerInfo.getReferredNum(),
      totalCommissionUsd: referrerInfo.getTotalCommissionUsd(),
      claimedCommissionUsd: referrerInfo.getClaimedCommissionUsd(),
      lastClaimTimeMs: referrerInfo.getLastClaimTimeMs(),
    }
  }

  static grpcFeeRecipientToFeeRecipient(
    gasFeeRecipient: GrpcFeeRecipient,
  ): FeeRecipient {
    return {
      feeRecipient: gasFeeRecipient.getFeeRecipient(),
    }
  }

  static grpcReferralInfoToReferralInfo(
    referralInfo: GrpcReferralInfo,
  ): ReferralInfo {
    const refereeInfo = referralInfo.getRefereeInfo()
    const referrerInfo = referralInfo.getReferrerInfo()

    return {
      referrerInfo: referrerInfo
        ? ReferralTransformer.grpcReferrerInfoToReferrerInfo(referrerInfo)
        : referrerInfo,
      refereeInfo: refereeInfo
        ? ReferralTransformer.grpcRefereeInfoToRefereeInfo(refereeInfo)
        : refereeInfo,
    }
  }
}
