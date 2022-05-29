import { InjectiveExplorerRPCClient } from '@injectivelabs/exchange-api/injective_explorer_rpc_pb_service'
import {
  StreamTxsRequest,
  StreamTxsResponse,
} from '@injectivelabs/exchange-api/injective_explorer_rpc_pb'
import { StreamOperation, StreamStatusResponse } from '@injectivelabs/ts-types'
import { Transaction } from '../../types/index'
import { ExplorerTransformer } from '../../transformers/ExplorerTransformer'

export type TransactionStreamCallback = ({
  transaction,
  operation,
}: {
  transaction: Transaction
  operation: StreamOperation
}) => void

const transformer = (response: StreamTxsResponse) => ({
  transaction: ExplorerTransformer.grpcTransactionToTransaction(response),
  operation: StreamOperation.Insert,
})

export class TransactionStream {
  protected client: InjectiveExplorerRPCClient

  protected endpoint: string

  constructor(endpoint: string) {
    this.endpoint = endpoint
    this.client = new InjectiveExplorerRPCClient(endpoint)
  }

  start({
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    callback: TransactionStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = new StreamTxsRequest()
    const stream = this.client.streamTxs(request)

    stream.on('data', (response: StreamTxsResponse) => {
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
