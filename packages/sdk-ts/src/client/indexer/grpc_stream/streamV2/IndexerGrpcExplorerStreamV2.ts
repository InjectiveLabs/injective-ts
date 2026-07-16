import * as InjectiveExplorerRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_explorer_rpc_pb'
import { InjectiveExplorerRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_explorer_rpc_pb.client'
import { createStreamSubscriptionV2 } from './streamHelpersV2.js'
import { ExplorerStreamTransformer } from '../../transformers/index.js'
import { GrpcWebRpcTransport } from '../../../base/GrpcWebRpcTransport.js'
import type { StreamSubscription } from '../../../../types/index.js'

export type BlocksStreamCallbackV2 = (
  response: ReturnType<typeof ExplorerStreamTransformer.blocksStreamCallback>,
) => void

export type BlocksWithTxsStreamCallbackV2 = (
  response: ReturnType<
    typeof ExplorerStreamTransformer.blocksWithTxsStreamCallback
  >,
) => void

export type TransactionsStreamCallbackV2 = (
  response: ReturnType<
    typeof ExplorerStreamTransformer.transactionsStreamCallback
  >,
) => void

export class IndexerGrpcExplorerStreamV2 {
  private client: InjectiveExplorerRPCClient
  private transport: GrpcWebRpcTransport

  constructor(endpoint: string, metadata?: Record<string, string>) {
    this.transport = new GrpcWebRpcTransport(endpoint, metadata)
    this.client = new InjectiveExplorerRPCClient(this.transport)
  }

  /**
   * Stream block updates
   * @param params.callback - Called for each block update
   * @returns StreamSubscription
   */
  streamBlocks({
    callback,
  }: {
    callback: BlocksStreamCallbackV2
  }): StreamSubscription {
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = InjectiveExplorerRpcPb.StreamBlocksRequest.create()
    return createStreamSubscriptionV2(
      (abortSignal) =>
        this.client.streamBlocks(request, { abort: abortSignal }),
      (response) => {
        const transformed =
          ExplorerStreamTransformer.blocksStreamCallback(response)
        callback(transformed)
      },
    )
  }

  /**
   * Stream blocks with transactions
   * @param params.callback - Called for each block with transactions update
   * @returns StreamSubscription
   */
  streamBlocksWithTxs({
    callback,
  }: {
    callback: BlocksWithTxsStreamCallbackV2
  }): StreamSubscription {
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = InjectiveExplorerRpcPb.StreamBlocksRequest.create()
    return createStreamSubscriptionV2(
      (abortSignal) =>
        this.client.streamBlocks(request, { abort: abortSignal }),
      (response) => {
        const transformed =
          ExplorerStreamTransformer.blocksWithTxsStreamCallback(response)
        callback(transformed)
      },
    )
  }

  /**
   * Stream transaction updates
   * @param params.callback - Called for each transaction update
   * @returns StreamSubscription
   */
  streamTransactions({
    callback,
  }: {
    callback: TransactionsStreamCallbackV2
  }): StreamSubscription {
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = InjectiveExplorerRpcPb.StreamTxsRequest.create()
    return createStreamSubscriptionV2(
      (abortSignal) => this.client.streamTxs(request, { abort: abortSignal }),
      (response) => {
        const transformed =
          ExplorerStreamTransformer.transactionsStreamCallback(response)
        callback(transformed)
      },
    )
  }
}
