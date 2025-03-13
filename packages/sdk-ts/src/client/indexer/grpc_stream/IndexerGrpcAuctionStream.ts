import { StreamStatusResponse } from '../types/index.js'
import { IndexerAuctionStreamTransformer } from '../transformers/index.js'
import { getGrpcIndexerWebImpl } from '../../base/BaseIndexerGrpcWebConsumer.js'
import { Subscription } from 'rxjs'
import { InjectiveAuctionRpc } from '@injectivelabs/indexer-proto-ts'

export type BidsStreamCallback = (
  response: ReturnType<
    typeof IndexerAuctionStreamTransformer.bidsStreamCallback
  >,
) => void

/**
 * @category Indexer Grpc Stream
 */
export class IndexerGrpcAuctionStream {
  protected client: InjectiveAuctionRpc.InjectiveAuctionRPCClientImpl

  constructor(endpoint: string) {
    this.client = new InjectiveAuctionRpc.InjectiveAuctionRPCClientImpl(
      getGrpcIndexerWebImpl(endpoint),
    )
  }

  streamBids({
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    callback: BidsStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    const request = InjectiveAuctionRpc.StreamBidsRequest.create()

    const subscription = this.client.StreamBids(request).subscribe({
      next(response: InjectiveAuctionRpc.StreamBidsResponse) {
        callback(IndexerAuctionStreamTransformer.bidsStreamCallback(response))
      },
      error(err) {
        if (onStatusCallback) {
          onStatusCallback(err)
        }
      },
      complete() {
        if (onEndCallback) {
          onEndCallback()
        }
      },
    })

    return subscription as unknown as Subscription
  }
}
