import {
  InjectiveExplorerRPCClientImpl,
  StreamBlocksRequest,
  StreamBlocksResponse,
  StreamTxsRequest,
  StreamTxsResponse,
} from '@injectivelabs/indexer-proto-ts/injective_explorer_rpc'
import { StreamStatusResponse } from '../types'
import { ExplorerStreamTransformer } from '../transformers'
import { getGrpcIndexerWebImpl } from '../../BaseIndexerGrpcWebConsumer'
import { Subscription } from 'rxjs'

export type BlocksStreamCallback = (
  response: ReturnType<typeof ExplorerStreamTransformer.blocksStreamCallback>,
) => void
export type BlocksWithTxsStreamCallback = (
  response: ReturnType<
    typeof ExplorerStreamTransformer.blocksWithTxsStreamCallback
  >,
) => void
export type TransactionsStreamCallback = (
  response: ReturnType<
    typeof ExplorerStreamTransformer.transactionsStreamCallback
  >,
) => void

/**
 * @category Indexer Grpc Stream
 */
export class IndexerGrpcExplorerStream {
  protected client: InjectiveExplorerRPCClientImpl

  constructor(endpoint: string) {
    this.client = new InjectiveExplorerRPCClientImpl(
      getGrpcIndexerWebImpl(endpoint),
    )
  }

  streamBlocks({
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    callback: BlocksStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    const request = StreamBlocksRequest.create()

    const subscription = this.client.StreamBlocks(request).subscribe({
      next(response: StreamBlocksResponse) {
        callback(ExplorerStreamTransformer.blocksStreamCallback(response))
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

  streamBlocksWithTxs({
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    callback: BlocksWithTxsStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    const request = StreamBlocksRequest.create()

    const subscription = this.client.StreamBlocks(request).subscribe({
      next(response: StreamBlocksResponse) {
        callback(
          ExplorerStreamTransformer.blocksWithTxsStreamCallback(response),
        )
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

  streamTransactions({
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    callback: TransactionsStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    const request = StreamTxsRequest.create()

    const subscription = this.client.StreamTxs(request).subscribe({
      next(response: StreamTxsResponse) {
        callback(ExplorerStreamTransformer.transactionsStreamCallback(response))
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
