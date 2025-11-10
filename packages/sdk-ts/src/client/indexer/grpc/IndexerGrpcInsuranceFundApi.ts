import {
  InjectiveInsuranceRpcPb,
  InjectiveInsuranceRPCClient,
} from '@injectivelabs/indexer-proto-ts-v2'
import { IndexerModule } from '../types/index.js'
import { IndexerGrpcInsuranceFundTransformer } from '../transformers/index.js'
import BaseIndexerGrpcConsumerV2 from '../../base/BaseIndexerGrpcConsumerV2.js'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcInsuranceFundApi extends BaseIndexerGrpcConsumerV2 {
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
