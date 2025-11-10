import * as InjectivePortfolioRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_portfolio_rpc_pb'
import { InjectivePortfolioRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_portfolio_rpc_pb.client'
import { createStreamSubscription } from './streamHelpers.js'
import { GrpcWebRpcTransport } from '../../base/GrpcWebRpcTransport.js'
import { IndexerAccountPortfolioStreamTransformer } from '../transformers/index.js'
import type { Subscription } from 'rxjs'
import type { StreamStatusResponse } from '../types/index.js'

export type AccountPortfolioStreamCallback = (
  response: ReturnType<
    typeof IndexerAccountPortfolioStreamTransformer.accountPortfolioStreamCallback
  >,
) => void

/**
 * @category Indexer Grpc Stream
 * @description Provides streaming access to account portfolio data from Injective Indexer
 */
export class IndexerGrpcAccountPortfolioStream {
  private client: InjectivePortfolioRPCClient
  private transport: GrpcWebRpcTransport

  constructor(endpoint: string, metadata?: Record<string, string>) {
    this.transport = new GrpcWebRpcTransport(endpoint, metadata)
    this.client = new InjectivePortfolioRPCClient(this.transport)
  }

  /**
   * Stream account portfolio updates
   * @param params - Stream parameters
   * @param params.accountAddress - The account address to stream portfolio for
   * @param params.subaccountId - Optional subaccount ID to filter
   * @param params.type - Optional portfolio type to filter
   * @param params.callback - Called for each portfolio update
   * @param params.onEndCallback - Called when stream ends normally
   * @param params.onStatusCallback - Called on stream errors
   * @returns Subscription object with unsubscribe method
   */
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
    // Input validation
    if (!accountAddress) {
      throw new Error('accountAddress is required')
    }
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request =
      InjectivePortfolioRpcPb.StreamAccountPortfolioRequest.create()
    request.accountAddress = accountAddress

    if (subaccountId) {
      request.subaccountId = subaccountId
    }

    if (type) {
      request.type = type
    }

    const stream = this.client.streamAccountPortfolio(request)

    return createStreamSubscription(
      stream,
      (response: InjectivePortfolioRpcPb.StreamAccountPortfolioResponse) => {
        callback(
          IndexerAccountPortfolioStreamTransformer.accountPortfolioStreamCallback(
            response,
          ),
        )
      },
      onEndCallback,
      onStatusCallback,
    )
  }
}
