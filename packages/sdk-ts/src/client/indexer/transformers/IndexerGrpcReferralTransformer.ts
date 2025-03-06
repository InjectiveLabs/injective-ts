import { InjectiveReferralRpc } from '@injectivelabs/indexer-proto-ts'

export class IndexerGrpcReferralTransformer {
  static referrerDetailsResponseToReferrerDetails(
    response: InjectiveReferralRpc.GetReferrerDetailsResponse,
  ): InjectiveReferralRpc.GetReferrerDetailsResponse {
    return response
  }

  static inviteeDetailsResponseToInviteeDetails(
    response: InjectiveReferralRpc.GetInviteeDetailsResponse,
  ): InjectiveReferralRpc.GetInviteeDetailsResponse {
    return response
  }

  static referrerByCodeResponseToReferrerByCode(
    response: InjectiveReferralRpc.GetReferrerByCodeResponse,
  ): InjectiveReferralRpc.GetReferrerByCodeResponse {
    return response
  }
}
