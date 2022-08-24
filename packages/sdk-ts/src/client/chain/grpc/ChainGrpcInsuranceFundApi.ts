import { Query as InsuranceFundQuery } from '@injectivelabs/chain-api/injective/insurance/v1beta1/query_pb_service'
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
import BaseConsumer from '../../BaseGrpcConsumer'
import { ChainGrpcInsuranceFundTransformer } from '../transformers/ChainGrpcInsuranceFundTransformer'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcInsuranceFundApi extends BaseConsumer {
  async fetchModuleParams() {
    const request = new QueryInsuranceParamsRequest()

    try {
      const response = await this.request<
        QueryInsuranceParamsRequest,
        QueryInsuranceParamsResponse,
        typeof InsuranceFundQuery.InsuranceParams
      >(request, InsuranceFundQuery.InsuranceParams)

      return ChainGrpcInsuranceFundTransformer.moduleParamsResponseToModuleParams(
        response,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchInsuranceFunds() {
    const request = new QueryInsuranceFundsRequest()

    try {
      const response = await this.request<
        QueryInsuranceFundsRequest,
        QueryInsuranceFundsResponse,
        typeof InsuranceFundQuery.InsuranceFunds
      >(request, InsuranceFundQuery.InsuranceFunds)

      return ChainGrpcInsuranceFundTransformer.insuranceFundsResponseToInsuranceFunds(
        response,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchInsuranceFund(marketId: string) {
    const request = new QueryInsuranceFundRequest()
    request.setMarketId(marketId)

    try {
      const response = await this.request<
        QueryInsuranceFundRequest,
        QueryInsuranceFundResponse,
        typeof InsuranceFundQuery.InsuranceFund
      >(request, InsuranceFundQuery.InsuranceFund)

      return ChainGrpcInsuranceFundTransformer.insuranceFundResponseToInsuranceFund(
        response,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchEstimatedRedemptions({
    marketId,
    address,
  }: {
    marketId: string
    address: string
  }) {
    const request = new QueryEstimatedRedemptionsRequest()
    request.setMarketid(marketId)
    request.setAddress(address)

    try {
      const response = await this.request<
        QueryEstimatedRedemptionsRequest,
        QueryEstimatedRedemptionsResponse,
        typeof InsuranceFundQuery.EstimatedRedemptions
      >(request, InsuranceFundQuery.EstimatedRedemptions)

      return ChainGrpcInsuranceFundTransformer.estimatedRedemptionsResponseToEstimatedRedemptions(
        response,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }

  async fetchPendingRedemptions({
    marketId,
    address,
  }: {
    marketId: string
    address: string
  }) {
    const request = new QueryPendingRedemptionsRequest()
    request.setMarketid(marketId)
    request.setAddress(address)

    try {
      const response = await this.request<
        QueryPendingRedemptionsRequest,
        QueryPendingRedemptionsResponse,
        typeof InsuranceFundQuery.PendingRedemptions
      >(request, InsuranceFundQuery.PendingRedemptions)

      return ChainGrpcInsuranceFundTransformer.redemptionsResponseToRedemptions(
        response,
      )
    } catch (e: any) {
      throw new Error(e.message)
    }
  }
}
