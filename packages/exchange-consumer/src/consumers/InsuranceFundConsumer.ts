import {
  FundsRequest,
  FundsResponse,
  RedemptionsRequest,
  RedemptionsResponse,
} from '@injectivelabs/exchange-api/injective_insurance_rpc_pb'
import { InjectiveInsuranceRPC } from '@injectivelabs/exchange-api/injective_insurance_rpc_pb_service'
import { GrpcException } from '@injectivelabs/exceptions'
import { AccountAddress } from '@injectivelabs/ts-types'
import BaseConsumer from '../BaseConsumer'

export class InsuranceFundConsumer extends BaseConsumer {
  async redemptions({
    denom,
    address,
    status,
  }: {
    address: AccountAddress
    denom?: string
    status?: string
  }) {
    const request = new RedemptionsRequest()
    request.setRedeemer(address)

    if (denom) {
      request.setRedemptionDenom(denom)
    }

    if (status) {
      request.setStatus(status)
    }

    try {
      const response = await this.request<
        RedemptionsRequest,
        RedemptionsResponse,
        typeof InjectiveInsuranceRPC.Redemptions
      >(request, InjectiveInsuranceRPC.Redemptions)

      return response.getRedemptionSchedulesList()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async funds() {
    const request = new FundsRequest()

    try {
      const response = await this.request<
        FundsRequest,
        FundsResponse,
        typeof InjectiveInsuranceRPC.Funds
      >(request, InjectiveInsuranceRPC.Funds)

      return response.getFundsList()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }
}
