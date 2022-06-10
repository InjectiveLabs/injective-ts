import {
  FeeRecipient,
  ReferralInfo,
  RefereeInfo,
  ReferrerInfo,
  GrpcFeeRecipient,
  GrpcRefereeInfo,
  GrpcReferralInfo,
  GrpcReferrerInfo,
} from '../types/index'

export class ReferralTransformer {
  static grpcRefereeInfoToRefereeInfo(
    refereeInfo: GrpcRefereeInfo,
  ): RefereeInfo {
    return {
      accountAddress: refereeInfo.getAccountAddress(),
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
      accountAddress: referrerInfo.getAccountAddress(),
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

  static grpcRefereeListToRefereeList(
    grpcReferees: GrpcRefereeInfo[],
  ): RefereeInfo[] {
    return grpcReferees.map(ReferralTransformer.grpcRefereeInfoToRefereeInfo)
  }
}
