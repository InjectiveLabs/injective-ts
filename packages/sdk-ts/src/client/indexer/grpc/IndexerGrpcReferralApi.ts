import * as InjectiveReferralRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_referral_rpc_pb'
import { InjectiveReferralRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_referral_rpc_pb.client'
import { IndexerModule } from '../types/index.js'
import { IndexerGrpcReferralTransformer } from '../transformers/index.js'
import BaseIndexerGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import type { GrpcWebTransportAdditionalOptions } from '../../../types'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcReferralApi extends BaseIndexerGrpcConsumer {
  protected module: string = IndexerModule.Referral
  private client: InjectiveReferralRPCClient

  constructor(endpoint: string, options?: GrpcWebTransportAdditionalOptions) {
    super(endpoint, options)

    this.client = new InjectiveReferralRPCClient(this.transport)
  }

  async fetchReferrerDetails(address: string) {
    const request = InjectiveReferralRpcPb.GetReferrerDetailsRequest.create()
    request.referrerAddress = address

    const response = await this.executeGrpcCall<
      InjectiveReferralRpcPb.GetReferrerDetailsRequest,
      InjectiveReferralRpcPb.GetReferrerDetailsResponse
    >(request, this.client.getReferrerDetails.bind(this.client))

    return IndexerGrpcReferralTransformer.referrerDetailsResponseToReferrerDetails(
      address,
      response,
    )
  }

  async fetchInviteeDetails(address: string) {
    const request = InjectiveReferralRpcPb.GetInviteeDetailsRequest.create()
    request.inviteeAddress = address

    const response = await this.executeGrpcCall<
      InjectiveReferralRpcPb.GetInviteeDetailsRequest,
      InjectiveReferralRpcPb.GetInviteeDetailsResponse
    >(request, this.client.getInviteeDetails.bind(this.client))

    return IndexerGrpcReferralTransformer.inviteeDetailsResponseToInviteeDetails(
      response,
    )
  }

  async fetchReferrerByCode(code: string) {
    const request = InjectiveReferralRpcPb.GetReferrerByCodeRequest.create()
    request.referralCode = code

    const response = await this.executeGrpcCall<
      InjectiveReferralRpcPb.GetReferrerByCodeRequest,
      InjectiveReferralRpcPb.GetReferrerByCodeResponse
    >(request, this.client.getReferrerByCode.bind(this.client))

    return IndexerGrpcReferralTransformer.referrerByCodeResponseToReferrerByCode(
      response,
    )
  }
}
