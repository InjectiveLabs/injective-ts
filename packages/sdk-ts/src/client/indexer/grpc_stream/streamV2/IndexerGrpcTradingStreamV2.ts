import * as InjectiveTradingRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_trading_rpc_pb'
import { InjectiveTradingRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_trading_rpc_pb.client'
import { createStreamSubscriptionV2 } from './streamHelpersV2.js'
import { GrpcWebRpcTransport } from '../../../base/GrpcWebRpcTransport.js'
import type { StreamSubscription } from '../../../../types/index.js'

export type GridStrategyStreamCallbackV2 = (
  response: InjectiveTradingRpcPb.StreamStrategyResponse,
) => void

export class IndexerGrpcTradingStreamV2 {
  private client: InjectiveTradingRPCClient
  private transport: GrpcWebRpcTransport

  constructor(endpoint: string, metadata?: Record<string, string>) {
    this.transport = new GrpcWebRpcTransport(endpoint, metadata)
    this.client = new InjectiveTradingRPCClient(this.transport)
  }

  /**
   * Stream grid strategies
   * @param params.marketId - Optional market ID to filter strategies
   * @param params.accountAddresses - Optional array of account addresses to filter
   * @param params.callback - Called for each strategy update
   * @returns StreamSubscription
   */
  streamGridStrategies({
    marketId,
    accountAddresses,
    callback,
  }: {
    marketId?: string
    accountAddresses?: string[]
    callback: GridStrategyStreamCallbackV2
  }): StreamSubscription {
    if ((!accountAddresses || accountAddresses.length === 0) && !marketId) {
      throw new Error('accountAddresses or marketId is required')
    }
    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    const request = InjectiveTradingRpcPb.StreamStrategyRequest.create()

    if (accountAddresses) {
      request.accountAddresses = accountAddresses
    }

    if (marketId) {
      request.marketId = marketId
    }

    return createStreamSubscriptionV2(
      (abortSignal) =>
        this.client.streamStrategy(request, { abort: abortSignal }),
      (response) => {
        callback(response)
      },
    )
  }
}
