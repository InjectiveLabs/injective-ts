import { InjectiveAccountsRPCClient } from '@injectivelabs/indexer-api/injective_accounts_rpc_pb_service'
import {
  StreamSubaccountBalanceRequest,
  StreamSubaccountBalanceResponse,
} from '@injectivelabs/indexer-api/injective_accounts_rpc_pb'
import { StreamStatusResponse } from '../types'
import { IndexerAccountStreamTransformer } from '../transformers'
import { getGrpcTransport } from '../../../utils/grpc'

export type BalanceStreamCallback = (
  response: ReturnType<
    typeof IndexerAccountStreamTransformer.balanceStreamCallback
  >,
) => void

/**
 * @category Indexer Grpc Stream
 */
export class IndexerGrpcAccountStream {
  protected client: InjectiveAccountsRPCClient

  constructor(endpoint: string) {
    this.client = new InjectiveAccountsRPCClient(endpoint, {
      transport: getGrpcTransport(),
    })
  }

  streamSubaccountBalance({
    subaccountId,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    subaccountId: string
    callback: BalanceStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }) {
    const request = new StreamSubaccountBalanceRequest()
    request.setSubaccountId(subaccountId)

    const stream = this.client.streamSubaccountBalance(request)

    stream.on('data', (response: StreamSubaccountBalanceResponse) => {
      callback(IndexerAccountStreamTransformer.balanceStreamCallback(response))
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
