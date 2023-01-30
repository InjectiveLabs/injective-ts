import {
  InjectiveAuctionRPCClientImpl,
  StreamBidsRequest,
  StreamBidsResponse,
} from '@injectivelabs/indexer-proto-ts/injective_auction_rpc'
import { StreamStatusResponse } from '../types'

import { IndexerAuctionStreamTransformer } from '../transformers'
import { getGrpcIndexerWebImpl } from '../../BaseIndexerGrpcWebConsumer'

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
  }) {
    const request = StreamBidsRequest.create()

    const stream = this.client.StreamBids(request)

    return stream.subscribe({
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
  }
}
