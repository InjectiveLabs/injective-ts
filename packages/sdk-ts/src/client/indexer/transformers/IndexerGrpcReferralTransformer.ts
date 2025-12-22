import { toBigNumber } from '@injectivelabs/utils'
import type * as InjectiveReferralRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_referral_rpc_pb'
import type { ReferralDetails } from '../types/index.js'

export class IndexerGrpcReferralTransformer {
  static referrerDetailsResponseToReferrerDetails(
    address: string,
    response: InjectiveReferralRpcPb.GetReferrerDetailsResponse,
  ): ReferralDetails {
    return {
      referrerAddress: address,
      invitees: response.invitees,
      referrerCode: response.referrerCode,
      totalCommission: toBigNumber(response.totalCommission),
      totalTradingVolume: toBigNumber(response.totalTradingVolume),
    }
  }

  static inviteeDetailsResponseToInviteeDetails(
    response: InjectiveReferralRpcPb.GetInviteeDetailsResponse,
  ): InjectiveReferralRpcPb.GetInviteeDetailsResponse {
    return response
  }

  static referrerByCodeResponseToReferrerByCode(
    response: InjectiveReferralRpcPb.GetReferrerByCodeResponse,
  ): string {
    return response?.referrerAddress || ''
  }
}
