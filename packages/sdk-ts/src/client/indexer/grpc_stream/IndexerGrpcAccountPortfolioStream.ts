import { StreamStatusResponse } from '../types/index.js'
import { IndexerAccountPortfolioStreamTransformer } from '../transformers/index.js'
import { getGrpcIndexerWebImpl } from '../../base/BaseIndexerGrpcWebConsumer.js'
import { Subscription } from 'rxjs'
import { InjectivePortfolioRpc } from '@injectivelabs/indexer-proto-ts'

export type AccountPortfolioStreamCallback = (
  response: ReturnType<
    typeof IndexerAccountPortfolioStreamTransformer.accountPortfolioStreamCallback
  >,
) => void

/**
 * @category Indexer Grpc Stream
 */
export class IndexerGrpcAccountPortfolioStream {
  protected client: InjectivePortfolioRpc.InjectivePortfolioRPCClientImpl

  constructor(endpoint: string) {
    this.client = new InjectivePortfolioRpc.InjectivePortfolioRPCClientImpl(
      getGrpcIndexerWebImpl(endpoint),
    )
  }

  streamAccountPortfolio({
    subaccountId,
    accountAddress,
    type,
    callback,
    onEndCallback,
    onStatusCallback,
  }: {
    accountAddress: string
    subaccountId?: string
    type?: string
    callback: AccountPortfolioStreamCallback
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
  }): Subscription {
    const request = InjectivePortfolioRpc.StreamAccountPortfolioRequest.create()
    request.accountAddress = accountAddress

    if (subaccountId) {
      request.subaccountId = subaccountId
    }

    if (type) {
      request.type = type
    }

    const subscription = this.client.StreamAccountPortfolio(request).subscribe({
      next(response: InjectivePortfolioRpc.StreamAccountPortfolioResponse) {
        callback(
          IndexerAccountPortfolioStreamTransformer.accountPortfolioStreamCallback(
            response,
          ),
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
