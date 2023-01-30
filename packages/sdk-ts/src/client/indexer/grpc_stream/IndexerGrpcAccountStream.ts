import {
  InjectiveAccountsRPCClientImpl,
  StreamSubaccountBalanceRequest,
  StreamSubaccountBalanceResponse,
} from '@injectivelabs/indexer-proto-ts/injective_accounts_rpc'
import { StreamStatusResponse } from '../types'
import { IndexerAccountStreamTransformer } from '../transformers'
import { getGrpcIndexerWebImpl } from '../../BaseIndexerGrpcWebConsumer'

export type BalanceStreamCallback = (
  response: ReturnType<
    typeof IndexerAccountStreamTransformer.balanceStreamCallback
  >,
) => void

/**
 * @category Indexer Grpc Stream
 */
export class IndexerGrpcAccountStream {
  protected client: InjectiveAccountsRPCClientImpl

  constructor(endpoint: string) {
    this.client = new InjectiveAccountsRPCClientImpl(
      getGrpcIndexerWebImpl(endpoint),
    )
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
    const request = StreamSubaccountBalanceRequest.create()
    request.subaccountId = subaccountId

    const stream = this.client.StreamSubaccountBalance(request)

    return stream.subscribe({
      next(response: StreamSubaccountBalanceResponse) {
        callback(
          IndexerAccountStreamTransformer.balanceStreamCallback(response),
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
  }
}
