import { StreamStatusResponse } from '../types/index.js'
import { ExplorerStreamTransformer } from '../transformers/index.js'
import { getGrpcIndexerWebImpl } from '../../base/BaseIndexerGrpcWebConsumer.js'
import { Subscription } from 'rxjs'
import { InjectiveExplorerRpc } from '@injectivelabs/indexer-proto-ts'

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
  protected client: InjectiveExplorerRpc.InjectiveExplorerRPCClientImpl

  constructor(endpoint: string) {
    this.client = new InjectiveExplorerRpc.InjectiveExplorerRPCClientImpl(
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
    const request = InjectiveExplorerRpc.StreamBlocksRequest.create()

    const subscription = this.client.StreamBlocks(request).subscribe({
      next(response: InjectiveExplorerRpc.StreamBlocksResponse) {
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
    const request = InjectiveExplorerRpc.StreamBlocksRequest.create()

    const subscription = this.client.StreamBlocks(request).subscribe({
      next(response: InjectiveExplorerRpc.StreamBlocksResponse) {
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
    const request = InjectiveExplorerRpc.StreamTxsRequest.create()

    const subscription = this.client.StreamTxs(request).subscribe({
      next(response: InjectiveExplorerRpc.StreamTxsResponse) {
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
