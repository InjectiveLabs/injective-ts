import * as InjectiveExplorerRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_explorer_rpc_pb'
import { InjectiveExplorerRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_explorer_rpc_pb.client'
import { createStreamSubscription } from './streamHelpers.js'
import { ExplorerStreamTransformer } from '../transformers/index.js'
import { GrpcWebRpcTransport } from '../../base/GrpcWebRpcTransport.js'
import type { Subscription } from 'rxjs'
import type { StreamStatusResponse } from '../types/index.js'

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
 * @description Provides streaming access to blockchain explorer data from Injective Indexer
 */
export class IndexerGrpcExplorerStream {
  private client: InjectiveExplorerRPCClient
  private transport: GrpcWebRpcTransport

  constructor(endpoint: string, metadata?: Record<string, string>) {
    this.transport = new GrpcWebRpcTransport(endpoint, metadata)
    this.client = new InjectiveExplorerRPCClient(this.transport)
  }

  /**
   * Stream block updates
   * @param params - Stream parameters
   * @param params.callback - Called for each block update
   * @param params.onEndCallback - Called when stream ends normally
   * @param params.onStatusCallback - Called on stream errors
   * @returns Subscription object with unsubscribe method
   */
  streamBlocks({
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    callback: BlocksStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    // Input validation
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = InjectiveExplorerRpcPb.StreamBlocksRequest.create()
    const stream = this.client.streamBlocks(request)

    return createStreamSubscription(
      stream,
      (response: InjectiveExplorerRpcPb.StreamBlocksResponse) => {
        callback(ExplorerStreamTransformer.blocksStreamCallback(response))
      },
      onEndCallback,
      onStatusCallback,
    )
  }

  /**
   * Stream blocks with transactions
   * @param params - Stream parameters
   * @param params.callback - Called for each block with transactions update
   * @param params.onEndCallback - Called when stream ends normally
   * @param params.onStatusCallback - Called on stream errors
   * @returns Subscription object with unsubscribe method
   */
  streamBlocksWithTxs({
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    callback: BlocksWithTxsStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    // Input validation
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = InjectiveExplorerRpcPb.StreamBlocksRequest.create()
    const stream = this.client.streamBlocks(request)

    return createStreamSubscription(
      stream,
      (response: InjectiveExplorerRpcPb.StreamBlocksResponse) => {
        callback(
          ExplorerStreamTransformer.blocksWithTxsStreamCallback(response),
        )
      },
      onEndCallback,
      onStatusCallback,
    )
  }

  /**
   * Stream transaction updates
   * @param params - Stream parameters
   * @param params.callback - Called for each transaction update
   * @param params.onEndCallback - Called when stream ends normally
   * @param params.onStatusCallback - Called on stream errors
   * @returns Subscription object with unsubscribe method
   */
  streamTransactions({
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    callback: TransactionsStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    // Input validation
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = InjectiveExplorerRpcPb.StreamTxsRequest.create()
    const stream = this.client.streamTxs(request)

    return createStreamSubscription(
      stream,
      (response: InjectiveExplorerRpcPb.StreamTxsResponse) => {
        callback(ExplorerStreamTransformer.transactionsStreamCallback(response))
      },
      onEndCallback,
      onStatusCallback,
    )
  }
}
