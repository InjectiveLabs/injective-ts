import * as InjectiveInsuranceRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_insurance_rpc_pb'
import { InjectiveInsuranceRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_insurance_rpc_pb.client'
import { IndexerModule } from '../types/index.js'
import BaseIndexerGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import { IndexerGrpcInsuranceFundTransformer } from '../transformers/index.js'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcInsuranceFundApi extends BaseIndexerGrpcConsumer {
  protected module: string = IndexerModule.InsuranceFund
  private client: InjectiveInsuranceRPCClient

  constructor(endpoint: string) {
    super(endpoint)
    this.client = new InjectiveInsuranceRPCClient(this.transport)
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

  async fetchInsuranceFunds() {
    const request = InjectiveInsuranceRpcPb.FundsRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveInsuranceRpcPb.FundsRequest,
      InjectiveInsuranceRpcPb.FundsResponse
    >(request, this.client.funds.bind(this.client))

    return IndexerGrpcInsuranceFundTransformer.insuranceFundsResponseToInsuranceFunds(
      response,
    )
  }
}
