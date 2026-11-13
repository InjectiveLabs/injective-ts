import { throwIfAborted } from '@injectivelabs/utils'
import {
  GrpcErrorCode,
  GrpcUnaryRequestException,
} from '@injectivelabs/exceptions'
import * as InjectiveRfqPricerRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_pricer_rpc_pb'
import { InjectiveRfqPricerRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_pricer_rpc_pb.client'
import { IndexerModule } from '../types/index.js'
import { IndexerRfqPricerTransformer } from '../transformers/index.js'
import BaseIndexerGrpcConsumer from '../../base/BaseIndexerGrpcConsumer.js'
import type { RequestOptions } from '@injectivelabs/utils'
import type { RFQPricing } from '../types/index.js'

/**
 * @category Indexer Grpc API
 */
export class IndexerGrpcRfqPricerApi extends BaseIndexerGrpcConsumer {
  protected module: string = IndexerModule.RfqPricer

  private get client() {
    return this.initClient(InjectiveRfqPricerRPCClient)
  }

  async fetchPricing(
    marketId: string,
    options?: RequestOptions,
  ): Promise<RFQPricing | undefined> {
    throwIfAborted(options?.signal)
    const request = InjectiveRfqPricerRpcPb.GetPricingRequest.create()
    request.marketId = marketId

    try {
      const response = await this.executeGrpcCall<
        InjectiveRfqPricerRpcPb.GetPricingRequest,
        InjectiveRfqPricerRpcPb.GetPricingResponse
      >(request, this.client.getPricing.bind(this.client), options)

      return IndexerRfqPricerTransformer.pricingResponseToPricing(response)
    } catch (error) {
      if (
        error instanceof GrpcUnaryRequestException &&
        error.code === GrpcErrorCode.NotFound
      ) {
        return undefined
      }

      throw error
    }
  }
}
