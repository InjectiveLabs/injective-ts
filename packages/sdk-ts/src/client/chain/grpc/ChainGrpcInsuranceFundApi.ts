import * as InjectiveInsuranceV1Beta1QueryPb from '@injectivelabs/core-proto-ts-v2/generated/injective/insurance/v1beta1/query_pb'
import { QueryClient as InjectiveInsuranceV1Beta1QueryClient } from '@injectivelabs/core-proto-ts-v2/generated/injective/insurance/v1beta1/query_pb.client'
import { ChainModule } from '../types/index.js'
import BaseGrpcConsumer from '../../base/BaseGrpcConsumer.js'
import { ChainGrpcInsuranceFundTransformer } from '../transformers/ChainGrpcInsuranceFundTransformer.js'
import type { GrpcWebTransportAdditionalOptions } from '../../../utils/grpc.js'

/**
 * @category Chain Grpc API
 */
export class ChainGrpcInsuranceFundApi extends BaseGrpcConsumer {
  protected module: string = ChainModule.InsuranceFund
  private client: InjectiveInsuranceV1Beta1QueryClient

  constructor(endpoint: string, options?: GrpcWebTransportAdditionalOptions) {
    super(endpoint, options)
    this.client = new InjectiveInsuranceV1Beta1QueryClient(this.transport)
  }

  async fetchModuleParams() {
    const request =
      InjectiveInsuranceV1Beta1QueryPb.QueryInsuranceParamsRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveInsuranceV1Beta1QueryPb.QueryInsuranceParamsRequest,
      InjectiveInsuranceV1Beta1QueryPb.QueryInsuranceParamsResponse
    >(request, this.client.insuranceParams.bind(this.client))

    return ChainGrpcInsuranceFundTransformer.moduleParamsResponseToModuleParams(
      response,
    )
  }

  async fetchInsuranceFunds() {
    const request =
      InjectiveInsuranceV1Beta1QueryPb.QueryInsuranceFundsRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveInsuranceV1Beta1QueryPb.QueryInsuranceFundsRequest,
      InjectiveInsuranceV1Beta1QueryPb.QueryInsuranceFundsResponse
    >(request, this.client.insuranceFunds.bind(this.client))

    return ChainGrpcInsuranceFundTransformer.insuranceFundsResponseToInsuranceFunds(
      response,
    )
  }

  async fetchInsuranceFund(marketId: string) {
    const request =
      InjectiveInsuranceV1Beta1QueryPb.QueryInsuranceFundRequest.create()

    request.marketId = marketId

    const response = await this.executeGrpcCall<
      InjectiveInsuranceV1Beta1QueryPb.QueryInsuranceFundRequest,
      InjectiveInsuranceV1Beta1QueryPb.QueryInsuranceFundResponse
    >(request, this.client.insuranceFund.bind(this.client))

    return ChainGrpcInsuranceFundTransformer.insuranceFundResponseToInsuranceFund(
      response,
    )
  }

  async fetchEstimatedRedemptions({
    marketId,
    address,
  }: {
    marketId: string
    address: string
  }) {
    const request =
      InjectiveInsuranceV1Beta1QueryPb.QueryEstimatedRedemptionsRequest.create()

    request.marketId = marketId
    request.address = address

    const response = await this.executeGrpcCall<
      InjectiveInsuranceV1Beta1QueryPb.QueryEstimatedRedemptionsRequest,
      InjectiveInsuranceV1Beta1QueryPb.QueryEstimatedRedemptionsResponse
    >(request, this.client.estimatedRedemptions.bind(this.client))

    return ChainGrpcInsuranceFundTransformer.estimatedRedemptionsResponseToEstimatedRedemptions(
      response,
    )
  }

  async fetchPendingRedemptions({
    marketId,
    address,
  }: {
    marketId: string
    address: string
  }) {
    const request =
      InjectiveInsuranceV1Beta1QueryPb.QueryPendingRedemptionsRequest.create()

    request.marketId = marketId
    request.address = address

    const response = await this.executeGrpcCall<
      InjectiveInsuranceV1Beta1QueryPb.QueryPendingRedemptionsRequest,
      InjectiveInsuranceV1Beta1QueryPb.QueryPendingRedemptionsResponse
    >(request, this.client.pendingRedemptions.bind(this.client))

    return ChainGrpcInsuranceFundTransformer.redemptionsResponseToRedemptions(
      response,
    )
  }
}
