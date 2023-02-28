import {
  InjectiveAuctionRPCClientImpl,
  StreamBidsRequest,
  StreamBidsResponse,
} from '@injectivelabs/indexer-proto-ts/injective_auction_rpc'
import { StreamStatusResponse } from '../types'
import { IndexerAuctionStreamTransformer } from '../transformers'
import { getGrpcIndexerWebImpl } from '../../BaseIndexerGrpcWebConsumer'
import { Subscription } from 'rxjs'

export type BidsStreamCallback = (
  response: ReturnType<
    typeof IndexerAuctionStreamTransformer.bidsStreamCallback
  >,
) => void

/**
 * @category Indexer Grpc Stream
 */
export class IndexerGrpcAuctionStream {
  protected client: InjectiveAuctionRPCClientImpl

  constructor(endpoint: string) {
    this.client = new InjectiveAuctionRPCClientImpl(
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
    const request = StreamBidsRequest.create()

    const subscription = this.client.StreamBids(request).subscribe({
      next(response: StreamBidsResponse) {
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
