import * as InjectiveInsuranceRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_insurance_rpc_pb'
import { InjectiveInsuranceRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_insurance_rpc_pb.client'
import { IndexerModule } from '../types/index.js'
import BaseIndexerGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import { IndexerGrpcInsuranceFundTransformer } from '../transformers/index.js'
import type { GrpcCallOptions } from '../../../types/index.js'
/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcInsuranceFundApi extends BaseIndexerGrpcConsumer {
  protected module: string = IndexerModule.InsuranceFund

  private get client() {
    return this.initClient(InjectiveInsuranceRPCClient)
  }

  async fetchRedemptions(
    {
      denom,
      address,
      status,
    }: {
      address: string
      denom?: string
      status?: string
    },
    options?: GrpcCallOptions,
  ) {
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
    >(request, this.client.redemptions.bind(this.client), options?.signal)

    return IndexerGrpcInsuranceFundTransformer.redemptionsResponseToRedemptions(
      response,
    )
  }

  async fetchInsuranceFunds(options?: GrpcCallOptions) {
    const request = InjectiveInsuranceRpcPb.FundsRequest.create()

    const response = await this.executeGrpcCall<
      InjectiveInsuranceRpcPb.FundsRequest,
      InjectiveInsuranceRpcPb.FundsResponse
    >(request, this.client.funds.bind(this.client), options?.signal)

    return IndexerGrpcInsuranceFundTransformer.insuranceFundsResponseToInsuranceFunds(
      response,
    )
  }
}
