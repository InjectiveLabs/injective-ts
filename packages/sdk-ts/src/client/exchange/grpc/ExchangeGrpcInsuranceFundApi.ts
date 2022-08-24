import {
  FundsRequest,
  FundsResponse,
  RedemptionsRequest,
  RedemptionsResponse,
} from '@injectivelabs/exchange-api/injective_insurance_rpc_pb'
import { InjectiveInsuranceRPC } from '@injectivelabs/exchange-api/injective_insurance_rpc_pb_service'
import BaseConsumer from '../../BaseGrpcConsumer'
import { ExchangeGrpcInsuranceFundTransformer } from '../transformers'

/**
 * @category Exchange Grpc API
 */
export class ExchangeGrpcInsuranceFundApi extends BaseConsumer {
  async fetchRedemptions({
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

      return ExchangeGrpcInsuranceFundTransformer.redemptionsResponseToRedemptions(
        response,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchInsuranceFunds() {
    const request = new FundsRequest()

    try {
      const response = await this.request<
        FundsRequest,
        FundsResponse,
        typeof InjectiveInsuranceRPC.Funds
      >(request, InjectiveInsuranceRPC.Funds)

      return ExchangeGrpcInsuranceFundTransformer.insuranceFundsResponseToInsuranceFunds(
        response,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
