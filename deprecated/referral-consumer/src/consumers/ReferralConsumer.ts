import { GrpcException } from '@injectivelabs/exceptions'
import { InjectiveReferralRPC } from '@injectivelabs/referral-api/injective_referral_rpc_pb_service'
import {
  ClaimCommissionsReq,
  ReferReq,
  GetFeeRecipientReq,
  GetFeeRecipientResp,
  GetReferralInfoReq,
  GetReferralInfoResp,
  ListRefereesReq,
  ListRefereesResp,
  AddReferrerReq,
  AddReferrerResp,
  UpdateReferrerReq,
} from '@injectivelabs/referral-api/injective_referral_rpc_pb'
import { ReferrerStatus } from '../types'
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

  async getRefereeList(address: string) {
    const request = new ListRefereesReq()

    request.setReferrerAddress(address)

    try {
      const response = await this.request<
        ListRefereesReq,
        ListRefereesResp,
        typeof InjectiveReferralRPC.ListReferees
      >(request, InjectiveReferralRPC.ListReferees)

      return response.getRefereesList()
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

  async addReferrer({ address, code }: { address: string; code: string }) {
    const request = new AddReferrerReq()

    request.setAddress(address)
    request.setCode(code)

    try {
      const response = await this.request<
        AddReferrerReq,
        AddReferrerResp,
        typeof InjectiveReferralRPC.AddReferrer
      >(request, InjectiveReferralRPC.AddReferrer)

      return response
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async updateReferrer({
    address,
    code,
    status,
  }: {
    address: string
    code: string
    status?: ReferrerStatus
  }) {
    const request = new UpdateReferrerReq()

    request.setAddress(address)
    request.setCode(code)

    if (status) {
      request.setStatus(status)
    }

    try {
      const response = await this.request<
        UpdateReferrerReq,
        any,
        typeof InjectiveReferralRPC.UpdateReferrer
      >(request, InjectiveReferralRPC.UpdateReferrer)

      return response
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }
}
