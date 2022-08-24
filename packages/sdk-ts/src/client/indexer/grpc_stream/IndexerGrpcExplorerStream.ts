import { InjectiveExplorerRPCClient } from '@injectivelabs/indexer-api/injective_explorer_rpc_pb_service'
import {
  StreamBlocksRequest,
  StreamBlocksResponse,
  StreamTxsRequest,
  StreamTxsResponse,
} from '@injectivelabs/indexer-api/injective_explorer_rpc_pb'
import { StreamStatusResponse } from '../types'
import { isServerSide } from '../../../utils/helpers'
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport'
import { ExplorerStreamTransformer } from '../transformers'

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
  protected client: InjectiveExplorerRPCClient

  constructor(endpoint: string) {
    this.client = new InjectiveExplorerRPCClient(endpoint, {
      transport: isServerSide() ? NodeHttpTransport() : undefined,
    })
  }

  blocks({
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    callback: BlocksStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = new StreamBlocksRequest()

    const stream = this.client.streamBlocks(request)

    stream.on('data', (response: StreamBlocksResponse) => {
      callback(ExplorerStreamTransformer.blocksStreamCallback(response))
    })

    if (onEndCallback) {
      stream.on('end', onEndCallback)
    }

    if (onStatusCallback) {
      stream.on('status', onStatusCallback)
    }

    return stream
  }

  blocksWithTxs({
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    callback: BlocksWithTxsStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = new StreamBlocksRequest()

    const stream = this.client.streamBlocks(request)

    stream.on('data', (response: StreamBlocksResponse) => {
      callback(ExplorerStreamTransformer.blocksWithTxsStreamCallback(response))
    })

    if (onEndCallback) {
      stream.on('end', onEndCallback)
    }

    if (onStatusCallback) {
      stream.on('status', onStatusCallback)
    }

    return stream
  }

  streamTransactions({
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    callback: TransactionsStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = new StreamTxsRequest()
    const stream = this.client.streamTxs(request)

    stream.on('data', (response: StreamTxsResponse) => {
      callback(ExplorerStreamTransformer.transactionsStreamCallback(response))
    })

    if (onEndCallback) {
      stream.on('end', onEndCallback)
    }

    if (onStatusCallback) {
      stream.on('status', onStatusCallback)
    }

    return stream
  }
}
