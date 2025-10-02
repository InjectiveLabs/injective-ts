import { toBigNumber } from '@injectivelabs/utils'
import type { ReferralDetails } from '../types/index.js'
import type { InjectiveReferralRpc } from '@injectivelabs/indexer-proto-ts'

export class IndexerGrpcReferralTransformer {
  static referrerDetailsResponseToReferrerDetails(
    address: string,
    response: InjectiveReferralRpc.GetReferrerDetailsResponse,
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
    response: InjectiveReferralRpc.GetInviteeDetailsResponse,
  ): InjectiveReferralRpc.GetInviteeDetailsResponse {
    return response
  }

  static referrerByCodeResponseToReferrerByCode(
    response: InjectiveReferralRpc.GetReferrerByCodeResponse,
  ): string {
    return response?.referrerAddress || ''
  }
}
