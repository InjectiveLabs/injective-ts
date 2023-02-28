import { StreamStatusResponse } from '../types'
import { IndexerAccountPortfolioStreamTransformer } from '../transformers'
import {
  InjectivePortfolioRPCClientImpl,
  StreamAccountPortfolioRequest,
  StreamAccountPortfolioResponse,
} from '@injectivelabs/indexer-proto-ts/injective_portfolio_rpc'
import { getGrpcIndexerWebImpl } from '../../BaseIndexerGrpcWebConsumer'
import { Subscription } from 'rxjs'

export type AccountPortfolioStreamCallback = (
  response: ReturnType<
    typeof IndexerAccountPortfolioStreamTransformer.accountPortfolioStreamCallback
  >,
) => void

/**
 * @category Indexer Grpc Stream
 */
export class IndexerGrpcAccountPortfolioStream {
  protected client: InjectivePortfolioRPCClientImpl

  constructor(endpoint: string) {
    this.client = new InjectivePortfolioRPCClientImpl(
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
    const request = StreamAccountPortfolioRequest.create()
    request.accountAddress = accountAddress

    if (subaccountId) {
      request.subaccountId = subaccountId
    }

    if (type) {
      request.type = type
    }

    const subscription = this.client.StreamAccountPortfolio(request).subscribe({
      next(response: StreamAccountPortfolioResponse) {
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
