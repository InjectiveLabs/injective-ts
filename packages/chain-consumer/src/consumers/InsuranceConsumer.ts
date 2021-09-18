import { Query } from '@injectivelabs/chain-api/injective/insurance/v1beta1/query_pb_service'
import {
  QueryInsuranceParamsRequest,
  QueryInsuranceParamsResponse,
  QueryInsuranceFundRequest,
  QueryInsuranceFundResponse,
  QueryEstimatedRedemptionsRequest,
  QueryEstimatedRedemptionsResponse,
  QueryInsuranceFundsRequest,
  QueryInsuranceFundsResponse,
  QueryPendingRedemptionsRequest,
  QueryPendingRedemptionsResponse,
} from '@injectivelabs/chain-api/injective/insurance/v1beta1/query_pb'
import { GrpcException } from '@injectivelabs/exceptions'
import { AccountAddress } from '@injectivelabs/ts-types'
import BaseConsumer from '../BaseConsumer'
import { GrpcInsuranceParams } from '../types'

export class InsuranceConsumer extends BaseConsumer {
  async fetchParams() {
    const request = new QueryInsuranceParamsRequest()

    try {
      const response = await this.request<
        QueryInsuranceParamsRequest,
        QueryInsuranceParamsResponse,
        typeof Query.InsuranceParams
      >(request, Query.InsuranceParams)

      return response.getParams() as GrpcInsuranceParams
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchInsuranceFunds() {
    const request = new QueryInsuranceFundsRequest()

    try {
      const response = await this.request<
        QueryInsuranceFundsRequest,
        QueryInsuranceFundsResponse,
        typeof Query.InsuranceFunds
      >(request, Query.InsuranceFunds)

      return response.getFundsList()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchInsuranceFund(marketId: string) {
    const request = new QueryInsuranceFundRequest()
    request.setMarketId(marketId)

    try {
      const response = await this.request<
        QueryInsuranceFundRequest,
        QueryInsuranceFundResponse,
        typeof Query.InsuranceFund
      >(request, Query.InsuranceFund)

      return response.getFund()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchEstimatedRedemptions({
    marketId,
    address,
  }: {
    marketId: string
    address: AccountAddress
  }) {
    const request = new QueryEstimatedRedemptionsRequest()
    request.setMarketid(marketId)
    request.setAddress(address)

    try {
      const response = await this.request<
        QueryEstimatedRedemptionsRequest,
        QueryEstimatedRedemptionsResponse,
        typeof Query.EstimatedRedemptions
      >(request, Query.EstimatedRedemptions)

      return response.getAmountList()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }

  async fetchPendingRedemptions({
    marketId,
    address,
  }: {
    marketId: string
    address: AccountAddress
  }) {
    const request = new QueryPendingRedemptionsRequest()
    request.setMarketid(marketId)
    request.setAddress(address)

    try {
      const response = await this.request<
        QueryPendingRedemptionsRequest,
        QueryPendingRedemptionsResponse,
        typeof Query.PendingRedemptions
      >(request, Query.PendingRedemptions)

      return response.getAmountList()
    } catch (e: any) {
      throw new GrpcException(e.message)
    }
  }
}
