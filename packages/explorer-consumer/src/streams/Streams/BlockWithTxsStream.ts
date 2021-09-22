import { InjectiveExplorerRPCClient } from '@injectivelabs/exchange-api/injective_explorer_rpc_pb_service'
import {
  StreamBlocksRequest,
  StreamBlocksResponse,
} from '@injectivelabs/exchange-api/injective_explorer_rpc_pb'
import { StreamOperation, StreamStatusResponse } from '@injectivelabs/ts-types'
import { Block } from '../../types/index'
import { ExplorerTransformer } from '../../transformers/ExplorerTransformer'

export type BlockWithTxsStreamCallback = ({
  blocks,
  operation,
}: {
  blocks: Block[]
  operation: StreamOperation
}) => void

const transformer = (response: StreamBlocksResponse) => ({
  blocks: ExplorerTransformer.grpcBlocksToBlocksWithTxs(
    response.getFieldList(),
  ),
  operation: StreamOperation.Insert,
})

export class BlockWithTxsStream {
  protected client: InjectiveExplorerRPCClient

  protected endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
    this.client = new InjectiveExplorerRPCClient(endpoint)
  }

  start({
    limit,
    before,
    after,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    limit: number
    before?: number
    after?: number
    callback: BlockWithTxsStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = new StreamBlocksRequest()
    request.setLimit(limit)

    if (before) {
      request.setBefore(before)
    }

    if (after) {
      request.setAfter(after)
    }

    const stream = this.client.streamBlocks(request)

    stream.on('data', (response: StreamBlocksResponse) => {
      callback(transformer(response))
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
