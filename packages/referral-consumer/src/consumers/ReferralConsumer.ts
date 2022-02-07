import { GrpcException } from '@injectivelabs/exceptions'
import { InjectiveReferralRPC } from '@injectivelabs/referral-api/injective-referral-rpc_pb_service'
import {
  ClaimCommissionsReq,
  ReferReq,
  GetFeeRecipientReq,
  GetFeeRecipientResp,
  GetReferralInfoReq,
  GetReferralInfoResp,
} from '@injectivelabs/referral-api/injective-referral-rpc_pb'
import BaseConsumer from '../BaseConsumer'

export class ReferralConsumer extends BaseConsumer {
  async getFeeRecipient(address: string) {
    const request = new GetFeeRecipientReq()

    request.setAddress(address)

    try {
      const response = await this.request<
        GetFeeRecipientReq,
        GetFeeRecipientResp,
        typeof InjectiveReferralRPC.GetFeeRecipient
      >(request, InjectiveReferralRPC.GetFeeRecipient)

      return response
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async getReferralInfo(address: string) {
    const request = new GetReferralInfoReq()

    request.setAddress(address)

    try {
      const response = await this.request<
        GetReferralInfoReq,
        GetReferralInfoResp,
        typeof InjectiveReferralRPC.GetReferralInfo
      >(request, InjectiveReferralRPC.GetReferralInfo)

      return response
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async claimCommissions(address: string) {
    const request = new ClaimCommissionsReq()

    request.setAddress(address)

    try {
      const response = await this.request<
        ClaimCommissionsReq,
        any,
        typeof InjectiveReferralRPC.ClaimCommissions
      >(request, InjectiveReferralRPC.ClaimCommissions)

      return response
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async refer({ address, code }: { address: string; code: string }) {
    const request = new ReferReq()

    request.setAddress(address)
    request.setReferralCode(code)

    try {
      const response = await this.request<
        ReferReq,
        any,
        typeof InjectiveReferralRPC.Refer
      >(request, InjectiveReferralRPC.Refer)

      return response
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }
}
