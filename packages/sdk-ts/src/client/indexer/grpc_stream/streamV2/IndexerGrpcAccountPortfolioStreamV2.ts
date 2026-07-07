import * as InjectivePortfolioRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_portfolio_rpc_pb'
import { InjectivePortfolioRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_portfolio_rpc_pb.client'
import { createStreamSubscriptionV2 } from './streamHelpersV2.js'
import { GrpcWebRpcTransport } from '../../../base/GrpcWebRpcTransport.js'
import { IndexerAccountPortfolioStreamTransformer } from '../../transformers/index.js'
import type { StreamSubscription } from '../../../../types/index.js'

export type AccountPortfolioStreamCallbackV2 = (
  response: ReturnType<
    typeof IndexerAccountPortfolioStreamTransformer.accountPortfolioStreamCallback
  >,
) => void

export class IndexerGrpcAccountPortfolioStreamV2 {
  private client: InjectivePortfolioRPCClient
  private transport: GrpcWebRpcTransport

  constructor(endpoint: string, metadata?: Record<string, string>) {
    this.transport = new GrpcWebRpcTransport(endpoint, metadata)
    this.client = new InjectivePortfolioRPCClient(this.transport)
  }

  /**
   * Stream account portfolio updates
   * @param params.accountAddress - The account address to stream portfolio for
   * @param params.subaccountId - Optional subaccount ID to filter
   * @param params.type - Optional portfolio type to filter
   * @param params.callback - Called for each portfolio update
   * @returns StreamSubscription
   */
  streamAccountPortfolio({
    accountAddress,
    subaccountId,
    type,
    callback,
  }: {
    accountAddress: string
    subaccountId?: string
    type?: string
    callback: AccountPortfolioStreamCallbackV2
  }): StreamSubscription {
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

    return createStreamSubscriptionV2(
      (abortSignal) =>
        this.client.streamAccountPortfolio(request, { abort: abortSignal }),
      (response) => {
        const transformed =
          IndexerAccountPortfolioStreamTransformer.accountPortfolioStreamCallback(
            response,
          )
        callback(transformed)
      },
    )
  }
}
