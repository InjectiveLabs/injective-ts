import {
  FundsRequest,
  FundsResponse,
  RedemptionsRequest,
  RedemptionsResponse,
} from '@injectivelabs/exchange-api/injective_insurance_rpc_pb'
import { InjectiveInsuranceRPC } from '@injectivelabs/exchange-api/injective_insurance_rpc_pb_service'
import BaseConsumer from '../../BaseGrpcConsumer'

export class InsuranceFundApi extends BaseConsumer {
  async redemptions({
    denom,
    address,
    status,
  }: {
    address: string
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

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async insuranceFunds() {
    const request = new FundsRequest()

    try {
      const response = await this.request<
        FundsRequest,
        FundsResponse,
        typeof InjectiveInsuranceRPC.Funds
      >(request, InjectiveInsuranceRPC.Funds)

      return response
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
