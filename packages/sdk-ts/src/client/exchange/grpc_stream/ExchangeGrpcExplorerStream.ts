import { InjectiveExplorerRPCClient } from '@injectivelabs/exchange-api/injective_explorer_rpc_pb_service'
import {
  StreamBlocksRequest,
  StreamBlocksResponse,
  StreamTxsRequest,
  StreamTxsResponse,
} from '@injectivelabs/exchange-api/injective_explorer_rpc_pb'
import { StreamStatusResponse } from '../types'
import { isServerSide } from '../../../utils/helpers'
import { NodeHttpTransport } from '@improbable-eng/grpc-web-node-http-transport'

export type BlocksStreamCallback = (response: StreamBlocksResponse) => void
export type TransactionsStreamCallback = (response: StreamTxsResponse) => void

export class ExchangeGrpcExplorerStream {
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
      callback(response)
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
      callback(response)
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
