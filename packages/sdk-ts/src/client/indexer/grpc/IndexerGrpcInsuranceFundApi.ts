import * as InjectiveInsuranceRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_insurance_rpc_pb'
import { InjectiveInsuranceRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_insurance_rpc_pb.client'
import { IndexerModule } from '../types/index.js'
import { fetchAllWithTokenPagination } from '../../../utils/pagination.js'
import BaseIndexerGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import { IndexerGrpcInsuranceFundTransformer } from '../transformers/index.js'
/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcInsuranceFundApi extends BaseIndexerGrpcConsumer {
  protected module: string = IndexerModule.InsuranceFund

  private get client() {
    return this.initClient(InjectiveInsuranceRPCClient)
  }

  async fetchRedemptions({
    denom,
    address,
    status,
  }: {
    address: string
    denom?: string
    status?: string
  }) {
    const request = InjectiveInsuranceRpcPb.RedemptionsRequest.create()

    request.redeemer = address

    if (denom) {
      request.redemptionDenom = denom
    }

    if (status) {
      request.status = status
    }

    const response = await this.executeGrpcCall<
      InjectiveInsuranceRpcPb.RedemptionsRequest,
      InjectiveInsuranceRpcPb.RedemptionsResponse
    >(request, this.client.redemptions.bind(this.client))

    return IndexerGrpcInsuranceFundTransformer.redemptionsResponseToRedemptions(
      response,
    )
  }

  async fetchInsuranceFunds(params?: { perPage?: number; token?: string }) {
    const { perPage, token } = params || {}
    const request = InjectiveInsuranceRpcPb.FundsRequest.create()

    if (perPage) {
      request.perPage = perPage
    }

    if (token) {
      request.token = token
    }

    const response = await this.executeGrpcCall<
      InjectiveInsuranceRpcPb.FundsRequest,
      InjectiveInsuranceRpcPb.FundsResponse
    >(request, this.client.funds.bind(this.client))

    return IndexerGrpcInsuranceFundTransformer.insuranceFundsResponseToInsuranceFunds(
      response,
    )
  }

  async fetchAllInsuranceFunds(params: { perPage?: number } = {}) {
    const { perPage = 200 } = params

    return fetchAllWithTokenPagination(
      { perPage },
      this.fetchInsuranceFunds.bind(this),
    )
  }
}
