import { StreamStatusResponse } from '../types/index.js'
import { IndexerAccountStreamTransformer } from '../transformers/index.js'
import { getGrpcIndexerWebImpl } from '../../base/BaseIndexerGrpcWebConsumer.js'
import { Subscription } from 'rxjs'
import { InjectiveAccountRpc } from '@injectivelabs/indexer-proto-ts'

export type BalanceStreamCallback = (
  response: ReturnType<
    typeof IndexerAccountStreamTransformer.balanceStreamCallback
  >,
) => void

/**
 * @category Indexer Grpc Stream
 */
export class IndexerGrpcAccountStream {
  protected client: InjectiveAccountRpc.InjectiveAccountsRPCClientImpl

  constructor(endpoint: string) {
    this.client = new InjectiveAccountRpc.InjectiveAccountsRPCClientImpl(
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
  }): Subscription {
    const request = InjectiveAccountRpc.StreamSubaccountBalanceRequest.create()
    request.subaccountId = subaccountId

    const subscription = this.client
      .StreamSubaccountBalance(request)
      .subscribe({
        next(response: InjectiveAccountRpc.StreamSubaccountBalanceResponse) {
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

    return subscription as unknown as Subscription
  }
}
