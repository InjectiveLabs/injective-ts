import * as InjectiveTradingRpcPb from '@injectivelabs/indexer-proto-ts-v2/generated/injective_trading_rpc_pb'
import { InjectiveTradingRPCClient } from '@injectivelabs/indexer-proto-ts-v2/generated/injective_trading_rpc_pb.client'
import { createStreamSubscription } from './streamHelpers.js'
import { GrpcWebRpcTransport } from '../../base/GrpcWebRpcTransport.js'
import type { Subscription } from 'rxjs'
import type { StreamStatusResponse } from '../types/index.js'

/**
 * @category Indexer Grid Strategy Grpc Stream
 * @description Provides streaming access to grid strategy data from Injective Indexer
 */
export class IndexerGrpcTradingStream {
  private client: InjectiveTradingRPCClient
  private transport: GrpcWebRpcTransport

  constructor(endpoint: string, metadata?: Record<string, string>) {
    this.transport = new GrpcWebRpcTransport(endpoint, metadata)
    this.client = new InjectiveTradingRPCClient(this.transport)
  }

  /**
   * Stream grid strategies
   * @param params - Stream parameters
   * @param params.marketId - Optional market ID to filter strategies
   * @param params.accountAddresses - Optional array of account addresses to filter
   * @param params.callback - Called for each strategy update
   * @param params.onEndCallback - Called when stream ends normally
   * @param params.onStatusCallback - Called on stream errors
   * @returns Subscription object with unsubscribe method
   */
  streamGridStrategies({
    marketId,
    callback,
    onEndCallback,
    accountAddresses,
    onStatusCallback,
  }: {
    marketId?: string
    accountAddresses?: string[]
    onEndCallback?: (status?: StreamStatusResponse) => void
    onStatusCallback?: (status: StreamStatusResponse) => void
    callback: (response: InjectiveTradingRpcPb.StreamStrategyResponse) => void
  }): Subscription {
    const request = InjectiveTradingRpcPb.StreamStrategyRequest.create()

    // Input validation (already exists in original)
    if ((!accountAddresses || accountAddresses.length === 0) && !marketId) {
      throw new Error('accountAddresses or marketId is required')
    }

    if (typeof callback !== 'function') {
      throw new Error('callback must be a function')
    }

    if (accountAddresses) {
      request.accountAddresses = accountAddresses
    }

    if (marketId) {
      request.marketId = marketId
    }

    const stream = this.client.streamStrategy(request)

    return createStreamSubscription(
      stream,
      (response: InjectiveTradingRpcPb.StreamStrategyResponse) => {
        callback(response)
      },
      onEndCallback,
      onStatusCallback,
    )
  }
}
