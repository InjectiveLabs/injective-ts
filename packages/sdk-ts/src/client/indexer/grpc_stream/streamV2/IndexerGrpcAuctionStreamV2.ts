import * as InjectiveAuctionRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_auction_rpc_pb'
import { InjectiveAuctionRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_auction_rpc_pb.client'
import { createStreamSubscriptionV2 } from './streamHelpersV2.js'
import { GrpcWebRpcTransport } from '../../../base/GrpcWebRpcTransport.js'
import { IndexerAuctionStreamTransformer } from '../../transformers/index.js'
import type { StreamSubscription } from '../../../../types/index.js'

export type BidsStreamCallbackV2 = (
  response: ReturnType<
    typeof IndexerAuctionStreamTransformer.bidsStreamCallback
  >,
) => void

export class IndexerGrpcAuctionStreamV2 {
  private client: InjectiveAuctionRPCClient
  private transport: GrpcWebRpcTransport

  constructor(endpoint: string, metadata?: Record<string, string>) {
    this.transport = new GrpcWebRpcTransport(endpoint, metadata)
    this.client = new InjectiveAuctionRPCClient(this.transport)
  }

  /**
   * Stream auction bids
   * @param params.callback - Called for each bid update
   * @returns StreamSubscription
   */
  streamBids({
    callback,
  }: {
    callback: BidsStreamCallbackV2
  }): StreamSubscription {
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = InjectiveAuctionRpcPb.StreamBidsRequest.create()

    const stream = this.client.streamBids(request)

    return createStreamSubscriptionV2(stream, (response) => {
      const transformed =
        IndexerAuctionStreamTransformer.bidsStreamCallback(response)
      callback(transformed)
    })
  }
}
