import {
  UnspecifiedErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import { InjectiveReferralRpc } from '@injectivelabs/indexer-proto-ts'
import BaseGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import { IndexerGrpcReferralTransformer } from '../transformers/index.js'
import { IndexerModule } from '../types/index.js'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcReferralApi extends BaseGrpcConsumer {
  protected module: string = IndexerModule.Referral

  protected client: InjectiveReferralRpc.InjectiveReferralRPCClientImpl

  constructor(endpoint: string) {
    super(endpoint)

    this.client = new InjectiveReferralRpc.InjectiveReferralRPCClientImpl(
      this.getGrpcWebImpl(endpoint),
    )
  }

  async fetchReferrerDetails(address: string) {
    const request = InjectiveReferralRpc.GetReferrerDetailsRequest.create()
    request.referrerAddress = address

    try {
      const response =
        await this.retry<InjectiveReferralRpc.GetReferrerDetailsResponse>(() =>
          this.client.GetReferrerDetails(request),
        )

      return IndexerGrpcReferralTransformer.referrerDetailsResponseToReferrerDetails(
        address,
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveReferralRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Referral',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Referral',
        contextModule: this.module,
      })
    }
  }

  async fetchInviteeDetails(address: string) {
    const request = InjectiveReferralRpc.GetInviteeDetailsRequest.create()
    request.inviteeAddress = address

    try {
      const response =
        await this.retry<InjectiveReferralRpc.GetInviteeDetailsResponse>(() =>
          this.client.GetInviteeDetails(request),
        )

      return IndexerGrpcReferralTransformer.inviteeDetailsResponseToInviteeDetails(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveReferralRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Referral',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Referral',
        contextModule: this.module,
      })
    }
  }

  async fetchReferrerByCode(address: string) {
    const request = InjectiveReferralRpc.GetReferrerByCodeRequest.create()
    request.referralCode = address

    try {
      const response =
        await this.retry<InjectiveReferralRpc.GetReferrerByCodeResponse>(() =>
          this.client.GetReferrerByCode(request),
        )

      return IndexerGrpcReferralTransformer.referrerByCodeResponseToReferrerByCode(
        response,
      )
    } catch (e: unknown) {
      if (e instanceof InjectiveReferralRpc.GrpcWebError) {
        throw new GrpcUnaryRequestException(new Error(e.toString()), {
          code: e.code,
          context: 'Referral',
          contextModule: this.module,
        })
      }

      throw new GrpcUnaryRequestException(e as Error, {
        code: UnspecifiedErrorCode,
        context: 'Referral',
        contextModule: this.module,
      })
    }
  }
}
