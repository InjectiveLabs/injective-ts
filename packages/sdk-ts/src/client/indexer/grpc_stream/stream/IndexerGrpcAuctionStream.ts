import * as InjectiveAuctionRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_auction_rpc_pb'
import { InjectiveAuctionRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_auction_rpc_pb.client'
import { createStreamSubscription } from './streamHelpers.js'
import { GrpcWebRpcTransport } from '../../../base/GrpcWebRpcTransport.js'
import { IndexerAuctionStreamTransformer } from '../../transformers/index.js'
import type { Subscription } from 'rxjs'
import type { StreamStatusResponse } from '../../types/index.js'

export type BidsStreamCallback = (
  response: ReturnType<
    typeof IndexerAuctionStreamTransformer.bidsStreamCallback
  >,
) => void

/**
 * @category Indexer Grpc Stream
 * @description Provides streaming access to auction data from Injective Indexer
 */
export class IndexerGrpcAuctionStream {
  private client: InjectiveAuctionRPCClient
  private transport: GrpcWebRpcTransport

  constructor(endpoint: string, metadata?: Record<string, string>) {
    this.transport = new GrpcWebRpcTransport(endpoint, metadata)
    this.client = new InjectiveAuctionRPCClient(this.transport)
  }

  /**
   * Stream auction bids
   * @param params - Stream parameters
   * @param params.callback - Called for each bid update
   * @param params.onEndCallback - Called when stream ends normally
   * @param params.onStatusCallback - Called on stream errors
   * @returns Subscription object with unsubscribe method
   */
  streamBids({
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    callback: BidsStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    // Input validation
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = InjectiveAuctionRpcPb.StreamBidsRequest.create()

    const stream = this.client.streamBids(request)

    return createStreamSubscription(
      stream,
      (response: InjectiveAuctionRpcPb.StreamBidsResponse) => {
        callback(IndexerAuctionStreamTransformer.bidsStreamCallback(response))
      },
      onEndCallback,
      onStatusCallback,
    )
  }
}
