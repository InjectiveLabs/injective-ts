import * as InjectiveRfqPricerRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_pricer_rpc_pb'
import { InjectiveRfqPricerRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_rfq_pricer_rpc_pb.client'
import { createStreamSubscriptionV2 } from './streamHelpersV2.js'
import { IndexerRfqPricerTransformer } from '../../transformers/index.js'
import { GrpcWebRpcTransport } from '../../../base/GrpcWebRpcTransport.js'
import type { StreamSubscription } from '../../../../types/index.js'

export type PricingStreamCallbackV2 = (
  response: ReturnType<
    typeof IndexerRfqPricerTransformer.pricingResponseToPricing
  >,
) => void

export class IndexerGrpcRfqPricerStreamV2 {
  private client: InjectiveRfqPricerRPCClient
  private transport: GrpcWebRpcTransport

  constructor(endpoint: string, metadata?: Record<string, string>) {
    this.transport = new GrpcWebRpcTransport(endpoint, metadata)
    this.client = new InjectiveRfqPricerRPCClient(this.transport)
  }

  /**
   * Subscribe to 1–50 markets. Empty tiers means the market is withdrawn.
   * Callbacks run synchronously and must return promptly: the server cuts off
   * slow clients with too_many_requests.
   */
  streamPricing({
    marketIds,
    callback,
    signal,
  }: {
    marketIds: string[]
    callback: PricingStreamCallbackV2
    signal?: AbortSignal
  }): StreamSubscription {
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    if (marketIds.length === 0 || marketIds.length > 50) {
      throw new Error('marketIds must contain between 1 and 50 entries')
    }

    const request = InjectiveRfqPricerRpcPb.PricingStreamRequest.create()
    request.marketIds = marketIds

    return createStreamSubscriptionV2(
      (abortSignal) =>
        this.client.pricingStream(request, { abort: abortSignal }),
      (response) => {
        callback(IndexerRfqPricerTransformer.pricingResponseToPricing(response))
      },
      { signal },
    )
  }
}
